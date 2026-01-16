# Sistema de Notificaciones - Documentación

## 📋 Resumen

Se ha implementado un sistema completo de notificaciones funcional tanto para **administradores** como para **usuarios**. Las notificaciones rastrean todos los movimientos importantes:

- 💰 **Depósitos** - Cuando un usuario realiza un depósito
- 💸 **Retiros** - Cuando un usuario solicita un retiro
- 📈 **Inversiones** - Cuando un usuario crea una inversión
- 👑 **Cambios de Plan** - Cuando un usuario cambia de plan
- ✅ **Aprobaciones** - Cuando el admin aprueba una inversión
- ❌ **Rechazos** - Cuando el admin rechaza una inversión
- 👤 **Registro** - Cuando se registra un nuevo usuario
- ℹ️ **Sistema** - Para mensajes del sistema

---

## 🔧 Componentes del Sistema

### 1. **lib/notifications.ts** - Sistema Central
Archivo que contiene toda la lógica de notificaciones.

**Funciones principales:**

#### Para Usuarios:
```typescript
// Obtener todas las notificaciones del usuario
getUserNotifications(userId: string): Notification[]

// Crear una notificación para un usuario
createUserNotification(userId: string, notification: Omit<Notification, 'id' | 'createdAt'>): Notification

// Marcar como leída
markNotificationAsRead(userId: string, notificationId: string): void

// Obtener cantidad de notificaciones sin leer
getUnreadCount(userId: string): number

// Eliminar notificación
deleteNotification(userId: string, notificationId: string): void
```

#### Para Admin:
```typescript
// Obtener notificaciones del admin
getAdminNotifications(): Notification[]

// Crear notificación para admin
createAdminNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Notification

// Marcar como leída
markAdminNotificationAsRead(notificationId: string): void

// Obtener cantidad de notificaciones sin leer del admin
getUnreadAdminCount(): number
```

---

### 2. **components/notifications-panel.tsx** - UI Usuario
Componente que muestra las notificaciones del usuario en el dashboard.

**Características:**
- 🔔 Ícono con badge de notificaciones sin leer
- Dialog modal con lista de notificaciones
- Colores por tipo de notificación
- Marca como leída individual o todas
- Elimina notificaciones
- Auto-actualización cada 5 segundos

**Uso:**
```tsx
import { UserNotificationsPanel } from '@/components/notifications-panel'

<UserNotificationsPanel variant="bell" /> // Variante: bell o card
```

---

### 3. **components/admin-notifications-panel.tsx** - UI Admin
Componente que muestra las actividades de usuarios al administrador.

**Características:**
- 🔔 Ícono con badge de actividades sin ver (hasta 99+)
- Dialog modal con lista de actividades
- Muestra información detallada del usuario
- Auto-actualización cada 3 segundos (más rápido que usuario)
- Monitoreo en tiempo real

**Uso:**
```tsx
import { AdminNotificationsPanel } from '@/components/admin-notifications-panel'

<AdminNotificationsPanel variant="bell" /> // Variante: bell o card
```

---

## 📦 Estructura de Notificación

```typescript
interface Notification {
  id: string                    // ID único generado automáticamente
  type: NotificationType        // Tipo de notificación
  title: string                 // Título corto
  message: string               // Mensaje descriptivo
  details?: {                   // Detalles adicionales
    userId: string
    userName: string
    userEmail: string
    amount?: number
    plan?: string
    previousPlan?: string
    investmentId?: string
    status?: string
  }
  read: boolean                 // Estado: leída o no
  createdAt: Date              // Fecha de creación
  expiresAt?: Date             // Fecha de expiración (opcional)
}
```

---

## 🔌 Integración en el Aplicativo

### **1. Depósitos** (`app/depositos/page.tsx`)
Cuando un usuario realiza un depósito:
```typescript
createUserNotification(user.id, {
  type: 'deposit',
  title: 'Depósito Registrado',
  message: `Se registró un depósito de $${amount.toFixed(2)}`,
  // ...
})
```

---

### **2. Retiros** (`app/retiros/page.tsx`)
Cuando un usuario solicita un retiro:
```typescript
createUserNotification(user.id, {
  type: 'withdrawal',
  title: 'Retiro Solicitado',
  message: `Se solicitó un retiro de $${amount.toFixed(2)}`,
  // ...
})
```

---

### **3. Inversiones** (`app/planes/page.tsx`)
Cuando un usuario crea una inversión:
```typescript
// Notificación para el usuario
createUserNotification(user.id, {
  type: 'investment',
  title: 'Inversión Creada',
  message: `Se creó una inversión de $${amount.toFixed(2)} en ${planName}`,
})

// Notificación para el admin
createAdminNotification({
  type: 'investment',
  title: 'Nueva Inversión Pendiente',
  message: `${userName} creó una inversión de $${amount.toFixed(2)}`,
})
```

---

