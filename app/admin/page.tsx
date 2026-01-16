"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSessionUser, clearSession, ADMIN_EMAIL, type User } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { AdminOverview } from "@/components/admin/overview"

export default function AdminPage() {
  const [admin, setAdmin] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const sessionUser = getSessionUser()
    if (!sessionUser) {
      router.push("/login")
      return
    }
    // Verificar que es admin
    if (sessionUser.email !== ADMIN_EMAIL || sessionUser.role !== "admin") {
      router.push("/dashboard")
      return
    }
    setAdmin(sessionUser)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!admin) return null

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar admin={admin} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <AdminHeader admin={admin} />
        <main className="flex-1 p-6 overflow-auto">
          <AdminOverview />
        </main>
      </div>
    </div>
  )
}
