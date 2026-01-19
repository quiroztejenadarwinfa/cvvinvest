# 📱 PROMPT PROFESIONAL: PLATAFORMA DE INVERSIÓN FINANCIERA - CVVINVEST

## 🎯 VISIÓN GENERAL DEL PROYECTO

**CVVINVEST** es una plataforma moderna, profesional y compleja de gestión de inversiones financieras diseñada con un enfoque **mobile-first** y completamente **responsive** para dispositivos de cualquier tamaño (mobile, tablet, desktop, TV).

---

## 🏗️ ARQUITECTURA TÉCNICA

### Stack Tecnológico
- **Frontend**: Next.js 14+ (App Router), React 18+, TypeScript
- **UI Components**: Shadcn/UI + Tailwind CSS
- **Backend**: Next.js API Routes
- **Autenticación**: Supabase Auth (OAuth, Email/Password, 2FA)
- **Base de Datos**: PostgreSQL (Supabase)
- **Almacenamiento de Estado**: localStorage (cliente), PostgreSQL (persistencia)
- **Gráficos**: Recharts (analítica avanzada)
- **Iconografía**: Lucide React
- **Internacionalización**: i18n (ES/EN)
- **Deployment**: Vercel

### Principios de Diseño
- ✅ Diseño moderno y minimalista
- ✅ Accesibilidad WCAG 2.1 AA
- ✅ Rendimiento optimizado (Core Web Vitals)
- ✅ Totalmente responsive
- ✅ Modo oscuro/claro
- ✅ Experiencia consistente en todos los dispositivos

---

## 📱 RESPONSIVE DESIGN

### Breakpoints Implementados
```
Mobile:        < 640px   (teléfonos)
Tablet:        640px - 1024px
Desktop:       1024px - 1440px
Large Desktop: > 1440px
TV:            > 1920px
```

### Comportamiento Adaptativo
- **Mobile**: Navegación en hamburguesa, cards en 1 columna, botones full-width
- **Tablet**: Navegación lateral colapsable, 2 columnas flexible
- **Desktop**: Sidebar fijo, 3-4 columnas, tooltips completos
- **Large**: Layout máximo, información expandida
- **TV**: Interfaces simplificadas, texto grande, elementos clickeables

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### Autenticación Unificada
```typescript
✅ Registro: Email + Contraseña
✅ Login: Email + Contraseña
✅ OAuth: Google, GitHub (opcional)
✅ 2FA: Google Authenticator (TOTP)
✅ Recuperación: Link por email
✅ Sesiones: Multi-dispositivo
```

### Características de Seguridad
- ✅ Contraseñas hasheadas (Supabase Auth)
- ✅ Confirmación automática de email
- ✅ 2FA con códigos de respaldo
- ✅ RLS (Row Level Security) en BD
- ✅ CSRF Protection
- ✅ Rate limiting en APIs
- ✅ Logging de acceso

---

## 💳 SISTEMA DE PLANES (TIER SYSTEM)

### 5 Niveles de Suscripción

```
┌─────────────────────────────────────────────────────────────┐
│ GRATUITO    │ ESTÁNDAR   │ PRO      │ VIP      │ ELITE      │
├─────────────────────────────────────────────────────────────┤
│ Gratis      │ $9.99/mes  │ $29/mes  │ $99/mes  │ $299/mes   │
│             │            │          │          │            │
│ Dashboard   │ + Depósitos│ + Reports│ + Advisor│ + Premium  │
│ Límite      │ + Retiros  │ + Charts │ + Instant│ + VIP      │
│ 1000 USD    │ + Compra   │ + Análisis│ Return   │ Support   │
│             │ + Venta    │ + APIs   │ (24h)    │            │
└─────────────────────────────────────────────────────────────┘
```

### Matriz de Características por Plan

