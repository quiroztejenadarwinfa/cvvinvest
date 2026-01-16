# 🏗️ ARQUITECTURA DEL SISTEMA DE NOTIFICACIONES

## Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                  SISTEMA DE NOTIFICACIONES                  │
└─────────────────────────────────────────────────────────────┘

                        ┌─────────────┐
                        │   Usuario   │
                        └──────┬──────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
           ┌────▼──┐      ┌───▼────┐    ┌──▼─────┐
           │Depósito│      │Retiro  │    │Inversión│
           └────┬──┘      └───┬────┘    └──┬─────┘
                │             │            │
                └─────────────┼────────────┘
                              │
                   ┌──────────▼──────────┐
                   │ createUserNotif()   │
                   └──────────┬──────────┘
                              │
                ┌─────────────┼─────────────┐
                │                           │
           ┌────▼──────────┐         ┌─────▼──────┐
           │   Dashboard   │         │   Admin    │
           │   Header UI   │         │   Header   │
           └────┬──────────┘         │    UI      │
                │                    └──────┬─────┘
           ┌────▼──────────┐         ┌──────▼──────┐
           │Notif Panel    │         │Admin Notif  │
           │User Component │         │Panel Comp   │
           └────┬──────────┘         └──────┬──────┘
                │                          │
                └──────────┬───────────────┘
                           │
                   ┌───────▼────────┐
                   │  localStorage  │
                   │   Persistence  │
                   └────────────────┘
```

---

## Arquitectura por Capas

```
┌─────────────────────────────────────────┐
│         Capa de Presentación            │
├─────────────────────────────────────────┤
│ • UserNotificationsPanel.tsx (UI)       │
│ • AdminNotificationsPanel.tsx (UI)      │
│ • Dashboard Header (integración)        │
│ • Admin Header (integración)            │
└────────────────┬────────────────────────┘
                 │
┌─────────────────▼────────────────────────┐
│       Capa de Lógica de Negocio         │
├──────────────────────────────────────────┤
│ • lib/notifications.ts                  │
│ • Gestión de estado                     │
│ • Filtrado y búsqueda                   │
│ • Generación de mensajes                │
└────────────────┬──────────────────────────┘
                 │
┌─────────────────▼────────────────────────┐
│        Capa de Persistencia              │
├──────────────────────────────────────────┤
│ • localStorage API                      │
│ • cvvinvest_notifications_${userId}     │
│ • cvvinvest_admin_notifications         │
└─────────────────────────────────────────┘
```

---

## Flujo de Creación de Notificación

```
1. Usuario realiza acción
   │
   ├─→ Depósito (app/depositos/page.tsx)
   ├─→ Retiro (app/retiros/page.tsx)
   ├─→ Inversión (app/planes/page.tsx)
   └─→ Cambio de plan (app/admin/usuarios/page.tsx)
       │
2. Se llama a createUserNotification()
   │
3. lib/notifications.ts procesa
   │
   ├─→ Genera ID único
   ├─→ Establece timestamp
   ├─→ Valida datos
   └─→ Genera mensaje automático
       │
4. Almacena en localStorage
   │
   ├─→ cvvinvest_notifications_${userId}
   └─→ Limita a 50 notificaciones
       │
5. Componentes detectan cambio
   │
   ├─→ UserNotificationsPanel actualiza (cada 5s)
   └─→ AdminNotificationsPanel actualiza (cada 3s)
       │
6. UI se renderiza con nueva notificación
   │
   └─→ Bell icon actualiza contador
```

---

## Estructura de Datos

```typescript
// NOTIFICACIÓN BASE
{
  id: string                    // Único, generado automáticamente
  type: NotificationType        // 8 tipos disponibles
  title: string                 // Título corto y descriptivo
  message: string               // Mensaje detallado
  details: {                    // Datos adicionales
    userId: string
    userName: string
    userEmail: string
    amount?: number
    plan?: string
    previousPlan?: string
    investmentId?: string
    status?: string
  }
  read: boolean                 // Estado de lectura
  createdAt: Date              // Timestamp de creación
  expiresAt?: Date             // Expiración opcional
}
```

---

## Ciclo de Vida de una Notificación

```
CREACIÓN
    │
    ├─→ createUserNotification() o createAdminNotification()
    │
    ├─→ Genera ID único
    │
    ├─→ Establece read: false
    │
    ├─→ Guarda en localStorage
    │
    └─→ Dispara actualización en componentes
        │
