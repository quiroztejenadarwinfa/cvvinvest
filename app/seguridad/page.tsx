"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Shield, Lock, Eye, AlertCircle, CheckCircle, Key, 
  Smartphone, Globe, Zap, FileText, Users, BarChart3, 
  Download, ArrowRight, LucideIcon 
} from "lucide-react"

interface SecurityFeature {
  icon: LucideIcon
  title: string
  description: string
  details: string[]
  status: "verified" | "active" | "premium"
}

const securityFeatures: SecurityFeature[] = [
  {
    icon: Lock,
    title: "Autenticación Segura",
    description: "Protección de contraseña y acceso",
    details: [
      "Contraseñas hasheadas con bcrypt",
      "Validación en tiempo real",
      "Recuperación de contraseña de 2 pasos",
      "Sesiones seguras con expiración"
    ],
    status: "verified"
  },
  {
    icon: Key,
    title: "Gestión de Credenciales",
    description: "Control total de tus datos de acceso",
    details: [
      "Cambio de contraseña simplificado",
      "Historial de cambios",
      "Notificaciones de cambios de seguridad",
      "Recuperación de cuenta verificada"
    ],
    status: "verified"
  },
  {
    icon: Smartphone,
    title: "Verificación de Dispositivos",
    description: "Reconocimiento de dispositivos confiables",
    details: [
      "Detección automática de nuevos dispositivos",
      "Historial de accesos",
      "Opción para cerrar sesiones remotas",
      "Alertas de actividad sospechosa"
    ],
    status: "active"
  },
  {
    icon: Globe,
    title: "Protección de Datos",
    description: "Cifrado y almacenamiento seguro",
    details: [
      "Cifrado de datos en tránsito (HTTPS/TLS)",
      "Almacenamiento seguro en localStorage",
      "No compartimos datos con terceros",
      "Cumplimiento de GDPR"
    ],
    status: "verified"
  },
  {
    icon: Shield,
    title: "Validación de Transacciones",
    description: "Protección de operaciones financieras",
    details: [
      "Verificación de montos y destinatarios",
      "Límites de transacciones por plan",
      "Confirmación de operaciones críticas",
      "Auditoría completa de movimientos"
    ],
    status: "premium"
  },
  {
    icon: AlertCircle,
    title: "Monitoreo Continuo",
    description: "Detección de actividades anómalas",
    details: [
      "Alertas en tiempo real",
      "Análisis de patrones de acceso",
      "Bloqueo de IPs sospechosas",
      "Reporte de intentos fallidos"
    ],
    status: "active"
  }
]

const securityTips = [
  {
    title: "Usa contraseñas fuertes",
    description: "Al menos 8 caracteres con mayúsculas, minúsculas, números y símbolos",
    icon: Key
  },
  {
    title: "No compartas tu contraseña",
    description: "CVVINVEST nunca te pedirá tu contraseña por correo o chat",
    icon: Eye
  },
  {
    title: "Verifica los correos",
    description: "Verifica que el correo sea oficial y revisa los detalles con cuidado",
    icon: FileText
  },
  {
    title: "Usa dispositivos seguros",
    description: "Accede solo desde equipos en redes confiables",
    icon: Smartphone
  },
  {
    title: "Revisa tu historial",
    description: "Monitorea tu actividad regularmente en tu panel",
    icon: BarChart3
  },
  {
    title: "Reporta problemas",
    description: "Contacta soporte inmediatamente si notas actividad sospechosa",
    icon: AlertCircle
  }
]