```
                        Gratuito  Estándar  Pro   VIP   Elite
─────────────────────────────────────────────────────────────
Dashboard                  ✓        ✓       ✓     ✓      ✓
Ver Saldo                  ✓        ✓       ✓     ✓      ✓
Depósitos                  ✓        ✓       ✓     ✓      ✓
Retiros                    ✗        ✓       ✓     ✓      ✓
Compra/Venta              ✗        ✓       ✓     ✓      ✓
Reportes                   ✗        ✗       ✓     ✓      ✓
Analytics Avanzado         ✗        ✗       ✓     ✓      ✓
API Access                 ✗        ✗       ✓     ✓      ✓
Asesor Dedicado            ✗        ✗       ✗     ✓      ✓
Retiro Inmediato (24h)     ✗        ✗       ✗     ✓      ✓
Soporte Premium            ✗        ✗       ✗     ✓      ✓
Límite Inversión Sin Cap   ✗        ✗       ✗     ✓      ✓
```

---

## 🎨 ESTRUCTURA DE PÁGINAS Y COMPONENTES

### Páginas Públicas (Pre-Login)

#### `/` - Home (Landing Page)
- **Secciones**:
  - Hero con CTA
  - Features highlights
  - Planes comparativos
  - Testimonios
  - FAQ
  - Footer con links
- **Responsive**: Carrusel mobile, grid desktop
- **CTAs**: "Comenzar", "Ver Planes", "Contactar"

#### `/planes` - Comparativa de Planes
- **Características**:
  - Tabla comparativa interactiva
  - Cards por plan con detalles
  - Calculadora ROI
  - Toggle anual/mensual
  - Selector de plan con descuentos
- **Mobile**: Cards stacked, scroll horizontal tabla
- **Desktop**: Grid 5 columnas, hover effects

#### `/login` - Inicio de Sesión
- **Campos**:
  - Email con validación
  - Contraseña con toggle visibilidad
  - Remember me
  - 2FA (si está habilitado)
- **Opciones**:
  - OAuth buttons (Google, GitHub)
  - "Olvidé contraseña"
  - Link a registro
- **Estados**: Loading, error, success
- **Mobile**: Full-width, formulario simplificado
- **Desktop**: Centered, 400px max-width

#### `/registro` - Crear Cuenta
- **Campos**:
  - Nombre completo
  - Email con validación
  - Contraseña (requisitos visuales)
  - Confirmar contraseña
  - Términos y condiciones
- **Validaciones**: Real-time, feedback visual
- **Strength meter**: Visual password strength
- **Mobile**: Progressive disclosure
- **Desktop**: Todos los campos visibles

#### `/recuperar-password` - Recuperar Contraseña
- **Flujo**:
  1. Ingresar email
  2. Enviar link
  3. Cambiar contraseña
- **Estados**: Espera, enviado, expirado
- **Mobile**: Simple y directo
- **Desktop**: Info panel lateral

#### `/nosotros` - About Us
- **Secciones**:
  - Misión/visión
  - Timeline de historia
  - Team members con fotos
  - Logros/estadísticas
- **Responsive**: Carrousel mobile, grid desktop

#### `/contacto` - Contacto
- **Campos**:
  - Nombre, email, asunto
  - Mensaje multiline
  - Categoría de consulta
  - Teléfono (opcional)
- **Integración**: Envío de notificación admin
- **Confirmación**: Toast success

#### `/privacidad`, `/terminos` - Documentos Legales
- **Contenido**: Markdown renderizado
- **Navegación**: Índice lateral
- **Responsive**: Full-width mobile, 2 columnas desktop

---

### Dashboard Usuario (Post-Login)

#### Layout Base
```
┌─────────────────────────────────────┐
│        Navbar (Header)              │ ← Logo, Notifications, User Menu
├──────────────┬──────────────────────┤
│              │                      │
│  Sidebar     │   Main Content       │
│  (Dinámico)  │   (Responsive)       │
│              │                      │
│              │                      │
└──────────────┴──────────────────────┘
│              Footer                 │
└─────────────────────────────────────┘

Mobile: Sidebar en hamburguesa
```

#### `/dashboard` - Panel Principal
- **Widgets (Cards)**:
  - Saldo total (con toggle privacidad)
  - Inversiones activas
  - Ganancias del día/mes/año
  - Portafolio (pie chart)
  - Transacciones recientes
  - Próximos eventos
