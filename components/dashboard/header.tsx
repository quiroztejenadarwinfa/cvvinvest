"use client"

import { Search, User as UserIcon, Mail, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserNotificationsPanel } from "@/components/notifications-panel"
import type { User } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const getPlanColor = (plan: string) => {
    const colors: Record<string, string> = {
      gratuito: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
      estandar: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      pro: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      vip: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      elite: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
    }
    return colors[plan.toLowerCase()] || colors.gratuito
  }

  return (
    <header className="h-auto border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div>
            <h1 className="text-2xl font-bold">¡Bienvenido, {user.name}!</h1>
            <p className="text-sm text-muted-foreground">Accede a tu información de inversión</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <UserNotificationsPanel userId={user.id} variant="bell" />
        </div>
      </div>

      {/* Account Identifier Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
        {/* Name and Email */}
        <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
          <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
            <UserIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Cuenta</p>
            <p className="font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        {/* Plan Badge */}
        <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-lg border border-border">
          <div className="p-2 bg-secondary rounded-lg flex-shrink-0">
            <Shield className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Plan Actual</p>
            <Badge className={`mt-1 ${getPlanColor(user.plan)}`}>
              {user.plan.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Saldo */}
        <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div className="p-2 bg-emerald-200 dark:bg-emerald-800 rounded-lg flex-shrink-0">
            <Mail className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase">Saldo</p>
            <p className="font-bold text-emerald-900 dark:text-emerald-50">${user.balance?.toFixed(2) || "0.00"}</p>
          </div>
        </div>
      </div>

      {/* Search Bar - moved to bottom on mobile */}
      <div className="relative hidden md:block mt-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar..." className="pl-10 w-full bg-secondary border-border" />
      </div>
    </header>
  )
}