LECTURA
    │
    ├─→ Usuario ve bell icon
    │
    ├─→ Haz clic para abrir diálogo
    │
    ├─→ markNotificationAsRead(userId, id)
    │
    ├─→ Actualiza localStorage
    │
    └─→ UI se actualiza (read: true)
        │
ELIMINACIÓN
    │
    ├─→ Usuario haz clic en X
    │
    ├─→ deleteNotification(userId, id)
    │
    ├─→ Se quita de localStorage
    │
    ├─→ Contador decrece
    │
    └─→ Limpieza automática cuando >50
```

---

## Integración en Componentes

### 1. Dashboard Header
```
components/dashboard/header.tsx
    │
    ├─→ Importa UserNotificationsPanel
    │
    └─→ <UserNotificationsPanel variant="bell" />
        │
        ├─→ Cada 5s: getUnreadCount()
        ├─→ Muestra badge con número
        └─→ Abre diálogo al hacer clic
```

### 2. Admin Header
```
components/admin/header.tsx
    │
    ├─→ Importa AdminNotificationsPanel
    │
    └─→ <AdminNotificationsPanel variant="bell" />
        │
        ├─→ Cada 3s: getUnreadAdminCount()
        ├─→ Muestra badge con número
        └─→ Abre diálogo con actividades
```

---

## Flujo de Transacciones

### Depósito
```
Usuario en /depositos
    │
    ├─→ Ingresa monto
    │
    ├─→ Completa pago
    │
    ├─→ createDeposit() en lib/auth.ts
    │
    └─→ createUserNotification({type: 'deposit'})
        │
        └─→ localStorage: cvvinvest_notifications_${userId}
```

### Inversión
```
Usuario en /planes
    │
    ├─→ Selecciona plan
    │
    ├─→ Ingresa monto
    │
    ├─→ createInvestment() en lib/auth.ts
    │
    ├─→ createUserNotification({type: 'investment'})
    │
    └─→ createAdminNotification({type: 'investment'})
        │
        └─→ Admin ve en /admin/inversiones
```

### Aprobación Admin
```
Admin en /admin/inversiones
    │
    ├─→ Selecciona inversión
    │
    ├─→ Haz clic en Aprobar
    │
    ├─→ approveInvestment() en lib/auth.ts
    │
    ├─→ createUserNotification({type: 'investment_approved'})
    │
    └─→ createAdminNotification({type: 'investment_approved'})
        │
        └─→ Usuario ve notificación en dashboard
```

---

## Manejo de Estado

### Estado Global
```
localStorage:
  │
  ├─→ cvvinvest_notifications_${userId}
  │   └─→ Array de 50 notificaciones máximo
  │
  └─→ cvvinvest_admin_notifications
      └─→ Array de 100 notificaciones máximo
```

### Estado Local (Componentes)
```
UserNotificationsPanel:
  ├─→ notifications: Notification[]
  ├─→ unreadCount: number
  └─→ autoRefresh: setInterval cada 5s

AdminNotificationsPanel:
  ├─→ notifications: Notification[]
  ├─→ unreadCount: number
  └─→ autoRefresh: setInterval cada 3s
```

---

## API Pública

### Funciones de Usuario
```typescript
// Obtener notificaciones
export function getUserNotifications(userId: string): Notification[]

// Crear notificación
export function createUserNotification(
  userId: string,
  notification: Omit<Notification, 'id' | 'createdAt'>
): Notification

// Marcar como leída
export function markNotificationAsRead(
  userId: string,
  notificationId: string
): void

// Obtener no leídas
export function getUnreadCount(userId: string): number

// Eliminar
export function deleteNotification(
  userId: string,
  notificationId: string
): void
```

### Funciones de Admin
```typescript
// Obtener notificaciones admin
export function getAdminNotifications(): Notification[]

// Crear para admin
export function createAdminNotification(
  notification: Omit<Notification, 'id' | 'createdAt'>
): Notification

