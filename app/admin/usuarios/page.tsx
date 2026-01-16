"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSessionUser, clearSession, ADMIN_EMAIL, type User, getAllUsers, setAllUsers } from "@/lib/auth"
import { getAllUsersFromDB, approveUser, deactivateUser } from "@/lib/auth-supabase"
import { createUserNotification, createAdminNotification } from "@/lib/notifications"
import { getPlanFeatures, type PlanType } from "@/lib/plan-features"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Edit, Trash2, DollarSign, AlertCircle, Crown, TrendingUp, CheckCircle2, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/card"

const planColors: Record<string, string> = {
  gratuito: "bg-slate-500",
  estandar: "bg-blue-500",
  pro: "bg-purple-500",
  vip: "bg-amber-500",
  elite: "bg-emerald-500",
}

const planDescriptions: Record<string, string> = {
  gratuito: "Acceso limitado al panel",
  estandar: "Inversiones, depósitos, retiros e informes",
  pro: "Estándar + Analytics avanzado",
  vip: "Pro + Asesor personal dedicado",
  elite: "Todo VIP + Retiros inmediatos 24/7",
}

export default function AdminUsuariosPage() {
  const [admin, setAdmin] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPlan, setFilterPlan] = useState<string>("all")
  const [showPendingOnly, setShowPendingOnly] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({ name: "", plan: "", balance: 0 })
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [selectedUserForPlan, setSelectedUserForPlan] = useState<User | null>(null)
  const [newPlanValue, setNewPlanValue] = useState<string>("")
  const [planChangeMessage, setPlanChangeMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)
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
    
    // Cargar usuarios inmediatamente
    loadUsers()
    
    // Recargar usuarios cada 5 segundos (actualizaciones en tiempo real)
    const interval = setInterval(() => {
      loadUsers()
    }, 5000)

    setLoading(false)
    return () => clearInterval(interval)
  }, [router])

  const loadUsers = async () => {
    try {
      // Cargar SOLO de Supabase
      const { users: dbUsers } = await getAllUsersFromDB()
      
      if (dbUsers && dbUsers.length > 0) {
        setUsers(dbUsers)
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  const handleApproveUser = async (userId: string) => {
    setApprovingId(userId)
    try {
      const { user: approvedUser, error } = await approveUser(userId)
      if (error) throw new Error(error)

      // Actualizar lista local
      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, is_active: true } : u
      )
      setUsers(updatedUsers)

      toast({
        title: "Usuario Aprobado",
        description: `${approvedUser?.name} ha sido aprobado y puede acceder a la plataforma.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setApprovingId(null)
    }
  }

  const handleDeactivateUser = async (userId: string) => {
    try {
      const { error } = await deactivateUser(userId)
      if (error) throw new Error(error)

      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, is_active: false } : u
      )
      setUsers(updatedUsers)

      toast({
        title: "Usuario Desactivado",
        description: "El usuario ha sido desactivado.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = filterPlan === "all" || user.plan === filterPlan
    const isPending = showPendingOnly ? !user.is_active : true
    return matchesSearch && matchesPlan && user.role === "user" && isPending
  })

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setEditForm({
      name: user.name,
      plan: user.plan,
      balance: user.balance,
    })
  }

  const openPlanModal = (user: User) => {
    setSelectedUserForPlan(user)
    setNewPlanValue(user.plan)
    setPlanChangeMessage(null)
    setShowPlanModal(true)
  }

  const changePlan = () => {
    if (!selectedUserForPlan || !newPlanValue) {
      setPlanChangeMessage({ type: "error", text: "Selecciona un plan válido" })
      return
    }

    if (newPlanValue === selectedUserForPlan.plan) {
      setPlanChangeMessage({ type: "error", text: "El usuario ya tiene este plan" })
      return
    }

    const updatedUsers = users.map((u) =>
      u.id === selectedUserForPlan.id ? { ...u, plan: newPlanValue as PlanType } : u
    )

    setAllUsers(updatedUsers)
    setUsers(updatedUsers)

    // Solo crear notificación para el admin (usuario no recibe estas)
    createAdminNotification({
      type: 'plan_change',
      title: 'Plan de Usuario Actualizado',
      message: `Actualizaste el plan de ${selectedUserForPlan.name} a ${newPlanValue.toUpperCase()}`,
      details: {
        userId: selectedUserForPlan.id,
        userName: selectedUserForPlan.name,
        userEmail: selectedUserForPlan.email,
        previousPlan: selectedUserForPlan.plan,
        plan: newPlanValue,
      },
      read: false,
    })

    setPlanChangeMessage({
      type: "success",
      text: `✓ Plan actualizado a ${newPlanValue.toUpperCase()} correctamente`,
    })

    setTimeout(() => {
      setShowPlanModal(false)
      setPlanChangeMessage(null)
    }, 2000)

    toast({
      title: "Plan actualizado",
      description: `Usuario actualizado a plan ${newPlanValue}`,
    })
  }

  const saveUserChanges = () => {
    if (!editingUser) return

    const updatedUsers = users.map((u) => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          name: editForm.name,
          plan: editForm.plan as PlanType,
          balance: editForm.balance,
        }
      }
      return u
    })

    setAllUsers(updatedUsers)
    setUsers(updatedUsers)
    setEditingUser(null)

    toast({
      title: "Usuario actualizado",
      description: "Los cambios se han guardado correctamente.",
    })
  }

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter((u) => u.id !== userId)
    setAllUsers(updatedUsers)
    setUsers(updatedUsers)

    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado de la plataforma.",
    })
  }

  const getPlanStats = () => {
    const usersList = users.filter((u) => u.role === "user")
    return {
      total: usersList.length,
      approved: usersList.filter((u) => u.is_active).length,
      pending: usersList.filter((u) => !u.is_active).length,
      gratuito: usersList.filter((u) => u.plan === "gratuito").length,
      estandar: usersList.filter((u) => u.plan === "estandar").length,
      pro: usersList.filter((u) => u.plan === "pro").length,
      vip: usersList.filter((u) => u.plan === "vip").length,
      elite: usersList.filter((u) => u.plan === "elite").length,
    }
  }

  const stats = getPlanStats()

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

  if (!admin) return null

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar admin={admin} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <AdminHeader admin={admin} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Gestión de Planes y Usuarios</h2>
                <p className="text-muted-foreground">Administra los planes y datos de los usuarios de la plataforma</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary px-4 py-2 rounded-lg">
                <Users className="h-4 w-4" />
                {stats.total} usuarios
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
              <Card className="bg-card border-border">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-green-500/30 cursor-pointer hover:bg-green-500/5" onClick={() => setShowPendingOnly(false)}>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Aprobados</p>
                  <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
                </CardContent>
              </Card>
              <Card className={`border-orange-500/30 cursor-pointer ${showPendingOnly ? 'bg-orange-500/10 border-2 border-orange-500' : 'bg-card'} hover:bg-orange-500/5`} onClick={() => setShowPendingOnly(true)}>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Pendientes</p>
                  <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-slate-500/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Gratuito</p>
                  <p className="text-2xl font-bold text-slate-500">{stats.gratuito}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-blue-500/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Estándar</p>
                  <p className="text-2xl font-bold text-blue-500">{stats.estandar}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-purple-500/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Pro</p>
                  <p className="text-2xl font-bold text-purple-500">{stats.pro}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-amber-500/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">VIP</p>
                  <p className="text-2xl font-bold text-amber-500">{stats.vip}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-emerald-500/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Elite</p>
                  <p className="text-2xl font-bold text-emerald-500">{stats.elite}</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre o email..."
                      className="pl-10 bg-secondary border-border"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterPlan} onValueChange={setFilterPlan}>
                    <SelectTrigger className="w-full md:w-48 bg-secondary border-border">
                      <SelectValue placeholder="Filtrar por plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los planes</SelectItem>
                      <SelectItem value="gratuito">Gratuito</SelectItem>
                      <SelectItem value="estandar">Estándar</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="elite">Elite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Lista de Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No se encontraron usuarios</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-bold text-lg">{user.name[0]}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${planColors[user.plan]}`} />
                            <Badge variant="outline" className="capitalize bg-card">
                              {user.plan}
                            </Badge>
                          </div>

                          <div className="text-right min-w-24">
                            <div className="font-bold text-primary">${user.balance.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Balance</div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!user.is_active ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleApproveUser(user.id)}
                                  disabled={approvingId === user.id}
                                  className="gap-2 bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  {approvingId === user.id ? "Aprobando..." : "Aprobar"}
                                </Button>
                              </>
                            ) : (
                              <Badge className="bg-green-500/20 text-green-400">✓ Aprobado</Badge>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openPlanModal(user)}
                              className="gap-2"
                            >
                              <Crown className="h-4 w-4" />
                              Cambiar Plan
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => deleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>Modifica los datos del usuario seleccionado</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={editForm.plan} onValueChange={(value) => setEditForm({ ...editForm, plan: value })}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gratuito">Gratuito</SelectItem>
                  <SelectItem value="estandar">Estándar</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="elite">Elite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Balance (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={editForm.balance}
                  onChange={(e) => setEditForm({ ...editForm, balance: Number(e.target.value) })}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancelar
            </Button>
            <Button onClick={saveUserChanges} className="bg-primary text-primary-foreground">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Change Modal */}
      <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Cambiar Plan del Usuario
            </DialogTitle>
            <DialogDescription>
              Actualiza el plan de {selectedUserForPlan?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current Plan Info */}
            {selectedUserForPlan && (
              <div className="bg-secondary p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">Plan Actual</p>
                <Badge className={`${planColors[selectedUserForPlan.plan]} text-white capitalize`}>
                  {selectedUserForPlan.plan}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {planDescriptions[selectedUserForPlan.plan]}
                </p>
              </div>
            )}

            {/* New Plan Selection */}
            <div className="space-y-2">
              <Label htmlFor="new-plan-select" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Nuevo Plan
              </Label>
              <Select value={newPlanValue} onValueChange={setNewPlanValue}>
                <SelectTrigger id="new-plan-select" className="bg-secondary border-border">
                  <SelectValue placeholder="Selecciona un plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gratuito">
                    <span className="capitalize">Gratuito - {planDescriptions.gratuito}</span>
                  </SelectItem>
                  <SelectItem value="estandar">
                    <span className="capitalize">Estándar - {planDescriptions.estandar}</span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="capitalize">Pro - {planDescriptions.pro}</span>
                  </SelectItem>
                  <SelectItem value="vip">
                    <span className="capitalize">VIP - {planDescriptions.vip}</span>
                  </SelectItem>
                  <SelectItem value="elite">
                    <span className="capitalize">Elite - {planDescriptions.elite}</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Plan Features Preview */}
            {newPlanValue && newPlanValue !== selectedUserForPlan?.plan && (
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">Características de {newPlanValue.toUpperCase()}</p>
                {(() => {
                  const features = getPlanFeatures(newPlanValue as PlanType)
                  return (
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-center gap-2">
                        {features.canDeposit ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span>Depósitos</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {features.canWithdraw ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span>Retiros ({features.withdrawalDays} días)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {features.canInvest ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span>Inversiones</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {features.canViewReports ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span>Informes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {features.canViewAnalytics ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span>Analytics Avanzado</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {features.canHavePersonalAdvisor ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span>Asesor Personal</span>
                      </li>
                    </ul>
                  )
                })()}
              </div>
            )}

            {/* Success Message */}
            {planChangeMessage && (
              <div className={`p-3 rounded-lg text-sm ${
                planChangeMessage.type === "success"
                  ? "bg-green-500/10 border border-green-500/30 text-green-700"
                  : "bg-red-500/10 border border-red-500/30 text-red-700"
              }`}>
                {planChangeMessage.text}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPlanModal(false)}>
              Cancelar
            </Button>
            <Button
              onClick={changePlan}
              disabled={!newPlanValue || newPlanValue === selectedUserForPlan?.plan}
              className="gap-2"
            >
              <Crown className="h-4 w-4" />
              Cambiar Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
