"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSessionUser, clearSession, ADMIN_EMAIL, type User, getAllWithdrawals, approveWithdrawal, rejectWithdrawal, type Withdrawal } from "@/lib/auth"
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
}

export default function AdminRetirosPage() {
  const [admin, setAdmin] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null)
  const [actionNotes, setActionNotes] = useState("")
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
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
    loadWithdrawals()
    setLoading(false)

    const interval = setInterval(loadWithdrawals, 5000)
    return () => clearInterval(interval)
  }, [router])

  const loadWithdrawals = () => {
    const allWithdrawals = getAllWithdrawals()
    setWithdrawals(allWithdrawals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesSearch =
      withdrawal.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.id.includes(searchTerm)
    const matchesStatus = filterStatus === "all" || withdrawal.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleApprove = () => {
    if (!selectedWithdrawal) return

    if (approveWithdrawal(selectedWithdrawal.id, actionNotes)) {
      toast({
        title: "Éxito",
        description: "Retiro aprobado. El balance del usuario ha sido actualizado.",
      })
      loadWithdrawals()
      setIsActionDialogOpen(false)
      setSelectedWithdrawal(null)
      setActionNotes("")
      setActionType(null)
    }
  }

  const handleReject = () => {
    if (!selectedWithdrawal) return

    if (rejectWithdrawal(selectedWithdrawal.id, actionNotes)) {
      toast({
        title: "Éxito",
        description: "Retiro rechazado.",
      })
      loadWithdrawals()
      setIsActionDialogOpen(false)
      setSelectedWithdrawal(null)
      setActionNotes("")
      setActionType(null)
    }
  }

  const openApprovalDialog = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal)
    setActionType("approve")
    setActionNotes("")
    setIsActionDialogOpen(true)
  }

  const openRejectionDialog = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal)
    setActionType("reject")
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

  const pendingCount = withdrawals.filter((w) => w.status === "pendiente").length
  const totalPending = withdrawals
    .filter((w) => w.status === "pendiente")
    .reduce((sum, w) => sum + w.amount, 0)
  const totalApproved = withdrawals
    .filter((w) => w.status === "aprobado")
    .reduce((sum, w) => sum + w.amount, 0)

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
                  <CardTitle className="text-sm font-medium">Retiros Pendientes</CardTitle>
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
                  <p className="text-xs text-muted-foreground">{withdrawals.filter((w) => w.status === "aprobado").length} retiros</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Retiros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${withdrawals.reduce((sum, w) => sum + w.amount, 0).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">{withdrawals.length} en total</p>
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

            {/* Withdrawals Table */}
            <Card>
              <CardContent className="p-0">
                {filteredWithdrawals.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No hay retiros para mostrar</p>
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
                        {filteredWithdrawals.map((withdrawal) => {
                          const config = statusConfig[withdrawal.status as keyof typeof statusConfig]
                          const StatusIcon = config.icon
                          return (
                            <tr key={withdrawal.id} className="border-b hover:bg-muted/30 transition-colors">
                              <td className="p-4">{withdrawal.userName}</td>
                              <td className="p-4 text-sm">{withdrawal.userEmail}</td>
                              <td className="p-4 font-semibold">${withdrawal.amount.toFixed(2)}</td>
                              <td className="p-4 text-sm">{withdrawal.method}</td>
                              <td className="p-4">
                                <Badge className={cn(config.bgColor, config.textColor, "border-0")}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {config.label}
                                </Badge>
                              </td>
                              <td className="p-4 text-sm text-muted-foreground">
                                {new Date(withdrawal.createdAt).toLocaleDateString("es-ES")}
                              </td>
                              <td className="p-4">
                                {withdrawal.status === "pendiente" ? (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => openApprovalDialog(withdrawal)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Aprobar
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => openRejectionDialog(withdrawal)}
                                    >
                                      Rechazar
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
          </div>
        </main>
      </div>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Aprobar Retiro" : "Rechazar Retiro"}
            </DialogTitle>
            <DialogDescription>
              {selectedWithdrawal && (
                <div className="space-y-2 mt-4">
                  <div>
                    <span className="font-semibold">Usuario:</span> {selectedWithdrawal.userName}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span> {selectedWithdrawal.userEmail}
                  </div>
                  <div>
                    <span className="font-semibold">Monto:</span> ${selectedWithdrawal.amount.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-semibold">Método:</span> {selectedWithdrawal.method}
                  </div>
                  {selectedWithdrawal.accountDetails && (
                    <div>
                      <span className="font-semibold">Cuenta:</span> {selectedWithdrawal.accountDetails}
                    </div>
                  )}
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
                  : "Razón del rechazo..."
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
                Aprobar Retiro
              </Button>
            ) : (
              <Button onClick={handleReject} variant="destructive">
                Rechazar Retiro
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
