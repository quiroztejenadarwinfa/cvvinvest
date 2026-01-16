# 🏗️ Arquitectura del Sistema de Planes

## Diagrama de Flujo General

```
┌─────────────────────────────────────────────────────────┐
│                  USUARIO SE AUTENTICA                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Verificar     │
         │ Email         │
         └───────┬───────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ Obtener Plan del     │
      │ usuario de BD        │
      │ (actualmente LS)     │
      └──────────┬───────────┘
                 │
                 ▼
      ┌──────────────────────────┐
      │ Guardar en SessionStorage│
      │ {plan: "pro", ...}       │
      └──────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────┐
    │ Renderizar Dashboard   │
    │ con acceso basado      │
    │ en plan                │
    └──────────┬─────────────┘
               │
      ┌────────┴────────┐
      ▼                 ▼
  ┌─────────────┐  ┌──────────────┐
  │ Sidebar     │  │ Pages        │
  │ Filtra      │  │ Validan      │
  │ menú        │  │ acceso       │
  └─────────────┘  └──────────────┘
```

## Estructura de Datos

### User Object
```typescript
{
  id: "abc123",
  email: "usuario@example.com",
  name: "Juan Pérez",
  role: "user",
  plan: "pro",                    ← Clave principal
  balance: 5000,
  createdAt: "2024-01-14T..."
}
```

### PlanFeatures Configuration
```typescript
{
  canDeposit: true,               ← Boolean features
  canWithdraw: true,
  canInvest: true,
  canViewReports: true,
  canViewAnalytics: true,
  canAccessAdvancedTools: true,
  canHavePersonalAdvisor: false,
  withdrawalDays: 3,              ← Numeric properties
  paymentMethods: [               ← Array properties
    "Banco Local",
    "Binance",
    "PayPal"
  ],
  supportLevel: "priority"        ← String properties
}
```

## Árbol de Decisión - Acceso

```
¿Puede el usuario acceder a X característica?
│
├─ NO ESTÁ AUTENTICADO
│  └─ Redirigir a /login
│
├─ SÍ ESTÁ AUTENTICADO
│  │
│  ├─ Obtener user.plan
│  │  (gratuito|estandar|pro|vip|elite)
│  │
│  └─ Consultar planFeaturesConfig[user.plan]
│     │
│     ├─ Si feature es boolean
│     │  └─ Retornar su valor (true/false)
│     │
│     ├─ Si feature es string
│     │  └─ Retornar si es !== "none"
│     │
│     └─ Si feature es número
│        └─ Retornar si es > 0
│
│  RESULTADO:
│  ├─ SÍ TIENE ACCESO
│  │  └─ Mostrar contenido
│  │
│  └─ NO TIENE ACCESO
│     └─ Mostrar FeatureGuard fallback
```

## Componentes y Relaciones

```
┌──────────────────────────────────────┐
│        LIB/PLAN-FEATURES.TS          │
│  (Configuración central de planes)   │
└────┬───────────────┬────────────────┬┘
     │               │                │
     ▼               ▼                ▼
  getPlan      canAccess        getMissing
  Features      Feature         FeatureMsg
     │               │                │
     └───┬───────────┴────────┬───────┘
         │                    │
         ▼                    ▼
  ┌────────────────┐  ┌──────────────────┐
  │ COMPONENTES    │  │ PÁGINAS          │
  │                │  │                  │
  │ • FeatureGuard │  │ • dashboard/     │
  │ • FeatureBtn   │  │   informes       │
  │ • Sidebar      │  │ • dashboard/     │
  │                │  │   analytics      │
  │                │  │ • depositos      │
  │                │  │ • retiros        │
  │                │  │ • inversiones    │
  └────────────────┘  └──────────────────┘
```

## Flujo de Renderización del Sidebar

```
SIDEBAR CARGA
  │
  ▼
getSessionUser() → Obtiene plan actual
  │
  ▼
Define allMenuItems[] (todos los items)
  │
  ▼
Filtra con canAccessFeature()
  │
  ├─ Panel        → Siempre visible
  ├─ Inversiones  → ¿canInvest? → SÍ/NO
  ├─ Depositar    → ¿canDeposit? → SÍ/NO
  ├─ Retirar      → ¿canWithdraw? → SÍ/NO
  ├─ Informes     → ¿canViewReports? → SÍ/NO
  ├─ Analytics    → ¿canViewAnalytics? → SÍ/NO
  ├─ Historial    → ¿canInvest? → SÍ/NO
  └─ Configuración → Siempre visible
  │
  ▼
visibleMenuItems[] = items filtrados
  │
  ▼
Renderizar solo visibleMenuItems[]
```

## Flujo de Protección de Página

