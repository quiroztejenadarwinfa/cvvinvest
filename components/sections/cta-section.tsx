import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comienza a invertir <span className="text-primary">hoy mismo</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Únete a más de 20,000 inversores activos que ya confían en CVVINVEST. Crea tu cuenta gratis y accede a todas las
            herramientas de la plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/registro">
                Crear Cuenta Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contacto">Contactar con un Asesor</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
