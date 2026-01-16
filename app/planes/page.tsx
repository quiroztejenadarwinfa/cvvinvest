'use client'

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check, Star, Zap, Crown, Diamond, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getSessionUser, createInvestment } from "@/lib/auth"
import { createUserNotification, createAdminNotification } from "@/lib/notifications"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Wallet } from "lucide-react"

const plans = [
  {
    name: "GRATUITO",
    subtitle: "PLAN INICIAL",
    price: "$0",
    period: "USD",
    minAmount: 0,
    maxAmount: 1000000,
    icon: Star,
    color: "from-slate-500 to-slate-600",
    borderColor: "border-slate-500/30",
    bgGlow: "bg-slate-500/10",
    supportLevel: "standard",
    features: [
      "Acceso completo al panel de inversiones",
      "Depósitos sin límite de monto",
      "Visualización de mercados en tiempo real",
      "Retiro sin comisiones (10 días hábiles)",
      "Centro de Ayuda 24/7",
      "Explorar todos los planes de pago",
      "Cambiar a plan premium sin penalización",
    ],
    notIncluded: ["Soporte prioritario", "Asesor personal", "PayPal", "Retiro acelerado"],
    popular: false,
    description: "Perfecto para comenzar sin riesgo con cualquier monto",
  },
  {
    name: "ESTANDAR",
    subtitle: "INVERSIÓN INICIAL",
    price: "$60 - $150",
    period: "USD",
    minAmount: 60,
    maxAmount: 150,
    icon: Zap,
    color: "from-blue-500 to-blue-600",
    borderColor: "border-blue-500/30",
    bgGlow: "bg-blue-500/10",
    supportLevel: "standard",
    features: [
      "Administración básica de inversión",
      "Depósito mínimo: $60 USD",
      "Retiro en 5 días hábiles",
      "Métodos: Transferencia bancaria, Binance",
      "Soporte por email (24 horas)",
      "Reportes mensuales",
      "Centro de Ayuda 24/7",
      "2FA (Autenticación de dos factores)",
      "Encriptación AES-256",
    ],
    notIncluded: ["PayPal", "Asesor personal", "Retiro en 48 horas", "Acceso a eventos"],
    popular: false,
    description: "Para comenzar a invertir con confianza",
  },
  {
    name: "PRO",
    subtitle: "PROFESIONAL",
    price: "$200 - $500",
    period: "USD",
    minAmount: 200,
    maxAmount: 500,
    icon: Crown,
    color: "from-primary to-primary/80",
    borderColor: "border-primary/50",
    bgGlow: "bg-primary/10",
    supportLevel: "priority",
    features: [
      "Retorno optimizado de mercado",
      "Depósito mínimo: $200 USD",
      "Retiro en 3 días hábiles",
      "Soporte prioritario 24/7 (Teléfono & Email)",
      "Métodos: Banco, Binance, PayPal",
      "Análisis de mercado avanzado",
      "Alertas personalizadas",
      "Reportes semanales detallados",
      "Centro de Ayuda prioritario",
      "Protección de fondos hasta $250,000",
      "Cumplimiento ISO 27001, GDPR, PCI DSS",
    ],
    notIncluded: ["Asesor personal dedicado", "Retiro instantáneo"],
    popular: true,
    description: "La mejor opción para la mayoría de inversores",
  },
  {
    name: "VIP",
    subtitle: "PREMIUM PLUS",
    price: "$600 - $1,500",
    period: "USD",
    minAmount: 600,
    maxAmount: 1500,
    icon: Diamond,
    color: "from-amber-500 to-amber-600",
    borderColor: "border-amber-500/30",
    bgGlow: "bg-amber-500/10",
    supportLevel: "24/7",
    features: [
      "Rendimiento superior garantizado",
      "Depósito mínimo: $600 USD",
      "Retiro en 48 horas",
      "Asesor financiero personal dedicado",
      "Todos los métodos de pago disponibles",
      "Soporte VIP 24/7 (Teléfono, Email, Chat)",
      "Acceso a oportunidades exclusivas",
      "Reportes detallados semanales + análisis",
      "Invitaciones a eventos VIP",
      "Protección de fondos hasta $250,000",
      "Conformidad regulatoria internacional",
      "Análisis técnico y fundamental avanzado",
    ],
    notIncluded: ["Gestor de cuenta ejecutivo", "Acceso a directivos directos"],
    popular: false,
    description: "Experiencia premium con soporte dedicado",
  },
  {
    name: "ELITE",
    subtitle: "INSTITUCIONAL",
    price: "$2,000+",
    period: "USD",
    minAmount: 2000,
    maxAmount: 1000000,
    icon: Diamond,
    color: "from-emerald-500 to-emerald-600",
    borderColor: "border-emerald-500/30",
    bgGlow: "bg-emerald-500/10",
    supportLevel: "24/7",
    features: [
      "Máximo rendimiento del mercado",
      "Depósito mínimo: $2,000 USD",
      "Retiro instantáneo (mismo día)",
      "Gestor de cuenta ejecutivo exclusivo",
      "Acceso directo a directivos",
      "Inversiones institucionales y privadas",
      "Soporte VIP prioritario 24/7 (Línea directa)",
      "Eventos VIP, networking y mastermind",
      "Línea de crédito preferencial",
      "Reportes en tiempo real",
      "Protección de fondos hasta $1,000,000",
      "Auditoría anual de reservas",
      "Conformidad con todas las regulaciones",
      "Estrategias de inversión personalizadas",
      "Asesoramiento fiscal internacional",
    ],
    notIncluded: [],
    popular: false,
    description: "Para inversores institucionales y profesionales",
  },
]

