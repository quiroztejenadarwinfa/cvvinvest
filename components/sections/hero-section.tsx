"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Shield, TrendingUp, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary">Plataforma verificada y segura</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-foreground">Invierte con</span> <span className="text-primary">Confianza</span>{" "}
              <span className="text-foreground">y</span> <span className="text-primary">Tecnología</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              CVVINVEST es la plataforma líder en inversiones financieras. Gestiona tu capital con las herramientas más
              avanzadas del mercado y obtén rendimientos superiores con total seguridad.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/registro">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/planes">Ver Planes</Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">100% Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Alto Rendimiento</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Retiros Rápidos</span>
              </div>
            </div>
          </div>

          {/* Trading Dashboard Preview */}
          <div className="relative hidden lg:block">
            <div className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Balance Total</span>
                  <span className="text-xs text-success">+12.5%</span>
                </div>
                <div className="text-3xl font-bold text-primary">$124,532.00</div>

                {/* Chart Simulation */}
                <div className="h-40 flex items-end gap-1 pt-4">
                  {[40, 65, 45, 70, 55, 80, 60, 90, 75, 95, 85, 100].map((height, i) => (
                    <div key={i} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${height}%` }} />
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground">Inversión</div>
                    <div className="font-semibold">$85,000</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Ganancia</div>
                    <div className="font-semibold text-success">$39,532</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">ROI</div>
                    <div className="font-semibold text-primary">46.5%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-card border border-primary/30 rounded-xl p-4 shadow-xl animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Rendimiento</div>
                  <div className="font-bold text-success">+24.8%</div>
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-4 -left-4 bg-card border border-primary/30 rounded-xl p-4 shadow-xl"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Protección</div>
                  <div className="font-bold">100%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
