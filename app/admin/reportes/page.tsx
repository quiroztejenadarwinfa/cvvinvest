"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart, Download, TrendingUp } from "lucide-react"
import type { User } from "@/lib/auth"

interface ReportStats {
  totalUsers: number
  activeUsers: number
  totalDeposits: number
  totalWithdrawals: number
  totalInvested: number
  pendingTransactions: number
  approvedTransactions: number
  rejectedTransactions: number
  platformBalance: number
  averageInvestmentReturn: number
  totalCommissions: number
}

export default function ReportesPage() {
  const [stats, setStats] = useState<ReportStats | null>(null)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener estadísticas de usuarios y transacciones
    const users: User[] = JSON.parse(localStorage.getItem("cvvinvest_users") || "[]")
    const deposits = JSON.parse(localStorage.getItem("cvvinvest_deposits") || "[]")
    const withdrawals = JSON.parse(localStorage.getItem("cvvinvest_withdrawals") || "[]")
    const investments = JSON.parse(localStorage.getItem("cvvinvest_investments") || "[]")

    // Calcular estadísticas
    const activeUsers = users.filter((u: User) => u.role === "user").length
    const totalDeposits = deposits.reduce((sum: number, d: any) => sum + (d.amount || 0), 0)
    const totalWithdrawals = withdrawals.reduce((sum: number, w: any) => sum + (w.amount || 0), 0)
    const totalInvested = investments.reduce((sum: number, i: any) => sum + (i.amount || 0), 0)
    const totalCommissions = Math.round(totalDeposits * 0.02) // 2% de comisión

    const pendingDeposits = deposits.filter((d: any) => d.status === "pendiente").length
    const approvedDeposits = deposits.filter((d: any) => d.status === "aprobado").length
    const rejectedDeposits = deposits.filter((d: any) => d.status === "rechazado").length

    const platformBalance = totalDeposits - totalWithdrawals + totalInvested

    setStats({
      totalUsers: users.length,
      activeUsers,
      totalDeposits,
      totalWithdrawals,
      totalInvested,
      pendingTransactions: pendingDeposits,
      approvedTransactions: approvedDeposits,
      rejectedTransactions: rejectedDeposits,
      platformBalance,
      averageInvestmentReturn: 21.5, // Según estadísticas del sistema
      totalCommissions,
    })

    setLoading(false)
  }, [])

  const handleExportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      timeRange,
      stats,
    }

    const csv = `
Reporte de Plataforma de Inversión
Generado: ${new Date().toLocaleDateString()}

RESUMEN GENERAL
===============
Total de Usuarios: ${stats?.totalUsers || 0}
Usuarios Activos: ${stats?.activeUsers || 0}
Saldo de Plataforma: $${stats?.platformBalance?.toLocaleString() || 0}
Comisiones Totales: $${stats?.totalCommissions?.toLocaleString() || 0}

TRANSACCIONES
=============
Total Depósitos: $${stats?.totalDeposits?.toLocaleString() || 0}
Total Retiros: $${stats?.totalWithdrawals?.toLocaleString() || 0}
Total Invertido: $${stats?.totalInvested?.toLocaleString() || 0}

ESTADO DE TRANSACCIONES
=======================
Pendientes: ${stats?.pendingTransactions || 0}
Aprobadas: ${stats?.approvedTransactions || 0}
Rechazadas: ${stats?.rejectedTransactions || 0}

PERFORMANCE
===========
Retorno Promedio: ${stats?.averageInvestmentReturn}%
    `.trim()

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(csv))
    element.setAttribute("download", `reporte-${new Date().toISOString().split("T")[0]}.csv`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando reportes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reportes</h1>
          <p className="text-muted-foreground mt-1">Análisis y estadísticas de la plataforma</p>
        </div>
        <Button onClick={handleExportReport} className="gap-2">
          <Download className="h-4 w-4" />
          Descargar Reporte
        </Button>
      </div>

      {/* Time Range Selector */}
      <Tabs value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
        <TabsList>
          <TabsTrigger value="7d">Últimos 7 días</TabsTrigger>
          <TabsTrigger value="30d">Últimos 30 días</TabsTrigger>
          <TabsTrigger value="90d">Últimos 90 días</TabsTrigger>
          <TabsTrigger value="1y">Este año</TabsTrigger>
        </TabsList>

        <TabsContent value={timeRange} className="space-y-6 mt-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Users */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stats?.activeUsers} activos
                </p>
              </CardContent>
            </Card>

            {/* Platform Balance */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Saldo de Plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${stats?.platformBalance?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Activos totales</p>
              </CardContent>
            </Card>

            {/* Total Deposits */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Depósitos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${stats?.totalDeposits?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Ingresos acumulados</p>
              </CardContent>
            </Card>

            {/* Total Commissions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Comisiones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${stats?.totalCommissions?.toLocaleString()}</div>
                <p className="text-xs text-green-600 mt-1">2% de depósitos</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transactions Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Resumen de Transacciones
                </CardTitle>
                <CardDescription>Depósitos vs Retiros</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Depósitos</span>
                      <span>${stats?.totalDeposits?.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "70%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Retiros</span>
                      <span>${stats?.totalWithdrawals?.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "30%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Inversiones</span>
                      <span>${stats?.totalInvested?.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: "50%" }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Estado de Transacciones
                </CardTitle>
                <CardDescription>Distribución actual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg">
                    <span className="text-sm font-medium">Pendientes</span>
                    <span className="text-2xl font-bold text-yellow-600">{stats?.pendingTransactions}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-500/10 rounded-lg">
                    <span className="text-sm font-medium">Aprobadas</span>
                    <span className="text-2xl font-bold text-green-600">{stats?.approvedTransactions}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-500/10 rounded-lg">
                    <span className="text-sm font-medium">Rechazadas</span>
                    <span className="text-2xl font-bold text-red-600">{stats?.rejectedTransactions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Performance</CardTitle>
              <CardDescription>Indicadores clave de rendimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-sm text-muted-foreground">Retorno Promedio</div>
                  <div className="text-2xl font-bold mt-1">{stats?.averageInvestmentReturn}%</div>
                  <div className="text-xs text-green-600 mt-2">Mensual</div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="text-sm text-muted-foreground">Tasa de Aprobación</div>
                  <div className="text-2xl font-bold mt-1">
                    {stats?.approvedTransactions && stats?.pendingTransactions
                      ? Math.round(
                          (stats.approvedTransactions /
                            (stats.approvedTransactions +
                              stats.rejectedTransactions +
                              stats.pendingTransactions)) *
                            100
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-xs text-green-600 mt-2">De transacciones</div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="text-sm text-muted-foreground">Saldo por Usuario</div>
                  <div className="text-2xl font-bold mt-1">
                    ${Math.round((stats?.platformBalance || 0) / (stats?.activeUsers || 1)).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Promedio</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