- **Acciones Rápidas**: Botones flotantes o cards clickeables
- **Gráficos**: Mini charts sparkline
- **Responsive**:
  - Mobile: 1 columna, widgets stacked
  - Tablet: 2 columnas
  - Desktop: 3-4 columnas, grid flexible

#### `/dashboard/inversiones` - Gestionar Inversiones
- **Tablas/Cards**:
  - Inversiones activas con estado
  - Historial completo con filtros
- **Columnas**: Nombre, Monto, ROI%, Estado, Fecha, Acciones
- **Filtros**: Estado, Rango fechas, Monto min/max, Búsqueda
- **Sorting**: Por fecha, monto, ROI, estado
- **Acciones**: Ver detalle, vender, editar
- **Gráficos**: Distribución por tipo, evolución temporal
- **Mobile**: Cards con deslizamiento, acciones en botón "..."
- **Desktop**: Tabla full con hover effects

#### `/depositos` - Depositar Dinero
- **Formulario**:
  - Seleccionar método (Tarjeta, Transferencia, Wallet)
  - Ingresar monto
  - Seleccionar divisa
  - Información de pago según método
- **Validaciones**: Monto mínimo/máximo según plan
- **Confirmation**: Resumen de depósito antes de confirmar
- **Resultado**: Confirmación con número de referencia
- **Mobile**: Formulario progresivo, step by step
- **Desktop**: Todo en un page

#### `/retiros` - Retirar Dinero
- **Similiar a depósitos**:
  - Seleccionar cuenta bancaria registrada
  - Ingresar monto
  - Seleccionar velocidad (Normal, Express, VIP)
  - Confirmación 2FA
- **Restricciones**: Según plan, límites diarios
- **Timeline**: Mostrar cuándo se procesará
- **Mobile**: Simplificado con pasos claros
- **Desktop**: Información completa visible

#### `/dashboard/informes` - Reportes Financieros (Pro+)
- **Secciones**:
  - Resumen ejecutivo (KPIs principales)
  - Gráficos históricos:
    - Línea: Evolución de saldo
    - Barra: Depósitos/Retiros por mes
    - Pie: Distribución de portafolio
    - Área: Ganancias acumulativas
  - Tablas detalladas por categoría
  - Exportar (PDF, CSV, Excel)
- **Períodos**: Día, Semana, Mes, Trimestre, Año, Custom
- **Comparativas**: Mes anterior, año anterior
- **Mobile**: Gráficos responsive, tablas scrollables
- **Desktop**: Múltiples gráficos lado a lado

#### `/dashboard/analytics` - Análisis Avanzado (Pro+)
- **Secciones**:
  - Volatilidad de portafolio
  - Correlación de activos
  - Indicadores técnicos (RSI, MACD, Bollinger)
  - Heat map de performance
  - Scatter chart de riesgo vs retorno
  - Predicciones (AI, simple)
- **Interactividad**: Seleccionar período, activo, indicador
- **Exportar**: Datos para análisis externo
- **Mobile**: Gráficos simplificados, selección de 1 indicador
- **Desktop**: Todos los indicadores visibles

#### `/dashboard/seguridad` - Configuración de Seguridad
- **Opciones**:
  - Cambiar contraseña
  - Configurar 2FA
  - Dispositivos activos
  - Sesiones activas (terminar)
  - Historial de acceso
  - IP whitelist
  - Notificaciones de seguridad
- **Mobile**: Collapse panels
- **Desktop**: Tabs o accordion

#### `/dashboard/configuracion` - Configuración General
- **Opciones**:
  - Información de perfil (editable)
  - Preferencias de notificación
  - Tema (claro/oscuro/auto)
  - Idioma (ES/EN)
  - Zona horaria
  - Datos para contacto
  - Cambiar email
- **Mobile**: Simple y directo
- **Desktop**: Sidebar con secciones

---

### Panel Admin (`/admin` - Solo authorized email)

