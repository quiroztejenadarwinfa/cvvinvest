import { Shield, Zap, LineChart, Wallet, Clock, HeadphonesIcon } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Máxima Seguridad",
    description:
      "Tecnología de encriptación de nivel bancario y autenticación de dos factores para proteger tu inversión.",
  },
  {
    icon: LineChart,
    title: "Análisis Avanzado",
    description: "Herramientas de análisis técnico y fundamental para tomar decisiones informadas.",
  },
  {
    icon: Zap,
    title: "Ejecución Instantánea",
    description: "Procesa transacciones en milisegundos con nuestra infraestructura de alta velocidad.",
  },
  {
    icon: Wallet,
    title: "Múltiples Métodos",
    description: "Depósitos y retiros mediante banco local, Binance, PayPal y más opciones.",
  },
  {
    icon: Clock,
    title: "Soporte 24/7",
    description: "Equipo de expertos disponible las 24 horas para asistirte en cualquier momento.",
  },
  {
    icon: HeadphonesIcon,
    title: "Asesor Personal",
    description: "Planes premium incluyen un asesor financiero personal dedicado a tu portafolio.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Por qué elegir <span className="text-primary">CVVINVEST</span>?
          </h2>
          <p className="text-muted-foreground">
            Ofrecemos las mejores herramientas y condiciones para maximizar el rendimiento de tus inversiones con total
            seguridad.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