```
Usuario navega a /dashboard/informes
  │
  ▼
Página carga
  │
  ▼
getSessionUser() → user = {plan: "estandar"}
  │
  ▼
┌─ FeatureGuard entra
│  ├─ feature = "canViewReports"
│  ├─ canAccessFeature("estandar", "canViewReports")
│  │
│  └─ returnvalor = true ✅
│     │
│     ▼
│  Renderizar children (página de informes)
│
└─ Si fuera Plan Gratuito:
   ├─ canAccessFeature("gratuito", "canViewReports") = false
   │
   ▼
   ┌─────────────────────────────────────┐
   │ Alert con FeatureGuard fallback     │
   │ "Informes no disponibles"           │
   │ [Ver planes disponibles]            │
   └─────────────────────────────────────┘
```

## Matriz de Características por Componente

```
COMPONENTE              CARACTERÍSTICA      PLAN MÍNIMO
─────────────────────────────────────────────────────────
Sidebar                 menú dinámico       N/A (lógica)
└─ Inversiones          canInvest           Estándar
└─ Depositar            canDeposit          Estándar
└─ Retirar              canWithdraw         Estándar
└─ Informes             canViewReports      Estándar
└─ Analytics            canViewAnalytics    Pro
└─ Historial            canInvest           Estándar

/dashboard              N/A                 Cualquiera
/dashboard/inversiones  canInvest           Estándar
/dashboard/informes     canViewReports      Estándar
/dashboard/analytics    canViewAnalytics    Pro

/depositos              canDeposit          Estándar
/retiros                canWithdraw         Estándar
```

## Ciclo de Vida de Validación

```
┌─────────────────────────────────────────────────────┐
│ 1. CARGA INICIAL                                    │
│    └─ getSessionUser() obtiene plan                │
└────────────┬────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────┐
│ 2. EVALUACIÓN                                       │
│    └─ canAccessFeature(plan, feature)              │
│       └─ Consulta planFeaturesConfig[plan][feature]│
└────────────┬────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────┐
│ 3. LÓGICA DE DECISIÓN                               │
│    ├─ Si valor es true → Permite acceso            │
│    ├─ Si valor es false → Deniega acceso           │
│    ├─ Si valor > 0 → Permite acceso                │
│    └─ Si valor empty → Deniega acceso              │
└────────────┬────────────────────────────────────────┘
             │
     ┌───────┴──────┐
     │              │
┌────▼──────┐  ┌───▼──────┐
│ ACCESO ✅  │  │DENEGADO ❌
│            │  │
│ Renderizar │  │ Mostrar fallback
│ contenido  │  │ (FeatureGuard)
│            │  │
└────────────┘  └──────────┘
```

## Ejemplo Práctico: Usuario Actualizando Plan

```
ESTADO INICIAL: Plan Gratuito
├─ localStorage: {plan: "gratuito"}
├─ Sidebar: Panel, Config, Ayuda
└─ Acceso denegado a: Inversiones, Depositar, Retiros, Informes

USUARIO REALIZA ACCIONES:
├─ Deposita $100
├─ Admin aprueba depósito
└─ Balance actualiza a $100

USUARIO ACTUALIZA A ESTÁNDAR:
├─ Admin cambia plan a "estandar"
├─ setSessionUser(updatedUser)
│  └─ localStorage: {plan: "estandar", balance: 100}
├─ Página recarga/refresh
└─ ✅ Se desactualiza el sidebar automáticamente

NUEVO ESTADO: Plan Estándar
├─ localStorage: {plan: "estandar"}
├─ Sidebar: Panel, Inversiones, Depositar, Retirar, 
│           Informes, Historial, Config
└─ Acceso permitido a: Todo excepto Analytics
```

## Flujo de Datos en Depósito

```
Usuario en /depositos
│
├─ Carga: getSessionUser()
│  └─ user.plan = "pro"
│
├─ getPlanFeatures("pro")
│  └─ paymentMethods = ["Banco Local", "Binance", "PayPal"]
│
├─ Renderiza: Métodos disponibles para tu plan
│  └─ "Banco Local, Binance, PayPal"
│
├─ Usuario selecciona método (ej: PayPal)
├─ Ingresa monto ($150)
│
└─ Crea depósito: createDeposit(150, "PayPal")
   └─ Almacena en localStorage (simulado)
      └─ Admin revisa y aprueba
         └─ Balance se actualiza
```

## Escalabilidad Futura

```
VERSIÓN ACTUAL (v1):
├─ 5 Planes
├─ 7 Características booleanas
├─ 3 Propiedades numéricas
└─ 1 Array de métodos

VERSIÓN FUTURA (v2):
├─ N Planes (escalable)
├─ Suscripciones dinámicas
├─ Descuentos por volumen
├─ Trial periods
├─ Planes personalizados
└─ API REST para configuración
```

---

**Última actualización:** 14 de enero de 2026
**Versión:** 1.0
