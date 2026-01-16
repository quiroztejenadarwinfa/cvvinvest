# 👨‍💼 Guía del Administrador - Sistema de Planes

## Acceso Admin

**Email:** `exe.main.darwin@gmail.com`  
**Contraseña:** `admin12345`

**Ruta:** http://localhost:3000/admin

## Panel de Administración

### Secciones Disponibles

```
/admin
├─ /admin/usuarios       (Gestión de usuarios y planes)
├─ /admin/depositos      (Aprobación de depósitos)
├─ /admin/retiros        (Aprobación de retiros)
└─ /admin/inversiones    (Gestión de inversiones)
```

## Gestionar Planes de Usuarios

### 1. Acceder a Lista de Usuarios

1. Inicia sesión como Admin
2. Navega a `/admin/usuarios`
3. Verás tabla con todos los usuarios registrados

### 2. Cambiar Plan de Usuario

**Método (Actual - Simulado):**

Editar en localStorage:
```javascript
// En consola del navegador (F12):
let users = JSON.parse(localStorage.getItem('cvvinvest_users'))
let user = users.find(u => u.email === "usuario@example.com")
user.plan = "pro"  // Cambiar a: gratuito, estandar, pro, vip, elite
localStorage.setItem('cvvinvest_users', JSON.stringify(users))

// El usuario verá cambios al recargar la página
```

### 3. Aprobar Depósitos

1. Navega a `/admin/depositos`
2. Verás depósitos pendientes con estado "Pendiente"
3. Para cada depósito puedes:
   - **Aprobar:** Aumenta balance del usuario
   - **Rechazar:** Mantiene balance sin cambios

**Efecto de Aprobar:**
```
Depósito aprobado: $100
  ↓
Balance del usuario aumenta: $100
  ↓
Usuario puede usar ese dinero para invertir
```

### 4. Aprobar Retiros

1. Navega a `/admin/retiros`
2. Verás retiros pendientes
3. Para cada retiro puedes:
   - **Aprobar:** Disminuye balance del usuario
   - **Rechazar:** Balance permanece igual

**Efecto de Aprobar:**
```
Retiro aprobado: $500
  ↓
Balance del usuario disminuye: $500
  ↓
Usuario recibe dinero en su cuenta bancaria
```

### 5. Gestionar Inversiones

1. Navega a `/admin/inversiones`
2. Verás inversiones pendientes y aprobadas
3. Puedes:
   - Aprobar nuevas inversiones
   - Ver estado de inversiones activas
   - Procesar cierres de posiciones

## Reglas Importantes

### ✅ Lo Que Puedes Hacer

- ✅ Cambiar planes de usuarios
- ✅ Aprobar/rechazar depósitos
- ✅ Aprobar/rechazar retiros
- ✅ Crear nuevos planes (modificando código)
- ✅ Agregar métodos de pago (modificando código)
- ✅ Ver historial de transacciones

### ❌ Lo Que NO Puedes Hacer Desde UI

- ❌ Cambiar contraseñas de usuarios
- ❌ Eliminar cuentas (sin backend)
- ❌ Modificar configuración de planes en vivo
- ❌ Crear nuevos tipos de características

## Cambiar Características de un Plan

**Para agregar/modificar características de un plan:**

1. Abre: `lib/plan-features.ts`
2. Edita la configuración:

```typescript
export const planFeaturesConfig: Record<PlanType, PlanFeatures> = {
  pro: {
    canDeposit: true,
    canWithdraw: true,
    canInvest: true,
    canViewReports: true,
    canViewAnalytics: true,
    canAccessAdvancedTools: true,
    canHavePersonalAdvisor: false,  // ← Cambiar esto a true
    withdrawalDays: 3,
    paymentMethods: ["Banco Local", "Binance", "PayPal"],
    supportLevel: "priority",
  },
}
```

3. Reinicia el servidor: `npm run dev`

## Agregar Nuevo Plan

1. Abre: `lib/plan-features.ts`
2. Agrega el nuevo tipo de plan:

```typescript
export type PlanType = 
  | "gratuito" 
  | "estandar" 
  | "pro" 
  | "vip" 
  | "elite" 
  | "premium"  // ← Nuevo plan

export const planFeaturesConfig: Record<PlanType, PlanFeatures> = {
  // ... otros planes ...
  premium: {
    canDeposit: true,
    canWithdraw: true,
    canInvest: true,
    canViewReports: true,
    canViewAnalytics: true,
    canAccessAdvancedTools: true,
    canHavePersonalAdvisor: true,
    withdrawalDays: 0, // Retiro instantáneo
    paymentMethods: ["Todos"],
    supportLevel: "24/7",
  },
}
```

3. Reinicia servidor

## Agregar Nuevo Método de Pago

1. Edita `lib/plan-features.ts`
2. Agrega el método en los planes que lo permitan:

```typescript
estandar: {
  // ...
  paymentMethods: [
    "Banco Local", 
    "Binance", 
    "Tarjeta Crédito"  // ← Nuevo
  ],
},
```

## Agregar Nueva Característica Controlada

**Ejemplo: Agregar "Rebalanceo Automático"**

1. En `lib/plan-features.ts`:

