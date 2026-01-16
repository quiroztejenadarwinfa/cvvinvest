"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Clock, AlertCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/auth"
import { getUserDeposits, getUserWithdrawals, getUserInvestments } from "@/lib/auth"

interface DashboardOverviewProps {
  user: User
}

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const isFreePlan = user.plan === "gratuito"
  const [totalInvested, setTotalInvested] = useState(0)
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0)
  const [totalDeposited, setTotalDeposited] = useState(0)
  const [showBalance, setShowBalance] = useState(true)

  useEffect(() => {
    // Calcular inversiones activas
    const investments = getUserInvestments()
    const approved = investments
      .filter(inv => inv.userId === user.id && inv.status === 'aprobado')
      .reduce((sum, inv) => sum + inv.amount, 0)
    setTotalInvested(approved)

    // Calcular retiros pendientes
    const withdrawals = getUserWithdrawals()
    const pending = withdrawals
      .filter(w => w.userId === user.id && w.status === 'pendiente')
      .reduce((sum, w) => sum + w.amount, 0)
    setPendingWithdrawals(pending)

    // Calcular depósitos totales
    const deposits = getUserDeposits()
    const total = deposits
      .filter(d => d.userId === user.id)
      .reduce((sum, d) => sum + d.amount, 0)
    setTotalDeposited(total)
  }, [user.id])

  return (
    <div className="space-y-6">
      {/* Alert for free plan */}
      {isFreePlan && (
        <div className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-xl">
          <AlertCircle className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Estás en el Plan Gratuito</p>
            <p className="text-sm text-muted-foreground">
              Este plan es solo visual. Actualiza tu plan para comenzar a invertir y realizar retiros.
            </p>
          </div>
          <Button asChild className="bg-primary text-primary-foreground">
            <Link href="/planes">Actualizar Plan</Link>
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Balance Total</CardTitle>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{showBalance ? `$${user.balance.toLocaleString()}` : "****"}</div>
            <p className="text-xs text-muted-foreground mt-1">USD disponible</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inversión Activa</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
            <p className="text-xs text-success mt-1">Aprobadas y activas</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Depositado</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDeposited.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">En tu cuenta</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Retiros Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingWithdrawals.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">En proceso</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 bg-transparent"
              asChild
            >
              <Link href="/depositos">
                <ArrowDownLeft className="h-6 w-6" />
                <span>Depositar</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 bg-transparent"
              disabled={isFreePlan}
              asChild={!isFreePlan}
            >
              {isFreePlan ? (
                <>
                  <ArrowUpRight className="h-6 w-6" />
                  <span>Retirar</span>
                </>
              ) : (
                <Link href="/retiros">
                  <ArrowUpRight className="h-6 w-6" />
                  <span>Retirar</span>
                </Link>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Tu Plan Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold capitalize">{user.plan}</div>
                <p className="text-sm text-muted-foreground">
                  {isFreePlan ? "Solo acceso visual" : "Inversiones activas"}
                </p>
              </div>
              <Button asChild variant={isFreePlan ? "default" : "outline"}>
                <Link href="/planes">{isFreePlan ? "Actualizar" : "Ver Planes"}</Link>
              </Button>
            </div>

            {isFreePlan && (
              <div className="text-xs text-muted-foreground p-3 bg-secondary rounded-lg">
                Actualiza tu plan para desbloquear inversiones, retiros y acceso a todas las funciones de la plataforma.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay actividad reciente</p>
            <p className="text-sm mt-1">
              {isFreePlan
                ? "Actualiza tu plan para comenzar a invertir"
                : "Realiza tu primera inversión para ver tu actividad aquí"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
