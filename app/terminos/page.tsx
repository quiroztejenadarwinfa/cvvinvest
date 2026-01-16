'use client'

import { FileText } from 'lucide-react'

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Términos y Condiciones</h1>
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
              Estos Términos y Condiciones ("Términos") constituyen un contrato legal vinculante entre usted ("Usuario", "Cliente", "Inversor") y CVVInvest ("Plataforma", "Empresa", "Nosotros"). Al acceder, registrarse o utilizar nuestros servicios, acepta estar sujeto a estos Términos en su totalidad.
            </p>
            <p className="text-muted-foreground">
              Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los cambios significativos serán notificados con 30 días de anticipación. El uso continuado de la plataforma después de los cambios constituye aceptación de los nuevos Términos.
            </p>
          </section>

          {/* Eligibilidad */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Elegibilidad</h2>
            <p className="text-muted-foreground mb-4">
              Para utilizar CVVInvest, debe cumplir con lo siguiente:
            </p>
            <ul className="text-muted-foreground space-y-2 mb-4">
              <li>✓ Ser mayor de 18 años (o edad legal en su jurisdicción)</li>
              <li>✓ Ser residente o estar autorizado a operar en una jurisdicción permitida</li>
              <li>✓ Proporcionar información precisa y completa durante el registro</li>
              <li>✓ No estar en listas de sanciones internacionales (OFAC, UN, UE)</li>
              <li>✓ Cumplir con todas las leyes locales, estatales y federales aplicables</li>
              <li>✓ No usar la plataforma para actividades ilegales o fraude</li>
            </ul>
            <p className="text-muted-foreground">
              Nos reservamos el derecho de rechazar, suspender o cerrar cuentas que incumplan estos requisitos.
            </p>
          </section>

          {/* Servicios */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Descripción de Servicios</h2>
            <p className="text-muted-foreground mb-4">
              CVVInvest ofrece:
            </p>
            <ul className="text-muted-foreground space-y-2 mb-4">
              <li>• Plataforma de gestión de inversiones</li>
              <li>• Depósitos y retiros seguros</li>
              <li>• Planes de inversión diversificados</li>
              <li>• Reportes y análisis de rendimiento</li>
              <li>• Soporte al cliente 24/7</li>
              <li>• Herramientas de análisis y monitoreo</li>
            </ul>
            <p className="text-muted-foreground">
              Estos servicios se proporcionan "tal como están". No garantizamos resultados específicos o rendimientos futuros.
            </p>
          </section>

          {/* Cuentas de Usuario */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Cuentas de Usuario</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Seguridad de Cuenta:</strong> Usted es responsable de mantener la confidencialidad de sus credenciales de acceso. Cualquier actividad realizada bajo su cuenta es su responsabilidad.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Información Precisa:</strong> Se requiere que proporcione información verdadera, exacta y completa durante el registro y mantenimiento de su cuenta.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Notificación de Violación:</strong> Debe notificarnos inmediatamente de cualquier acceso no autorizado a su cuenta.
            </p>
            <p className="text-muted-foreground">
              <strong>Suspensión de Cuenta:</strong> Podemos suspender o cerrar su cuenta si violate estos Términos o si detectamos actividad sospechosa.
            </p>
          </section>

          {/* Depósitos y Retiros */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Depósitos, Retiros y Transacciones</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Depósitos Mínimos:</strong> El depósito mínimo varía según el plan seleccionado. El Plan Gratuito permite depósitos sin mínimo ($0 USD) y sin límite máximo. Puedes depositar cualquier cantidad. Planes de pago: Estándar $60, Pro $200, VIP $600, Elite $2,000. No hay comisiones en depósitos.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Métodos de Pago:</strong> Aceptamos transferencias bancarias, tarjetas de crédito/débito, billeteras electrónicas y criptomonedas.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Procesamiento de Retiros:</strong> Los retiros se procesan según tu plan: Plan Gratuito (10 días hábiles), Plan Estándar (5 días), Plan Pro (3 días), Plan VIP (48 horas), Plan Elite (Instantáneo). No hay comisiones en retiros de ningún plan.
            </p>
            <p className="text-muted-foreground">
              <strong>Verificación:</strong> Podemos requerir verificación adicional antes de procesar transacciones grandes conforme a regulaciones AML/KYC.
            </p>
          </section>

          {/* Política de Planes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">5.1 Política de Planes de 15 Días</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Duración del Plan:</strong> Cada plan de inversión tiene una duración de 15 días calendario desde su activación. Durante este período, usted tendrá acceso completo a todos los beneficios del plan seleccionado. El Plan Gratuito tiene duración ilimitada.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Plan Gratuito:</strong> El Plan Gratuito permite depósitos sin mínimo ($0 USD) y sin límite máximo. Puedes depositar cualquier cantidad ($1, $10, $100, etc.). Es perfecto para comenzar sin riesgo, hacer inversiones de prueba y conocer la plataforma. No está sujeto a la duración de 15 días. Para cambiar a un plan de pago, deberá tener depositado el mínimo requerido de ese plan. Por ejemplo, para cambiar a Plan Estándar requiere tener al menos $60 USD. Una vez cambie a un plan de pago, los términos de 15 días y la ventana de cambio de 3 días aplican.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Ventana de Cambio de Plan (Primeros 3 Días):</strong> En planes de pago (Estándar, Pro, VIP, Elite), puede cambiar a un plan diferente ÚNICAMENTE durante los primeros 3 días del plan actual. Después de transcurridos 3 días, estará comprometido con el plan actual por los 15 días completos y no podrá cambiar hasta que finalice el período.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Cancelación de Saldo Restante (Prorrateo):</strong> Si decide cambiar de plan durante los primeros 3 días, deberá cancelar el valor prorrateado de los días restantes del plan anterior. El cálculo es: (Monto del Plan ÷ 15 días) × Días Restantes No Utilizados.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Ejemplo de Prorrateo:</strong>
            </p>
            <ul className="text-muted-foreground space-y-2 mb-4 ml-4">
              <li>• Usted contrata el Plan Pro a $300 por 15 días</li>
              <li>• Al día 2, decide cambiar al Plan VIP</li>
              <li>• Cálculo: $300 ÷ 15 = $20 por día</li>
              <li>• Días restantes no utilizados: 13 días</li>
              <li>• Monto a cancelar: 13 × $20 = $260</li>
              <li>• Se aplicará este cargo a su cuenta</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              <strong>Sin Comisiones Adicionales:</strong> No hay comisiones por cambio de plan. El único costo es el prorrateo de días restantes que debe pagar.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Renovación Automática:</strong> Al finalizar los 15 días, su plan expirará. Puede renovar el mismo plan o cambiar a uno diferente sin restricciones. Esto es considerado una "nueva activación" y tendrá nuevamente 3 días para cambiar si lo desea.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Acceso al Dashboard:</strong> Usted podrá ver en su Dashboard el contador de días restantes en su plan actual y la fecha exacta de finalización. Si está dentro de la ventana de 3 días, verá la opción de cambiar de plan.
            </p>
            <p className="text-muted-foreground">
              <strong>Excepciones:</strong> El Plan Gratuito no tiene duración limitada. Para cambiar de Plan Gratuito a un plan de pago, debe cumplir con el depósito mínimo de ese plan. El sistema validará automáticamente que su saldo sea suficiente antes de permitir la actualización.
            </p>
          </section>

          {/* Requisitos de Saldo para Cambio de Plan */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">5.2 Requisitos de Saldo para Cambio de Plan</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Cambio desde Plan Gratuito:</strong> Para cambiar del Plan Gratuito a un plan de pago, su saldo depositable debe ser igual o superior al depósito mínimo de ese plan.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Depósitos Mínimos Requeridos:</strong>
            </p>
            <ul className="text-muted-foreground space-y-2 mb-4 ml-4">
              <li>• Plan Estándar: Mínimo $60 USD</li>
              <li>• Plan Pro: Mínimo $200 USD</li>
              <li>• Plan VIP: Mínimo $600 USD</li>
              <li>• Plan Elite: Mínimo $2,000 USD</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              <strong>Validación Automática:</strong> El sistema verificará automáticamente que su saldo en cuenta sea suficiente. Si intenta cambiar a un plan pero no tiene el mínimo requerido, la plataforma no permitirá la transacción y le informará del monto faltante.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Múltiples Depósitos:</strong> Puede realizar múltiples depósitos en el Plan Gratuito sin límite de transacciones ni restricción de tiempo. En el Plan Gratuito no hay mínimo ni máximo de depósito. Puedes depositar cualquier cantidad.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Cambios Posteriores:</strong> Una vez en un plan de pago, si desea cambiar a otro plan de pago dentro de los primeros 3 días, deberá pagar el prorrateo de días restantes del plan actual (si es diferente al Plan Gratuito).
            </p>
            <p className="text-muted-foreground">
              <strong>Permanencia en Plan Gratuito:</strong> Si su saldo es insuficiente para cambiar a otro plan, puede mantener sus fondos indefinidamente en el Plan Gratuito sin comisiones, sin duración limitada y sin penalizaciones.
            </p>
          </section>

          {/* Riesgos */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Reconocimiento de Riesgos</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Riesgo de Inversión:</strong> Las inversiones conllevan riesgo de pérdida. Los rendimientos pasados no garantizan resultados futuros. El valor de sus inversiones puede disminuir.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Riesgo de Mercado:</strong> Los mercados son impredecibles. Factores globales pueden afectar el rendimiento.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Riesgo de Liquidez:</strong> Algunos instrumentos pueden no ser fácilmente convertibles a efectivo.
            </p>
            <p className="text-muted-foreground">
              <strong>Riesgo de Crédito:</strong> Los emisores pueden incumplir sus obligaciones.
            </p>
          </section>

          {/* Limitación de Responsabilidad */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Limitación de Responsabilidad</h2>
            <p className="text-muted-foreground mb-4">
              EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY, CVVINVEST NO SERÁ RESPONSABLE POR:
            </p>
            <ul className="text-muted-foreground space-y-2 mb-4">
              <li>• Daños indirectos, incidentales o consecuentes</li>
              <li>• Pérdida de ganancias o ingresos esperados</li>
              <li>• Pérdida de datos o interrupciones de servicio</li>
              <li>• Fallos técnicos o del servidor</li>
              <li>• Acciones de terceros fuera de nuestro control</li>
            </ul>
            <p className="text-muted-foreground">
              Nuestra responsabilidad total está limitada al monto que usted depositó en los últimos 12 meses.
            </p>
          </section>

          {/* Representaciones y Garantías */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Representaciones y Garantías</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Por parte del Usuario:</strong> Declara que posee toda la autoridad legal para entrar en estos Términos y que cumple con todas las regulaciones aplicables.
            </p>
            <p className="text-muted-foreground">
              <strong>Por parte de CVVInvest:</strong> Representamos que operamos de manera legal y regulada, pero no garantizamos resultados específicos de inversión.
            </p>
          </section>

          {/* Propiedad Intelectual */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Propiedad Intelectual</h2>
            <p className="text-muted-foreground mb-4">
              Todo contenido en CVVInvest (logos, diseño, texto, código) está protegido por derechos de autor. No puede reproducir, distribuir o modificar sin permiso explícito.
            </p>
            <p className="text-muted-foreground">
              Se le otorga una licencia limitada para usar la plataforma únicamente para fines autorizados.
            </p>
          </section>

          {/* Indemnización */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Indemnización</h2>
            <p className="text-muted-foreground">
              Acepta indemnizar y mantener indemne a CVVInvest contra cualquier reclamo, daño, pérdida o gasto (incluyendo honorarios legales) derivados de su violación de estos Términos o su uso de la plataforma.
            </p>
          </section>

          {/* Terminación */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Terminación</h2>
            <p className="text-muted-foreground mb-4">
              Puede cerrar su cuenta en cualquier momento. CVVInvest puede terminar su acceso si viola estos Términos.
            </p>
            <p className="text-muted-foreground">
              Tras terminación, sus fondos serán reembolsados conforme al calendario de retiros establecido.
            </p>
          </section>

          {/* Ley Aplicable */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">12. Ley Aplicable y Jurisdicción</h2>
            <p className="text-muted-foreground mb-4">
              Estos Términos se rigen por las leyes de la jurisdicción en que CVVInvest está registrada, independientemente de conflictos de principios legales.
            </p>
            <p className="text-muted-foreground">
              Cualquier disputa será resuelta mediante arbitraje vinculante conforme a las reglas de arbitraje internacional.
            </p>
          </section>

          {/* Contacto */}
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Preguntas sobre estos Términos</h2>
            <p className="text-muted-foreground mb-2">
              Para preguntas sobre estos Términos y Condiciones, contáctenos:
            </p>
            <p className="text-muted-foreground">
              📧 soportecvvinvest@proton.me<br />
              📞 No disponible temporalmente<br />
              Disponible 24/7
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
