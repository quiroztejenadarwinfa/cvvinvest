import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Shield, Target, Users, Award } from "lucide-react"

export default function NosotrosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Sobre <span className="text-primary">CVVINVEST</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Somos una plataforma líder en inversiones financieras, comprometidos con la seguridad, transparencia y el
              crecimiento de tu capital.
            </p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-card border border-border text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Seguridad</h3>
              <p className="text-sm text-muted-foreground">
                Tecnología de encriptación de nivel bancario para proteger tus inversiones.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Precisión</h3>
              <p className="text-sm text-muted-foreground">
                Análisis de mercado avanzado para maximizar tus rendimientos.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Comunidad</h3>
              <p className="text-sm text-muted-foreground">Más de 20,000 inversores activos confían en nuestra plataforma.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Excelencia</h3>
              <p className="text-sm text-muted-foreground">Comprometidos con los más altos estándares de servicio.</p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 rounded-2xl bg-card border border-border">
              <h2 className="text-2xl font-bold mb-4 text-primary">Nuestra Misión</h2>
              <p className="text-muted-foreground">
                Democratizar el acceso a inversiones financieras de alto rendimiento, proporcionando herramientas
                profesionales y seguridad de nivel institucional a inversores de todos los niveles.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border">
              <h2 className="text-2xl font-bold mb-4 text-primary">Nuestra Visión</h2>
              <p className="text-muted-foreground">
                Ser la plataforma de inversiones más confiable y tecnológicamente avanzada del mercado, estableciendo
                nuevos estándares en transparencia, rendimiento y experiencia de usuario.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-center mb-8">CVVINVEST en Números</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">20,000+</div>
                <div className="text-sm text-muted-foreground mt-1">Inversores Activos</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">$380M+</div>
                <div className="text-sm text-muted-foreground mt-1">Capital Gestionado</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">21.5%</div>
                <div className="text-sm text-muted-foreground mt-1">Rendimiento Promedio Anual</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground mt-1">Soporte Disponible</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
