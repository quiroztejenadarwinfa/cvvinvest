// Sistema de notificaciones para admin y usuarios

export type NotificationType = 
  | 'deposit'           // Depósito realizado
  | 'withdrawal'        // Retiro realizado
  | 'investment'        // Inversión realizada
  | 'plan_change'       // Cambio de plan
  | 'investment_approved'  // Inversión aprobada
  | 'investment_rejected'   // Inversión rechazada
  | 'user_registered'   // Nuevo usuario registrado
  | 'system'           // Notificación del sistema

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  details?: {
    userId?: string
    userName?: string
    userEmail?: string
    amount?: number
    plan?: string
    previousPlan?: string
    investmentId?: string
    status?: string
  }
  read: boolean
  createdAt: Date
  expiresAt?: Date
}

export interface NotificationFilters {
  type?: NotificationType
  read?: boolean
  days?: number // Notificaciones de los últimos N días
}

// Clave de localStorage
const NOTIFICATIONS_KEY = 'cvvinvest_notifications'
const ADMIN_NOTIFICATIONS_KEY = 'cvvinvest_admin_notifications'

/**
 * Obtener todas las notificaciones del usuario actual
 */
export function getUserNotifications(userId: string): Notification[] {
  try {
    const stored = localStorage.getItem(`${NOTIFICATIONS_KEY}_${userId}`)
    if (!stored) return []
    
    const notifications = JSON.parse(stored) as Notification[]
    // Convertir strings a Date
    return notifications.map(n => ({
      ...n,
      createdAt: new Date(n.createdAt),
      expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined
    }))
  } catch (error) {
    console.error('Error loading user notifications:', error)
    return []
  }
}

/**
 * Obtener todas las notificaciones del admin
 */
export function getAdminNotifications(): Notification[] {
  try {
    const stored = localStorage.getItem(ADMIN_NOTIFICATIONS_KEY)
    if (!stored) return []
    
    const notifications = JSON.parse(stored) as Notification[]
    return notifications.map(n => ({
      ...n,
      createdAt: new Date(n.createdAt),
      expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined
    }))
  } catch (error) {
    console.error('Error loading admin notifications:', error)
    return []
  }
}

/**
 * Crear una notificación de usuario (solo depósitos y retiros)
 * Las inversiones y cambios de plan solo van al admin
 */
export function createUserNotification(
  userId: string,
  notification: Omit<Notification, 'id' | 'createdAt'>
): Notification {
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    read: false
  }

  // Solo guardar notificaciones de depósitos y retiros para el usuario
  const allowedTypes = ['deposit', 'withdrawal', 'investment_approved', 'investment_rejected']
  if (!allowedTypes.includes(notification.type)) {
    // Solo crear notificación de admin si no es para el usuario
    return newNotification
  }

  const notifications = getUserNotifications(userId)
  notifications.unshift(newNotification)

  // Mantener solo las últimas 50 notificaciones
  const limited = notifications.slice(0, 50)
  localStorage.setItem(
    `${NOTIFICATIONS_KEY}_${userId}`,
    JSON.stringify(limited)
  )

  return newNotification
}

/**
 * Crear una notificación de admin
 */
