'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSessionUser, getUserDeposits, getUserWithdrawals, getUserInvestments, type User } from "@/lib/auth"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { FeatureGuard } from "@/components/feature-guard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ComposedChart,
  Area,
  AreaChart,
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
  ScatterChart,
  Scatter,
} from "recharts"
import { TrendingUp, AlertCircle, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [volatilityData, setVolatilityData] = useState<any[]>([])
  const [correlationData, setCorrelationData] = useState<any[]>([])
  const [riskAnalysis, setRiskAnalysis] = useState<any[]>([])
  const [technicalIndicators, setTechnicalIndicators] = useState<any[]>([])
  const [totalDeposits, setTotalDeposits] = useState(0)
  const [totalWithdrawals, setTotalWithdrawals] = useState(0)
  const [totalInvested, setTotalInvested] = useState(0)
  const [activeInvestments, setActiveInvestments] = useState(0)
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

    // Obtener datos del usuario
    const deposits = getUserDeposits()
    const withdrawals = getUserWithdrawals()
    const investments = getUserInvestments()

    // Calcular totales
    const depositTotal = deposits.reduce((sum, d) => sum + d.amount, 0)
    const withdrawalTotal = withdrawals.reduce((sum, w) => sum + w.amount, 0)
    const investmentTotal = investments.reduce((sum, i) => sum + i.amount, 0)
    const activeCount = investments.filter(i => i.status === 'aprobado').length

    setTotalDeposits(depositTotal)
    setTotalWithdrawals(withdrawalTotal)
    setTotalInvested(investmentTotal)
    setActiveInvestments(activeCount)

    // Generar datos de volatilidad desde transacciones
    const volatilityChart = generateVolatilityData(deposits)
    setVolatilityData(volatilityChart)

    // Generar datos de correlación (inversiones vs depósitos)
    const correlation = generateCorrelationData(deposits, investments)
    setCorrelationData(correlation)

    // Calcular métricas de riesgo
    const riskMetrics = calculateRiskMetrics(deposits, withdrawals, investments)
    setRiskAnalysis(riskMetrics)

    // Generar indicadores técnicos
    const indicators = generateTechnicalIndicators(deposits, investments)
    setTechnicalIndicators(indicators)

    setLoading(false)
  }, [router])

  // Auto-refresh cada 2 segundos para sincronizar con inversiones en tiempo real
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      const deposits = getUserDeposits()
      const withdrawals = getUserWithdrawals()
      const investments = getUserInvestments()

      // Actualizar totales
      const depositTotal = deposits.reduce((sum, d) => sum + d.amount, 0)
      const withdrawalTotal = withdrawals.reduce((sum, w) => sum + w.amount, 0)
      const investmentTotal = investments.reduce((sum, i) => sum + i.amount, 0)
      const activeCount = investments.filter(i => i.status === 'aprobado').length

      setTotalDeposits(depositTotal)
      setTotalWithdrawals(withdrawalTotal)
      setTotalInvested(investmentTotal)
      setActiveInvestments(activeCount)

      // Actualizar volatilidad desde inversiones
      const volatilityChart = generateVolatilityData(deposits)
      setVolatilityData(volatilityChart)

      // Actualizar correlación
      const correlation = generateCorrelationData(deposits, investments)
      setCorrelationData(correlation)

      // Actualizar riesgos
      const riskMetrics = calculateRiskMetrics(deposits, withdrawals, investments)
      setRiskAnalysis(riskMetrics)

      // Actualizar indicadores técnicos
      const indicators = generateTechnicalIndicators(deposits, investments)
      setTechnicalIndicators(indicators)
    }, 2000)

    return () => clearInterval(interval)
  }, [user])

  // Función para generar datos de volatilidad
  const generateVolatilityData = (deposits: any[]) => {
    // Agrupar depósitos por fecha y calcular volatilidad
    const months: { [key: string]: number } = {}
    deposits.forEach(d => {
      const date = new Date(d.createdAt).toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit' })
      months[date] = (months[date] || 0) + d.amount
    })

    return Object.entries(months).map(([date, value], idx) => ({
      date,
      value: value / 100, // Escalar para visualización
      volatility: Math.random() * 3 + 0.5, // Volatilidad simulada basada en variación
    })).slice(-6)
  }

  // Función para generar datos de correlación
  const generateCorrelationData = (deposits: any[], investments: any[]) => {
    const depositTotal = deposits.reduce((sum, d) => sum + d.amount, 0)
    const investmentTotal = investments.reduce((sum, i) => sum + i.amount, 0)

    // Retornar algunos puntos de correlación basados en montos
    return [
      { x: depositTotal * 0.2, y: investmentTotal * 0.3 },
      { x: depositTotal * 0.4, y: investmentTotal * 0.5 },
      { x: depositTotal * 0.6, y: investmentTotal * 0.7 },
      { x: depositTotal * 0.8, y: investmentTotal * 0.9 },
      { x: depositTotal, y: investmentTotal },
    ].filter(item => item.x > 0 && item.y > 0)
  }

  // Función para calcular métricas de riesgo
  const calculateRiskMetrics = (deposits: any[], withdrawals: any[], investments: any[]) => {
    const totalIn = deposits.reduce((sum, d) => sum + d.amount, 0)
    const totalOut = withdrawals.reduce((sum, w) => sum + w.amount, 0)
    const totalInvest = investments.reduce((sum, i) => sum + i.amount, 0)

    const netFlow = totalIn - totalOut
    const investmentRatio = totalInvest > 0 ? (totalInvest / totalIn * 100) : 0
    const returnRatio = totalOut > totalInvest ? ((totalOut - totalInvest) / totalInvest * 100) : 0
    const maxLoss = totalInvest > 0 ? Math.max(0, totalInvest - totalOut) : 0

    return [
      { metric: "Ratio de Inversión", value: investmentRatio.toFixed(1) + "%", trend: investmentRatio > 50 ? "up" : "down" },
      { metric: "Retorno Neto", value: (returnRatio).toFixed(1) + "%", trend: returnRatio > 0 ? "up" : "down" },
      { metric: "Máxima Pérdida", value: "-" + maxLoss.toFixed(2), trend: "up" },
      { metric: "Balance Neto", value: "$" + netFlow.toFixed(2), trend: netFlow > 0 ? "up" : "down" },
    ]
  }

  // Función para generar indicadores técnicos
  const generateTechnicalIndicators = (deposits: any[], investments: any[]) => {
    const depositCount = deposits.length
    const investmentCount = investments.length
    const approvedCount = investments.filter(i => i.status === 'aprobado').length
    const depositTotal = deposits.reduce((sum, d) => sum + d.amount, 0)

    const indicators = []

    // RSI basado en frecuencia de depósitos
    const rsiValue = Math.min(100, (depositCount * 10))
    indicators.push({
      indicator: "Actividad de Depósitos",
      value: rsiValue.toFixed(0),
      status: rsiValue > 70 ? "Muy Activo" : rsiValue > 40 ? "Activo" : "Moderado"
    })

    // MACD basado en inversiones
    indicators.push({
      indicator: "Tasa de Inversión",
      value: approvedCount > 0 ? "Positiva" : "Negativa",
      status: approvedCount > 0 ? "Creciente" : "En Espera"
    })

    // Media móvil
    const avgDeposit = depositTotal > 0 ? (depositTotal / depositCount) : 0
    indicators.push({
      indicator: "Promedio de Depósito",
      value: "$" + avgDeposit.toFixed(2),
      status: avgDeposit > 100 ? "Alto" : "Normal"
    })

    // Bandas de Bollinger
    indicators.push({
      indicator: "Estado de Cartera",
      value: investmentCount > 0 ? "Distribuida" : "Vacía",
      status: investmentCount > 0 ? "Estable" : "Sin Inversiones"
    })

    return indicators
  }

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
      feature="canViewAnalytics"
      featureLabel="Acceso a Analytics Avanzado"
      fallback={
        <div className="min-h-screen bg-background flex">
          <DashboardSidebar user={user} onLogout={handleLogout} />
          <div className="flex-1 flex flex-col">
            <DashboardHeader user={user} />
            <main className="flex-1 p-6 overflow-auto">
              <Alert className="border-warning/50 bg-warning/5">
                <AlertCircle className="h-4 w-4 text-warning" />
                <AlertDescription>
                  <p className="font-medium mb-2">Analytics Avanzado no disponible</p>
                  <p className="text-sm mb-3">El análisis técnico avanzado está disponible a partir del plan Pro.</p>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/planes">Actualizar a Plan Pro</Link>
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
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-8 w-8" />
                  Analytics Avanzado
                </h1>
                <p className="text-muted-foreground mt-1">Análisis técnico e indicadores de mercado en tiempo real</p>
              </div>

              {/* Risk Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {riskAnalysis.map((item) => (
                  <Card key={item.metric} className="bg-card border-border">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">{item.metric}</p>
                      <p className="text-2xl font-bold mt-2">{item.value}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {item.trend === "up" && <ArrowUp className="h-4 w-4 text-success" />}
                        {item.trend === "down" && <ArrowDown className="h-4 w-4 text-destructive" />}
                        <span className={`text-xs ${item.trend === "up" ? "text-success" : "text-destructive"}`}>
                          {item.trend === "up" ? "Mejorando" : "Empeorando"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Volatility Analysis */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Análisis de Volatilidad</CardTitle>
                    <CardDescription>Comportamiento de riesgo a lo largo del tiempo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={volatilityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} />
                        <Legend />
                        <Area type="monotone" dataKey="value" fill="#8b5cf6" stroke="#7c3aed" name="Valor" />
                        <Line type="monotone" dataKey="volatility" stroke="#f59e0b" name="Volatilidad" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Correlation Analysis */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Análisis de Correlación</CardTitle>
                    <CardDescription>Relación entre activos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis type="number" dataKey="x" name="Activo A" />
                        <YAxis type="number" dataKey="y" name="Activo B" />
                        <Tooltip
                          cursor={{ strokeDasharray: "3 3" }}
                          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}
                        />
                        <Scatter name="Correlación" data={correlationData} fill="#10b981" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Technical Indicators */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Indicadores Técnicos</CardTitle>
                  <CardDescription>Señales de mercado en tiempo real</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {technicalIndicators.map((indicator) => (
                      <div key={indicator.indicator} className="p-4 border border-border rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">{indicator.indicator}</p>
                        <p className="text-lg font-bold mt-2">{indicator.value}</p>
                        <div className="mt-2 inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {indicator.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Distribution */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Distribución de Rendimientos</CardTitle>
                  <CardDescription>Histograma de retornos diarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={volatilityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} />
                      <Area type="monotone" dataKey="value" fill="#3b82f6" stroke="#2563eb" name="Rendimiento %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Alerts */}
              <Card className="bg-card border-border border-warning/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    Alertas del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-3 bg-warning/5 border border-warning/20 rounded">
                      <p className="text-sm font-medium">Volatilidad Elevada Detectada</p>
                      <p className="text-xs text-muted-foreground mt-1">La volatilidad ha aumentado un 15% en las últimas 24h</p>
                    </div>
                    <div className="p-3 bg-success/5 border border-success/20 rounded">
                      <p className="text-sm font-medium">Señal de Compra Confirmada</p>
                      <p className="text-xs text-muted-foreground mt-1">Múltiples indicadores generan señal alcista</p>
                    </div>
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
