'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Zap, CheckCircle, ArrowUpRight, AlertCircle, XCircle, MessageCircle, Copy, DollarSign } from 'lucide-react'
import { getSessionUser, createDeposit, getUserDeposits } from '@/lib/auth'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { canAccessFeature, getPlanFeatures } from '@/lib/plan-features'
import { createUserNotification, createAdminNotification } from '@/lib/notifications'
import { PaymentButton } from '@/components/payment-button'
import { getActiveBankAccounts } from '@/lib/bank-config'
import Link from 'next/link'

export default function DepositosPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [depositAmount, setDepositAmount] = useState("")
  const [deposits, setDeposits] = useState<any[]>([])
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false)
  const [currentDepositId, setCurrentDepositId] = useState<string | null>(null)
  const [lastDepositStatus, setLastDepositStatus] = useState<{id: string; status: string; message: string} | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<"paypal" | "transfer">("paypal")
  const [bankAccounts] = useState(getActiveBankAccounts())
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)
  const amount = parseFloat(depositAmount) || 0

  useEffect(() => {
    const currentUser = getSessionUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
    loadDeposits()
    setLoading(false)

    // Recargar el usuario cada 1 segundo para obtener cambios de plan
    const interval = setInterval(() => {
      const updatedUser = getSessionUser()
      if (updatedUser) {
        setUser(updatedUser)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  // Monitorear confirmación del admin para el depósito actual
  useEffect(() => {
    if (!currentDepositId) return

    const interval = setInterval(async () => {
      const deposits = getUserDeposits()
      const deposit = deposits.find(d => d.id === currentDepositId)
      
      if (deposit) {
        if (deposit.status === "aprobado") {
          // Refrescar datos del usuario desde Supabase
          if (user && user.id) {
            try {
              const response = await fetch(`/api/user/refresh?userId=${user.id}`)
              if (response.ok) {
                const data = await response.json()
                if (data.user) {
                  setUser({
                    ...user,
                    balance: data.user.balance
                  })
                  localStorage.setItem('cvvinvest_user', JSON.stringify({
                    ...user,
                    balance: data.user.balance
                  }))
                }
              }
            } catch (error) {
              console.error('Error refrescando usuario:', error)
            }
          }
          
          setIsPaymentConfirmed(true)
          setLastDepositStatus({
            id: deposit.id,
            status: "aprobado",
            message: "¡Su pago fue aprobado! El dinero ha sido agregado a su cuenta."
          })
          clearInterval(interval)
          setTimeout(() => {
            setIsPaymentConfirmed(false)
            setCurrentDepositId(null)
            setDepositAmount("")
            loadDeposits()
            setLastDepositStatus(null)
          }, 5000)
        } else if (deposit.status === "rechazado") {
          setLastDepositStatus({
            id: deposit.id,
            status: "rechazado",
            message: `Su pago fue rechazado${deposit.notes ? ': ' + deposit.notes : '.'}`
          })
          clearInterval(interval)
          setTimeout(() => {
            setCurrentDepositId(null)
            setDepositAmount("")
            loadDeposits()
            setLastDepositStatus(null)
          }, 5000)
        } else if (deposit.status === "cancelado") {
          setLastDepositStatus({
            id: deposit.id,
            status: "cancelado",
            message: `Su pago fue cancelado${deposit.notes ? ': ' + deposit.notes : '.'}`
          })
          clearInterval(interval)
          setTimeout(() => {
            setCurrentDepositId(null)
            setDepositAmount("")
            loadDeposits()
            setLastDepositStatus(null)
          }, 5000)
        }
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [currentDepositId])

  const loadDeposits = () => {
    const userDeposits = getUserDeposits()
    setDeposits(userDeposits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  const handlePayPalClick = () => {
    if (user && amount > 0) {
      // Crear depósito pendiente
      const depositId = `dep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const newDeposit = {
        id: depositId,
        userId: user.id,
        amount: amount,
        method: "PayPal",
        status: "pendiente",
        createdAt: new Date().toISOString(),
        notes: "Esperando confirmación del administrador",
        userName: user.name || user.email,
        userEmail: user.email
      }
      
      // Guardar depósito con la clave correcta
      const allDeposits = JSON.parse(localStorage.getItem('cvvinvest_deposits') || '[]')
      localStorage.setItem('cvvinvest_deposits', JSON.stringify([newDeposit, ...allDeposits]))
      
      // Enviar notificación al admin
      createAdminNotification({
        type: "deposit_pending",
        title: "Nuevo Depósito Pendiente",
        message: `${user.email} ha iniciado un depósito de $${amount.toFixed(2)} vía PayPal`,
        data: {
          userId: user.id,
          depositId: depositId,
          amount: amount,
          method: "PayPal",
          userEmail: user.email
        }
      })
      
      // Establecer ID del depósito actual para monitorear confirmación
      setCurrentDepositId(depositId)
      
      // Redirigir a PayPal
      window.location.href = "https://www.paypal.com/ncp/payment/F65DBX6HAEPTU"
    }
  }

  const handleBankTransfer = () => {
    if (user && amount > 0) {
      // Crear depósito por transferencia bancaria
      const depositId = `dep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const newDeposit = {
        id: depositId,
        userId: user.id,
        amount: amount,
        method: "Transferencia Bancaria",
        status: "pendiente",
        createdAt: new Date().toISOString(),
        notes: "Esperando confirmación de transferencia",
        userName: user.name || user.email,
        userEmail: user.email
      }
      
      // Guardar depósito
      const allDeposits = JSON.parse(localStorage.getItem('cvvinvest_deposits') || '[]')
      localStorage.setItem('cvvinvest_deposits', JSON.stringify([newDeposit, ...allDeposits]))
      
      // Enviar notificación al admin
      createAdminNotification({
        type: "deposit_pending",
        title: "Nuevo Depósito Pendiente - Transferencia Bancaria",
        message: `${user.email} ha iniciado un depósito de $${amount.toFixed(2)} vía Transferencia Bancaria (EC)`,
        data: {
          userId: user.id,
          depositId: depositId,
          amount: amount,
          method: "Transferencia Bancaria",
          userEmail: user.email
        }
      })
      
      setCurrentDepositId(depositId)
      setDepositAmount("")
      
      // Mostrar mensaje de éxito
      setLastDepositStatus({
        id: depositId,
        status: "pendiente",
        message: "✓ Depósito registrado. Por favor realiza la transferencia a la cuenta indicada."
      })
      
      setTimeout(() => setLastDepositStatus(null), 8000)
    }
  }

  const handleCopyAccount = (text: string, accountId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAccount(accountId)
    setTimeout(() => setCopiedAccount(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">Cargando...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Validar acceso según el plan
  if (user && !canAccessFeature(user.plan, "canDeposit")) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Depósitos</h1>
            </div>
            <Alert className="border-warning/50 bg-warning/5">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription>
                <p className="font-medium mb-2">Acceso Restringido</p>
                <p className="text-sm mb-4">
                  Los depósitos no están disponibles en tu plan actual. Actualiza a un plan pago para comenzar a invertir.
                </p>
                <Button asChild className="gap-2">
                  <Link href="/planes">Ver planes disponibles</Link>
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const planFeatures = user ? getPlanFeatures(user.plan) : null

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Realizar <span className="text-primary">Depósito</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Realiza tu depósito de forma rápida y segura con PayPal
            </p>
          </div>

          {/* User Info */}
          {user && (
            <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  Cuenta: <span className="font-semibold text-foreground">{user.email}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Plan: <span className="font-semibold text-primary uppercase">{user.plan}</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Balance Actual</p>
                <p className="text-2xl font-bold text-primary">${user.balance?.toFixed(2) || "0.00"}</p>
              </div>
            </div>
          )}

          {/* Plan Info Banner */}
          {planFeatures && (
            <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Métodos disponibles para tu plan:</span>{" "}
                {planFeatures.paymentMethods.join(", ")}
              </p>
            </div>
          )}

          {/* Status Messages */}
          {lastDepositStatus && (
            <Alert className={`mb-8 border-2 ${
              lastDepositStatus.status === "aprobado" 
                ? "border-green-500/50 bg-green-500/10" 
                : lastDepositStatus.status === "rechazado"
                ? "border-red-500/50 bg-red-500/10"
                : "border-gray-500/50 bg-gray-500/10"
            }`}>
              {lastDepositStatus.status === "aprobado" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription className={
                lastDepositStatus.status === "aprobado" 
                  ? "text-green-700" 
                  : lastDepositStatus.status === "rechazado"
                  ? "text-red-700"
                  : "text-gray-700"
              }>
                {lastDepositStatus.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Deposit Form - Featured */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Nuevo Depósito</h2>

                  {/* Method Tabs */}
                  <div className="flex gap-2 mb-6 border-b">
                    <button
                      onClick={() => setSelectedMethod("paypal")}
                      className={`px-4 py-2 font-medium transition-colors ${
                        selectedMethod === "paypal"
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      PayPal
                    </button>
                    <button
                      onClick={() => setSelectedMethod("transfer")}
                      className={`px-4 py-2 font-medium transition-colors ${
                        selectedMethod === "transfer"
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Transferencia Bancaria (EC)
                    </button>
                  </div>

                  {/* Amount Input */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">Monto a Depositar (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-primary">$</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="0.00"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                      />
                    </div>
                    {amount > 0 && (
                      <p className="text-sm text-muted-foreground mt-3">
                        Confirmarás: <span className="font-bold text-primary">${amount.toFixed(2)}</span>
                      </p>
                    )}
                  </div>

                  {/* PayPal Method */}
                  {selectedMethod === "paypal" && (
                    <div className="space-y-3">
                      {amount > 0 ? (
                        <>
                          <PaymentButton
                            amount={amount.toFixed(2)}
                            currency="$"
                            onPayment={handlePayPalClick}
                            isConfirmed={isPaymentConfirmed}
                            className="w-full"
                          />
                          <Button
                            asChild
                            variant="outline"
                            className="w-full border-2 border-primary/30 hover:bg-primary/5"
                          >
                            <Link href="/chat?source=depositos&autoMessage=true">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Depositar a través de Asistente
                            </Link>
                          </Button>
                        </>
                      ) : (
                        <div className="p-4 bg-muted rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Ingresa un monto para continuar</p>
                        </div>
                      )}
                      <p className="text-xs text-center text-muted-foreground mt-3">
                        Serás redirigido a PayPal para completar el pago
                      </p>
                    </div>
                  )}

                  {/* Bank Transfer Method */}
                  {selectedMethod === "transfer" && (
                    <div className="space-y-4">
                      {amount > 0 ? (
                        <div>
                          <Alert className="border-blue-500/50 bg-blue-500/10 mb-4">
                            <AlertCircle className="h-4 w-4 text-blue-500" />
                            <AlertDescription className="text-blue-700">
                              <p className="font-semibold mb-2">Próximo paso:</p>
                              <p className="text-sm">Haz clic en el botón "Pagar" para acceder a la información de la cuenta bancaria y enviar tu comprobante.</p>
                            </AlertDescription>
                          </Alert>
                          
                          <Button
                            onClick={() => router.push(`/depositos/transferencia?amount=${amount}`)}
                            className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                          >
                            <DollarSign className="h-5 w-5 mr-2" />
                            Pagar ${amount.toFixed(2)}
                          </Button>
                        </div>
                      ) : (
                        <div className="p-4 bg-muted rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Ingresa un monto para continuar</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 text-xs text-muted-foreground mt-6 pt-6 border-t">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>Múltiples métodos de pago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>Sin comisiones en transferencias</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>100% seguro</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="font-semibold">Retirar Fondos</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Solicita un retiro de tus ganancias
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/retiros">Ir a Retiros</Link>
                </Button>
              </Card>

              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="font-semibold mb-3">💡 Consejo</h3>
                <p className="text-sm text-muted-foreground">
                  Los depósitos deben ser aprobados por nuestro equipo. Recibirás una notificación cuando se procese tu solicitud.
                </p>
              </Card>
            </div>
          </div>

          {/* Deposits History */}
          {deposits.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Mis Depósitos</h2>
              <div className="space-y-3">
                {deposits.map((deposit) => (
                  <Card key={deposit.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">${deposit.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {deposit.method} • {new Date(deposit.createdAt).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                            deposit.status === "aprobado"
                              ? "bg-green-500/20 text-green-600"
                              : deposit.status === "rechazado"
                                ? "bg-red-500/20 text-red-600"
                                : deposit.status === "cancelado"
                                ? "bg-gray-500/20 text-gray-600"
                                : "bg-yellow-500/20 text-yellow-600"
                          }`}
                        >
                          {deposit.status === "aprobado" 
                            ? "✓ Aprobado" 
                            : deposit.status === "rechazado" 
                            ? "✗ Rechazado" 
                            : deposit.status === "cancelado"
                            ? "⊘ Cancelado"
                            : "⏳ Pendiente"}
                        </div>
                        {deposit.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{deposit.notes}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