```typescript
export interface PlanFeatures {
  // ... características existentes ...
  canAutoRebalance: boolean  // ← NUEVA
}

export const planFeaturesConfig = {
  gratuito: { canAutoRebalance: false },
  estandar: { canAutoRebalance: false },
  pro: { canAutoRebalance: true },
  vip: { canAutoRebalance: true },
  elite: { canAutoRebalance: true },
}
```

2. En componentes:

```tsx
// En el sidebar, agregar:
{
  href: "/dashboard/rebalance",
  icon: BalanceIcon,
  label: "Rebalanceo Automático",
  feature: "canAutoRebalance"  // ← Aquí
}
```

3. Crear página en `app/dashboard/rebalance/page.tsx`:

```tsx
import { FeatureGuard } from "@/components/feature-guard"

export default function RebalancePage() {
  return (
    <FeatureGuard
      user={user}
      feature="canAutoRebalance"
      featureLabel="Rebalanceo Automático"
    >
      {/* Contenido */}
    </FeatureGuard>
  )
}
```

## Escenarios Comunes

### Escenario 1: Usuario solicita actualizar a Pro

**Pasos:**
1. Usuario deposita $200+
2. Apruebas el depósito
3. Usuario va a `/planes` y selecciona Pro
4. En localStorage se actualiza el plan
5. ✅ Al recargar, ve todas las características Pro

**En admin:**
```javascript
let users = JSON.parse(localStorage.getItem('cvvinvest_users'))
let user = users.find(u => u.email === "usuario@example.com")
user.plan = "pro"
localStorage.setItem('cvvinvest_users', JSON.stringify(users))
```

### Escenario 2: Usuario quiere analytics pero está en plan Estándar

**Solución para Admin:**

1. Verifica balance del usuario (debe ser $200+)
2. Cambia plan a Pro
3. Notifica al usuario

**En admin:**
```javascript
let users = JSON.parse(localStorage.getItem('cvvinvest_users'))
let user = users.find(u => u.email === "usuario@example.com")
if (user.balance >= 200) {
  user.plan = "pro"
  localStorage.setItem('cvvinvest_users', JSON.stringify(users))
  // Notificar usuario
}
```

### Escenario 3: Usuario debe rechazarse por transferencia fraudulenta

**Pasos:**
1. Ve a `/admin/depositos`
2. Encuentra la transacción
3. Haz clic en "Rechazar"
4. Ingresa nota: "Actividad sospechosa"
5. ✅ El balance del usuario NO se actualiza

## Monitoreo y Reportes

### Ver Ingresos por Plan

```javascript
// En consola:
let deposits = JSON.parse(localStorage.getItem('cvvinvest_deposits'))
let approved = deposits.filter(d => d.status === 'aprobado')
let byPlan = {}
approved.forEach(d => {
  let user = users.find(u => u.id === d.userId)
  byPlan[user.plan] = (byPlan[user.plan] || 0) + d.amount
})
console.table(byPlan)
```

### Ver Usuarios Activos

```javascript
let users = JSON.parse(localStorage.getItem('cvvinvest_users'))
let active = users.filter(u => u.plan !== 'gratuito')
console.log(`Usuarios activos: ${active.length}`)
console.table(active)
```

### Ver Retiros Pendientes

```javascript
let withdrawals = JSON.parse(localStorage.getItem('cvvinvest_withdrawals'))
let pending = withdrawals.filter(w => w.status === 'pendiente')
console.log(`Retiros pendientes: ${pending.length}`)
console.log(`Monto: $${pending.reduce((s, w) => s + w.amount, 0)}`)
```

## Mejores Prácticas

### ✅ Recomendaciones

1. **Aprobar en orden:**
   - Depositos primero
   - Luego inversiones
   - Finalmente retiros

2. **Validar información:**
   - Verifica datos bancarios
   - Confirma identidad si es necesario
   - Revisa historial de transacciones

3. **Mantener registros:**
   - Toma notas en cada decisión
   - Anota motivos de rechazo
   - Documenta cambios de plan

4. **Responder rápido:**
   - Depósitos: < 24 horas
   - Retiros: Según plan (1-5 días)
   - Inversiones: < 2 horas

### ❌ Evitar

1. ❌ No cambies planes sin validar depósito
2. ❌ No apruebes sin verificar datos
3. ❌ No rechaces sin dejar nota
4. ❌ No hagas cambios manuales en DB sin backup

## Solución de Problemas

### Problema 1: Usuario no ve cambio de plan

**Solución:**
```
1. Verifica que el cambio esté en localStorage
2. Pide al usuario que recargue (Ctrl+F5)
3. Si persiste, limpia localStorage y vuelve a loguear
```

### Problema 2: Depósito no actualiza balance

**Solución:**
```
1. Verifica que hayas hecho click en "Aprobar"
2. Revisa que el balance anterior + depósito = balance nuevo
3. Si no, rechaza y aprueba de nuevo
```

### Problema 3: Usuario dice que no ve Informes

**Solución:**
```
1. Verifica en admin que plan sea Estándar+
2. Cambia plan si es Gratuito
3. Pide al usuario que recargue la página
```

## Contacto para Soporte Técnico

Si el sistema necesita cambios:

1. Edita archivos en `lib/plan-features.ts`
2. Agrega cambios en componentes según sea necesario
3. Ejecuta `npm run dev` para probar
4. Si hay error, revisa consola (F12)

---

**Última actualización:** 14 de enero de 2026
**Rol:** Administrador
**Acceso:** exe.main.darwin@gmail.com / admin12345
