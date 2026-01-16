'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Zap, CheckCircle, ArrowDownLeft, Clock, DollarSign, Wallet } from 'lucide-react'
import { getSessionUser, createWithdrawal, getUserWithdrawals } from '@/lib/auth'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { canAccessFeature, getPlanFeatures } from '@/lib/plan-features'
import { createUserNotification } from '@/lib/notifications'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

export default function RetirosPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [method, setMethod] = useState("paypal")
  const [accountDetails, setAccountDetails] = useState("")
  const [paypalEmail, setPaypalEmail] = useState("")
  const [paypalEmailConfirm, setPaypalEmailConfirm] = useState("")
  const [binanceUserId, setBinanceUserId] = useState("")
  const [binancePayId, setBinancePayId] = useState("")
  const [validationError, setValidationError] = useState("")

  useEffect(() => {
    const currentUser = getSessionUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
    loadWithdrawals()
    setLoading(false)
  }, [router])

  const loadWithdrawals = () => {
    const userWithdrawals = getUserWithdrawals()
    setWithdrawals(userWithdrawals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  const handleRequestWithdrawal = () => {
    setValidationError("")
    
    const amount = parseFloat(withdrawalAmount)
    if (amount <= 0) {
      setValidationError("Por favor ingresa un monto válido")
      return
    }

    if (!method) {
      setValidationError("Por favor selecciona un método de retiro")
      return
    }

    // Validaciones específicas por método
    if (method === "paypal") {
      // Validar que el plan sea compatible con PayPal
      const paypalPlans = ["pro", "vip", "elite"]
      const userPlan = (user.plan || "gratuito").toLowerCase()
      
      if (!paypalPlans.includes(userPlan)) {
        setValidationError(`PayPal solo está disponible para planes Pro, VIP y Elite. Tu plan es ${userPlan.toUpperCase()}`)
        return
      }

      if (!paypalEmail || !paypalEmailConfirm) {
        setValidationError("Por favor ingresa el correo de PayPal en ambos campos")
        return
      }

      if (paypalEmail !== paypalEmailConfirm) {
        setValidationError("Los correos de PayPal no coinciden")
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(paypalEmail)) {
        setValidationError("Por favor ingresa un correo válido")
        return
      }
    } else if (method === "binance") {
      if (!binanceUserId || !binancePayId) {
        setValidationError("Por favor ingresa el ID de usuario y Binance Pay ID")
        return
      }
    } else if (method === "banco" && !accountDetails.trim()) {
      setValidationError("Por favor ingresa los detalles de tu cuenta")
      return
    }

    if (user && createWithdrawal(amount, method, accountDetails || paypalEmail || binancePayId || undefined)) {
      // Crear notificación
      let details = ""
      if (method === "paypal") {
        details = `PayPal: ${paypalEmail}`
      } else if (method === "binance") {
        details = `Binance Pay ID: ${binancePayId}`
      }

      createUserNotification(user.id, {
        type: 'withdrawal',
        title: 'Retiro Solicitado',
        message: `Se solicitó un retiro de $${amount.toFixed(2)} por ${method === "paypal" ? "PayPal" : method === "binance" ? "Binance Pay" : "Transferencia Bancaria"}`,
        details: {
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          amount,
        },
        read: false,
      })
      
      loadWithdrawals()
      setShowSuccessMessage(true)
      setWithdrawalAmount("")
      setPaypalEmail("")
      setPaypalEmailConfirm("")
      setBinanceUserId("")
      setBinancePayId("")
      setAccountDetails("")
      setTimeout(() => setShowSuccessMessage(false), 5000)
    } else {
      setValidationError("No tienes suficiente balance para solicitar este retiro")
    }
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
  if (user && !canAccessFeature(user.plan, "canWithdraw")) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Retiros</h1>
            </div>
            <Alert className="border-warning/50 bg-warning/5">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription>
                <p className="font-medium mb-2">Acceso Restringido</p>
                <p className="text-sm mb-4">
                  Los retiros no están disponibles en tu plan actual. Actualiza a un plan pago para retirar tus ganancias.
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

  const amount = parseFloat(withdrawalAmount) || 0
  const planFeatures = user ? getPlanFeatures(user.plan) : null

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Solicitar <span className="text-primary">Retiro</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Retira tus ganancias a través de tu método de pago preferido
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
                {planFeatures && (
                  <p className="text-xs text-success mt-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Tiempo de retiro: {planFeatures.withdrawalDays} día(s) hábil(es)
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Balance Disponible</p>
                <p className="text-2xl font-bold text-primary">${user.balance?.toFixed(2) || "0.00"}</p>
              </div>
            </div>
          )}

          {/* Plan Methods Banner */}
          {planFeatures && (
            <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Métodos disponibles para tu plan:</span>{" "}
                {planFeatures.paymentMethods.join(", ")}
              </p>
            </div>
          )}

          {/* Warning if no balance */}
          {user && user.balance <= 0 && (
            <Alert className="mb-8 border-yellow-500/30 bg-yellow-500/10">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                No tienes balance disponible para retirar. Por favor realiza un depósito primero.
              </AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {showSuccessMessage && (
            <Alert className="mb-8 border-green-500/30 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                ¡Solicitud de retiro registrada! El administrador procesará tu solicitud pronto.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Withdrawal Form - Featured */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/5 to-amber-500/10 overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Solicitar Retiro</h2>

                  {/* Instructions */}
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-2">📌 Instrucciones de Retiro:</p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>✓ Selecciona tu método de retiro preferido (PayPal, Binance Pay o Transferencia Bancaria)</li>
                      <li>✓ Para PayPal: ingresa tu correo en ambos campos y verifica que coincidan</li>
                      <li>✓ Para Binance Pay: proporciona tu ID de usuario y ID de Binance Pay</li>
                      <li>✓ Ingresa el monto que deseas retirar</li>
                      <li>✓ Presiona el botón correspondiente a tu método de pago</li>
                      <li>✓ Tu solicitud será procesada en las próximas 24-48 horas</li>
                    </ul>
                  </div>

                  {/* Validation Error */}
                  {validationError && (
                    <Alert className="mb-6 border-red-300 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {validationError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Amount Input */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">Monto a Retirar (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-amber-600">$</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="0.00"
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        max={user?.balance || 0}
                        className="w-full pl-12 pr-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                      />
                    </div>
                    {withdrawalAmount && (
                      <p className="text-sm text-muted-foreground mt-3">
                        Solicitarás: <span className="font-bold text-amber-600">${parseFloat(withdrawalAmount).toFixed(2)}</span>
                      </p>
                    )}
                    {user?.balance && parseFloat(withdrawalAmount) > user.balance && (
                      <p className="text-sm text-red-600 mt-3">
                        ⚠️ El monto solicitado excede tu balance disponible
                      </p>
                    )}
                  </div>

                  {/* Method Selection - Tabs */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-3 block">Método de Retiro</label>
                    <Tabs defaultValue="paypal" onValueChange={(value) => setMethod(value as "paypal" | "binance" | "banco")}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="paypal">
                          <DollarSign className="h-4 w-4 mr-2" />
                          PayPal
                        </TabsTrigger>
                        <TabsTrigger value="binance">
                          <Wallet className="h-4 w-4 mr-2" />
                          Binance Pay
                        </TabsTrigger>
                        <TabsTrigger value="banco">
                          Banco
                        </TabsTrigger>
                      </TabsList>

                      {/* PayPal Tab */}
                      <TabsContent value="paypal" className="space-y-4 mt-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            <strong>PayPal:</strong> Disponible solo para planes Pro, VIP y Elite
                          </p>
                        </div>

                        <div className="grid gap-3">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Correo de PayPal (donde recibirás el pago)</label>
                            <input
                              type="email"
                              placeholder="tu@email.com"
                              value={paypalEmail}
                              onChange={(e) => setPaypalEmail(e.target.value)}
                              className="w-full px-4 py-2 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">Confirmar Correo de PayPal</label>
                            <input
                              type="email"
                              placeholder="Confirma tu@email.com"
                              value={paypalEmailConfirm}
                              onChange={(e) => setPaypalEmailConfirm(e.target.value)}
                              className={`w-full px-4 py-2 bg-background border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                                paypalEmail && paypalEmailConfirm ? (
                                  paypalEmail === paypalEmailConfirm 
                                    ? "border-green-500 focus:ring-green-500" 
                                    : "border-red-500 focus:ring-red-500"
                                ) : "border-border focus:ring-blue-500"
                              }`}
                            />
                          </div>

                          {paypalEmail && paypalEmailConfirm && paypalEmail !== paypalEmailConfirm && (
                            <p className="text-sm text-red-600 font-semibold">❌ Los correos no coinciden</p>
                          )}
                          {paypalEmail && paypalEmailConfirm && paypalEmail === paypalEmailConfirm && (
                            <p className="text-sm text-green-600 font-semibold">✓ Los correos coinciden correctamente</p>
                          )}
                        </div>
                      </TabsContent>

                      {/* Binance Pay Tab */}
                      <TabsContent value="binance" className="space-y-4 mt-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm text-yellow-800">
                            <strong>Binance Pay:</strong> Disponible para todos los planes
                          </p>
                        </div>

                        <div className="grid gap-3">
                          <div>
                            <label className="text-sm font-medium mb-2 block">ID de Usuario Binance</label>
                            <input
                              type="text"
                              placeholder="Ej: 123456789"
                              value={binanceUserId}
                              onChange={(e) => setBinanceUserId(e.target.value)}
                              className="w-full px-4 py-2 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Encuéntralo en: Configuración → Información de Cuenta → ID de Usuario</p>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">ID de Binance Pay</label>
                            <input
                              type="text"
                              placeholder="Ej: BNB123PAYID"
                              value={binancePayId}
                              onChange={(e) => setBinancePayId(e.target.value)}
                              className="w-full px-4 py-2 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            />
                            <p className="text-xs text-muted-foreground mt-1">El identificador único de tu billetera Binance Pay</p>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Banco Tab */}
                      <TabsContent value="banco" className="space-y-4 mt-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Detalles de la Cuenta</label>
                          <textarea
                            placeholder="Número de cuenta, IBAN, nombre del banco, o detalles de transferencia..."
                            value={accountDetails}
                            onChange={(e) => setAccountDetails(e.target.value)}
                            className="w-full px-4 py-2 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none h-24"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Button */}
                  {withdrawalAmount && parseFloat(withdrawalAmount) > 0 && parseFloat(withdrawalAmount) <= (user?.balance || 0) ? (
                    <Button
                      onClick={handleRequestWithdrawal}
                      className={`w-full py-6 text-lg font-semibold ${
                        method === "paypal" ? "bg-blue-600 hover:bg-blue-700" :
                        method === "binance" ? "bg-yellow-600 hover:bg-yellow-700" :
                        "bg-amber-600 hover:bg-amber-700"
                      }`}
                    >
                      {method === "paypal" ? (
                        <>
                          <DollarSign className="w-5 h-5 mr-2" />
                          Retirar por PayPal
                        </>
                      ) : method === "binance" ? (
                        <>
                          <Wallet className="w-5 h-5 mr-2" />
                          Retirar por Binance Pay
                        </>
                      ) : (
                        <>
                          <ArrowDownLeft className="w-5 h-5 mr-2" />
                          Retirar por Transferencia
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">
                        {!withdrawalAmount || parseFloat(withdrawalAmount) <= 0 ? "Ingresa un monto válido" : "Monto excede tu balance disponible"}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 text-xs text-muted-foreground mt-6 pt-6 border-t">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>Procesamiento rápido (24-48 horas)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>Sin comisiones adicionales</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>100% seguro y encriptado</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <ArrowDownLeft className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Realizar Depósito</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Aumenta tu balance con depósitos
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/depositos">Ir a Depósitos</Link>
                </Button>
              </Card>

              <Card className="p-6 bg-amber-500/5 border-amber-500/20">
                <h3 className="font-semibold mb-3">💡 Información</h3>
                <p className="text-sm text-muted-foreground">
                  Los retiros deben ser aprobados por nuestro equipo. Recibirás una notificación cuando se procese.
                </p>
              </Card>
            </div>
          </div>

          {/* Withdrawals History */}
          {withdrawals.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Mis Solicitudes de Retiro</h2>
              <div className="space-y-3">
                {withdrawals.map((withdrawal) => (
                  <Card key={withdrawal.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">${withdrawal.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {withdrawal.method} • {new Date(withdrawal.createdAt).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                            withdrawal.status === "aprobado"
                              ? "bg-green-500/20 text-green-600"
                              : withdrawal.status === "rechazado"
                                ? "bg-red-500/20 text-red-600"
                                : "bg-yellow-500/20 text-yellow-600"
                          }`}
                        >
                          {withdrawal.status === "aprobado" ? "✓ Aprobado" : withdrawal.status === "rechazado" ? "✗ Rechazado" : "⏳ Pendiente"}
                        </div>
                        {withdrawal.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{withdrawal.notes}</p>
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
