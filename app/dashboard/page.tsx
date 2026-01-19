"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSessionUser, clearSession, type User } from "@/lib/auth"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardOverview } from "@/components/dashboard/overview"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const sessionUser = getSessionUser()
    if (!sessionUser) {
      router.push("/login")
      return
    }
    if (sessionUser.role === "admin") {
      router.push("/admin")
      return
    }
    setUser(sessionUser)
    setLoading(false)
  }, [router])

  // Refrescar datos del usuario desde Supabase cada 2 segundos para ver cambios en tiempo real
  useEffect(() => {
    if (!user) return
    
    const interval = setInterval(async () => {
      try {
        // Primero intentar obtener desde Supabase
        const response = await fetch(`/api/user/refresh?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            const updatedUser = {
              ...user,
              balance: data.user.balance || user.balance,
              plan: data.user.plan || user.plan,
              name: data.user.name || user.name,
            }
            setUser(updatedUser)
            // Actualizar también en localStorage para consistencia
            localStorage.setItem('cvvinvest_user', JSON.stringify(updatedUser))
            return
          }
        }
      } catch (error) {
        console.error('Error refrescando desde Supabase:', error)
      }
      
      // Fallback: intentar desde localStorage
      const updatedUser = getSessionUser()
      if (updatedUser) {
        setUser(updatedUser)
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [user])

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar user={user} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader user={user} />
        <main className="flex-1 p-6 overflow-auto">
          <DashboardOverview user={user} />
        </main>
      </div>
    </div>
  )
}
