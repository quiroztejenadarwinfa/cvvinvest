'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { getSessionUser, ADMIN_EMAIL } from '@/lib/auth'
import { useEffect } from 'react'
import { 
  Mail, 
  Phone, 
  Clock, 
  FileText, 
  Shield, 
  HelpCircle,
  MessageSquare,
  Book,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { clearSession } from '@/lib/auth'

export default function AyudaPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const sessionUser = getSessionUser()
    if (!sessionUser) {
      router.push('/login')
      return
    }
    // No permitir que admin entre aquí
    if (sessionUser.email === ADMIN_EMAIL) {
      router.push('/admin')
      return
    }
    setUser(sessionUser)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    clearSession()
    router.push('/')
  }

  if (loading || !user) return null

  const faqs = [
    {
      title: '¿Cómo funciona el proceso de inversión?',
      content: 'Al seleccionar un plan de inversión en nuestra plataforma, debes hacer un depósito inicial. Ese monto se invierte en nuestras estrategias de mercado. Recibirás reportes mensuales sobre el rendimiento. Puedes retirar tus fondos (capital + ganancias) en cualquier momento respetando los períodos de liquidez establecidos.',
      icon: HelpCircle
    },
    {
      title: '¿Cuál es la duración de un plan?',
      content: 'Cada plan tiene una duración de 15 días desde la activación. Durante este período, accedes a todos los beneficios del plan. Al finalizar, puedes renovar o cambiar de plan según tus necesidades.',
      icon: FileText
    },
    {
      title: '¿Puedo cambiar de plan?',
      content: 'Sí, puedes cambiar de plan solo durante los primeros 3 días de tu plan actual. Si cambias, deberás cancelar el valor restante de los días no utilizados del plan anterior.\n\nEjemplo: Si cambias al día 2 de un plan de $150, debes pagar 13 días restantes prorrateados ($150 ÷ 15 = $10/día × 13 = $130).',
      icon: FileText
    },
    {
      title: '¿Cuál es el depósito mínimo?',
      content: 'El depósito mínimo varía según el plan que elijas:\n• Plan Gratuito: $0 USD (sin mínimo, puedes depositar cualquier monto)\n• Plan Estándar: $60 USD\n• Plan Pro: $200 USD\n• Plan VIP: $600 USD\n• Plan Elite: $2,000 USD\n\nEn el Plan Gratuito no hay límite máximo de depósito. Puedes depositar $1, $10, $50, $100 o más. Acumula fondos sin comisiones hasta alcanzar el mínimo del plan que deseas.',
      icon: FileText
    },
    {
      title: '¿Cuánto tiempo tarda en procesarse un retiro?',
      content: 'El tiempo de retiro depende de tu plan:\n• Plan Gratuito: 10 días hábiles (sin límite de monto)\n• Plan Estándar: 5 días hábiles\n• Plan Pro: 3 días hábiles\n• Plan VIP: 48 horas\n• Plan Elite: Instantáneo (mismo día)\nTodos los retiros son completamente gratuitos sin comisiones. El tiempo exacto también depende de tu banco.',
      icon: Clock
    },
    {
      title: '¿Es segura la plataforma?',
      content: 'Sí. CVVInvest utiliza encriptación de nivel bancario (AES-256), autenticación de dos factores, y cumple con regulaciones internacionales (ISO 27001, GDPR, PCI DSS). Todos los fondos están protegidos con seguros de hasta $250,000 USD.',
      icon: Shield
    },
    {
      title: '¿Qué métodos de pago aceptan?',
      content: 'Aceptamos múltiples métodos según tu plan:\n\nTodos los planes:\n• Transferencias bancarias internacionales\n• Binance\n• Criptomonedas (Bitcoin, Ethereum)\n\nPlanes Pro y superiores:\n• PayPal\n\nPara más detalles sobre qué métodos están disponibles en tu plan específico, consulta la página de Planes o contáctanos.',
      icon: Phone
    },
    {
      title: '¿Cómo cambio mi plan?',
      content: 'Desde el Plan Gratuito, puedes cambiar a un plan de pago solo si tienes depositado el mínimo requerido:\n• Para cambiar a Estándar: necesitas $60 USD depositados\n• Para cambiar a Pro: necesitas $200 USD depositados\n• Para cambiar a VIP: necesitas $600 USD depositados\n• Para cambiar a Elite: necesitas $2,000 USD depositados\n\nPuedes hacer múltiples depósitos en el Plan Gratuito hasta alcanzar el mínimo. Una vez actualices a un plan de pago, tendrás 3 días para cambiar a otro plan (pagando prorrateo si es necesario).',
      icon: CheckCircle
    },
    {
      title: '¿Qué pasa si no tengo suficiente para cambiar de plan?',
      content: 'Si tu saldo en el Plan Gratuito es menor al mínimo requerido del plan que quieres, el sistema no te permitirá cambiarte. Por ejemplo, si tienes $50 depositados, no puedes cambiar a Plan Estándar ($60 mínimo). Pero puedes:\n• Hacer un depósito adicional de $10 o más\n• Esperar a tener dinero disponible\n• Mantener tus $50 invertidos en el Plan Gratuito sin comisiones\n\nNo hay límite de tiempo en el Plan Gratuito.',
      icon: AlertCircle
    },
  ]

  const contactChannels = [
    {
      icon: Mail,
      title: 'Email',
      value: 'soportecvvinvest@proton.me',
      description: 'Respuesta dentro de 24 horas'
    },
    {
      icon: Phone,
      title: 'Teléfono',
      value: 'No disponible temporalmente',
      description: 'Disponible 24/7'
    },
    {
      icon: MessageSquare,
      title: 'Contacto Directo',
      value: 'Formulario Web',
      description: 'Envía tu mensaje desde aquí',
      link: '/contacto'
    }
  ]

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar user={user} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader user={user} />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Centro de Ayuda</h1>
            </div>
            <p className="text-muted-foreground">Encuentra respuestas a tus preguntas y contacta con nuestro equipo de soporte</p>
          </div>

          {/* Canales de Contacto */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {contactChannels.map((channel) => {
              const Icon = channel.icon
              return (
                <div key={channel.title} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-4 h-full">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{channel.title}</h3>
                      {channel.link ? (
                        <Link href={channel.link} className="text-primary hover:underline font-medium mb-1 flex items-center gap-1">
                          {channel.value}
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      ) : (
                        <p className="text-foreground font-medium mb-1">{channel.value}</p>
                      )}
                      <p className="text-sm text-muted-foreground">{channel.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Preguntas Frecuentes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Preguntas Frecuentes</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const Icon = faq.icon
                return (
                  <details key={index} className="group bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                    <summary className="flex items-center gap-3 cursor-pointer">
                      <div className="p-2 bg-primary/10 rounded-lg group-open:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground flex-1 text-left">{faq.title}</h3>
                      <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-4 ml-14 text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {faq.content}
                    </div>
                  </details>
                )
              })}
            </div>
          </section>

          {/* Sobre el Buzón de Mensajes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Contáctanos - Formulario Web</h2>
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8">
              <div className="flex gap-6 flex-col md:flex-row">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Envía tu mensaje directamente</h3>
                  <p className="text-muted-foreground mb-4">
                    ¿Tienes una pregunta específica? Usa nuestro formulario de contacto para enviar un mensaje directo a nuestro equipo de soporte.
                  </p>
                  <ul className="space-y-2 text-muted-foreground mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Soporte rápido y profesional</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Respuesta dentro de 24 horas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Disponible 24/7</span>
                    </li>
                  </ul>
                  <Link href="/contacto" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                    Ir al Formulario
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex-1">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h4 className="font-semibold text-foreground mb-4">Lo que incluye:</h4>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Tu nombre</p>
                          <p className="text-sm text-muted-foreground">Para personalizamos la respuesta</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Tu email</p>
                          <p className="text-sm text-muted-foreground">Donde recibirás la respuesta</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Asunto</p>
                          <p className="text-sm text-muted-foreground">Categoría de tu consulta</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <MessageSquare className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Mensaje</p>
                          <p className="text-sm text-muted-foreground">Tu pregunta o consulta</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Documentación Legal */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Documentación Importante</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Términos y Condiciones',
                  description: 'Lee nuestros términos legales completos',
                  icon: FileText,
                  link: '/terminos',
                  color: 'from-blue-500/10 to-blue-400/5'
                },
                {
                  title: 'Política de Privacidad',
                  description: 'Cómo protegemos tus datos personales',
                  icon: Shield,
                  link: '/privacidad',
                  color: 'from-green-500/10 to-green-400/5'
                },
                {
                  title: 'Centro Legal',
                  description: 'Información regulatoria y de cumplimiento',
                  icon: Book,
                  link: '/legal',
                  color: 'from-purple-500/10 to-purple-400/5'
                }
              ].map((doc) => {
                const Icon = doc.icon
                return (
                  <Link key={doc.title} href={doc.link} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all hover:shadow-lg group">
                    <div className={`p-3 rounded-lg w-fit mb-3 bg-gradient-to-br ${doc.color} group-hover:shadow-md transition-shadow`}>
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Nivel de Soporte */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Tu Nivel de Soporte</h2>
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Plan {user.plan?.charAt(0).toUpperCase() + user.plan?.slice(1) || 'Estándar'}</h3>
                  <p className="text-muted-foreground">Acceso a todas las características incluidas en tu plan</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Beneficios de tu plan:</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    {user.plan === 'gratuito' ? (
                      <>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Depósitos iniciales hasta $150 USD</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Inversión de prueba sin comisiones</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Retiro sin comisiones</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Centro de Ayuda completo</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Acceso a documentación legal</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Explorar todos los planes disponibles</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Inversiones activas y gestión de fondos</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Retiros sin comisión</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Reportes detallados de inversión</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Soporte {user.plan === 'estándar' ? 'estándar por email' : user.plan === 'pro' ? 'prioritario 24/7' : 'VIP 24/7'}</span>
                        </li>
                        {(user.plan === 'vip' || user.plan === 'elite') && (
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <span>Asesor financiero personal</span>
                          </li>
                        )}
                        {user.plan === 'elite' && (
                          <>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-primary" />
                              <span>Retiro instantáneo (mismo día)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-primary" />
                              <span>Gestor de cuenta ejecutivo</span>
                            </li>
                          </>
                        )}
                      </>
                    )}
                  </ul>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    <strong>¿Necesitas ayuda adicional?</strong>
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    No dudes en contactarnos. Nuestro equipo está disponible 24/7 para responder tus preguntas.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    📧 soportecvvinvest@proton.me<br />
                    📞 No disponible temporalmente
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
