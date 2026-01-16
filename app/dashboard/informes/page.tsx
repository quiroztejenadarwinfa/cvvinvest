'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSessionUser, type User, getUserDeposits, getUserWithdrawals, getUserInvestments } from "@/lib/auth"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { FeatureGuard } from "@/components/feature-guard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, FileText, TrendingUp, Calendar, Filter } from "lucide-react"
import Link from "next/link"

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]

export default function InformesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [investmentData, setInvestmentData] = useState<any[]>([])
  const [portfolioDistribution, setPortfolioDistribution] = useState<any[]>([])
  const [depositsData, setDepositsData] = useState<any[]>([])
  const [withdrawalsData, setWithdrawalsData] = useState<any[]>([])
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [totalStats, setTotalStats] = useState({
    totalDeposited: 0,
    totalWithdrawn: 0,
    totalInvested: 0,
    averageInvestment: 0,
  })
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
    
    // Cargar datos del usuario
    const deposits = getUserDeposits()
    const withdrawals = getUserWithdrawals()
    const investments = getUserInvestments()

    // Processar depósitos
    const depositsByMonth: Record<string, number> = {}
    deposits.forEach(d => {
      const month = new Date(d.createdAt).toLocaleDateString('es-ES', { month: 'short' })
      depositsByMonth[month] = (depositsByMonth[month] || 0) + d.amount
    })
    const depositsChartData = Object.entries(depositsByMonth).map(([month, amount]) => ({
      month,
      amount,
    }))
    setDepositsData(depositsChartData)

    // Processar retiros
    const withdrawalsByMonth: Record<string, number> = {}
    withdrawals.forEach(w => {
      const month = new Date(w.createdAt).toLocaleDateString('es-ES', { month: 'short' })
      withdrawalsByMonth[month] = (withdrawalsByMonth[month] || 0) + w.amount
    })
    const withdrawalsChartData = Object.entries(withdrawalsByMonth).map(([month, amount]) => ({
      month,
      amount,
    }))
    setWithdrawalsData(withdrawalsChartData)

    // Distribución de inversiones por plan
    const investmentsByPlan: Record<string, number> = {}
    investments.forEach(i => {
      investmentsByPlan[i.planName] = (investmentsByPlan[i.planName] || 0) + i.amount
    })
    const portfolioData = Object.entries(investmentsByPlan).map(([name, value]) => ({
      name,
      value,
    }))
    setPortfolioDistribution(portfolioData.length > 0 ? portfolioData : [{ name: 'Sin inversiones', value: 0 }])

    // Inversiones por mes
    const investmentsByMonth: Record<string, number> = {}
    investments.forEach(i => {
      const month = new Date(i.createdAt).toLocaleDateString('es-ES', { month: 'short' })
      investmentsByMonth[month] = (investmentsByMonth[month] || 0) + i.amount
    })
    const investmentChartData = Object.entries(investmentsByMonth).map(([month, amount]) => ({
      month,
      amount,
      returns: Math.round(amount * 0.05), // 5% de retorno simulado
    }))
    setInvestmentData(investmentChartData)

    // Calcular totales
    const totalDeposited = deposits.reduce((sum, d) => sum + d.amount, 0)
    const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.amount, 0)
    const totalInvested = investments.filter(i => i.status === 'aprobado').reduce((sum, i) => sum + i.amount, 0)
    const averageInvestment = investments.length > 0 ? totalInvested / investments.length : 0

    setTotalStats({
      totalDeposited,
      totalWithdrawn,
      totalInvested,
      averageInvestment,
    })

    // Generar datos de rendimiento por período
    const performanceChartData = [
      { period: "1M", performance: investments.length > 0 ? Math.random() * 15 : 0 },
      { period: "3M", performance: investments.length > 0 ? Math.random() * 25 : 0 },
      { period: "6M", performance: investments.length > 0 ? Math.random() * 35 : 0 },
      { period: "1Y", performance: investments.length > 0 ? Math.random() * 50 : 0 },
    ]
    setPerformanceData(performanceChartData)

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("cvvinvest_user")
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
    <FeatureGuard
      user={user}
      feature="canViewReports"
      featureLabel="Acceso a Informes"
      fallback={
        <div className="min-h-screen bg-background flex">
          <DashboardSidebar user={user} onLogout={handleLogout} />
          <div className="flex-1 flex flex-col">
            <DashboardHeader user={user} />
            <main className="flex-1 p-6 overflow-auto">
              <Alert className="border-warning/50 bg-warning/5">
                <FileText className="h-4 w-4 text-warning" />
                <AlertDescription>
                  <p className="font-medium mb-2">Informes no disponibles</p>
                  <p className="text-sm mb-3">Los informes detallados están disponibles a partir del plan Estándar.</p>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/planes">Ver planes disponibles</Link>
                  </Button>
                </AlertDescription>
              </Alert>
            </main>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar user={user} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col">
          <DashboardHeader user={user} />
          <main className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Informes</h1>
                  <p className="text-muted-foreground mt-1">Análisis detallado de tu cartera de inversiones</p>
                </div>
                <Button className="gap-2" variant="outline">
                  <Download className="h-4 w-4" />
                  Descargar Reporte
                </Button>
              </div>

              {/* Filtros */}
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Período</label>
                      <select className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground">
                        <option>Último mes</option>
                        <option>Últimos 3 meses</option>
                        <option>Últimos 6 meses</option>
                        <option>Último año</option>
                        <option>Personalizado</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">Tipo de Reporte</label>
                      <select className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground">
                        <option>Resumen General</option>
                        <option>Detallado</option>
                        <option>Por Plan</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <Button className="gap-2">
                        <Filter className="h-4 w-4" />
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Total Depositado</p>
                    <p className="text-2xl font-bold mt-2">${totalStats.totalDeposited.toLocaleString()}</p>
                    <p className="text-xs text-success mt-1">En tu cuenta</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Total Retirado</p>
                    <p className="text-2xl font-bold mt-2">${totalStats.totalWithdrawn.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Completado</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Total Invertido</p>
                    <p className="text-2xl font-bold mt-2">${totalStats.totalInvested.toLocaleString()}</p>
                    <p className="text-xs text-success mt-1">Aprobadas y activas</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Inversión Promedio</p>
                    <p className="text-2xl font-bold mt-2">${totalStats.averageInvestment.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Por transacción</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Investment Growth Chart */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Evolución de Inversiones</CardTitle>
                    <CardDescription>Inversión y retornos mensuales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={investmentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} />
                        <Legend />
                        <Line type="monotone" dataKey="amount" stroke="#3b82f6" name="Inversión" />
                        <Line type="monotone" dataKey="returns" stroke="#10b981" name="Retornos" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Portfolio Distribution Chart */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Distribución de Cartera</CardTitle>
                    <CardDescription>Por tipo de plan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={portfolioDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {portfolioDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Comparison */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Rentabilidad por Período</CardTitle>
                  <CardDescription>Comparación de rendimientos en diferentes intervalos de tiempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} />
                      <Bar dataKey="performance" fill="#3b82f6" name="Rentabilidad %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Detailed Table */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Detalle de Inversiones</CardTitle>
                  <CardDescription>Listado completo de tus inversiones activas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-border">
                        <tr className="text-left text-muted-foreground">
                          <th className="py-2 px-4">Plan</th>
                          <th className="py-2 px-4">Monto Inicial</th>
                          <th className="py-2 px-4">Fecha Inicio</th>
                          <th className="py-2 px-4">Valor Actual</th>
                          <th className="py-2 px-4">Ganancia</th>
                          <th className="py-2 px-4">ROI %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {investmentData.length > 0 ? (
                          investmentData.map((inv, idx) => {
                            const roi = inv.amount > 0 ? ((inv.returns / inv.amount) * 100).toFixed(2) : 0
                            const currentValue = inv.amount + inv.returns
                            return (
                              <tr key={idx}>
                                <td className="py-3 px-4">{inv.month}</td>
                                <td className="py-3 px-4">${inv.amount.toLocaleString()}</td>
                                <td className="py-3 px-4">{new Date().toLocaleDateString('es-ES')}</td>
                                <td className="py-3 px-4">${currentValue.toLocaleString()}</td>
                                <td className="py-3 px-4 text-success">${inv.returns.toLocaleString()}</td>
                                <td className="py-3 px-4 text-success">{roi}%</td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-3 px-4 text-center text-muted-foreground">
                              No hay inversiones registradas
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </FeatureGuard>
  )
}
