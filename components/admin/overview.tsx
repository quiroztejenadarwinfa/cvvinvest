"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, ArrowUpRight, ArrowDownLeft, AlertCircle, CheckCircle, Clock, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { User } from "@/lib/auth"
import { getAllUsersSupabase } from "@/lib/auth"

export function AdminOverview() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0,
  })

  useEffect(() => {
    // Función para cargar y actualizar datos desde Supabase
    const loadStats = async () => {
      try {
        const supabaseUsers = await getAllUsersSupabase()
        console.log(`[AdminOverview] Usuarios desde Supabase: ${supabaseUsers.length}`)
        
        if (supabaseUsers.length > 0) {
          setUsers(supabaseUsers)
          // Calcular estadísticas desde usuarios de Supabase
          const totalDeposits = supabaseUsers.reduce((acc, u: any) => acc + (u.balance || 0), 0)
          
          setStats({
            totalUsers: supabaseUsers.length,
            totalDeposits: totalDeposits,
            totalWithdrawals: 0,
            pendingWithdrawals: 0,
          })
        } else {
          // Fallback a localStorage
          const storedUsers = localStorage.getItem("cvvinvest_users")
          if (storedUsers) {
            const parsedUsers: User[] = JSON.parse(storedUsers)
            console.log(`[AdminOverview] Usuarios desde localStorage (fallback): ${parsedUsers.length}`)
            setUsers(parsedUsers)
            setStats({
              totalUsers: parsedUsers.length,
              totalDeposits: parsedUsers.reduce((acc, u) => acc + u.balance, 0),
              totalWithdrawals: 0,
              pendingWithdrawals: 0,
            })
          }
        }
      } catch (error) {
        console.error('[AdminOverview] Error loading stats:', error)
        // Fallback a localStorage
        const storedUsers = localStorage.getItem("cvvinvest_users")
        if (storedUsers) {
          const parsedUsers: User[] = JSON.parse(storedUsers)
          setUsers(parsedUsers)
        }
      }
    }
    
    // Cargar al montar
    loadStats()
    
    // Actualizar cada 2 segundos para tiempo real (más eficiente que 1 segundo)
    const interval = setInterval(() => {
      loadStats()
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Registrados en la plataforma</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Capital Total</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalDeposits.toLocaleString()}</div>
            <p className="text-xs text-success mt-1">En depósitos activos</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Retiros Totales</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalWithdrawals.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Procesados</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Retiros Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingWithdrawals}</div>
            <p className="text-xs text-muted-foreground mt-1">Solicitudes por aprobar</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Usuarios Recientes</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/usuarios">Ver Todos</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay usuarios registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">{user.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">
                      {user.plan}
                    </Badge>
                    <div className="text-right">
                      <div className="font-medium">${user.balance.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Balance</div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Aprobar Retiros</div>
                <p className="text-sm text-muted-foreground">0 pendientes</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/retiros">Ver</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <ArrowDownLeft className="h-6 w-6 text-info" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Verificar Depósitos</div>
                <p className="text-sm text-muted-foreground">0 pendientes</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/depositos">Ver</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Alertas del Sistema</div>
                <p className="text-sm text-muted-foreground">Sin alertas</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                alert("Sistema funcionando correctamente - Sin alertas críticas")
              }}>
                Ver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
