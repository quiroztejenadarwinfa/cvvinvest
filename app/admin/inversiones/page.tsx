'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { getSessionUser, getAllInvestments, approveInvestment, rejectInvestment, getAllUsers, setAllUsers, ADMIN_EMAIL } from '@/lib/auth'
import { createUserNotification, createAdminNotification } from '@/lib/notifications'

import type { PlanType } from '@/lib/plan-features'
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Crown, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Investment {
  id: string
  userEmail: string
  userName?: string
  planName: string
  amount: number
  status: 'pendiente' | 'aprobado' | 'rechazado'
  notes?: string
  createdAt: string
  minAmount: number
  maxAmount: number
}

const planSuggestions: Record<string, PlanType[]> = {
  'plan-60-150': ['estandar', 'pro', 'vip'],
  'plan-200-500': ['pro', 'vip', 'elite'],
  'plan-600-1500': ['vip', 'elite'],
  'plan-1500-plus': ['elite'],
}

export default function AdminInvestmentPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [actionNotes, setActionNotes] = useState('')
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'cancel' | null>(null)
  const [message, setMessage] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [changePlanOnApprove, setChangePlanOnApprove] = useState(false)
  const [selectedPlanForChange, setSelectedPlanForChange] = useState<PlanType>('')
  const [suggestedPlans, setSuggestedPlans] = useState<PlanType[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [adminEarningsMultiplier, setAdminEarningsMultiplier] = useState(0.05)

  useEffect(() => {
    const currentUser = getSessionUser()
    if (!currentUser || currentUser.email !== ADMIN_EMAIL || currentUser.role !== "admin") {
      router.push('/login')
      return
    }
    setUser(currentUser)
    loadInvestments()
  }, [router])

  // Auto-refresh deshabilitado por defecto. La búsqueda y filtros funcionan en tiempo real.
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      loadInvestments()
    }, 5000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const loadInvestments = () => {
    const allInvestments = getAllInvestments()
    setInvestments(allInvestments)
    filterInvestments(allInvestments, searchTerm, statusFilter, minAmount, maxAmount, startDate, endDate)
  }

  const filterInvestments = (data: Investment[], search: string, status: string, minAmt: string, maxAmt: string, startDt: string, endDt: string) => {
    let filtered = data

    // Filtrar por búsqueda (usuario, correo, ID)
    if (search) {
      filtered = filtered.filter(
        (inv) =>
          inv.userEmail.toLowerCase().includes(search.toLowerCase()) ||
          inv.userName?.toLowerCase().includes(search.toLowerCase()) ||
          inv.id.includes(search)
      )
    }

    // Filtrar por estado
    if (status !== 'all') {
      filtered = filtered.filter((inv) => inv.status === status)
    }

    // Filtrar por monto mínimo
    if (minAmt) {
      const min = parseFloat(minAmt)
      if (!isNaN(min)) {
        filtered = filtered.filter((inv) => inv.amount >= min)
      }
    }

    // Filtrar por monto máximo
    if (maxAmt) {
      const max = parseFloat(maxAmt)
      if (!isNaN(max)) {
        filtered = filtered.filter((inv) => inv.amount <= max)
      }
    }

    // Filtrar por fecha inicial
    if (startDt) {
      const startDateTime = new Date(startDt).getTime()
      filtered = filtered.filter((inv) => new Date(inv.createdAt).getTime() >= startDateTime)
    }

    // Filtrar por fecha final
    if (endDt) {
      const endDateTime = new Date(endDt).getTime() + 86400000 // +1 día para incluir todo el día
      filtered = filtered.filter((inv) => new Date(inv.createdAt).getTime() <= endDateTime)
    }

    setFilteredInvestments(filtered)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    filterInvestments(investments, value, statusFilter, minAmount, maxAmount, startDate, endDate)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    filterInvestments(investments, searchTerm, value, minAmount, maxAmount, startDate, endDate)
  }

  const handleMinAmountChange = (value: string) => {
    setMinAmount(value)
    filterInvestments(investments, searchTerm, statusFilter, value, maxAmount, startDate, endDate)
  }

  const handleMaxAmountChange = (value: string) => {
    setMaxAmount(value)
    filterInvestments(investments, searchTerm, statusFilter, minAmount, value, startDate, endDate)
  }

  const handleStartDateChange = (value: string) => {
    setStartDate(value)
    filterInvestments(investments, searchTerm, statusFilter, minAmount, maxAmount, value, endDate)
  }

  const handleEndDateChange = (value: string) => {
    setEndDate(value)
    filterInvestments(investments, searchTerm, statusFilter, minAmount, maxAmount, startDate, value)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setMinAmount('')
    setMaxAmount('')
    setStartDate('')
    setEndDate('')
    filterInvestments(investments, '', 'all', '', '', '', '')
  }

  const getSuggestedPlansForInvestment = (amount: number): PlanType[] => {
    if (amount >= 1500) return ['vip', 'elite']
    if (amount >= 600) return ['vip', 'elite']
    if (amount >= 200) return ['pro', 'vip', 'elite']
    if (amount >= 60) return ['estandar', 'pro', 'vip']
    return []
  }

  const openActionModal = (investment: Investment, type: 'approve' | 'reject' | 'cancel') => {
    setSelectedInvestment(investment)
    setActionType(type)
    setActionNotes('')
    setChangePlanOnApprove(false)
    setSelectedPlanForChange('')
    
    if (type === 'approve') {
      const suggested = getSuggestedPlansForInvestment(investment.amount)
      setSuggestedPlans(suggested)
      setSelectedPlanForChange(suggested[0] || '')
    }
    
    setShowActionModal(true)
  }

  const handleAction = async () => {
    if (!selectedInvestment || !actionType) return

    try {
      if (actionType === 'cancel') {
        // Cambiar estado a rechazado (similar a cancel)
        rejectInvestment(selectedInvestment.id, `CANCELADO: ${actionNotes}`)
        
        // Crear notificación para el usuario
        createUserNotification(selectedInvestment.userEmail, {
          type: 'investment_cancelled',
          title: 'Inversión Cancelada',
          message: `Tu inversión de $${selectedInvestment.amount.toFixed(2)} fue cancelada${actionNotes ? ': ' + actionNotes : ''}`,
          details: {
            userId: selectedInvestment.userEmail,
            userName: selectedInvestment.userName,
            userEmail: selectedInvestment.userEmail,
            amount: selectedInvestment.amount,
            plan: selectedInvestment.planName,
            investmentId: selectedInvestment.id,
          },
          read: false,
        })
        
        // Crear notificación para el admin
        createAdminNotification({
          type: 'investment_cancelled',
          title: 'Inversión Cancelada',
          message: `Cancelaste la inversión de ${selectedInvestment.userName} por $${selectedInvestment.amount.toFixed(2)}`,
          details: {
            userId: selectedInvestment.userEmail,
            userName: selectedInvestment.userName,
            userEmail: selectedInvestment.userEmail,
            amount: selectedInvestment.amount,
            plan: selectedInvestment.planName,
            investmentId: selectedInvestment.id,
          },
          read: false,
        })
        
        setMessage(`✓ Inversión cancelada. Notificación enviada al usuario.`)
      } else if (actionType === 'approve') {
        approveInvestment(selectedInvestment.id, actionNotes)
        
        // Crear notificación para el usuario
        createUserNotification(selectedInvestment.userEmail, {
          type: 'investment_approved',
          title: 'Inversión Aprobada',
          message: `Tu inversión de $${selectedInvestment.amount.toFixed(2)} en ${selectedInvestment.planName} fue aprobada`,
          details: {
            userId: selectedInvestment.userEmail,
            userName: selectedInvestment.userName,
            userEmail: selectedInvestment.userEmail,
            amount: selectedInvestment.amount,
            plan: selectedInvestment.planName,
            investmentId: selectedInvestment.id,
          },
          read: false,
        })

        // Crear notificación para el admin
        createAdminNotification({
          type: 'investment_approved',
          title: 'Inversión Aprobada',
          message: `Aprobaste la inversión de ${selectedInvestment.userName} por $${selectedInvestment.amount.toFixed(2)}`,
          details: {
            userId: selectedInvestment.userEmail,
            userName: selectedInvestment.userName,
            userEmail: selectedInvestment.userEmail,
            amount: selectedInvestment.amount,
            plan: selectedInvestment.planName,
            investmentId: selectedInvestment.id,
          },
          read: false,
        })
        
        // Actualizar al plan que el usuario solicitó en la inversión
        const planToUpdate = selectedInvestment.planName as PlanType
        
        // Actualizar el usuario con el plan que solicitó
        if (planToUpdate) {
          const allUsers = getAllUsers()
          const updatedUsers = allUsers.map((u) =>
            u.email === selectedInvestment.userEmail
              ? { ...u, plan: planToUpdate }
              : u
          )
          setAllUsers(updatedUsers)
          
          // Crear notificación de cambio de plan
          createUserNotification(selectedInvestment.userEmail, {
            type: 'plan_change',
            title: 'Plan Actualizado',
            message: `Tu plan fue actualizado a ${planToUpdate.toUpperCase()} por inversión`,
            details: {
              userId: selectedInvestment.userEmail,
              userName: selectedInvestment.userName,
              userEmail: selectedInvestment.userEmail,
              previousPlan: selectedInvestment.planName,
              plan: planToUpdate,
            },
            read: false,
          })

          setMessage(
            `✓ Inversión aprobada. Plan del usuario actualizado a ${planToUpdate.toUpperCase()}`
          )
        } else {
          setMessage('✓ Inversión aprobada exitosamente. El saldo del usuario ha sido deducido.')
        }
      } else {
        rejectInvestment(selectedInvestment.id, actionNotes)
        
        // Crear notificación de rechazo para el usuario
        createUserNotification(selectedInvestment.userEmail, {
          type: 'investment_rejected',
          title: 'Inversión Rechazada',
          message: `Tu inversión de $${selectedInvestment.amount.toFixed(2)} en ${selectedInvestment.planName} fue rechazada`,
          details: {
            userId: selectedInvestment.userEmail,
            userName: selectedInvestment.userName,
            userEmail: selectedInvestment.userEmail,
            amount: selectedInvestment.amount,
            plan: selectedInvestment.planName,
            investmentId: selectedInvestment.id,
          },
          read: false,
        })

        // Crear notificación para el admin
        createAdminNotification({
          type: 'investment_rejected',
          title: 'Inversión Rechazada',
          message: `Rechazaste la inversión de ${selectedInvestment.userName} por $${selectedInvestment.amount.toFixed(2)}`,
          details: {
            userId: selectedInvestment.userEmail,
            userName: selectedInvestment.userName,
            userEmail: selectedInvestment.userEmail,
            amount: selectedInvestment.amount,
            plan: selectedInvestment.planName,
            investmentId: selectedInvestment.id,
          },
          read: false,
        })

        setMessage('✓ Inversión rechazada.')
      }

      setShowActionModal(false)
      setSelectedInvestment(null)
      setActionType(null)
      setActionNotes('')
      setChangePlanOnApprove(false)
      setSelectedPlanForChange('')
      loadInvestments()
      setTimeout(() => setMessage(''), 5000)
    } catch (error) {
      setMessage('✗ Error al procesar la acción.')
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const pendingCount = investments.filter((inv) => inv.status === 'pendiente').length
  const approvedCount = investments.filter((inv) => inv.status === 'aprobado').length
  const rejectedCount = investments.filter((inv) => inv.status === 'rechazado').length
  const totalAmount = investments
    .filter((inv) => inv.status === 'aprobado')
    .reduce((sum, inv) => sum + inv.amount, 0)
  const approvedTotal = totalAmount

  // Calcular ganancias
  const totalEarningsGenerated = investments
    .filter((inv) => inv.status === 'aprobado')
    .reduce((sum, inv) => sum + (inv.amount * adminEarningsMultiplier), 0)
  
  const totalLosses = investments
    .filter((inv) => inv.status === 'rechazado')
    .reduce((sum, inv) => sum + inv.amount, 0)

  if (!user) {
    return <div className="p-8 text-center">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Gestión de Inversiones</h1>
          <p className="text-muted-foreground text-lg">Revisa y aprueba las solicitudes de inversión</p>
        </div>

        {message && (
          <Alert className={cn(
            'mb-6',
            message.includes('exitosamente')
              ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
              : message.includes('Error')
              ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
              : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
          )}>
            <AlertDescription className={cn(
              message.includes('exitosamente')
                ? 'text-green-800 dark:text-green-200'
                : message.includes('Error')
                ? 'text-red-800 dark:text-red-200'
                : 'text-yellow-800 dark:text-yellow-200'
            )}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Pending Count */}
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-300">En Revisión</p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-50 mt-2">{pendingCount}</p>
                <p className="text-xs text-amber-700 dark:text-amber-200 mt-1">Solicitudes pendientes de aprobación</p>
              </div>
              <div className="bg-amber-500 bg-opacity-20 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </Card>

          {/* Total Approved */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-300">Total Aprobado</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-50 mt-2">${approvedTotal.toFixed(2)}</p>
                <p className="text-xs text-green-700 dark:text-green-200 mt-1">Capital invertido</p>
              </div>
              <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          {/* Approved Count */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-300">Aprobadas</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-50 mt-2">{approvedCount}</p>
                <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">Solicitudes activas</p>
              </div>
              <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          {/* Total */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Total de Solicitudes</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-50 mt-2">{investments.length}</p>
                <p className="text-xs text-purple-700 dark:text-purple-200 mt-1">Todas las inversiones</p>
              </div>
              <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Earnings Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Ganancia Generada */}
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300">Ganancia Generada</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-50 mt-2">${totalEarningsGenerated.toFixed(2)}</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-200 mt-1">Del {(adminEarningsMultiplier * 100).toFixed(0)}% de inversiones</p>
              </div>
              <div className="bg-emerald-500 bg-opacity-20 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </Card>

          {/* Inversión Total Aprobada */}
          <Card className="p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-cyan-200 dark:border-cyan-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-600 dark:text-cyan-300">Inversión Total</p>
                <p className="text-3xl font-bold text-cyan-900 dark:text-cyan-50 mt-2">${approvedTotal.toFixed(2)}</p>
                <p className="text-xs text-cyan-700 dark:text-cyan-200 mt-1">De {approvedCount} inversiones</p>
              </div>
              <div className="bg-cyan-500 bg-opacity-20 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </Card>

          {/* Pérdidas */}
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-300">Montos Rechazados</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-50 mt-2">${totalLosses.toFixed(2)}</p>
                <p className="text-xs text-red-700 dark:text-red-200 mt-1">De {rejectedCount} solicitudes</p>
              </div>
              <div className="bg-red-500 bg-opacity-20 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Control de Porcentaje de Ganancias */}
        <Card className="mb-8 p-6 bg-card/50 border">
          <h3 className="font-semibold mb-4">Configurar Porcentaje de Ganancias</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Porcentaje de Ganancias por Inversión</Label>
              <input 
                type="range"
                min="0"
                max="100"
                step="1"
                value={adminEarningsMultiplier * 100}
                onChange={(e) => setAdminEarningsMultiplier(parseFloat(e.target.value) / 100)}
                className="w-full mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">Actual: {(adminEarningsMultiplier * 100).toFixed(0)}%</p>
            </div>
          </div>
        </Card>

        {/* Advanced Filters */}
        <Card className="mb-6 p-6 bg-card/50 backdrop-blur border">
          <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-5 w-5" />
            <h3 className="font-semibold text-lg">Filtros Avanzados</h3>
            <div className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
              {[statusFilter !== 'all' ? 1 : 0, minAmount ? 1 : 0, maxAmount ? 1 : 0, startDate ? 1 : 0, endDate ? 1 : 0].reduce((a, b) => a + b)} activo{[statusFilter !== 'all' ? 1 : 0, minAmount ? 1 : 0, maxAmount ? 1 : 0, startDate ? 1 : 0, endDate ? 1 : 0].reduce((a, b) => a + b) !== 1 ? 's' : ''}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                resetFilters()
              }}
              className="ml-2"
            >
              Limpiar
            </Button>
          </div>

          <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300",
            showFilters ? "opacity-100 visible" : "opacity-0 hidden h-0 overflow-hidden"
          )}>
            {/* Búsqueda por usuario/email */}
            <div>
              <label className="text-sm font-medium block mb-2">Buscar por Correo del Usuario</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Nombre, email o ID..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Filtro de estado */}
            <div>
              <label className="text-sm font-medium block mb-2">Estado</label>
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

            {/* Monto Mínimo */}
            <div>
              <label className="text-sm font-medium block mb-2">Monto Mínimo</label>
              <input
                type="number"
                placeholder="$0"
                value={minAmount}
                onChange={(e) => handleMinAmountChange(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Monto Máximo */}
            <div>
              <label className="text-sm font-medium block mb-2">Monto Máximo</label>
              <input
                type="number"
                placeholder="$999999"
                value={maxAmount}
                onChange={(e) => handleMaxAmountChange(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Fecha Inicial */}
            <div>
              <label className="text-sm font-medium block mb-2">Desde</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Fecha Final */}
            <div>
              <label className="text-sm font-medium block mb-2">Hasta</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Auto-refresh */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={cn(
                  "w-full",
                  autoRefresh && 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700'
                )}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", autoRefresh && "animate-spin")} />
                {autoRefresh ? "Auto-actualizar" : "Actualizar"}
              </Button>
            </div>
          </div>

          {/* Resumen de resultados */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Mostrando <span className="font-semibold text-foreground">{filteredInvestments.length}</span> de <span className="font-semibold text-foreground">{investments.length}</span> inversiones
            </p>
          </div>
        </Card>

        {/* Investments List */}
        <div className="space-y-4">
          {filteredInvestments.length === 0 ? (
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                No hay inversiones que cumplan con los filtros especificados
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
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
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Left - User & Investment Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{investment.userName || 'Usuario'}</h3>
                          <p className="text-sm text-muted-foreground">{investment.userEmail}</p>
                        </div>
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
                            ? '⏳ Pendiente'
                            : investment.status === 'aprobado'
                            ? '✅ Aprobado'
                            : '❌ Rechazado'}
                        </Badge>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                          <p className="text-xs font-medium text-purple-600 dark:text-purple-300 uppercase tracking-wider">Plan</p>
                          <p className="text-sm font-bold text-purple-900 dark:text-purple-50 mt-1">{investment.planName.toUpperCase()}</p>
                        </div>

                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-xs font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wider">Monto</p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-50 mt-1">
                            ${investment.amount.toFixed(0)}
                          </p>
                        </div>

                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-xs font-medium text-green-600 dark:text-green-300 uppercase tracking-wider">Rango</p>
                          <p className="text-sm font-bold text-green-900 dark:text-green-50 mt-1">
                            ${investment.minAmount} - ${investment.maxAmount}
                          </p>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Solicitado</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-50 mt-1">
                            {new Date(investment.createdAt).toLocaleDateString('es-ES', {
                              month: 'short',
                              day: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      {investment.notes && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <p className="text-xs font-semibold text-amber-600 dark:text-amber-300 uppercase tracking-wider mb-1">📝 Notas</p>
                          <p className="text-sm text-amber-900 dark:text-amber-50">{investment.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Right - Actions */}
                    {investment.status === 'pendiente' ? (
                      <div className="lg:w-56 space-y-2">
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => openActionModal(investment, 'approve')}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Aprobar
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => openActionModal(investment, 'reject')}
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Rechazar
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => openActionModal(investment, 'cancel')}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <div className="lg:w-56 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Sin acción disponible</p>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {investment.status === 'aprobado' ? '✓ Completada' : '✗ Rechazada'}
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

      {/* Action Modal */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'approve' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Aprobar Inversión
                </>
              ) : actionType === 'reject' ? (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Rechazar Inversión
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-gray-500" />
                  Cancelar Inversión
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? `Ingresos: $${selectedInvestment?.amount.toFixed(2)} - Plan: ${selectedInvestment?.planName.toUpperCase()}`
                : `Usuario: ${selectedInvestment?.userEmail} - Monto: $${selectedInvestment?.amount.toFixed(2)}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Notas (Opcional):</label>
              <Textarea
                placeholder="Agrega notas sobre tu decisión..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="h-24"
              />
            </div>

            {/* Plan Change Option (only for approve) */}
            {actionType === 'approve' && (
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="change-plan"
                    checked={changePlanOnApprove}
                    onChange={(e) => setChangePlanOnApprove(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="change-plan" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    Cambiar plan al aprobar
                  </label>
                </div>

                {changePlanOnApprove && (
                  <div className="bg-primary/5 p-3 rounded-lg space-y-3">
                    <Label htmlFor="plan-select" className="text-sm">
                      Selecciona un nuevo plan
                    </Label>
                    <Select value={selectedPlanForChange} onValueChange={(value) => setSelectedPlanForChange(value as PlanType)}>
                      <SelectTrigger id="plan-select" className="bg-background">
                        <SelectValue placeholder="Elige un plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {suggestedPlans.map((plan) => (
                          <SelectItem key={plan} value={plan}>
                            <span className="capitalize font-medium">{plan}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedPlanForChange && (
                      <div className="bg-secondary p-3 rounded border border-border text-xs space-y-1">
                        <p className="font-medium mb-2">Características del Plan {selectedPlanForChange.toUpperCase()}:</p>
                        {(() => {
                          const features = getPlanFeatures(selectedPlanForChange)
                          return (
                            <ul className="space-y-1">
                              <li className="flex items-center gap-2">
                                {features.canDeposit ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-3 w-3 text-red-500" />
                                )}
                                Depósitos
                              </li>
                              <li className="flex items-center gap-2">
                                {features.canWithdraw ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-3 w-3 text-red-500" />
                                )}
                                Retiros ({features.withdrawalDays} días)
                              </li>
                              <li className="flex items-center gap-2">
                                {features.canInvest ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-3 w-3 text-red-500" />
                                )}
                                Todas las inversiones
                              </li>
                              <li className="flex items-center gap-2">
                                {features.canViewReports ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-3 w-3 text-red-500" />
                                )}
                                Reportes
                              </li>
                              <li className="flex items-center gap-2">
                                {features.canViewAnalytics ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-3 w-3 text-red-500" />
                                )}
                                Análisis
                              </li>
                            </ul>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionModal(false)}>
              Cerrar
            </Button>
            <Button
              onClick={handleAction}
              className={
                actionType === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : actionType === 'reject'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }
            >
              {actionType === 'approve' ? 'Aprobar' : actionType === 'reject' ? 'Rechazar' : 'Cancelar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