#### `/admin` - Dashboard Admin
- **Widgets**:
  - Usuarios activos
  - Ingresos del mes
  - Transacciones pendientes
  - Sistema status
- **Gráficos**: 
  - Nuevos usuarios por día
  - Ingresos por plan
  - Transacciones por tipo
- **Acciones rápidas**: Aprobar inversiones, ver tickets

#### `/admin/usuarios` - Gestión de Usuarios
- **Tabla**: ID, Email, Nombre, Plan, Balance, Estado, Acciones
- **Filtros**: Por plan, estado, rango de balance, búsqueda
- **Acciones**: Ver detalle, cambiar plan, bloquear, ver historial
- **Modal**: Editar información de usuario
- **Bulk actions**: Cambiar plan a múltiples
- **Exportar**: CSV/JSON con datos de usuarios

#### `/admin/inversiones` - Aprobar/Rechazar Inversiones
- **Tabla**: Inversión pendiente, Usuario, Monto, Fecha, Acciones
- **Botones**: Aprobar, Rechazar (con nota)
- **Modal**: Detalle de inversión con comprobante
- **Notificaciones**: Automáticas al usuario

#### `/admin/depositos` - Gestionar Depósitos
- **Similar a inversiones**:
  - Ver comprobante
  - Aprobar/Rechazar
  - Enviar mensaje
- **Estado**: Pendiente, Aprobado, Rechazado

#### `/admin/retiros` - Gestionar Retiros
- **Gestión de retiros**:
  - Ver datos bancarios
  - Aprobar/Rechazar
  - Estado de procesamiento
- **Notificación**: Al usuario sobre estado

#### `/admin/reportes` - Reportes del Sistema
- **Gráficos**:
  - Usuarios por período
  - Ingresos acumulativos
  - Transacciones por tipo
  - Top usuarios por inversión
  - Churn rate
  - LTV analysis
- **Tablas exportables**
- **Alertas**: Anomalías detectadas

#### `/admin/configuracion` - Configuración del Sistema
- **Opciones**:
  - Parámetros de planes
  - Comisiones
  - Límites de transacción
  - Emails de notificación
  - Mantenimiento del sistema

---

## 🧩 COMPONENTES REUTILIZABLES

### Layout Components
```
✅ Navbar              (Logo, Nav items, User menu, Notifications)
✅ Sidebar             (Dinámico según plan, Collapsible)
✅ Footer              (Links, Copyright, Social)
✅ DashboardHeader     (Bienvenida, Quick stats)
✅ DashboardSidebar    (Menu items filtrados por plan)
✅ AdminHeader         (Admin info, System status)
✅ AdminSidebar        (Admin menu items)
```

### Data Display Components
```
✅ Card                (Container base)
✅ Table               (Datos tabulares con sorting/filtering)
✅ DataGrid            (Tabla avanzada con paginación)
✅ Chart               (Gráficos con Recharts)
✅ Stat Card           (KPI con icon e indicador)
✅ Timeline            (Eventos cronológicos)
✅ Badge               (Etiquetas de estado)
✅ Progress            (Barras de progreso)
```

### Form Components
```
✅ Input               (Text, Email, Password, Number)
✅ Textarea            (Textos multiline)
✅ Select              (Dropdown con búsqueda)
✅ Checkbox            (Selección múltiple)
✅ Radio               (Selección única)
✅ Toggle              (Switch on/off)
✅ DatePicker          (Selector de fecha)
✅ TimePicker          (Selector de hora)
✅ CurrencyInput       (Entrada de moneda)
✅ PasswordStrength    (Validador visual)
```

### Feedback Components
```
✅ Alert               (Información, warning, error, success)
✅ Toast               (Notificación temporal)
✅ Modal/Dialog        (Ventana modal)
✅ ConfirmDialog       (Confirmación de acción)
✅ Drawer              (Panel lateral deslizable)
✅ Tooltip             (Información al hover)
✅ Loading Spinner     (Indicador de carga)
✅ Skeleton            (Placeholder mientras carga)
✅ Empty State         (Cuando no hay datos)
```

