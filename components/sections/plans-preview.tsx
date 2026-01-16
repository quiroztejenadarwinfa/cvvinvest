import { Button } from "@/components/ui/button"
import { Check, Star } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "GRATUITO",
    subtitle: "VISUAL",
    price: "$0",
    color: "from-slate-500 to-slate-600",
    borderColor: "border-slate-500/30",
    features: ["Acceso visual al panel", "Vista general de la plataforma", "Sin inversiones activas", "Sin retiros"],
    popular: false,
  },
  {
    name: "ESTANDAR",
    subtitle: "INVERSIÓN",
    price: "$60 - $150",
    color: "from-blue-500 to-blue-600",
    borderColor: "border-blue-500/30",
    features: ["Administración básica", "Inversión estable", "Retiro en 5 días hábiles", "Banco local y Binance"],
    popular: false,
  },
  {
    name: "PRO",
    subtitle: "PROFESIONAL",
    price: "$200 - $500",
    color: "from-primary to-primary/80",
    borderColor: "border-primary/50",
    features: ["Retorno optimizado", "Retiro en 3 días hábiles", "Soporte prioritario", "PayPal incluido"],
    popular: true,
  },
  {
    name: "VIP",
    subtitle: "PREMIUM",
    price: "$600 - $1,500",
    color: "from-amber-500 to-amber-600",
    borderColor: "border-amber-500/30",
    features: ["Rendimiento superior", "Retiro en 48 horas", "Asesor personal", "Todos los métodos"],
    popular: false,
  },
]

export function PlansPreview() {
  return (
    <section className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Planes de <span className="text-primary">Inversión</span>
          </h2>
          <p className="text-muted-foreground">
            Elige el plan que mejor se adapte a tus objetivos financieros. Desde acceso visual hasta inversiones premium
            con rendimientos superiores.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl bg-card border-2 p-6 transition-all duration-300 hover:scale-105",
                plan.popular ? "border-primary shadow-lg shadow-primary/20" : plan.borderColor,
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  POPULAR
                </div>
              )}

              <div
                className={cn(
                  "text-xs font-bold px-3 py-1 rounded-full inline-block bg-gradient-to-r text-white mb-4",
                  plan.color,
                )}
              >
                {plan.subtitle}
              </div>

              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-2xl font-bold text-primary mb-4">{plan.price}</div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
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
                asChild
              >
                <Link href="/registro">Seleccionar</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link href="/planes">Ver todos los planes y detalles</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
