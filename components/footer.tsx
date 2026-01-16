import Link from "next/link"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Plataforma líder en inversiones financieras. Seguridad, tecnología y rendimiento al servicio de tu
              capital.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Plataforma</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/planes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Planes
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/seguridad" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Seguridad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Centro Legal
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Contacto</h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                <a href="mailto:soportecvvinvest@proton.me" className="text-primary hover:underline hover:text-primary/80 transition-colors">
                  soportecvvinvest@proton.me
                </a>
              </li>
              <li className="text-sm text-muted-foreground">No disponible temporalmente</li>
              <li className="text-sm text-muted-foreground">Abierto 24/7</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2026 CVVINVEST. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <span className="text-xs text-muted-foreground">Inversiones reguladas y supervisadas</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
