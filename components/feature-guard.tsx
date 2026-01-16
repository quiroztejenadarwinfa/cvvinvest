"use client"

import React from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/auth"
import { canAccessFeature, getMissingFeatureMessage } from "@/lib/plan-features"

interface FeatureGuardProps {
  user: User
  feature: string
  featureLabel: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Componente que protege el acceso a características según el plan del usuario
 */
export function FeatureGuard({
  user,
  feature,
  featureLabel,
  children,
  fallback,
}: FeatureGuardProps) {
  const hasAccess = canAccessFeature(user.plan, feature as any)

  if (!hasAccess) {
    return (
      fallback || (
        <Alert className="border-warning/50 bg-warning/5">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription>
            <p className="font-medium mb-2">{featureLabel} no disponible</p>
            <p className="text-sm mb-3">{getMissingFeatureMessage(user.plan, feature)}</p>
            <Button asChild size="sm" variant="outline">
              <Link href="/planes">Ver planes</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )
    )
  }

  return <>{children}</>
}

interface FeatureButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  user: User
  feature: string
  featureLabel: string
  children: React.ReactNode
}

/**
 * Botón que se deshabilita si el usuario no tiene acceso a la característica
 */
export function FeatureButton({
  user,
  feature,
  featureLabel,
  disabled,
  title,
  children,
  ...props
}: FeatureButtonProps) {
  const hasAccess = canAccessFeature(user.plan, feature as any)
  const message = getMissingFeatureMessage(user.plan, feature)

  return (
    <Button
      disabled={!hasAccess || disabled}
      title={!hasAccess ? message : title}
      {...props}
    >
      {children}
    </Button>
  )
}