### Feature Components
```
✅ TwoFactorModal      (Configurar 2FA)
✅ ChangePasswordModal (Cambiar contraseña)
✅ ActiveSessionsModal (Ver sesiones activas)
✅ NotificationsPanel  (Centro de notificaciones)
✅ UserMenu            (Dropdown de usuario)
✅ FeatureGuard        (Protección por plan)
```

---

## 🎨 DISEÑO VISUAL

### Paleta de Colores
```
Primary:     #2563eb (Azul profesional)
Secondary:   #1e293b (Gris oscuro)
Success:     #10b981 (Verde)
Warning:     #f59e0b (Naranja)
Destructive: #ef4444 (Rojo)
Accent:      #8b5cf6 (Púrpura)
Background:  #0f172a (Negro azulado)
Foreground:  #f1f5f9 (Blanco gris)
```

### Tipografía
```
Familia: Inter (Google Fonts)
Pesos: 400, 500, 600, 700

Tamaños:
- H1: 2.5rem (40px)
- H2: 2rem (32px)
- H3: 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)
```

### Espaciado (Tailwind)
```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 24px
2xl: 32px
```

### Bordes y Sombras
```
Border Radius: 8px (default), 12px (cards), 4px (buttons)
Shadows:
  - sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
  - md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
  - lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
```

---

## 📊 FUNCIONALIDADES AVANZADAS

### Sistema de Notificaciones
```
✅ Real-time (WebSocket o polling)
✅ Tipos: Info, Success, Warning, Error, Transaction
✅ Persistencia en BD
✅ Lectura/no lectura
✅ Centro de notificaciones
✅ Email notifications (opt-in)
✅ Push notifications (mobile)
```

### Sistema de Reportes
```
✅ Descarga PDF
✅ Descarga CSV
✅ Descarga Excel
✅ Email report
✅ Programación automática (diaria/semanal/mensual)
✅ Comparativas período anterior
```

### Analytics & Tracking
```
✅ Google Analytics
✅ Mixpanel (eventos)
✅ Sentry (error tracking)
✅ Performance monitoring
```

### Internacionalización (i18n)
```
✅ Español (es)
✅ Inglés (en)
✅ Selector de idioma en header
✅ Persistencia de preferencia
✅ Traducción de fechas y monedas
```

### Dark/Light Mode
```
✅ Toggle en header o settings
✅ Persistencia en localStorage
✅ Respeta preferencia del sistema (prefers-color-scheme)
✅ Smooth transition
✅ Todos los componentes soportan ambos modos
```

---

## 📱 ADAPTABILIDAD A DISPOSITIVOS

### Mobile (< 640px)
- ✅ Navegación en hamburguesa
- ✅ Bottom tab bar opcional
- ✅ Full-width cards
- ✅ Botones grandes (48x48 mínimo)
- ✅ Touch-friendly spacing
- ✅ Stack vertical
- ✅ Modals full-screen
- ✅ Drawer para menús

### Tablet (640px - 1024px)
- ✅ Sidebar colapsable
- ✅ 2 columnas flexible
- ✅ Tablas scrollables horizontal
- ✅ Modals con max-width

### Desktop (1024px+)
- ✅ Sidebar fijo o colapsable
- ✅ 3-4 columnas
- ✅ Tablas completas
- ✅ Tooltips, popovers
- ✅ Hover effects

### Large Desktop (> 1440px)
- ✅ Layout máximo
- ✅ Información expandida
- ✅ Múltiples gráficos lado a lado

### TV (> 1920px)
- ✅ UI simplificada
- ✅ Texto grande (18px+)
- ✅ Elementos bien espaciados
- ✅ Colores de alto contraste
- ✅ Navegación simplificada (5-6 elementos máximo)

---

## 🔄 FLUJOS PRINCIPALES

### Flujo de Registro
```
1. Usuario visita /registro
2. Completa formulario
3. Validación en tiempo real
4. Clic "Crear Cuenta"
5. Email confirmado automáticamente
6. Redirige a /login
7. Usuario inicia sesión
8. Redirige a /dashboard
```

