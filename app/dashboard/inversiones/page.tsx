'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSessionUser, getUserInvestments, type User } from '@/lib/auth'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { InvestmentEarningsCard } from '@/components/investment-earnings-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  ArrowUpRight,
  Calendar,
  DollarSign,
  Coins,
  Briefcase
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { clearSession } from '@/lib/auth'
import { canAccessFeature } from '@/lib/plan-features'
import { FeatureGuard } from '@/components/feature-guard'
import Link from 'next/link'

interface Investment {
  id: string
  userId: string
  userEmail: string
  userName: string
  planName: string
  amount: number
  minAmount: number
  maxAmount: number
  status: 'pendiente' | 'aprobado' | 'rechazado'
  createdAt: string
  approvedAt?: string
  notes?: string
}

export default function DashboardInvestmentsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('reciente')
  const [amountFilter, setAmountFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const sessionUser = getSessionUser()
    if (!sessionUser) {
      router.push('/login')
      return
    }
    if (sessionUser.role === 'admin') {
      router.push('/admin')
      return
    }
    setUser(sessionUser)
    loadInvestments(sessionUser)
    setLoading(false)
  }, [router])

  // Recargar inversiones cada 2 segundos para ver cambios en tiempo real
  useEffect(() => {
    if (!user) return
    const interval = setInterval(() => {
      loadInvestments(user)
    }, 2000)
    return () => clearInterval(interval)
  }, [user])

  const loadInvestments = (currentUser: User) => {
    const allInvestments = getUserInvestments()
    setInvestments(allInvestments)
    applyFilters(allInvestments, statusFilter, searchTerm, sortBy, amountFilter)
  }

  const applyFilters = (data: Investment[], status: string, search: string, sort: string, amount: string) => {
    let filtered = data

    if (status !== 'all') {
      filtered = filtered.filter((inv) => inv.status === status)
    }

    if (search) {
      filtered = filtered.filter(
        (inv) =>
          inv.planName.toLowerCase().includes(search.toLowerCase()) ||
          inv.id.includes(search)
      )
    }

    // Filtro por monto
    if (amount !== 'all') {
      filtered = filtered.filter((inv) => {
        if (amount === 'bajo') return inv.amount < 1000
        if (amount === 'medio') return inv.amount >= 1000 && inv.amount < 5000
        if (amount === 'alto') return inv.amount >= 5000
        return true
      })
    }

    // Ordenar
    filtered.sort((a, b) => {
      if (sort === 'reciente') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sort === 'antiguo') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      if (sort === 'mayor-monto') {
        return b.amount - a.amount
      }
      if (sort === 'menor-monto') {
        return a.amount - b.amount
      }
      return 0
    })

    setFilteredInvestments(filtered)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    applyFilters(investments, value, searchTerm, sortBy, amountFilter)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    applyFilters(investments, statusFilter, value, sortBy, amountFilter)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    applyFilters(investments, statusFilter, searchTerm, value, amountFilter)
  }

  const handleAmountFilter = (value: string) => {
    setAmountFilter(value)
    applyFilters(investments, statusFilter, searchTerm, sortBy, value)
  }

  const handleLogout = () => {
    clearSession()
    router.push('/')
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

  const pendingCount = investments.filter((inv) => inv.status === 'pendiente').length
  const approvedCount = investments.filter((inv) => inv.status === 'aprobado').length
  const totalInvested = investments
    .filter((inv) => inv.status === 'aprobado')
    .reduce((sum, inv) => sum + inv.amount, 0)

  // Calcular ganancias/pérdidas
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const investmentsToday = investments.filter(inv => {
    const invDate = new Date(inv.createdAt)
    invDate.setHours(0, 0, 0, 0)
    return invDate.getTime() === today.getTime()
  })
  
  const earningsToday = investmentsToday.filter(inv => inv.status === 'aprobado').length > 0 
    ? investmentsToday.filter(inv => inv.status === 'aprobado').reduce((sum, inv) => sum + (inv.amount * 0.05), 0)
    : 0
  
  const totalEarnings = approvedCount > 0 
    ? investments.filter(inv => inv.status === 'aprobado').reduce((sum, inv) => sum + (inv.amount * 0.05), 0)
    : 0
  
  const losses = investments.filter(inv => inv.status === 'rechazado').reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <FeatureGuard
      user={user}
      feature="canInvest"
      featureLabel="Acceso a Inversiones"
      fallback={
        <div className="min-h-screen bg-background flex">
          <DashboardSidebar user={user} onLogout={handleLogout} />
          <div className="flex-1 flex flex-col">
            <DashboardHeader user={user} />
            <main className="flex-1 p-6 overflow-auto">
              <Alert className="border-warning/50 bg-warning/5">
                <AlertCircle className="h-4 w-4 text-warning" />
                <AlertDescription>
                  <p className="font-medium mb-2">Inversiones no disponibles</p>
                  <p className="text-sm mb-3">Las inversiones estarán disponibles según tu plan</p>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/planes">Ver Planes</Link>
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
          <main className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto">
              {/* Header Premium con Decoraciones */}
              <div className="mb-12 relative overflow-hidden rounded-2xl p-8 text-white shadow-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h1 className="text-5xl font-bold mb-2 flex items-center gap-3">
                      <span className="w-2 h-12 bg-white/30 rounded-full" />
                      Mis Inversiones
                    </h1>
                    <p className="text-blue-100 text-lg">Gestiona, monitorea y maximiza tus retornos</p>
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-blue-100 text-sm mb-2">Cartera Total</p>
                    <p className="text-4xl font-bold flex items-baseline gap-2">
                      <span>$</span>
                      <span className="text-5xl">{totalInvested.toFixed(0)}</span>
                      <span className="text-lg text-blue-100">.{(totalInvested * 100 % 100).toFixed(0).padStart(2, '0')}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats Cards - 3 Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Total Invested - Premium Card */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800 p-6 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                        <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <Badge className="bg-blue-600 text-white">Activo</Badge>
                    </div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-300 mb-2">Total Invertido</p>
                    <p className="text-4xl font-bold text-blue-900 dark:text-blue-50 mb-1">${totalInvested.toFixed(2)}</p>
                    <p className="text-xs text-blue-700 dark:text-blue-200">✓ {approvedCount} inversiones activas</p>
                  </div>
                </div>

                {/* Pending - Premium Card */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border border-amber-200 dark:border-amber-800 p-6 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-amber-500/10 rounded-xl group-hover:bg-amber-500/20 transition-colors">
                        <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <Badge className="bg-amber-600 text-white">En Revisión</Badge>
                    </div>
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-300 mb-2">Solicitudes Pendientes</p>
                    <p className="text-4xl font-bold text-amber-900 dark:text-amber-50 mb-1">{pendingCount}</p>
                    <p className="text-xs text-amber-700 dark:text-amber-200">Esperando aprobación</p>
                  </div>
                </div>

                {/* Approved - Premium Card */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800 p-6 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <Badge className="bg-green-600 text-white">Aprobado</Badge>
                    </div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-300 mb-2">Inversiones Activas</p>
                    <p className="text-4xl font-bold text-green-900 dark:text-green-50 mb-1">{approvedCount}</p>
                    <p className="text-xs text-green-700 dark:text-green-200">Generando retornos</p>
                  </div>
                </div>
              </div>

              {/* Earnings/Losses Statistics - Premium Design */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full" />
                  Análisis de Ganancias
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Ganancias del Día */}
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border border-emerald-200 dark:border-emerald-800 p-6 shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                          <ArrowUpRight className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <Badge className="bg-emerald-600 text-white">Hoy</Badge>
                      </div>
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300 mb-2">Ganancias Hoy</p>
                      <p className="text-4xl font-bold text-emerald-900 dark:text-emerald-50 mb-1">${earningsToday.toFixed(2)}</p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-200">De {investmentsToday.length} inversiones</p>
                    </div>
                  </div>

                  {/* Total Ganancias */}
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border border-cyan-200 dark:border-cyan-800 p-6 shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                          <TrendingUp className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <Badge className="bg-cyan-600 text-white">Total</Badge>
                      </div>
                      <p className="text-sm font-medium text-cyan-600 dark:text-cyan-300 mb-2">Total Ganado</p>
                      <p className="text-4xl font-bold text-cyan-900 dark:text-cyan-50 mb-1">${totalEarnings.toFixed(2)}</p>
                      <p className="text-xs text-cyan-700 dark:text-cyan-200">Ganancia general</p>
                    </div>
                  </div>

                  {/* Pérdidas */}
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border border-red-200 dark:border-red-800 p-6 shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-red-500/10 rounded-xl group-hover:bg-red-500/20 transition-colors">
                          <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <Badge className="bg-red-600 text-white">Rechazadas</Badge>
                      </div>
                      <p className="text-sm font-medium text-red-600 dark:text-red-300 mb-2">Pérdidas</p>
                      <p className="text-4xl font-bold text-red-900 dark:text-red-50 mb-1">${losses.toFixed(2)}</p>
                      <p className="text-xs text-red-700 dark:text-red-200">Inversiones rechazadas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Earnings Cards for Approved Investments */}
              {investments.filter(inv => inv.status === 'aprobado').length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Tus Inversiones Activas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {investments.filter(inv => inv.status === 'aprobado').map((investment) => (
                      <InvestmentEarningsCard key={investment.id} investment={investment} />
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="mb-8 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />

              {/* Advanced Filters */}
              <Card className="p-6 mb-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-75 transition-opacity" onClick={() => setShowFilters(!showFilters)}>
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                    <Filter className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Filtros Avanzados</h3>
                  <div className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    {[statusFilter !== 'all' ? 1 : 0, amountFilter !== 'all' ? 1 : 0, sortBy !== 'reciente' ? 1 : 0].reduce((a, b) => a + b)} activo{[statusFilter !== 'all' ? 1 : 0, amountFilter !== 'all' ? 1 : 0, sortBy !== 'reciente' ? 1 : 0].reduce((a, b) => a + b) !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className={cn(
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-300",
                  showFilters ? "opacity-100 visible" : "opacity-0 hidden h-0"
                )}>
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">Búsqueda</label>
                    <div className="relative group">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500 dark:text-blue-400 group-focus-within:text-purple-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Buscar plan o ID..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">Estado</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => handleStatusFilter(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:focus:ring-emerald-400/30 transition-all shadow-sm text-slate-900 dark:text-slate-50"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="aprobado">Aprobado</option>
                      <option value="rechazado">Rechazado</option>
                    </select>
                  </div>

                  {/* Amount Range Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">Rango de Monto</label>
                    <select
                      value={amountFilter}
                      onChange={(e) => handleAmountFilter(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:focus:ring-purple-400/30 transition-all shadow-sm text-slate-900 dark:text-slate-50"
                    >
                      <option value="all">Todos los montos</option>
                      <option value="bajo">Menos de $1,000</option>
                      <option value="medio">$1,000 a $5,000</option>
                      <option value="alto">Más de $5,000</option>
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">Ordenar Por</label>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 hover:border-cyan-300 dark:hover:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:focus:ring-cyan-400/30 transition-all shadow-sm text-slate-900 dark:text-slate-50"
                    >
                      <option value="reciente">Más reciente</option>
                      <option value="antiguo">Más antiguo</option>
                      <option value="mayor-monto">Mayor monto</option>
                      <option value="menor-monto">Menor monto</option>
                    </select>
                  </div>
                </div>
              </Card>

            {/* Investments List */}
            <div className="space-y-4">
              {filteredInvestments.length === 0 ? (
                <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-2 border-dashed border-blue-200 dark:border-blue-800/50 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                    <p className="font-semibold mb-1">
                      {investments.length === 0
                        ? "No tienes inversiones registradas"
                        : "No hay inversiones que coincidan con tus filtros"}
                    </p>
                    <p className="text-blue-700/70 dark:text-blue-300/70 text-xs">
                      {investments.length === 0 
                        ? "Comienza tu primer inversión para ver resultados aquí"
                        : "Intenta modificar los filtros o crear una nueva inversión"}
                    </p>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {/* Results Counter - Enhanced Design */}
                  <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Mostrando <span className="font-bold text-blue-600 dark:text-blue-400">{filteredInvestments.length}</span> de <span className="font-bold text-slate-700 dark:text-slate-200">{investments.length}</span> inversiones
                      </p>
                    </div>
                    {filteredInvestments.length !== investments.length && (
                      <button 
                        onClick={() => {
                          setSearchTerm('')
                          setStatusFilter('all')
                          setAmountFilter('all')
                        }}
                        className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>

                  {/* Investment Cards */}
                  {filteredInvestments.map((investment) => (
                    <Card 
                      key={investment.id} 
                      className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 hover:border-l-primary"
                      style={{
                        borderLeftColor: investment.status === 'aprobado' 
                          ? 'rgb(34, 197, 94)' 
                          : investment.status === 'pendiente'
                          ? 'rgb(217, 119, 6)'
                          : 'rgb(239, 68, 68)'
                      }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Left Section - Investment Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <h3 className="text-xl font-bold text-foreground">{investment.planName.toUpperCase()}</h3>
                            <Badge
                              className={cn(
                                'font-medium',
                                investment.status === 'pendiente'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
                                  : investment.status === 'aprobado'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                              )}
                            >
                              {investment.status === 'pendiente'
                                ? "En revisión"
                                : investment.status === 'aprobado'
                                ? "Aprobado"
                                : "Rechazado"}
                            </Badge>
                          </div>

                          {/* Info Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                              <p className="text-xs font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wider">Monto</p>
                              <p className="text-2xl font-bold text-blue-900 dark:text-blue-50 mt-1">
                                <DollarSign className="inline h-5 w-5 mr-1" />
                                {investment.amount.toFixed(2)}
                              </p>
                            </div>

                            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                              <p className="text-xs font-medium text-purple-600 dark:text-purple-300 uppercase tracking-wider">Rango Permitido</p>
                              <p className="text-sm font-bold text-purple-900 dark:text-purple-50 mt-1">
                                ${investment.minAmount} - ${investment.maxAmount}
                              </p>
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Solicitado</p>
                              <p className="text-sm font-bold text-slate-900 dark:text-slate-50 mt-1">
                                <Calendar className="inline h-4 w-4 mr-1" />
                                {new Date(investment.createdAt).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: '2-digit',
                                })}
                              </p>
                            </div>

                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
                              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-300 uppercase tracking-wider">ID</p>
                              <p className="text-sm font-mono font-bold text-emerald-900 dark:text-emerald-50 mt-1 truncate">
                                {investment.id.substring(0, 8)}...
                              </p>
                            </div>
                          </div>

                          {/* Notes Section */}
                          {investment.notes && (
                            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                              <p className="text-xs font-semibold text-amber-600 dark:text-amber-300 uppercase tracking-wider mb-1">Nota del Admin</p>
                              <p className="text-sm text-amber-900 dark:text-amber-50">{investment.notes}</p>
                            </div>
                          )}
                        </div>

                        {/* Right Section - Status Info */}
                        {investment.status === 'aprobado' && investment.approvedAt && (
                          <div className="lg:w-48 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-center">
                            <div className="flex justify-center mb-2">
                              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="text-xs font-medium text-green-600 dark:text-green-300 uppercase tracking-wider mb-1">Aprobado el</p>
                            <p className="text-lg font-bold text-green-900 dark:text-green-50">
                              {new Date(investment.approvedAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                              })}
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-200 mt-2">
                              Hace {Math.floor((Date.now() - new Date(investment.approvedAt).getTime()) / (1000 * 60 * 60 * 24))} día{Math.floor((Date.now() - new Date(investment.approvedAt).getTime()) / (1000 * 60 * 60 * 24)) !== 1 ? 's' : ''}
                            </p>
                          </div>
                        )}

                        {investment.status === 'pendiente' && (
                          <div className="lg:w-48 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-center">
                            <div className="flex justify-center mb-2">
                              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400 animate-spin" />
                            </div>
                            <p className="text-xs font-medium text-amber-600 dark:text-amber-300 uppercase tracking-wider mb-1">En Revisión</p>
                            <p className="text-xs text-amber-700 dark:text-amber-200">
                              Enviado hace {Math.floor((Date.now() - new Date(investment.createdAt).getTime()) / (1000 * 60 * 60))} hora{Math.floor((Date.now() - new Date(investment.createdAt).getTime()) / (1000 * 60 * 60)) !== 1 ? 's' : ''}
                            </p>
                          </div>
                        )}

                        {investment.status === 'rechazado' && (
                          <div className="lg:w-48 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-center">
                            <div className="flex justify-center mb-2">
                              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <p className="text-xs font-medium text-red-600 dark:text-red-300 uppercase tracking-wider mb-1">Rechazado</p>
                            <p className="text-xs text-red-700 dark:text-red-200">
                              Puedes intentar con otros montos
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
    </FeatureGuard>
  )
}
