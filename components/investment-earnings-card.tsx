"use client"

import { useEffect, useState } from "react"
import { Investment } from "@/lib/auth"
import { calculateInvestmentEarnings, getProjectedEarnings, getInvestmentProgress, getRemainingDays } from "@/lib/auth"
import { Card } from "@/components/ui/card"
import { TrendingUp, Clock, Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface InvestmentEarningsCardProps {
  investment: Investment
}

export function InvestmentEarningsCard({ investment }: InvestmentEarningsCardProps) {
  const [earnings, setEarnings] = useState(0)
  const [totalValue, setTotalValue] = useState(0)
  const [progress, setProgress] = useState(0)
  const [remainingDays, setRemainingDays] = useState(15)
  const [projected, setProjected] = useState(0)

  useEffect(() => {
    const updateEarnings = () => {
      const currentEarnings = calculateInvestmentEarnings(investment)
      const projectedEarnings = getProjectedEarnings(investment)
      const progressPercent = getInvestmentProgress(investment)
      const daysLeft = getRemainingDays(investment)
      
      setEarnings(currentEarnings)
      setTotalValue(investment.amount + currentEarnings)
      setProgress(progressPercent)
      setRemainingDays(daysLeft)
      setProjected(projectedEarnings)
    }

    updateEarnings()
    const interval = setInterval(updateEarnings, 1000) // Actualizar cada segundo
    return () => clearInterval(interval)
  }, [investment])

  const earningsPercent = ((earnings / investment.amount) * 100).toFixed(2)

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{investment.planName}</h3>
            <p className="text-sm text-muted-foreground">Monto invertido: ${investment.amount.toFixed(2)}</p>
          </div>
          {investment.status === "aprobado" && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
              <span className="text-xs font-medium">Activo</span>
            </div>
          )}
        </div>

        {/* Earnings Display */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground mb-2">Ganancia Actual</p>
            <p className="text-2xl font-bold text-primary">${earnings.toFixed(2)}</p>
            <p className="text-xs text-green-600 font-semibold mt-1">+{earningsPercent}%</p>
          </div>
          
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground mb-2">Valor Total</p>
            <p className="text-2xl font-bold text-foreground">${totalValue.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Capital + Ganancias</p>
          </div>
          
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground mb-2">Proyectado (15d)</p>
            <p className="text-2xl font-bold text-primary">${projected.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Total esperado</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Progreso del Plan</span>
            </div>
            <span className="text-sm font-semibold text-primary">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {remainingDays > 0 
              ? `${remainingDays} día${remainingDays !== 1 ? 's' : ''} restante${remainingDays !== 1 ? 's' : ''}`
              : 'Plan finalizado'
            }
          </p>
        </div>

        {/* Return Rate Info */}
        {investment.dailyReturnPercent && (
          <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Rendimiento Diario</p>
              <p className="text-xs text-muted-foreground">
                {investment.dailyReturnPercent.toFixed(3)}% compuesto diariamente
              </p>
            </div>
          </div>
        )}

        {/* Status Message */}
        {investment.status === "pendiente" && (
          <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <p className="text-sm text-yellow-700 font-medium">
              Pendiente de aprobación. Las ganancias comenzarán cuando sea aprobada.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
