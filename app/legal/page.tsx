'use client'

import { Shield, CheckCircle, AlertCircle, Lock, FileText, Users } from 'lucide-react'
import Link from 'next/link'

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Centro Legal & Cumplimiento</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            En CVVInvest, nos comprometemos con la más alta transparencia, regulación y cumplimiento normativo en la industria de inversiones.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Regulación y Cumplimiento */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Regulación & Cumplimiento</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Licenciamiento Regulatorio</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Autorizado y regulado por autoridades financieras internacionales</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Cumplimiento total con regulaciones AML/KYC</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Certificaciones internacionales de seguridad financiera</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Auditorías externas periódicas por firmas independientes</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Estándares Internacionales</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">ISO 27001 - Seguridad de la Información</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">PCI DSS - Cumplimiento de Pagos</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">GDPR - Protección de Datos Europeos</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">SOC 2 Type II - Controles de Seguridad</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Seguridad & Protección */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Seguridad & Protección</h2>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Medidas de Seguridad</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✓ Encriptación de extremo a extremo (AES-256)</li>
                  <li>✓ Autenticación de dos factores (2FA) obligatoria</li>
                  <li>✓ Biometría y reconocimiento facial</li>
                  <li>✓ Monitoreo 24/7 de transacciones fraudulentas</li>
                  <li>✓ Segregación de fondos de clientes</li>
                  <li>✓ Almacenamiento en bóvedas digitales certificadas</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Protección de Fondos</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✓ Seguro de depósitos de hasta $250,000 USD</li>
                  <li>✓ Fondos segregados y protegidos legalmente</li>
                  <li>✓ Auditoría anual de reservas</li>
                  <li>✓ Cobertura de fraude y robo</li>
                  <li>✓ Fondo de compensación de inversores</li>
                  <li>✓ Garantía de devolución de capital</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Transparencia */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Transparencia & Reportes</h2>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <p className="text-muted-foreground mb-6">
              Proporcionamos acceso completo a información financiera y operativa:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Reportes Mensuales</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Estados de cuenta detallados</li>
                  <li>• Rendimiento de inversiones</li>
                  <li>• Histórico de transacciones</li>
                  <li>• Comisiones y honorarios</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Información Pública</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Reportes de auditoría</li>
                  <li>• Estados financieros consolidados</li>
                  <li>• Prospecto legal completo</li>
                  <li>• Riesgos y disclaimers</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Documentación Legal</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Términos y condiciones</li>
                  <li>• Política de privacidad</li>
                  <li>• Avisos de riesgo</li>
                  <li>• Declaraciones de conformidad</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Gestión de Riesgos */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Gestión de Riesgos</h2>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Disclosure de Riesgos Importantes</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong>Riesgo de Mercado:</strong> Los valores de inversión pueden fluctuar basándose en condiciones de mercado, economía global y factores geopolíticos.
              </p>
              <p>
                <strong>Riesgo de Liquidez:</strong> No se garantiza la disponibilidad inmediata de liquidez en todos los productos de inversión.
              </p>
              <p>
                <strong>Riesgo de Crédito:</strong> Existe el riesgo de que los emisores incumplan sus obligaciones.
              </p>
              <p>
                <strong>Riesgo Operacional:</strong> Aunque mantenemos altos estándares, eventos imprevistos pueden afectar operaciones.
              </p>
              <p className="pt-4 border-t border-yellow-200 dark:border-yellow-900">
                <strong>Advertencia:</strong> Las inversiones pasadas no garantizan resultados futuros. Consulte con un asesor financiero certificado antes de invertir. Los rendimientos mostrados incluyen simulaciones y no constituyen garantías.
              </p>
            </div>
          </div>
        </section>

        {/* Contacto & Soporte */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Soporte Normativo & Legal</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Oficina de Cumplimiento</h3>
              <p className="text-muted-foreground mb-4">
                Nuestro departamento de cumplimiento está disponible para responder preguntas sobre regulaciones y normativas:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>📧 <a href="mailto:soportecvvinvest@proton.me" className="text-primary hover:underline">soportecvvinvest@proton.me</a></li>
                <li>📞 No disponible temporalmente</li>
                <li>🌐 Centro Legal disponible 24/7</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Documentación Legal</h3>
              <div className="space-y-2">
                <Link href="/terminos" className="block text-primary hover:underline">
                  → Términos y Condiciones Completos
                </Link>
                <Link href="/privacidad" className="block text-primary hover:underline">
                  → Política de Privacidad Detallada
                </Link>
                <a href="#" className="block text-primary hover:underline">
                  → Prospecto Legal PDF
                </a>
                <a href="#" className="block text-primary hover:underline">
                  → Declaración de Riesgos
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Certificaciones */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-8">Certificaciones & Acreditaciones</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {['ISO 27001', 'PCI DSS Certified', 'GDPR Compliant', 'SOC 2 Type II'].map((cert) => (
              <div key={cert} className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="inline-block p-4 bg-primary/10 rounded-lg mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold text-foreground">{cert}</p>
                <p className="text-xs text-muted-foreground mt-1">Auditoría 2025</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Legal */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 CVVInvest. Todos los derechos reservados. Esta página se mantiene actualizada conforme a regulaciones internacionales.
            <br />
            <span className="mt-2 block">Para reportes de cumplimiento: compliance@cvvinvest.com</span>
          </p>
        </div>
      </div>
    </div>
  )
}
