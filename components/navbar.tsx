"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Menu, X, LogOut, DollarSign, User as UserIcon, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getSessionUser, clearSession } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/planes", label: "Planes" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const currentUser = getSessionUser()
    setUser(currentUser)
  }, [])

  const handleLogout = () => {
    clearSession()
    setUser(null)
    router.push('/')
    setMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User Account Info Card - Desktop */}
        {mounted && user && (
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex flex-col gap-0 min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">
                  {user.name || "Usuario"}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user.email || ""}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Shield className="h-3.5 w-3.5 text-primary/60" />
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                {user.plan?.charAt(0).toUpperCase() + user.plan?.slice(1) || "Gratis"}
              </span>
            </div>
          </div>
        )}

        {/* User Account Info Card - Mobile */}
        {mounted && user && (
          <button
            onClick={() => {
              router.push('/dashboard')
              setMobileMenuOpen(false)
            }}
            className="md:hidden flex items-center gap-2 px-2 py-1 rounded bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
          </button>
        )}

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/dashboard">
                  <UserIcon className="h-4 w-4" />
                  Panel
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/depositos">
                  <DollarSign className="h-4 w-4" />
                  Depositar
                </Link>
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/registro">Crear Cuenta</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-sm font-medium">Tema</span>
              <ThemeToggle />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium py-2 transition-colors",
                  pathname === link.href ? "text-primary" : "text-muted-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {user ? (
                <>
                  {/* User Info Card in Mobile Menu */}
                  <div className="px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="flex flex-col gap-0 min-w-0">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {user.name || "Usuario"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {user.email || ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full gap-2">
                    <Link href="/dashboard">
                      <UserIcon className="h-4 w-4" />
                      Panel
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full gap-2">
                    <Link href="/depositos">
                      <DollarSign className="h-4 w-4" />
                      Depositar
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={handleLogout} className="w-full gap-2">
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button asChild className="bg-primary text-primary-foreground">
                    <Link href="/registro">Crear Cuenta</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