// Marcar como leída
export function markAdminNotificationAsRead(notificationId: string): void

// Obtener no leídas
export function getUnreadAdminCount(): number
```

---

## Tipos de Datos

```typescript
type NotificationType = 
  | 'deposit'
  | 'withdrawal'
  | 'investment'
  | 'plan_change'
  | 'investment_approved'
  | 'investment_rejected'
  | 'user_registered'
  | 'system'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  details?: Record<string, any>
  read: boolean
  createdAt: Date
  expiresAt?: Date
}
```

---

## Rendimiento

### Optimizaciones
- ✅ localStorage en lugar de base de datos (más rápido)
- ✅ Auto-actualización eficiente (5-3 segundos)
- ✅ Límite de notificaciones (50/100)
- ✅ Cleanup automático
- ✅ Componentes memorizados

### Escalabilidad
- ✅ Soporta múltiples usuarios simultáneos
- ✅ No requiere servidor
- ✅ Fácil migración a backend cuando sea necesario
- ✅ API diseñada para ser agnóstica del storage

---

## Seguridad

### Implementadas
- ✅ localStorage cliente-side (sin transmisión)
- ✅ Datos simples (sin datos sensibles)
- ✅ Cada usuario ve solo sus notificaciones
- ✅ Admin ve datos públicos del usuario

### Consideraciones
- ⚠️ localStorage no es seguro para datos sensibles
- ⚠️ Visible en DevTools del navegador
- ✅ Migrable a sesión servidor si es necesario

---

## Extensibilidad

### Agregar Nuevo Tipo
```typescript
// 1. Actualizar NotificationType en lib/notifications.ts
type NotificationType = 'nuevo_tipo' | ...

// 2. Agregar generador de mensaje
const messageGenerators: Record<NotificationType, (details) => {...}> = {
  nuevo_tipo: (details) => ({
    title: 'Título',
    message: 'Mensaje'
  })
}

// 3. Usarlo en app/page.tsx
createUserNotification(userId, {
  type: 'nuevo_tipo',
  details: {...}
})
```

### Migración a Backend
```typescript
// Reemplazar localStorage con API
// Cambiar solo lib/notifications.ts
// Los componentes seguirían funcionando igual
export async function createUserNotification(userId, notification) {
  const response = await fetch('/api/notifications', {
    method: 'POST',
    body: JSON.stringify({userId, notification})
  })
  return response.json()
}
```

---

## Testing

### Unit Tests
```
✅ createUserNotification()
✅ getUnreadCount()
✅ markNotificationAsRead()
✅ deleteNotification()
```

### Integration Tests
```
✅ Depósito → Notificación usuario
✅ Inversión → Notificación admin
✅ Aprobación → Notificación usuario
✅ Cambio plan → Notificaciones dual
```

### UI Tests
```
✅ Bell icon muestra contador
✅ Diálogo se abre al hacer clic
✅ Marcar como leída funciona
✅ Auto-actualización cada 5/3 seg
```

---

## Diagrama de Dependencias

```
app/
  ├─→ depositos/page.tsx
  │   └─→ lib/notifications.ts
  │
  ├─→ retiros/page.tsx
  │   └─→ lib/notifications.ts
  │
  ├─→ planes/page.tsx
  │   └─→ lib/notifications.ts
  │
  ├─→ admin/
  │   ├─→ inversiones/page.tsx
  │   │   └─→ lib/notifications.ts
  │   │
  │   └─→ usuarios/page.tsx
  │       └─→ lib/notifications.ts
  │
  └─→ registro/page.tsx
      └─→ lib/notifications.ts

components/
  ├─→ notifications-panel.tsx
  │   └─→ lib/notifications.ts
  │
  ├─→ admin-notifications-panel.tsx
  │   └─→ lib/notifications.ts
  │
  ├─→ dashboard/header.tsx
  │   └─→ components/notifications-panel.tsx
  │
  └─→ admin/header.tsx
      └─→ components/admin-notifications-panel.tsx
```

---

**Arquitectura diseñada para ser:**
- ✅ Simple de entender
- ✅ Fácil de mantener
- ✅ Escalable
- ✅ Migrable a backend
- ✅ Testeble

