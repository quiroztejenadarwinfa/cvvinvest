"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSessionUser, clearSession, ADMIN_EMAIL, type User, getAllDeposits, approveDeposit, rejectDeposit, type Deposit } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DollarSign, CheckCircle, XCircle, Clock, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const statusConfig = {
  pendiente: {
    label: "Pendiente",
    icon: Clock,
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  aprobado: {
    label: "Aprobado",
    icon: CheckCircle,
    color: "bg-green-500",
    textColor: "text-green-600",
    bgColor: "bg-green-100",
  },
  rechazado: {
    label: "Rechazado",
    icon: XCircle,
    color: "bg-red-500",
    textColor: "text-red-600",
    bgColor: "bg-red-100",
  },
  cancelado: {
    label: "Cancelado",
    icon: XCircle,
    color: "bg-gray-500",
    textColor: "text-gray-600",
    bgColor: "bg-gray-100",
  },
}

export default function AdminDepositosPage() {
  const [admin, setAdmin] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [comprobantes, setComprobantes] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null)
  const [selectedComprobante, setSelectedComprobante] = useState<any | null>(null)
  const [actionNotes, setActionNotes] = useState("")
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | "cancel" | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const sessionUser = getSessionUser()
    if (!sessionUser) {
      router.push("/login")
      return
    }
    if (sessionUser.email !== ADMIN_EMAIL || sessionUser.role !== "admin") {
      router.push("/dashboard")
      return
    }
    setAdmin(sessionUser)
    loadDeposits()
    setLoading(false)

    // Cargar depósitos cada 5 segundos
    const interval = setInterval(loadDeposits, 5000)
    return () => clearInterval(interval)
  }, [router])

  const loadDeposits = () => {
    const allDeposits = getAllDeposits()
    setDeposits(allDeposits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    
    // Load comprobantes from localStorage
    const allComprobantes = JSON.parse(localStorage.getItem('cvvinvest_comprobantes') || '[]')
    setComprobantes(allComprobantes.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  const filteredDeposits = deposits.filter((deposit) => {
    const matchesSearch =
      deposit.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.id.includes(searchTerm)
    const matchesStatus = filterStatus === "all" || deposit.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleApprove = async () => {
    if (!selectedDeposit) return

    const result = await approveDeposit(selectedDeposit.id, actionNotes)
    if (result) {
      toast({
        title: "Éxito",
        description: "Depósito aprobado. El saldo del usuario ha sido actualizado.",
      })
      loadDeposits()
      setIsActionDialogOpen(false)
      setSelectedDeposit(null)
      setActionNotes("")
      setActionType(null)
    } else {
      toast({
        title: "Error",
        description: "No se pudo aprobar el depósito.",
        variant: "destructive",
      })
    }
  }

  const handleReject = () => {
    if (!selectedDeposit) return

    if (rejectDeposit(selectedDeposit.id, actionNotes)) {
      toast({
        title: "Éxito",
        description: "Depósito rechazado.",
      })
      loadDeposits()
      setIsActionDialogOpen(false)
      setSelectedDeposit(null)
      setActionNotes("")
      setActionType(null)
    } else {
      toast({
        title: "Error",
        description: "No se pudo rechazar el depósito.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    if (!selectedDeposit) return

    // Cancelar es similar a rechazar, pero con estado diferente
    const allDeposits = getAllDeposits()
    const deposit = allDeposits.find((d) => d.id === selectedDeposit.id)
    if (deposit) {
      deposit.status = "cancelado"
      deposit.notes = actionNotes
      localStorage.setItem('cvvinvest_deposits', JSON.stringify(allDeposits))
      
      toast({
        title: "Éxito",
        description: "Depósito cancelado.",
      })
      loadDeposits()
      setIsActionDialogOpen(false)
      setSelectedDeposit(null)
      setActionNotes("")
      setActionType(null)
    }
  }

  const handleApproveComprobante = (comprobanteId: string) => {
    if (!selectedComprobante) return

    const allComprobantes = JSON.parse(localStorage.getItem('cvvinvest_comprobantes') || '[]')
    const comprobante = allComprobantes.find((c: any) => c.id === comprobanteId)
    
    if (comprobante) {
      // Cambiar estado del comprobante a aprobado
      comprobante.status = 'aprobado'
      comprobante.updatedAt = new Date().toISOString()
      localStorage.setItem('cvvinvest_comprobantes', JSON.stringify(allComprobantes))

      // Crear o actualizar el depósito relacionado
      const allDeposits = getAllDeposits()
      let deposit = allDeposits.find((d: any) => d.comprobanteId === comprobanteId)
      
      if (!deposit) {
        // Crear nuevo depósito si no existe
        deposit = {
          id: `dep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: comprobante.userId,
          userEmail: comprobante.userEmail,
          userName: comprobante.userName,
          amount: comprobante.amount,
          method: 'Transferencia Bancaria',
          status: 'aprobado',
          comprobanteId: comprobanteId,
          createdAt: new Date().toISOString(),
          notes: 'Depósito automático desde comprobante aprobado'
        }
        allDeposits.unshift(deposit)
      } else {
        // Actualizar estado a aprobado
        deposit.status = 'aprobado'
        deposit.notes = 'Comprobante revisado y aprobado'
      }
      
      localStorage.setItem('cvvinvest_deposits', JSON.stringify(allDeposits))

      // Actualizar balance del usuario
      const allUsers = JSON.parse(localStorage.getItem('cvvinvest_users') || '[]')
      const user = allUsers.find((u: any) => u.email === comprobante.userEmail)
      if (user) {
        user.balance = (parseFloat(user.balance) || 0) + comprobante.amount
        localStorage.setItem('cvvinvest_users', JSON.stringify(allUsers))
      }

      toast({
        title: "Éxito",
        description: `Comprobante aprobado. Depósito de $${comprobante.amount.toFixed(2)} registrado.`,
      })
      
      loadDeposits()
      setSelectedComprobante(null)
    }
  }

  const handleRejectComprobante = (comprobanteId: string) => {
    if (!selectedComprobante) return

    const allComprobantes = JSON.parse(localStorage.getItem('cvvinvest_comprobantes') || '[]')
    const comprobante = allComprobantes.find((c: any) => c.id === comprobanteId)
    
    if (comprobante) {
      // Cambiar estado del comprobante a rechazado
      comprobante.status = 'rechazado'
      comprobante.updatedAt = new Date().toISOString()
      localStorage.setItem('cvvinvest_comprobantes', JSON.stringify(allComprobantes))

      toast({
        title: "Éxito",
        description: "Comprobante rechazado.",
      })
      
      loadDeposits()
      setSelectedComprobante(null)
    }
  }

  const openApprovalDialog = (deposit: Deposit) => {
    setSelectedDeposit(deposit)
    setActionType("approve")
    setActionNotes("")
    setIsActionDialogOpen(true)
  }

  const openRejectionDialog = (deposit: Deposit) => {
    setSelectedDeposit(deposit)
    setActionType("reject")
    setActionNotes("")
    setIsActionDialogOpen(true)
  }

  const openCancellationDialog = (deposit: Deposit) => {
    setSelectedDeposit(deposit)
    setActionType("cancel")
    setActionNotes("")
    setIsActionDialogOpen(true)
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

  const pendingCount = deposits.filter((d) => d.status === "pendiente").length
  const totalPending = deposits
    .filter((d) => d.status === "pendiente")
    .reduce((sum, d) => sum + d.amount, 0)
  const totalApproved = deposits
    .filter((d) => d.status === "aprobado")
    .reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar admin={admin} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col">
        <AdminHeader admin={admin} />

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Depósitos Pendientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingCount}</div>
                  <p className="text-xs text-muted-foreground">Total: ${totalPending.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Aprobado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalApproved.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">{deposits.filter((d) => d.status === "aprobado").length} depósitos</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Depósitos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${deposits.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">{deposits.length} en total</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por email, nombre o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-background border border-border rounded-lg"
              >
                <option value="all">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="aprobado">Aprobados</option>
                <option value="rechazado">Rechazados</option>
              </select>
            </div>

            {/* Deposits Table */}
            <Card>
              <CardContent className="p-0">
                {filteredDeposits.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No hay depósitos para mostrar</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-4 font-semibold">Usuario</th>
                          <th className="text-left p-4 font-semibold">Email</th>
                          <th className="text-left p-4 font-semibold">Monto</th>
                          <th className="text-left p-4 font-semibold">Método</th>
                          <th className="text-left p-4 font-semibold">Estado</th>
                          <th className="text-left p-4 font-semibold">Fecha</th>
                          <th className="text-left p-4 font-semibold">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDeposits.map((deposit) => {
                          const config = statusConfig[deposit.status as keyof typeof statusConfig] || statusConfig.pendiente
                          const StatusIcon = config.icon
                          return (
                            <tr key={deposit.id} className="border-b hover:bg-muted/30 transition-colors">
                              <td className="p-4">{deposit.userName}</td>
                              <td className="p-4 text-sm">{deposit.userEmail}</td>
                              <td className="p-4 font-semibold">${deposit.amount.toFixed(2)}</td>
                              <td className="p-4 text-sm">{deposit.method}</td>
                              <td className="p-4">
                                <Badge className={cn(config.bgColor, config.textColor, "border-0")}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {config.label}
                                </Badge>
                              </td>
                              <td className="p-4 text-sm text-muted-foreground">
                                {new Date(deposit.createdAt).toLocaleDateString("es-ES")}
                              </td>
                              <td className="p-4">
                                {deposit.status === "pendiente" ? (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => openApprovalDialog(deposit)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Aprobar
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => openRejectionDialog(deposit)}
                                    >
                                      Rechazar
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-gray-600 hover:bg-gray-700"
                                      onClick={() => openCancellationDialog(deposit)}
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground">—</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comprobantes Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Comprobantes de Transferencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                {comprobantes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No hay comprobantes de transferencia</p>
                ) : (
                  <div className="space-y-4">
                    {comprobantes.map((comprobante) => {
                      const statusConfig = {
                        'pendiente': { bg: 'border-yellow-300 bg-yellow-50', text: 'text-yellow-800', label: '⏳ Pendiente' },
                        'aprobado': { bg: 'border-green-300 bg-green-50', text: 'text-green-800', label: '✓ Aprobado' },
                        'rechazado': { bg: 'border-red-300 bg-red-50', text: 'text-red-800', label: '✗ Rechazado' }
                      }
                      const status = statusConfig[comprobante.status as keyof typeof statusConfig] || statusConfig.pendiente
                      return (
                        <div 
                          key={comprobante.id}
                          onClick={() => setSelectedComprobante(comprobante)}
                          className={cn(
                            "border-2 rounded-lg p-4 hover:shadow-md cursor-pointer transition-all",
                            status.bg
                          )}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-semibold">{comprobante.userName}</p>
                              <p className="text-sm text-muted-foreground">{comprobante.userEmail}</p>
                            </div>
                            <Badge className="bg-blue-600">
                              ${comprobante.amount.toFixed(2)}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {new Date(comprobante.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <Badge variant="outline" className={cn("border-0", status.text, status.bg)}>
                              {status.label}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Comprobante Modal */}
      {selectedComprobante && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedComprobante(null)}
        >
          <Card 
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Comprobante de Transferencia</CardTitle>
              <button 
                onClick={() => setSelectedComprobante(null)}
                className="text-2xl text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Usuario</p>
                <p className="text-lg font-semibold">{selectedComprobante.userName}</p>
                <p className="text-sm text-muted-foreground">{selectedComprobante.userEmail}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Monto</p>
                <p className="text-2xl font-bold text-primary">${selectedComprobante.amount.toFixed(2)}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-muted-foreground">Fecha</p>
                <p className="text-sm">{new Date(selectedComprobante.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">Comprobante</p>
                {selectedComprobante.image && (
                  <img 
                    src={selectedComprobante.image} 
                    alt="Comprobante"
                    className="w-full rounded-lg border-2 border-primary/30 max-h-96 object-cover"
                  />
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => setSelectedComprobante(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cerrar
                </Button>
                {selectedComprobante.status === 'pendiente' && (
                  <>
                    <Button 
                      onClick={() => handleRejectComprobante(selectedComprobante.id)}
                      variant="destructive"
                      className="flex-1"
                    >
                      Rechazar
                    </Button>
                    <Button 
                      onClick={() => handleApproveComprobante(selectedComprobante.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Aprobar
                    </Button>
                  </>
                )}
                {selectedComprobante.status === 'aprobado' && (
                  <Badge className="flex-1 bg-green-600 justify-center py-2">✓ Aprobado</Badge>
                )}
                {selectedComprobante.status === 'rechazado' && (
                  <Badge variant="destructive" className="flex-1 justify-center py-2">✗ Rechazado</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" 
                ? "Aprobar Depósito" 
                : actionType === "reject"
                ? "Rechazar Depósito"
                : "Cancelar Depósito"}
            </DialogTitle>
            <DialogDescription>
              {selectedDeposit && (
                <div className="space-y-2 mt-4">
                  <p>
                    <span className="font-semibold">Usuario:</span> {selectedDeposit.userName}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {selectedDeposit.userEmail}
                  </p>
                  <p>
                    <span className="font-semibold">Monto:</span> ${selectedDeposit.amount.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Método:</span> {selectedDeposit.method}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div>
            <Label htmlFor="notes" className="mb-2">
              Notas (opcional)
            </Label>
            <Textarea
              id="notes"
              placeholder={
                actionType === "approve"
                  ? "Agregar notas sobre la aprobación..."
                  : actionType === "reject"
                  ? "Razón del rechazo..."
                  : "Razón de la cancelación..."
              }
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              className="min-h-20"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancelar
            </Button>
            {actionType === "approve" ? (
              <Button
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                Aprobar Depósito
              </Button>
            ) : actionType === "reject" ? (
              <Button onClick={handleReject} variant="destructive">
                Rechazar Depósito
              </Button>
            ) : (
              <Button onClick={handleCancel} className="bg-gray-600 hover:bg-gray-700">
                Cancelar Depósito
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
