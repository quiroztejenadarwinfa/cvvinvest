'use client'

import { Lock } from 'lucide-react'

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Política de Privacidad</h1>
          </div>
          <p className="text-muted-foreground">Última actualización: 15 de enero de 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-invert max-w-none">
          {/* Introducción */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introducción</h2>
            <p className="text-muted-foreground mb-4">
              CVVInvest ("Nosotros", "Nuestro") valora su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y aseguramos su información cuando utiliza nuestra plataforma.
            </p>
            <p className="text-muted-foreground">
              Por favor, lea esta política cuidadosamente. Si tiene preguntas, contáctenos en soportecvvinvest@proton.me.
            </p>
          </section>

          {/* Información Recopilada */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Información que Recopilamos</h2>
            
            <h3 className="text-lg font-semibold text-foreground mb-3">Información de Identificación Personal (PII)</h3>
            <ul className="text-muted-foreground space-y-2 mb-6">
              <li>• Nombre completo</li>
              <li>• Dirección de correo electrónico</li>
              <li>• Número de teléfono</li>
              <li>• Dirección residencial</li>
              <li>• Fecha de nacimiento</li>
              <li>• Número de identificación (pasaporte, cédula, etc.)</li>
              <li>• Información bancaria</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mb-3">Información de Uso</h3>
            <ul className="text-muted-foreground space-y-2 mb-6">
              <li>• Actividad de navegación en la plataforma</li>
              <li>• Historial de transacciones</li>
              <li>• Dispositivos utilizados</li>
              <li>• Dirección IP</li>
              <li>• Cookies y tecnologías de rastreo</li>
              <li>• Datos de ubicación (si autoriza)</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mb-3">Información de Terceros</h3>
            <p className="text-muted-foreground">
              Podemos recibir información sobre usted de terceros autorizados para propósitos de verificación (bancos, instituciones de crédito, proveedores de antecedentes).
            </p>
          </section>

          {/* Uso de Información */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Cómo Usamos su Información</h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos la información recopilada para:
            </p>
            <ul className="text-muted-foreground space-y-2 mb-4">
              <li>✓ Verificar su identidad (KYC - Know Your Customer)</li>
              <li>✓ Cumplir con regulaciones AML (Anti-Lavado de Dinero)</li>
              <li>✓ Procesar sus transacciones y depósitos</li>
              <li>✓ Administrar y mantener su cuenta</li>
              <li>✓ Enviarle confirmaciones y notificaciones</li>
              <li>✓ Mejorar nuestros servicios</li>
              <li>✓ Detectar y prevenir fraude</li>
              <li>✓ Cumplir con obligaciones legales</li>
              <li>✓ Comunicaciones de marketing (con su consentimiento)</li>
            </ul>
          </section>

          {/* Compartir Información */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Compartir Información</h2>
            <p className="text-muted-foreground mb-4">
              Compartimos información únicamente cuando es necesario:
            </p>
            <ul className="text-muted-foreground space-y-2 mb-4">
              <li>• Con autoridades regulatorias y gubernamentales</li>
              <li>• Con proveedores de servicios (bancos, procesadores de pagos)</li>
              <li>• Con asesores legales y auditores</li>
              <li>• En casos de investigación de fraude o seguridad</li>
              <li>• Cuando la ley lo requiera</li>
            </ul>
            <p className="text-muted-foreground">
              <strong>Nunca</strong> vendemos su información personal a terceros con fines de marketing sin su consentimiento explícito.
            </p>
          </section>

          {/* Seguridad de Datos */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Seguridad de Datos</h2>
            <p className="text-muted-foreground mb-4">
              Implementamos medidas de seguridad robustas:
            </p>
            <ul className="text-muted-foreground space-y-2 mb-4">
              <li>🔒 Encriptación AES-256 de datos en tránsito y en reposo</li>
              <li>🔒 Certificado SSL/TLS para conexiones seguras</li>
              <li>🔒 Autenticación de dos factores (2FA)</li>
              <li>🔒 Monitoreo 24/7 de acceso no autorizado</li>
              <li>🔒 Segregación de datos de clientes</li>
              <li>🔒 Copias de seguridad redundantes</li>
              <li>🔒 Cumplimiento con ISO 27001</li>
            </ul>
            <p className="text-muted-foreground">
              A pesar de nuestros esfuerzos, no podemos garantizar seguridad absoluta. Usted utiliza la plataforma bajo su propio riesgo.
            </p>
          </section>

          {/* Derechos del Usuario */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Sus Derechos</h2>
            <p className="text-muted-foreground mb-4">
              Dependiendo de su ubicación, usted puede tener derechos bajo GDPR y otras leyes:
            </p>
            <ul className="text-muted-foreground space-y-2 mb-4">
              <li>✓ <strong>Derecho de Acceso:</strong> Solicitar una copia de sus datos</li>
              <li>✓ <strong>Derecho de Rectificación:</strong> Corregir información inexacta</li>
              <li>✓ <strong>Derecho al Olvido:</strong> Solicitar eliminación de datos</li>
              <li>✓ <strong>Derecho a la Portabilidad:</strong> Recibir datos en formato legible</li>
              <li>✓ <strong>Derecho a Objetar:</strong> Oponerse al procesamiento</li>
              <li>✓ <strong>Derecho a Retirar Consentimiento:</strong> En cualquier momento</li>
            </ul>
            <p className="text-muted-foreground">
              Para ejercer estos derechos, contáctenos en soportecvvinvest@proton.me.
            </p>
          </section>

          {/* Retención de Datos */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Retención de Datos</h2>
            <p className="text-muted-foreground mb-4">
              Conservamos su información personal durante:
            </p>
            <ul className="text-muted-foreground space-y-2 mb-4">
              <li>• <strong>Datos Activos:</strong> Mientras mantenga su cuenta</li>
              <li>• <strong>Datos Transaccionales:</strong> Mínimo 7 años (requisitos regulatorios)</li>
              <li>• <strong>Datos de Marketing:</strong> Hasta que retire consentimiento</li>
              <li>• <strong>Registros de Acceso:</strong> 12 meses</li>
            </ul>
            <p className="text-muted-foreground">
              Después de este período, eliminamos o anonimizamos su información de manera segura.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Cookies y Tecnologías de Rastreo</h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos cookies para:
            </p>
            <ul className="text-muted-foreground space-y-2 mb-4">
              <li>• Mantener sesiones de usuario</li>
              <li>• Recordar preferencias</li>
              <li>• Analizar uso de la plataforma</li>
              <li>• Mejorar experiencia del usuario</li>
              <li>• Prevenir fraude</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              Puede controlar cookies a través de la configuración del navegador, aunque esto puede afectar la funcionalidad.
            </p>
          </section>

          {/* Links Externos */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Enlaces a Sitios Externos</h2>
            <p className="text-muted-foreground">
              CVVInvest no es responsable por las políticas de privacidad de sitios externos. Le recomendamos revisar sus políticas antes de compartir información.
            </p>
          </section>

          {/* Cambios a Política */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Cambios a Esta Política</h2>
            <p className="text-muted-foreground">
              Podemos actualizar esta política periódicamente. Los cambios significativos serán notificados por correo electrónico. Su uso continuado de la plataforma significa aceptación de los cambios.
            </p>
          </section>

          {/* Contacto */}
          <section className="bg-card border border-border rounded-xl p-6 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4">Encargado de Protección de Datos</h2>
            <p className="text-muted-foreground mb-2">
              Si tiene preguntas sobre cómo manejamos sus datos:
            </p>
            <p className="text-muted-foreground">
              📧 <a href="mailto:soportecvvinvest@proton.me" className="text-primary hover:underline">soportecvvinvest@proton.me</a><br />
              📞 No disponible temporalmente<br />
              🕐 Disponible 24/7
            </p>
          </section>

          {/* Cumplimiento */}
          <section className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-3">Cumplimiento Normativo</h2>
            <p className="text-muted-foreground text-sm">
              Esta Política de Privacidad cumple con GDPR (UE), CCPA (California), LGPD (Brasil), POPIA (Sudáfrica) y otras leyes de protección de datos internacionales. CVVInvest está certificada ISO 27001 para seguridad de información.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