### **4. Aprobación/Rechazo de Inversiones** (`app/admin/inversiones/page.tsx`)
Cuando el admin aprueba o rechaza una inversión:
```typescript
// Si aprueba
createUserNotification(userEmail, {
  type: 'investment_approved',
  title: 'Inversión Aprobada',
  message: `Tu inversión fue aprobada`,
})

// Si rechaza
createUserNotification(userEmail, {
  type: 'investment_rejected',
  title: 'Inversión Rechazada',
  message: `Tu inversión fue rechazada`,
})
```

---

### **5. Cambios de Plan** (`app/admin/usuarios/page.tsx`)
Cuando el admin cambia el plan de un usuario:
```typescript
// Notificación para el usuario
createUserNotification(user.id, {
  type: 'plan_change',
  title: 'Plan Actualizado',
  message: `Tu plan fue actualizado a ${newPlan.toUpperCase()}`,
  details: {
    previousPlan: oldPlan,
    plan: newPlan,
  }
})

// Notificación para el admin
createAdminNotification({
  type: 'plan_change',
  title: 'Plan de Usuario Actualizado',
  message: `Actualizaste el plan de ${userName} a ${newPlan}`,
})
```

---

### **6. Registro de Usuario** (`app/registro/page.tsx`)
Cuando se registra un nuevo usuario:
```typescript
createAdminNotification({
  type: 'user_registered',
  title: 'Nuevo Usuario Registrado',
  message: `Se registró un nuevo usuario: ${name} (${email})`,
})
```

---

## 🎨 Colores y Estilos

Cada tipo de notificación tiene un color único:

| Tipo | Emoji | Color | Uso |
|------|-------|-------|-----|
| deposit | 💰 | Verde | Dinero entrante |
| withdrawal | 💸 | Rojo | Dinero saliente |
| investment | 📈 | Azul | Inversiones |
| plan_change | 👑 | Púrpura | Cambios de plan |
| investment_approved | ✅ | Verde oscuro | Aprobaciones |
| investment_rejected | ❌ | Rojo oscuro | Rechazos |
| user_registered | 👤 | Gris | Nuevos usuarios |
| system | ℹ️ | Cyan | Mensajes del sistema |

---

## 💾 Almacenamiento

Las notificaciones se guardan en **localStorage**:

```
key: `cvvinvest_notifications_${userId}` (para usuarios)
key: `cvvinvest_admin_notifications` (para admin)
```

**Límites:**
- Máximo 50 notificaciones por usuario
- Máximo 100 notificaciones para admin
- Las más antiguas se eliminan automáticamente cuando se alcanza el límite

---

## 🔄 Actualización en Tiempo Real

### Usuario:
- Las notificaciones se actualizan automáticamente **cada 5 segundos**
- El bell icon muestra el contador de notificaciones sin leer

### Admin:
- Las notificaciones se actualizan automáticamente **cada 3 segundos**
- El bell icon muestra todas las actividades de usuarios
- Monitoreo en tiempo real de depósitos, retiros, inversiones, etc.

---

## 📱 Uso en Componentes

### En Dashboard del Usuario:
```tsx
import { DashboardHeader } from '@/components/dashboard/header'

// El header ya incluye el panel de notificaciones
<DashboardHeader user={user} />
```

### En Panel del Admin:
```tsx
import { AdminHeader } from '@/components/admin/header'

// El header ya incluye el panel de notificaciones del admin
<AdminHeader admin={admin} />
```

---

## ✨ Características Avanzadas

### 1. **Filtrado**
```typescript
// Obtener solo notificaciones de depósitos
const deposits = getUserNotificationsFiltered(userId, { type: 'deposit' })
```

### 2. **Expiración**
Las notificaciones pueden tener una fecha de expiración:
```typescript
const notification = {
  // ...
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
}
```

### 3. **Generación Automática de Mensajes**
```typescript
const { title, message } = generateNotificationMessage('deposit', {
  amount: 500
})
```

---

## 🐛 Troubleshooting

### Las notificaciones no aparecen:
1. Verifica que `lib/notifications.ts` esté presente
2. Asegúrate de que `createUserNotification()` se llame en el momento correcto
3. Revisa la consola del navegador para errores

### El contador no se actualiza:
1. Verifica que el intervalo de actualización esté activo (5s usuario, 3s admin)
2. Revisa que `getUnreadCount()` esté siendo llamado

### localStorage lleno:
1. Las notificaciones antiguas se limpian automáticamente
2. Puedes limpiar manualmente con `cleanOldNotifications(userId)`

---

## 📊 Eventos Rastreados

El sistema rastrean los siguientes eventos:

```
✅ Depósito creado
✅ Retiro solicitado
✅ Inversión creada
✅ Inversión aprobada
✅ Inversión rechazada
✅ Plan cambiado
✅ Usuario registrado
✅ Actividades del admin
```

---

## 🎯 Próximos Pasos (Opcional)

- [ ] Agregar notificaciones por email
- [ ] Agregar notificaciones push del navegador
- [ ] Agregar historial completo de notificaciones
- [ ] Agregar preferencias de notificación por usuario
- [ ] Agregar filtros avanzados en el panel de admin

---

**Sistema completamente funcional desde el 2024**
