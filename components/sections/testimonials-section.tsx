import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Carlos Mendoza",
    role: "Empresario",
    content:
      "CVVINVEST ha transformado mi forma de invertir. La plataforma es intuitiva y los rendimientos han superado mis expectativas.",
    rating: 5,
  },
  {
    name: "María García",
    role: "Inversionista",
    content:
      "La seguridad y transparencia de CVVINVEST me dan total confianza. El soporte es excepcional y siempre están disponibles.",
    rating: 5,
  },
  {
    name: "Roberto Sánchez",
    role: "Trader Profesional",
    content:
      "Las herramientas de análisis y la velocidad de ejecución son de primer nivel. Definitivamente la mejor plataforma del mercado.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Lo que dicen nuestros <span className="text-primary">Inversores</span>
          </h2>
          <p className="text-muted-foreground">Miles de inversores confían en CVVINVEST para gestionar su capital.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">&quot;{testimonial.content}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">{testimonial.name[0]}</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
