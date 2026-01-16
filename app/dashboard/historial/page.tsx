'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSessionUser, getUserDeposits, getUserWithdrawals, getUserInvestments, type User, clearSession } from '@/lib/auth'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowUpRight, 
  ArrowDownLeft,
  TrendingUp,
  Search,
  Filter,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TransactionItem {
  id: string
  type: 'deposit' | 'withdrawal' | 'investment'
  amount: number
  status: 'completed' | 'pendiente' | 'aprobado' | 'rechazado'
  date: string
  description: string
  notes?: string
}

export default function HistoricalPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')

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

    // Cargar todas las transacciones del usuario
    const deposits = getUserDeposits()
      .filter(d => d.userId === sessionUser.id)
      .map(d => ({
        id: d.id,
        type: 'deposit' as const,
        amount: d.amount,
        status: d.status as 'completed' | 'pendiente' | 'aprobado' | 'rechazado',
        date: d.date || new Date().toISOString(),
        description: `Depósito de $${d.amount.toFixed(2)}`,
      }))

    const withdrawals = getUserWithdrawals()
      .filter(w => w.userId === sessionUser.id)
      .map(w => ({
        id: w.id,
        type: 'withdrawal' as const,
        amount: w.amount,
        status: w.status as 'completed' | 'pendiente' | 'aprobado' | 'rechazado',
        date: w.date || new Date().toISOString(),
        description: `Retiro de $${w.amount.toFixed(2)}`,
        notes: w.notes,
      }))

    const investments = getUserInvestments()
      .filter(inv => inv.userId === sessionUser.id)
      .map(inv => ({
        id: inv.id,
        type: 'investment' as const,
        amount: inv.amount,
        status: inv.status as 'completed' | 'pendiente' | 'aprobado' | 'rechazado',
        date: inv.createdAt || new Date().toISOString(),
        description: `Inversión en ${inv.planName || 'Plan'} - $${inv.amount.toFixed(2)}`,
        notes: inv.notes,
      }))

    // Combinar y ordenar por fecha
    const allTransactions = [...deposits, ...withdrawals, ...investments]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setTransactions(allTransactions)
    setFilteredTransactions(allTransactions)
    setLoading(false)
  }, [router])

  useEffect(() => {
    let filtered = transactions

    // Filtrar por tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(t => t.type === activeTab)
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.amount.toString().includes(searchTerm)
      )
    }

    setFilteredTransactions(filtered)
  }, [searchTerm, activeTab, transactions])

  const handleLogout = () => {
    clearSession()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando historial...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'aprobado':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'pendiente':
        return <Clock className="h-4 w-4 text-warning" />
      case 'rechazado':
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'aprobado':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">Completado</Badge>
      case 'pendiente':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Pendiente</Badge>
      case 'rechazado':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">Rechazado</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-5 w-5 text-success" />
      case 'withdrawal':
        return <ArrowUpRight className="h-5 w-5 text-warning" />
      case 'investment':
        return <TrendingUp className="h-5 w-5 text-primary" />
      default:
        return <DollarSign className="h-5 w-5" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Depósito'
      case 'withdrawal':
        return 'Retiro'
      case 'investment':
        return 'Inversión'
      default:
        return 'Transacción'
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar user={user} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader user={user} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">Historial de Transacciones</h1>
              <p className="text-muted-foreground">Visualiza todas tus depósitos, retiros e inversiones</p>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por descripción o monto..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Depositado</CardTitle>
                  <ArrowDownLeft className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${transactions
                      .filter(t => t.type === 'deposit' && (t.status === 'completed' || t.status === 'aprobado'))
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Invertido</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${transactions
                      .filter(t => t.type === 'investment' && (t.status === 'completed' || t.status === 'aprobado'))
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Retirado</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${transactions
                      .filter(t => t.type === 'withdrawal' && (t.status === 'completed' || t.status === 'aprobado'))
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transactions Tabs */}
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="deposit">Depósitos</TabsTrigger>
                    <TabsTrigger value="investment">Inversiones</TabsTrigger>
                    <TabsTrigger value="withdrawal">Retiros</TabsTrigger>
                  </TabsList>

                  {['all', 'deposit', 'investment', 'withdrawal'].map(tab => (
                    <TabsContent key={tab} value={tab} className="space-y-4">
                      {filteredTransactions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No hay transacciones en esta categoría</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredTransactions.map(transaction => (
                            <div
                              key={transaction.id}
                              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition"
                            >
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-secondary rounded-lg">
                                  {getTypeIcon(transaction.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">{transaction.description}</div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(transaction.date).toLocaleDateString('es-ES', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </div>
                                  {transaction.notes && (
                                    <div className="text-xs text-muted-foreground mt-1">Notas: {transaction.notes}</div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {getStatusBadge(transaction.status)}
                                <div className="text-right">
                                  <div className="font-bold text-lg">${transaction.amount.toLocaleString()}</div>
                                  <div className="text-xs text-muted-foreground">{getTypeLabel(transaction.type)}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