### Flujo de Inversión
```
1. Usuario en /dashboard/inversiones
2. Clic "Invertir" o en plan
3. Modal con detalles
4. Ingresa monto
5. Confirmación con 2FA
6. Estado pendiente
7. Admin aprueba/rechaza
8. Notificación al usuario
9. Inversión activa o rechazada
```

### Flujo de Retiro
```
1. Usuario en /retiros
2. Selecciona cuenta bancaria
3. Ingresa monto
4. Selecciona velocidad
5. Confirmación
6. Solicitud pendiente
7. Admin procesa
8. Notificación de procesamiento
9. Fondos transferidos
```

---

## 🛡️ SEGURIDAD E PRIVACIDAD

- ✅ HTTPS obligatorio
- ✅ Headers de seguridad (CSP, X-Frame-Options, etc.)
- ✅ Validación input (servidor y cliente)
- ✅ SQL Injection protection (Supabase)
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Logging de auditoría
- ✅ Encriptación de datos sensibles
- ✅ PCI DSS ready (para pagos)
- ✅ GDPR compliant

---

## 📈 PERFORMANCE TARGETS

```
Métricas Core Web Vitals:
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

Lighthouse Scores:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

Bundle Size:
- Main JS: < 200KB (gzipped)
- CSS: < 50KB (gzipped)
- Total: < 300KB (gzipped)
```

---

## 🚀 MEJORAS FUTURAS

### Fase 2
- ✅ Integración de APIs de brokers reales
- ✅ Órdenes avanzadas (Stop Loss, Take Profit)
- ✅ Análisis técnico interactivo
- ✅ Alertas de precio en tiempo real
- ✅ Copy trading

### Fase 3
- ✅ Mobile app (React Native)
- ✅ API pública para terceros
- ✅ IA para recomendaciones
- ✅ Simulador de trading
- ✅ Comunidad (foro, blogs)

### Fase 4
- ✅ Marketplace de estrategias
- ✅ Trading algorítmico
- ✅ Integración cripto
- ✅ Social trading
- ✅ Webhooks y bots

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Funcionalidad Base ✅
- [x] Autenticación completa
- [x] Sistema de planes
- [x] Dashboard responsivo
- [x] Gestión de inversiones
- [x] Depósitos y retiros
- [x] Panel admin
- [x] Notificaciones

### Responsive ✅
- [x] Mobile (< 640px)
- [x] Tablet (640px - 1024px)
- [x] Desktop (1024px+)
- [x] Large Desktop (> 1440px)
- [x] TV (> 1920px)

### Seguridad ✅
- [x] 2FA
- [x] RLS en BD
- [x] Rate limiting
- [x] Input validation
- [x] HTTPS
- [x] Headers de seguridad

### Performance ✅
- [x] Image optimization
- [x] Code splitting
- [x] Lazy loading
- [x] Caching estratégico
- [x] CDN

### UX/UI ✅
- [x] Dark mode
- [x] Tema claro
- [x] i18n (ES/EN)
- [x] Accesibilidad
- [x] Loading states
- [x] Error handling

---

## 🎓 DOCUMENTACIÓN REQUERIDA

```
docs/
├── ARCHITECTURE.md          (Diagrama técnico)
├── API_REFERENCE.md         (Endpoints)
├── USER_GUIDE.md            (Manual de usuario)
├── ADMIN_GUIDE.md           (Manual de admin)
├── DEPLOYMENT.md            (Instrucciones deploy)
├── SECURITY.md              (Políticas de seguridad)
├── DATABASE.md              (Schema BD)
└── COMPONENT_LIBRARY.md     (Componentes disponibles)
```

---

## 🎯 CONCLUSIÓN

**CVVINVEST** es una plataforma profesional, segura y escalable que ofrece una experiencia moderna y completa para la gestión de inversiones financieras. Con soporte completo para mobile, tablet y desktop, un sistema de planes flexible y características avanzadas de seguridad, está lista para crecer y adaptarse a las necesidades futuras del mercado.

**Estado**: Listo para desarrollo y mejoras continuas ✅
