"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  FileText,
  Mail,
  RotateCcw,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/auth"

interface AdminSidebarProps {
  admin: User
  onLogout: () => void
}

const menuItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/usuarios", icon: Users, label: "Usuarios" },
  { href: "/admin/inversiones", icon: Wallet, label: "Inversiones" },
  { href: "/admin/depositos", icon: ArrowDownLeft, label: "Depósitos" },
  { href: "/admin/retiros", icon: ArrowUpRight, label: "Retiros" },
  { href: "/admin/mensajes", icon: Mail, label: "Buzón de Mensajes" },
  { href: "/admin/chat", icon: MessageCircle, label: "Chat" },
  { href: "/admin/reportes", icon: BarChart3, label: "Reportes" },
  { href: "/admin/seguridad", icon: Shield, label: "Seguridad" },
  { href: "/admin/configuracion", icon: Settings, label: "Configuración" },
  { href: "/admin/reset", icon: RotateCcw, label: "Resetear Sistema" },
]

export function AdminSidebar({ admin, onLogout }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <Link href="/admin">
          <Logo />
        </Link>
        <div className="mt-2 px-2 py-1 bg-destructive/10 text-destructive text-xs font-bold rounded inline-block">
          ADMIN PANEL
        </div>
      </div>

      {/* Admin Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
            <Shield className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{admin?.name || 'Admin'}</div>
            <div className="text-xs text-muted-foreground truncate">{admin?.email || ''}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