export default function PlanesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [showInvestmentModal, setShowInvestmentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [investmentMessage, setInvestmentMessage] = useState("")
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
  const [withdrawalMethod, setWithdrawalMethod] = useState<"paypal" | "binance">("paypal")
  const [paypalEmail, setPaypalEmail] = useState("")
  const [paypalEmailConfirm, setPaypalEmailConfirm] = useState("")
  const [binanceUserId, setBinanceUserId] = useState("")
  const [binancePayId, setBinancePayId] = useState("")
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [withdrawalMessage, setWithdrawalMessage] = useState("")

  useEffect(() => {
    setMounted(true)
    const currentUser = getSessionUser()
    setUser(currentUser)
  }, [])

  const handleSelectPlan = (plan: any) => {
    if (!user) {
      router.push('/registro')
      return
    }

    if (plan.name === "GRATUITO") {
      if (user.plan === "gratuito") {
        // El usuario ya tiene Plan Gratuito, redirigir a panel de depósitos
        router.push('/depositos')
      } else {
        // Activar plan gratuito
        setSelectedPlan({ ...plan, isDeposit: false })
        setInvestmentAmount("")
        setShowInvestmentModal(true)
      }
    } else {
      // Mostrar modal para planes de pago
      setSelectedPlan({ ...plan, isDeposit: false })
      setInvestmentAmount("")
      setShowInvestmentModal(true)
    }
  }

  const handleConfirmInvestment = async () => {
    if (!selectedPlan || !investmentAmount || !user) return

    const amount = parseFloat(investmentAmount)

    if (isNaN(amount) || amount <= 0) {
      setInvestmentMessage("El monto debe ser mayor a 0")
      setTimeout(() => setInvestmentMessage(""), 5000)
      return
    }

    // Para depósitos en Plan Gratuito: no hay validación de minAmount/maxAmount
    if (!selectedPlan.isDeposit) {
      if (amount < selectedPlan.minAmount) {
        setInvestmentMessage(`El monto mínimo es $${selectedPlan.minAmount}`)
        setTimeout(() => setInvestmentMessage(""), 5000)
        return
      }

      if (amount > selectedPlan.maxAmount) {
        setInvestmentMessage(`El monto máximo es $${selectedPlan.maxAmount}`)
        setTimeout(() => setInvestmentMessage(""), 5000)
        return
      }
    }

    if (amount > user.balance) {
      setInvestmentMessage(`Tu saldo actual es $${user.balance}`)
      setTimeout(() => setInvestmentMessage(""), 5000)
      return
    }

    // Si es un depósito en Plan Gratuito
    if (selectedPlan.isDeposit) {
      // Registrar depósito
      const deposit = {
        id: `deposit_${Date.now()}`,
        userId: user.id,
        amount,
        type: 'deposit',
        date: new Date().toISOString(),
        status: 'completed',
      }

      // Guardar en localStorage (mejor práctica: backend)
      const deposits = JSON.parse(localStorage.getItem('deposits') || '[]')
      deposits.push(deposit)
      localStorage.setItem('deposits', JSON.stringify(deposits))

      // Actualizar balance del usuario
      const updatedUser = {
        ...user,
        balance: (user.balance || 0) + amount,
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)

      setInvestmentMessage(`Depósito de $${amount.toFixed(2)} realizado exitosamente. Tu nuevo saldo es $${updatedUser.balance.toFixed(2)}.`)
      setShowInvestmentModal(false)
      setSelectedPlan(null)
      setInvestmentAmount("")
      setTimeout(() => setInvestmentMessage(""), 5000)
    } else {
      // Crear inversión (comportamiento existente)
      const investment = createInvestment(
        selectedPlan.name.toLowerCase(),
        amount,
        selectedPlan.minAmount,
        selectedPlan.maxAmount
      )

      if (investment) {
        // Solo crear notificación para el administrador
        createAdminNotification({
          type: 'investment',
          title: 'Nueva Inversión Pendiente',
          message: `${user.name} creó una inversión de $${amount.toFixed(2)} en ${selectedPlan.name}`,
          details: {
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            amount,
            plan: selectedPlan.name,
            investmentId: investment.id,
          },
          read: false,
        })

        setInvestmentMessage(`Inversión de $${amount} creada. El administrador revisará tu solicitud.`)
        setShowInvestmentModal(false)
        setSelectedPlan(null)
        setInvestmentAmount("")
        setTimeout(() => setInvestmentMessage(""), 5000)
      }
    }
  }

  const handleWithdrawalRequest = async () => {
    if (!user) return

    if (withdrawalMethod === "paypal") {
      // Validar que el plan sea compatible con PayPal
      const paypalPlans = ["pro", "vip", "elite"]
      const userPlan = (user.plan || "gratuito").toLowerCase()
      
      if (!paypalPlans.includes(userPlan)) {
        setWithdrawalMessage(`PayPal solo está disponible para planes Pro, VIP y Elite. Tu plan actual es ${userPlan.toUpperCase()}`)
        setTimeout(() => setWithdrawalMessage(""), 5000)
        return
      }

      // Validar correos de PayPal
      if (!paypalEmail || !paypalEmailConfirm) {
        setWithdrawalMessage("Por favor ingresa el correo de PayPal en ambos campos")
        setTimeout(() => setWithdrawalMessage(""), 5000)
        return
      }

      if (paypalEmail !== paypalEmailConfirm) {
        setWithdrawalMessage("❌ Los correos de PayPal no coinciden. Verifica que sean idénticos")
        setTimeout(() => setWithdrawalMessage(""), 5000)
        return
      }

      // Validar formato de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(paypalEmail)) {
        setWithdrawalMessage("Por favor ingresa un correo válido (ej: tu@email.com)")
        setTimeout(() => setWithdrawalMessage(""), 5000)
        return
      }
    } else if (withdrawalMethod === "binance") {
      // Validar campos de Binance
      if (!binanceUserId || !binancePayId) {
        setWithdrawalMessage("Por favor ingresa el ID de usuario y Binance Pay ID")
        setTimeout(() => setWithdrawalMessage(""), 5000)
        return
      }
    }

    // Validar monto de retiro
    const amount = parseFloat(withdrawalAmount)
    if (isNaN(amount) || amount <= 0) {
      setWithdrawalMessage("El monto debe ser mayor a 0")
      setTimeout(() => setWithdrawalMessage(""), 5000)
      return
    }

    if (amount > user.balance) {
      setWithdrawalMessage(`Tu saldo actual es $${user.balance}`)
      setTimeout(() => setWithdrawalMessage(""), 5000)
      return
    }

    // Crear solicitud de retiro
    const withdrawal = {
      id: `withdrawal_${Date.now()}`,
      userId: user.id,
      amount,
      method: withdrawalMethod,
      paypalEmail: withdrawalMethod === "paypal" ? paypalEmail : null,
      binanceUserId: withdrawalMethod === "binance" ? binanceUserId : null,
      binancePayId: withdrawalMethod === "binance" ? binancePayId : null,
      plan: user.plan || "gratuito",
      status: 'pending',
      date: new Date().toISOString(),
    }

    // Guardar en localStorage
    const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]')
    withdrawals.push(withdrawal)
    localStorage.setItem('withdrawals', JSON.stringify(withdrawals))

    // Crear notificación para admin
    createAdminNotification({
      type: 'withdrawal',
      title: 'Nueva Solicitud de Retiro',
      message: `${user.name} solicitó un retiro de $${amount.toFixed(2)} por ${withdrawalMethod === "paypal" ? "PayPal" : "Binance Pay"}`,
      details: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        amount,
        plan: user.plan || "gratuito",
        status: `${withdrawalMethod} - ${withdrawalMethod === "paypal" ? paypalEmail : binancePayId}`,
      },
      read: false,
    })

    setWithdrawalMessage(`✓ Solicitud de retiro de $${amount.toFixed(2)} creada exitosamente por ${withdrawalMethod === "paypal" ? "PayPal" : "Binance Pay"}.`)
    setShowWithdrawalModal(false)
    setWithdrawalMethod("paypal")
    setPaypalEmail("")
    setPaypalEmailConfirm("")
    setBinanceUserId("")
    setBinancePayId("")
    setWithdrawalAmount("")
    setTimeout(() => setWithdrawalMessage(""), 5000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Planes de <span className="text-primary">Inversión</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Elige el plan que mejor se adapte a tus objetivos financieros. Desde acceso visual hasta inversiones
              institucionales con los mejores rendimientos del mercado.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-2xl bg-card border-2 p-6 transition-all duration-300 hover:scale-105 flex flex-col",
                  plan.popular ? "border-primary shadow-lg shadow-primary/20" : plan.borderColor,
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    MÁS POPULAR
                  </div>
                )}

                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", plan.bgGlow)}>
                  <plan.icon
                    className={cn("h-6 w-6")}
                    style={{ color: plan.color.includes("primary") ? "var(--primary)" : undefined }}
                  />
                </div>

                <div
                  className={cn(
                    "text-xs font-bold px-3 py-1 rounded-full inline-block bg-gradient-to-r text-white mb-3 w-fit",
                    plan.color,
                  )}
                >
                  {plan.subtitle}
                </div>

                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-tight">{plan.description}</p>
                <div className="text-2xl font-bold text-primary mb-1">{plan.price}</div>
                <div className="text-xs text-muted-foreground mb-1">{plan.period}</div>
                
                {/* Soporte Level Badge */}
                <div className="mb-4 py-2 px-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs font-semibold text-foreground mb-1">Nivel de Soporte:</p>
                  <p className="text-xs text-primary font-bold capitalize">
                    {plan.supportLevel === "none" && "Sin soporte"}
                    {plan.supportLevel === "standard" && "Estándar (24h)"}
                    {plan.supportLevel === "priority" && "Prioritario 24/7"}
                    {plan.supportLevel === "24/7" && "VIP 24/7"}
                  </p>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "w-full",
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  )}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {user?.plan === "gratuito" && plan.name === "GRATUITO"
                    ? "Depositar"
                    : user
                      ? "Seleccionar"
                      : "Comenzar"}
                </Button>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Comparativa de Planes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-4 px-4 font-bold">Característica</th>
                    {plans.map((plan) => (
                      <th key={plan.name} className="text-center py-4 px-4 font-bold">{plan.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="py-4 px-4 font-semibold">Depósito Mínimo</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="text-center py-4 px-4">
                        {plan.name === "GRATUITO" ? "$0 USD" : `$${plan.minAmount}`}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="py-4 px-4 font-semibold">Depósito Máximo</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="text-center py-4 px-4">
                        ${plan.maxAmount.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="py-4 px-4 font-semibold">Tiempo de Retiro</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="text-center py-4 px-4">
                        {plan.name === "GRATUITO" && "10 días hábiles"}
                        {plan.name === "ESTANDAR" && "5 días hábiles"}
                        {plan.name === "PRO" && "3 días hábiles"}
                        {plan.name === "VIP" && "48 horas"}
                        {plan.name === "ELITE" && "Instantáneo"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="py-4 px-4 font-semibold">Duración del Plan</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="text-center py-4 px-4">
                        {plan.name === "GRATUITO" ? "Ilimitado" : "15 días"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="py-4 px-4 font-semibold">Cambio de Plan</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="text-center py-4 px-4">
                        {plan.name === "GRATUITO" ? "Sí" : "Primeros 3 días*"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="py-4 px-4 font-semibold">Nivel de Soporte</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="text-center py-4 px-4 text-primary font-bold">
                        {plan.supportLevel === "none" && "Sin soporte"}
                        {plan.supportLevel === "standard" && "Estándar"}
                        {plan.supportLevel === "priority" && "Prioritario"}
                        {plan.supportLevel === "24/7" && "VIP 24/7"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="py-4 px-4 font-semibold">Asesor Personal</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="text-center py-4 px-4">
                        {(plan.name === "VIP" || plan.name === "ELITE") ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="py-4 px-4 font-semibold">PayPal Disponible</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="text-center py-4 px-4">
                        {(plan.name !== "GRATUITO" && plan.name !== "ESTANDAR") ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="py-4 px-4 font-semibold">Reportes Detallados</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="text-center py-4 px-4">
                        {(plan.name !== "GRATUITO") ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="py-4 px-4 font-semibold">Acceso a Eventos VIP</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="text-center py-4 px-4">
                        {(plan.name === "VIP" || plan.name === "ELITE") ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-secondary/50">
                    <td className="py-4 px-4 font-semibold">Garantías y Seguros</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="text-center py-4 px-4 text-sm">
                        {plan.name === "GRATUITO" && "N/A"}
                        {plan.name === "ESTANDAR" && "$250,000"}
                        {plan.name === "PRO" && "$250,000"}
                        {plan.name === "VIP" && "$250,000"}
                        {plan.name === "ELITE" && "$1,000,000"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Plan Policy Alert */}
          <div className="mt-20 bg-gradient-to-r from-amber-500/10 to-orange-500/5 border-2 border-amber-500/30 rounded-2xl p-8 mb-12">
            <div className="flex gap-4">
              <div className="flex-shrink-0 pt-1">
                <svg className="h-6 w-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Política de Planes: 15 Días + Cambios en Primeros 3 Días</h3>
                <p className="text-sm text-amber-800 mb-3">
                  Todos los planes activos tienen una duración de <span className="font-semibold">15 días</span>. Durante los <span className="font-semibold">primeros 3 días</span>, puedes cambiar de plan cancelando el saldo restante prorrateado. Después de esto, estás comprometido con el plan completo.
                </p>
                <ul className="text-sm text-amber-800 space-y-1 ml-4">
                  <li>• <span className="font-semibold">Duración:</span> 15 días por plan</li>
                  <li>• <span className="font-semibold">Cambio permitido:</span> Solo en primeros 3 días</li>
                  <li>• <span className="font-semibold">Cancelación:</span> Se cobra el prorrateo de días restantes</li>
                  <li>• <span className="font-semibold">Cálculo:</span> Monto del plan ÷ 15 × días restantes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Preguntas Frecuentes</h2>
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-2">¿Cuál es la duración de un plan?</h3>
                <p className="text-sm text-muted-foreground">
                  Cada plan tiene una duración de <span className="font-semibold text-primary">15 días</span> desde la activación. Durante este período, accedes a todos los beneficios del plan. Al finalizar, puedes renovar o cambiar de plan según tus necesidades.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-2">¿Puedo cambiar de plan?</h3>
                <p className="text-sm text-muted-foreground">
                  Sí, puedes cambiar de plan solo durante los <span className="font-semibold text-primary">primeros 3 días</span> de tu plan actual. Si cambias, deberás cancelar el valor restante de los días no utilizados del plan anterior. Por ejemplo, si cambias al día 2 de un plan de $150, debes pagar 13 días restantes prorrateados. Esta política asegura transparencia y equidad.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-2">¿Qué pasa después de los 3 primeros días?</h3>
                <p className="text-sm text-muted-foreground">
                  Después de los 3 primeros días, estás comprometido con el plan actual por los 15 días completos. No puedes cambiar de plan hasta que se complete el período. Al terminar, puedes renovar el mismo plan u optar por uno diferente sin restricciones.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-2">¿Cómo se calcula el prorrateo?</h3>
                <p className="text-sm text-muted-foreground">
                  El prorrateo se calcula dividiendo el monto del plan entre 15 días. Si cambias al día 2, pagas 13 días restantes al precio diario prorrateado. <span className="font-semibold">Ejemplo:</span> Plan de $300 ÷ 15 días = $20/día. Si cambias el día 2, pagas 13 × $20 = $260. El cambio se procesa inmediatamente.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-2">¿Cómo cambio a un plan de pago?</h3>
                <p className="text-sm text-muted-foreground">
                  Para cambiar del Plan Gratuito a un plan de pago (Estándar, Pro, VIP o Elite), debes tener depositado en tu cuenta el mínimo requerido de ese plan. Por ejemplo, para cambiar a Plan Estándar necesitas tener al menos $60 USD depositados. Puedes hacer múltiples depósitos en el Plan Gratuito hasta alcanzar el mínimo deseado.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-2">¿Qué pasa si cambio de plan dentro de primeros 3 días?</h3>
                <p className="text-sm text-muted-foreground">
                  Si cambias a un plan de pago en los primeros 3 días, deberás pagar el prorrateo de días restantes (solo aplica a planes de pago, no al Plan Gratuito). El cálculo es: (Monto del Plan ÷ 15 días) × Días Restantes. El monto se deducirá de tu saldo depositado.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-2">¿Los retiros tienen comisión?</h3>
                <p className="text-sm text-muted-foreground">
                  Los retiros son completamente gratuitos en todos los planes. No hay comisiones de cambio de plan ni de acceso a la plataforma (solo pagas el prorrateo si cambias en los primeros 3 días). El tiempo de procesamiento varía: 5 días hábiles (Estándar), 3 días (Pro), 48 horas (VIP) e instantáneo (Elite).
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-2">¿Qué métodos de pago aceptan?</h3>
                <p className="text-sm text-muted-foreground">
                  Aceptamos múltiples métodos según tu plan: Transferencias bancarias (todos), Binance (todos), PayPal (Pro+), Criptomonedas Bitcoin/Ethereum (todos). Consulta tu plan específico para ver todas las opciones disponibles.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-2">¿Cuál es la diferencia entre los planes?</h3>
                <p className="text-sm text-muted-foreground">
                  La diferencia principal está en: monto mínimo/máximo de inversión, tiempo de retiro, nivel de soporte, acceso a asesor personal, acceso a eventos VIP y beneficios adicionales. Consulta nuestra tabla de comparación arriba para ver el detalle completo.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-2">¿Es seguro invertir en CVVInvest?</h3>
                <p className="text-sm text-muted-foreground">
                  Sí. CVVInvest cumple con regulaciones internacionales (ISO 27001, GDPR, PCI DSS), utiliza encriptación AES-256, autenticación de dos factores, y protege tus fondos con seguros de hasta $250,000 USD (Elite: $1,000,000). Para más información, visita nuestro Centro Legal.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-2">¿Cuál es el depósito mínimo?</h3>
                <p className="text-sm text-muted-foreground">
                  El depósito mínimo varía según el plan:\n• Plan Gratuito: $0 USD (sin mínimo, deposita cualquier monto)\n• Plan Estándar: $60 USD\n• Plan Pro: $200 USD\n• Plan VIP: $600 USD\n• Plan Elite: $2,000 USD\nEn el Plan Gratuito no hay límite máximo de depósito. Puedes acumular fondos hasta alcanzar el mínimo del plan que deseas.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-2">¿Cómo obtengo soporte si tengo dudas?</h3>
                <p className="text-sm text-muted-foreground">
                  Tienes varias opciones: Email (soportecvvinvest@proton.me), Teléfono (no disponible temporalmente), Formulario web en Contáctanos, o accede a nuestro Centro de Ayuda en tu Dashboard. Todos los planes incluyen soporte, con mayor prioridad en planes Pro+.
                </p>
              </div>
            </div>
          </div>

          {/* Security & Compliance Section */}
          <div className="mt-24 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-center mb-4">Seguridad y Cumplimiento</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Todos nuestros planes incluyen protección de nivel institucional con estándares internacionales
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-foreground">Certificaciones Internacionales</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">ISO 27001 - Seguridad de Información</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">PCI DSS - Cumplimiento de Pagos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">GDPR - Protección de Datos (UE)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">SOC 2 Type II - Controles de Seguridad</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg text-foreground">Medidas de Protección</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Encriptación AES-256 extremo a extremo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Autenticación de dos factores (2FA)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Monitoreo 24/7 de transacciones</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Segregación de fondos de clientes</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-primary/20 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Para información completa sobre regulación y cumplimiento, visita:
              </p>
              <Link href="/legal" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                Centro Legal Completo
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Investment Modal */}
      <Dialog open={showInvestmentModal} onOpenChange={setShowInvestmentModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedPlan?.isDeposit ? `Depositar en ${selectedPlan?.name}` : `Invertir en ${selectedPlan?.name}`}
            </DialogTitle>
            <DialogDescription>
              {selectedPlan?.isDeposit
                ? "Ingresa el monto que deseas depositar. Puedes depositar cualquier cantidad para acumular fondos."
                : "Ingresa el monto que deseas invertir en este plan. El administrador revisará tu solicitud."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {investmentMessage && (
              <Alert className={cn(
                investmentMessage.includes("realizado") || investmentMessage.includes("creada") ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
              )}>
                <AlertDescription className={cn(
                  investmentMessage.includes("realizado") || investmentMessage.includes("creada") ? "text-green-800" : "text-yellow-800"
                )}>
                  {investmentMessage}
                </AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label>Tu Saldo Actual: ${user?.balance || 0}</Label>
            </div>
            {!selectedPlan?.isDeposit && (
              <div className="grid gap-2">
                <Label>Rango Permitido: ${selectedPlan?.minAmount} - ${selectedPlan?.maxAmount}</Label>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="amount">
                {selectedPlan?.isDeposit ? "Monto a Depositar ($)" : "Monto a Invertir ($)"}
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                min={selectedPlan?.isDeposit ? 0.01 : selectedPlan?.minAmount}
                max={user?.balance || 0}
                step="0.01"
              />
              <p className="text-xs text-muted-foreground">
                {selectedPlan?.isDeposit
                  ? `Máximo disponible: $${user?.balance || 0}`
                  : `Mínimo: $${selectedPlan?.minAmount} | Máximo: $${Math.min(selectedPlan?.maxAmount, user?.balance || 0)}`}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvestmentModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmInvestment} className="bg-primary">
              {selectedPlan?.isDeposit ? "Confirmar Depósito" : "Confirmar Inversión"}
            </Button>
            {user && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowInvestmentModal(false)
                  setShowWithdrawalModal(true)
                }}
                className="text-primary hover:text-primary/80"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Solicitar Retiro
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdrawal Modal */}
      <Dialog open={showWithdrawalModal} onOpenChange={setShowWithdrawalModal}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Solicitar Retiro de Fondos</DialogTitle>
            <DialogDescription>
              Selecciona tu método de retiro preferido y completa los datos necesarios.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {withdrawalMessage && (
              <Alert className={cn(
                withdrawalMessage.includes("exitosamente") || withdrawalMessage.includes("✓") ? "bg-green-50 border-green-200" : 
                withdrawalMessage.includes("❌") ? "bg-red-50 border-red-200" :
                "bg-yellow-50 border-yellow-200"
              )}>
                <AlertDescription className={cn(
                  withdrawalMessage.includes("exitosamente") || withdrawalMessage.includes("✓") ? "text-green-800" : 
                  withdrawalMessage.includes("❌") ? "text-red-800" :
                  "text-yellow-800"
                )}>
                  {withdrawalMessage}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <p className="text-sm font-semibold text-foreground">
                Tu Saldo Disponible: <span className="text-primary text-lg">${user?.balance || 0}</span>
              </p>
            </div>

            <Tabs defaultValue="paypal" onValueChange={(value) => setWithdrawalMethod(value as "paypal" | "binance")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paypal">
                  <DollarSign className="h-4 w-4 mr-2" />
                  PayPal
                </TabsTrigger>
                <TabsTrigger value="binance">
                  <Wallet className="h-4 w-4 mr-2" />
                  Binance Pay
                </TabsTrigger>
              </TabsList>

              {/* PayPal Tab */}
              <TabsContent value="paypal" className="space-y-4 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    📌 Disponibilidad de PayPal
                  </p>
                  <p className="text-sm text-blue-800">
                    PayPal está disponible para planes: <strong>Pro, VIP y Elite</strong>
                  </p>
                  {user && ["pro", "vip", "elite"].includes((user?.plan || "gratuito").toLowerCase()) ? (
                    <p className="text-sm text-green-700 font-semibold mt-2">✓ Tu plan ({(user?.plan || "gratuito").toUpperCase()}) tiene acceso a PayPal</p>
                  ) : user ? (
                    <p className="text-sm text-red-700 font-semibold mt-2">✗ Tu plan ({(user?.plan || "gratuito").toUpperCase()}) no tiene acceso a PayPal</p>
                  ) : null}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="paypal-email" className="font-semibold">
                    Correo de PayPal donde recibirás el pago
                  </Label>
                  <Input
                    id="paypal-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="border-2"
                  />
                  <p className="text-xs text-muted-foreground">Ingresa el correo asociado a tu cuenta PayPal</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="paypal-email-confirm" className="font-semibold">
                    Confirmar Correo de PayPal
                  </Label>
                  <Input
                    id="paypal-email-confirm"
                    type="email"
                    placeholder="Confirma tu@email.com"
                    value={paypalEmailConfirm}
                    onChange={(e) => setPaypalEmailConfirm(e.target.value)}
                    className={cn(
                      "border-2",
                      paypalEmail && paypalEmailConfirm ? (
                        paypalEmail === paypalEmailConfirm ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
                      ) : ""
                    )}
                  />
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
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-yellow-900 mb-2">
                    📌 Disponibilidad de Binance Pay
                  </p>
                  <p className="text-sm text-yellow-800">
                    Binance Pay está disponible para <strong>todos los planes</strong>
                  </p>
                  {user && (
                    <p className="text-sm text-green-700 font-semibold mt-2">✓ Tu plan ({(user?.plan || "gratuito").toUpperCase()}) tiene acceso a Binance Pay</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="binance-user-id" className="font-semibold">
                    ID de Usuario Binance
                  </Label>
                  <Input
                    id="binance-user-id"
                    type="text"
                    placeholder="Ej: 123456789"
                    value={binanceUserId}
                    onChange={(e) => setBinanceUserId(e.target.value)}
                    className="border-2"
                  />
                  <p className="text-xs text-muted-foreground">Encuéntralo en: Configuración → Información de Cuenta → ID de Usuario</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="binance-pay-id" className="font-semibold">
                    ID de Binance Pay
                  </Label>
                  <Input
                    id="binance-pay-id"
                    type="text"
                    placeholder="Ej: BNB123PAYID"
                    value={binancePayId}
                    onChange={(e) => setBinancePayId(e.target.value)}
                    className="border-2"
                  />
                  <p className="text-xs text-muted-foreground">El identificador único de tu billetera Binance Pay</p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Monto de retiro */}
            <div className="grid gap-2">
              <Label htmlFor="withdrawal-amount" className="font-semibold">
                Monto a Retirar ($)
              </Label>
              <Input
                id="withdrawal-amount"
                type="number"
                placeholder="0.00"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                min="0.01"
                max={user?.balance || 0}
                step="0.01"
                className="border-2"
              />
              <p className="text-xs text-muted-foreground">
                Máximo disponible: ${user?.balance || 0}
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 justify-between">
            <Button variant="outline" onClick={() => setShowWithdrawalModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleWithdrawalRequest} 
              className="bg-primary hover:bg-primary/90"
            >
              {withdrawalMethod === "paypal" ? (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Retirar por PayPal
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Retirar por Binance Pay
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Alert */}
      {investmentMessage && !showInvestmentModal && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className={cn(
            investmentMessage.includes("creada") 
              ? "bg-green-50 border-green-200" 
              : investmentMessage.includes("Error")
              ? "bg-red-50 border-red-200"
              : "bg-yellow-50 border-yellow-200"
          )}>
            <AlertDescription className={cn(
              investmentMessage.includes("creada") 
                ? "text-green-800" 
                : investmentMessage.includes("Error")
                ? "text-red-800"
                : "text-yellow-800"
            )}>
              {investmentMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {withdrawalMessage && !showWithdrawalModal && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className={cn(
            withdrawalMessage.includes("exitosamente") 
              ? "bg-green-50 border-green-200" 
              : withdrawalMessage.includes("Error")
              ? "bg-red-50 border-red-200"
              : "bg-yellow-50 border-yellow-200"
          )}>
            <AlertDescription className={cn(
              withdrawalMessage.includes("exitosamente") 
                ? "text-green-800" 
                : withdrawalMessage.includes("Error")
                ? "text-red-800"
                : "text-yellow-800"
            )}>
              {withdrawalMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <Footer />
    </div>
  )
}
