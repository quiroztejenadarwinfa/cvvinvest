"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Settings,
  HelpCircle,
  LogOut,
  Crown,
  BarChart3,
  TrendingUp,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/auth"
import { canAccessFeature } from "@/lib/plan-features"

interface DashboardSidebarProps {
  user: User
  onLogout: () => void
}

interface MenuItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  feature?: string // Característica requerida para mostrar este item
}

const allMenuItems: MenuItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Panel" },
  { href: "/dashboard/inversiones", icon: Wallet, label: "Inversiones", feature: "canInvest" },
  { href: "/depositos", icon: ArrowDownLeft, label: "Depositar", feature: "canDeposit" },
  { href: "/retiros", icon: ArrowUpRight, label: "Retirar", feature: "canWithdraw" },
  { href: "/dashboard/informes", icon: BarChart3, label: "Informes", feature: "canViewReports" },
  { href: "/dashboard/analytics", icon: TrendingUp, label: "Analytics", feature: "canViewAnalytics" },
  { href: "/dashboard/historial", icon: History, label: "Historial", feature: "canInvest" },
  { href: "/dashboard/seguridad", icon: Shield, label: "Seguridad" },
  { href: "/dashboard/ajustes", icon: Settings, label: "Ajustes" },
]

export function DashboardSidebar({ user, onLogout }: DashboardSidebarProps) {
  const pathname = usePathname()
  
  // Filtrar items de menú según el plan del usuario
  const visibleMenuItems = allMenuItems.filter((item) => {
    if (!item.feature) return true
    return canAccessFeature(user.plan, item.feature as any)
  })

  const planColors: Record<string, string> = {
    gratuito: "bg-slate-500",
    estandar: "bg-blue-500",
    pro: "bg-primary",
    vip: "bg-amber-500",
    elite: "bg-emerald-500",
  }

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold">{user.name[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{user.name}</div>
            <div className="flex items-center gap-1">
              <span className={cn("w-2 h-2 rounded-full", planColors[user.plan])} />
              <span className="text-xs text-muted-foreground capitalize">Plan {user.plan}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {visibleMenuItems.map((item) => (
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

      {/* Upgrade Plan CTA */}
      {user.plan === "gratuito" && (
        <div className="p-4 border-t border-border">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">Mejora tu Plan</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Desbloquea inversiones y retiros con nuestros planes premium.
            </p>
            <Button size="sm" className="w-full bg-primary text-primary-foreground" asChild>
              <Link href="/planes">Ver Planes</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-1">
        <Link
          href="/dashboard/ayuda"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
            pathname === "/dashboard/ayuda"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          <HelpCircle className="h-5 w-5" />
          Ayuda
        </Link>
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
