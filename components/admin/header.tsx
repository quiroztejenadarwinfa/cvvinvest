"use client"

import { Search, Shield, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminNotificationsPanel } from "@/components/admin-notifications-panel"
import { getMessages } from "@/lib/messages"
import type { User } from "@/lib/auth"

interface AdminHeaderProps {
  admin: User
}

export function AdminHeader({ admin }: AdminHeaderProps) {
  const messages = getMessages()
  const unreadMessages = messages.filter((m) => !m.read).length

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-destructive" />
          <h1 className="text-lg font-semibold">Panel de Administración</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar usuarios, transacciones..." className="pl-10 w-80 bg-secondary border-border" />
        </div>

        {unreadMessages > 0 && (
          <Link href="/admin/mensajes">
            <Button variant="ghost" size="icon" className="relative">
              <Mail className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unreadMessages}
              </span>
            </Button>
          </Link>
        )}

        <AdminNotificationsPanel variant="bell" />
      </div>
    </header>
  )
}
