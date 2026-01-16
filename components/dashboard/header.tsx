"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserNotificationsPanel } from "@/components/notifications-panel"
import type { User } from "@/lib/auth"

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">¡Bienvenido, {user.name.split(" ")[0]}!</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar..." className="pl-10 w-64 bg-secondary border-border" />
        </div>

        <UserNotificationsPanel userId={user.id} variant="bell" />
      </div>
    </header>
  )
}