export function createAdminNotification(
  notification: Omit<Notification, 'id' | 'createdAt'>
): Notification {
  const newNotification: Notification = {
    ...notification,
    id: `admin-notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    read: false
  }

  const notifications = getAdminNotifications()
  notifications.unshift(newNotification)

  // Mantener solo las últimas 100 notificaciones
  const limited = notifications.slice(0, 100)
  localStorage.setItem(
    ADMIN_NOTIFICATIONS_KEY,
    JSON.stringify(limited)
  )

  return newNotification
}

/**
 * Marcar notificación como leída
 */
export function markNotificationAsRead(userId: string, notificationId: string): void {
  const notifications = getUserNotifications(userId)
  const updated = notifications.map(n =>
    n.id === notificationId ? { ...n, read: true } : n
  )

  localStorage.setItem(
    `${NOTIFICATIONS_KEY}_${userId}`,
    JSON.stringify(updated)
  )
}

/**
 * Marcar todas las notificaciones como leídas
 */
export function markAllNotificationsAsRead(userId: string): void {
  const notifications = getUserNotifications(userId)
  const updated = notifications.map(n => ({ ...n, read: true }))

  localStorage.setItem(
    `${NOTIFICATIONS_KEY}_${userId}`,
    JSON.stringify(updated)
  )
}

/**
 * Eliminar una notificación del usuario
 */
export function deleteNotification(userId: string, notificationId: string): void {
  const notifications = getUserNotifications(userId)
  const filtered = notifications.filter(n => n.id !== notificationId)
  localStorage.setItem(
    `${NOTIFICATIONS_KEY}_${userId}`,
    JSON.stringify(filtered)
  )
}

/**
 * Limpiar toda la bandeja de notificaciones del usuario
 */
export function clearUserNotifications(userId: string): void {
  localStorage.removeItem(`${NOTIFICATIONS_KEY}_${userId}`)
}

/**
 * Marcar notificación de admin como leída
 */
export function markAdminNotificationAsRead(notificationId: string): void {
  const notifications = getAdminNotifications()
  const updated = notifications.map(n =>
    n.id === notificationId ? { ...n, read: true } : n
  )

  localStorage.setItem(
    ADMIN_NOTIFICATIONS_KEY,
    JSON.stringify(updated)
  )
}

/**
 * Obtener notificaciones filtradas
 */
export function getUserNotificationsFiltered(
  userId: string,
  filters: NotificationFilters
): Notification[] {
  let notifications = getUserNotifications(userId)

  if (filters.type) {
    notifications = notifications.filter(n => n.type === filters.type)
  }

  if (filters.read !== undefined) {
    notifications = notifications.filter(n => n.read === filters.read)
  }

  if (filters.days) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - filters.days)
    notifications = notifications.filter(n => new Date(n.createdAt) >= cutoffDate)
  }

  return notifications
}

/**
 * Obtener notificaciones no leídas
 */
export function getUnreadCount(userId: string): number {
  return getUserNotifications(userId).filter(n => !n.read).length
}

/**
 * Obtener notificaciones no leídas del admin
 */
export function getUnreadAdminCount(): number {
  return getAdminNotifications().filter(n => !n.read).length
}

/**
 * Limpiar toda la bandeja del administrador
 */
export function clearAdminNotifications(): void {
  localStorage.removeItem(ADMIN_NOTIFICATIONS_KEY)
}

/**
 * Limpiar notificaciones antiguas (más de 30 días)
 */
export function cleanOldNotifications(userId: string): void {
  const notifications = getUserNotifications(userId)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const filtered = notifications.filter(
    n => new Date(n.createdAt) >= thirtyDaysAgo
  )

  localStorage.setItem(
    `${NOTIFICATIONS_KEY}_${userId}`,
    JSON.stringify(filtered)
  )
}

/**
 * Generar mensaje de notificación según tipo
 */
export function generateNotificationMessage(
  type: NotificationType,
  details?: Notification['details']
): { title: string; message: string } {
  switch (type) {
    case 'deposit':
      return {
        title: 'Depósito Realizado',
        message: `Se registró un depósito de $${details?.amount?.toFixed(2) || '0.00'}`
      }
    case 'withdrawal':
      return {
        title: 'Retiro Procesado',
        message: `Se procesó un retiro de $${details?.amount?.toFixed(2) || '0.00'}`
      }
    case 'investment':
      return {
        title: 'Inversión Realizada',
        message: `Se registró una inversión de $${details?.amount?.toFixed(2) || '0.00'} en ${details?.plan || 'un plan'}`
      }
    case 'plan_change':
      return {
        title: 'Plan Actualizado',
        message: `Tu plan cambió de ${details?.previousPlan || 'Gratuito'} a ${details?.plan || 'nuevo plan'}`
      }
    case 'investment_approved':
      return {
        title: 'Inversión Aprobada',
        message: `Tu inversión de $${details?.amount?.toFixed(2) || '0.00'} ha sido aprobada`
      }
    case 'investment_rejected':
      return {
        title: 'Inversión Rechazada',
        message: `Tu inversión de $${details?.amount?.toFixed(2) || '0.00'} ha sido rechazada`
      }
    case 'user_registered':
      return {
        title: 'Nuevo Usuario',
        message: `${details?.userName || 'Un usuario'} (${details?.userEmail}) se ha registrado`
      }
    case 'system':
      return {
        title: 'Notificación del Sistema',
        message: 'Mensaje del sistema'
      }
    default:
      return {
        title: 'Notificación',
        message: 'Tienes una nueva notificación'
      }
  }
}
