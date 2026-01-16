'use client'

import { useEffect, useState } from 'react'
import { Bell, X, Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  getAdminNotifications,
  getUnreadAdminCount,
  markAdminNotificationAsRead,
  markAllNotificationsAsRead,
  type Notification,
  type NotificationType,
} from '@/lib/notifications'
import { cn } from '@/lib/utils'

interface AdminNotificationsPanelProps {
  variant?: 'bell' | 'card'
}

const notificationColors: Record<NotificationType, string> = {
  deposit: 'bg-green-100 text-green-800 border-green-300',
  withdrawal: 'bg-blue-100 text-blue-800 border-blue-300',
  investment: 'bg-purple-100 text-purple-800 border-purple-300',
  plan_change: 'bg-amber-100 text-amber-800 border-amber-300',
  investment_approved: 'bg-green-100 text-green-800 border-green-300',
  investment_rejected: 'bg-red-100 text-red-800 border-red-300',
  user_registered: 'bg-blue-100 text-blue-800 border-blue-300',
  system: 'bg-gray-100 text-gray-800 border-gray-300',
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  deposit: '💰',
  withdrawal: '💸',
  investment: '📈',
  plan_change: '👑',
  investment_approved: '✅',
  investment_rejected: '❌',
  user_registered: '👤',
  system: 'ℹ️',
}

export function AdminNotificationsPanel({
  variant = 'bell',
}: AdminNotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDialog, setShowDialog] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
    // Recargar notificaciones cada 3 segundos
    const interval = setInterval(loadNotifications, 3000)
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = () => {
    const notifs = getAdminNotifications()
    setNotifications(notifs)
    setUnreadCount(getUnreadAdminCount())
    setLoading(false)
  }

  const handleMarkAsRead = (notificationId: string) => {
    markAdminNotificationAsRead(notificationId)
    loadNotifications()
  }

  const handleMarkAllAsRead = () => {
    // Marcar todas como leídas
    const notifs = getAdminNotifications()
    notifs.forEach(n => {
      if (!n.read) {
        markAdminNotificationAsRead(n.id)
      }
    })
    loadNotifications()
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Hace un momento'
    if (diffMins < 60) return `Hace ${diffMins}m`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays < 7) return `Hace ${diffDays}d`
    return new Date(date).toLocaleDateString('es-ES')
  }

  if (variant === 'bell') {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDialog(true)}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Actividad de Usuarios
                </span>
                {unreadCount > 0 && (
                  <Badge variant="destructive">{unreadCount}</Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                {notifications.length === 0
                  ? 'Sin actividad de usuarios'
                  : `${notifications.length} eventos registrados`}
              </DialogDescription>
            </DialogHeader>

            {notifications.length > 0 && (
              <div className="flex gap-2 mb-4">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleMarkAllAsRead}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Marcar todos como vistos
                  </Button>
                )}
              </div>
            )}

            <ScrollArea className="h-96 pr-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  Cargando...
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <Bell className="h-8 w-8 mb-2 opacity-50" />
                  <p>Sin actividad</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notif) => (
                    <Card
                      key={notif.id}
                      className={cn(
                        'p-4 border-l-4',
                        notificationColors[notif.type],
                        !notif.read && 'bg-opacity-70'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {notificationIcons[notif.type]}
                            </span>
                            <p className="font-semibold text-sm">{notif.title}</p>
                            {!notif.read && (
                              <div className="w-2 h-2 rounded-full bg-current" />
                            )}
                          </div>

                          <p className="text-sm mt-2">{notif.message}</p>

                          {/* Mostrar detalles del usuario si existen */}
                          {notif.details?.userEmail && (
                            <div className="mt-2 text-xs space-y-1 opacity-75">
                              <p>
                                <span className="font-medium">Usuario:</span>{' '}
                                {notif.details.userName || 'N/A'} (
                                {notif.details.userEmail})
                              </p>
                              {notif.details.amount && (
                                <p>
                                  <span className="font-medium">Monto:</span> $
                                  {notif.details.amount.toFixed(2)}
                                </p>
                              )}
                              {notif.details.plan && (
                                <p>
                                  <span className="font-medium">Plan:</span>{' '}
                                  {notif.details.plan}
                                </p>
                              )}
                              {notif.details.previousPlan && (
                                <p>
                                  <span className="font-medium">Cambio de:</span>{' '}
                                  {notif.details.previousPlan} →{' '}
                                  {notif.details.plan}
                                </p>
                              )}
                            </div>
                          )}

                          <p className="text-xs opacity-70 mt-2">
                            {formatTime(new Date(notif.createdAt))}
                          </p>
                        </div>

                        <div className="flex gap-1">
                          {!notif.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsRead(notif.id)}
                              title="Marcar como visto"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Variante card
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Actividad de Usuarios
          {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
        </h2>
        {unreadCount > 0 && (
          <Button size="sm" variant="outline" onClick={handleMarkAllAsRead}>
            Marcar todos como vistos
          </Button>
        )}
      </div>

      <ScrollArea className="h-96 pr-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            Cargando...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <Bell className="h-8 w-8 mb-2 opacity-50" />
            <p>Sin actividad</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <Card
                key={notif.id}
                className={cn(
                  'p-4 border-l-4',
                  notificationColors[notif.type],
                  !notif.read && 'bg-opacity-70'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {notificationIcons[notif.type]}
                      </span>
                      <p className="font-semibold text-sm">{notif.title}</p>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>

                    <p className="text-sm mt-2">{notif.message}</p>

                    {notif.details?.userEmail && (
                      <div className="mt-2 text-xs space-y-1 opacity-75">
                        <p>
                          <span className="font-medium">Usuario:</span>{' '}
                          {notif.details.userName || 'N/A'} (
                          {notif.details.userEmail})
                        </p>
                        {notif.details.amount && (
                          <p>
                            <span className="font-medium">Monto:</span> $
                            {notif.details.amount.toFixed(2)}
                          </p>
                        )}
                        {notif.details.plan && (
                          <p>
                            <span className="font-medium">Plan:</span>{' '}
                            {notif.details.plan}
                          </p>
                        )}
                      </div>
                    )}

                    <p className="text-xs opacity-70 mt-2">
                      {formatTime(new Date(notif.createdAt))}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    {!notif.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(notif.id)}
                        title="Marcar como visto"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  )
}
