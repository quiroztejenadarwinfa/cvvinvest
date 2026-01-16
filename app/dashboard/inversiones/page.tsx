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
  DollarSign
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
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Mis Inversiones</h1>
                <p className="text-muted-foreground text-lg">Gestiona y controla tus inversiones</p>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Invested */}
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-300">Total Invertido</p>
                      <p className="text-3xl font-bold text-blue-900 dark:text-blue-50 mt-2">${totalInvested.toFixed(2)}</p>
                      <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">{approvedCount} inversiones aprobadas</p>
                    </div>
                    <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </Card>

                {/* Pending */}
                <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-300">Pendiente</p>
                      <p className="text-3xl font-bold text-amber-900 dark:text-amber-50 mt-2">{pendingCount}</p>
                      <p className="text-xs text-amber-700 dark:text-amber-200 mt-1">Solicitudes en revisión</p>
                    </div>
                    <div className="bg-amber-500 bg-opacity-20 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </Card>

                {/* Approved */}
                <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-300">Aprobado</p>
                      <p className="text-3xl font-bold text-green-900 dark:text-green-50 mt-2">{approvedCount}</p>
                      <p className="text-xs text-green-700 dark:text-green-200 mt-1">Inversiones activas</p>
                    </div>
                    <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </Card>

                {/* Total Requests */}
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Total de Solicitudes</p>
                      <p className="text-3xl font-bold text-purple-900 dark:text-purple-50 mt-2">{investments.length}</p>
                      <p className="text-xs text-purple-700 dark:text-purple-200 mt-1">Todas las inversiones</p>
                    </div>
                    <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </Card>
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

              {/* Advanced Filters */}
              <Card className="p-6 mb-8 bg-card/50 backdrop-blur border">
                <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-5 w-5" />
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
                    <label className="text-sm font-medium mb-2 block">Búsqueda</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar plan o ID..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Estado</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => handleStatusFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="aprobado">Aprobado</option>
                      <option value="rechazado">Rechazado</option>
                    </select>
                  </div>

                  {/* Amount Range Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rango de Monto</label>
                    <select
                      value={amountFilter}
                      onChange={(e) => handleAmountFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    >
                      <option value="all">Todos los montos</option>
                      <option value="bajo">Menos de $1,000</option>
                      <option value="medio">$1,000 a $5,000</option>
                      <option value="alto">Más de $5,000</option>
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ordenar Por</label>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
                <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    {investments.length === 0
                      ? "No tienes inversiones registradas"
                      : "No hay inversiones que coincidan con tus filtros"}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {/* Results Counter */}
                  <div className="text-sm text-muted-foreground">
                    Mostrando <span className="font-semibold text-foreground">{filteredInvestments.length}</span> de <span className="font-semibold text-foreground">{investments.length}</span> inversiones
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
                                {new Date(investment.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
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
