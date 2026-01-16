import { Users, TrendingUp, DollarSign, Shield } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "20,000+",
    label: "Inversores Activos",
    description: "Comunidad verificada y en crecimiento",
  },
  {
    icon: DollarSign,
    value: "$380M+",
    label: "Capital Gestionado",
    description: "Distribuido en carteras diversificadas",
  },
  {
    icon: TrendingUp,
    value: "21.5%",
    label: "Rendimiento Promedio Anual",
    description: "Retorno verificado según plan",
  },
  {
    icon: Shield,
    value: "99.5%",
    label: "Disponibilidad",
    description: "Servicio confiable y seguro",
  },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm font-medium text-primary mt-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