export default function SeguridadPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSupportMessage, setShowSupportMessage] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("cvvinvest_user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setIsLoading(false)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Centro de Seguridad</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Protegemos tu cuenta con las mejores prácticas de seguridad
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Status General */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Estado de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">Óptimo</div>
              <p className="text-sm text-slate-400 mt-2">Tu cuenta está protegida</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Verificaciones Activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">6/6</div>
              <p className="text-sm text-slate-400 mt-2">Todas las capas habilitadas</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Cumplimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">100%</div>
              <p className="text-sm text-slate-400 mt-2">GDPR y estándares internacionales</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Características de Seguridad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon
              const statusColor = {
                verified: "bg-green-900 text-green-200",
                active: "bg-blue-900 text-blue-200",
                premium: "bg-purple-900 text-purple-200"
              }[feature.status]

              const statusLabel = {
                verified: "Verificado",
                active: "Activo",
                premium: "Premium"
              }[feature.status]

              return (
                <Card key={index} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <Icon className="w-8 h-8 text-blue-400" />
                      <Badge className={statusColor}>{statusLabel}</Badge>
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-400">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Security Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Consejos de Seguridad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityTips.map((tip, index) => {
              const Icon = tip.icon
              return (
                <Card key={index} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6 text-blue-400" />
                      <CardTitle className="text-white text-base">{tip.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300">{tip.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Tu Cuenta
              </CardTitle>
              <CardDescription className="text-blue-200">Acceso rápido a configuración de seguridad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-white hover:bg-slate-100 text-blue-900 font-semibold"
                onClick={() => {
                  if (user) {
                    // Si está autenticado, ir a seguridad
                    router.push("/dashboard/seguridad")
                  } else {
                    // Si NO está autenticado, ir a login
                    router.push("/login")
                  }
                }}
              >
                Ir a Configuración
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="text-sm text-blue-200">
                <p>• Cambiar contraseña</p>
                <p>• Ver dispositivos conectados</p>
                <p>• Gestionar sesiones</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documentación
              </CardTitle>
              <CardDescription className="text-purple-200">Guías y recursos de seguridad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-white hover:bg-slate-100 text-purple-900 font-semibold"
                onClick={() => {
                  setShowSupportMessage(true)
                  setTimeout(() => {
                    setShowSupportMessage(false)
                    router.push("/contacto")
                  }, 2000)
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Guía Completa
              </Button>
              {showSupportMessage && (
                <div className="p-3 bg-purple-500/20 border border-purple-400 rounded text-sm text-purple-200 animate-pulse">
                  📧 Por favor, contacta a nuestro equipo de soporte para obtener la guía completa de seguridad.
                </div>
              )}
              <div className="text-sm text-purple-200">
                <p>• Mejores prácticas</p>
                <p>• Preguntas frecuentes</p>
                <p>• Reportar problemas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {[
              {
                q: "¿Cómo cambio mi contraseña?",
                a: "Ve a Configuración > Seguridad > Cambiar Contraseña. Se te enviará un código a tu correo para verificar el cambio."
              },
              {
                q: "¿Qué hago si olvido mi contraseña?",
                a: "Usa la opción 'Recuperar Contraseña' en la pantalla de login. Te enviaremos un enlace seguro a tu correo."
              },
              {
                q: "¿Cómo veo qué dispositivos tienen acceso a mi cuenta?",
                a: "En Configuración > Seguridad > Dispositivos verás todos los equipos conectados. Puedes cerrar sesiones remotas."
              },
              {
                q: "¿Es seguro usar CVVINVEST en WiFi público?",
                a: "Sí, usamos HTTPS/TLS. Sin embargo, recomendamos usar una VPN en redes públicas para mayor protección."
              },
              {
                q: "¿Qué debo hacer si sospecho una violación de seguridad?",
                a: "Contacta inmediatamente a soporte. Cambiaremos tu contraseña y revisaremos tu actividad."
              },
              {
                q: "¿Compartis mis datos con terceros?",
                a: "No. Tus datos nunca se comparten. Cumplimos con GDPR y regulaciones internacionales de privacidad."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-base">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 p-6 bg-slate-800 border border-slate-700 rounded-lg text-center">
          <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">¿Necesitas ayuda?</h3>
          <p className="text-slate-400 mb-4">
            Nuestro equipo de soporte está disponible 24/7 para resolver cualquier pregunta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white hover:bg-slate-100 text-blue-900 font-semibold"
              onClick={() => router.push("/contacto")}
            >
              Contactar Soporte
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              onClick={() => router.push("/dashboard/ayuda")}
            >
              Centro de Ayuda
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
