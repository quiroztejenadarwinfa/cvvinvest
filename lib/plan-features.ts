/**
 * Plan Features Module
 * Nota: La gestión de planes ha sido removida
 * Este archivo proporciona stubs simples para compatibilidad
 */

export type PlanType = "gratuito" | "estandar" | "pro" | "vip" | "elite"

export interface PlanFeatures {
  canDeposit: boolean
  canWithdraw: boolean
  withdrawalDays: number
  canInvest: boolean
  canViewReports: boolean
  canViewAnalytics: boolean
  canHavePersonalAdvisor: boolean
  customizableLimits: boolean
  apiAccess: boolean
  paymentMethods: string[]
}

/**
 * Verifica si un usuario puede acceder a una característica
 */
export function canAccessFeature(userPlan: string, feature: string): boolean {
  const features = getPlanFeatures(userPlan as PlanType)
  
  switch (feature) {
    case "canDeposit":
      return features.canDeposit
    case "canWithdraw":
      return features.canWithdraw
    case "canInvest":
      return features.canInvest
    case "canViewReports":
      return features.canViewReports
    case "canViewAnalytics":
      return features.canViewAnalytics
    case "canHavePersonalAdvisor":
      return features.canHavePersonalAdvisor
    case "customizableLimits":
      return features.customizableLimits
    case "apiAccess":
      return features.apiAccess
    default:
      return false
  }
}

/**
 * Obtiene el mensaje de característica no disponible
 */
export function getMissingFeatureMessage(feature: string): string {
  return `Esta característica no está disponible en tu plan actual`
}

/**
 * Obtiene las características de un plan
 * Plan gratuito: solo permite depósitos, sin retiros
 * Plan estándar y superior: permite depósitos y retiros
 */
export function getPlanFeatures(plan: PlanType): PlanFeatures {
  // Plan gratuito: solo depósitos, NO retiros
  if (plan === "gratuito") {
    return {
      canDeposit: true,
      canWithdraw: false,
      withdrawalDays: 0,
      canInvest: false,
      canViewReports: false,
      canViewAnalytics: false,
      canHavePersonalAdvisor: false,
      customizableLimits: false,
      apiAccess: false,
      paymentMethods: ["Transferencia Bancaria", "PayPal"],
    }
  }

  // Plan estándar: depósitos, retiros (5 días), inversiones básicas
  if (plan === "estandar") {
    return {
      canDeposit: true,
      canWithdraw: true,
      withdrawalDays: 5,
      canInvest: true,
      canViewReports: true,
      canViewAnalytics: false,
      canHavePersonalAdvisor: false,
      customizableLimits: false,
      apiAccess: false,
      paymentMethods: ["Transferencia Bancaria", "PayPal", "Tarjeta de Crédito"],
    }
  }

  // Plan pro: retiros más rápidos (3 días)
  if (plan === "pro") {
    return {
      canDeposit: true,
      canWithdraw: true,
      withdrawalDays: 3,
      canInvest: true,
      canViewReports: true,
      canViewAnalytics: true,
      canHavePersonalAdvisor: false,
      customizableLimits: true,
      apiAccess: false,
      paymentMethods: ["Transferencia Bancaria", "PayPal", "Tarjeta de Crédito"],
    }
  }

  // Plan VIP: retiros muy rápidos (2 días)
  if (plan === "vip") {
    return {
      canDeposit: true,
      canWithdraw: true,
      withdrawalDays: 2,
      canInvest: true,
      canViewReports: true,
      canViewAnalytics: true,
      canHavePersonalAdvisor: true,
      customizableLimits: true,
      apiAccess: false,
      paymentMethods: ["Transferencia Bancaria", "PayPal", "Tarjeta de Crédito"],
    }
  }

  // Plan elite: retiros inmediatos (1 día)
  if (plan === "elite") {
    return {
      canDeposit: true,
      canWithdraw: true,
      withdrawalDays: 1,
      canInvest: true,
      canViewReports: true,
      canViewAnalytics: true,
      canHavePersonalAdvisor: true,
      customizableLimits: true,
      apiAccess: true,
      paymentMethods: ["Transferencia Bancaria", "PayPal", "Tarjeta de Crédito"],
    }
  }

  // Default: plan gratuito (sin retiros)
  return {
    canDeposit: true,
    canWithdraw: false,
    withdrawalDays: 0,
    canInvest: false,
    canViewReports: false,
    canViewAnalytics: false,
    canHavePersonalAdvisor: false,
    customizableLimits: false,
    apiAccess: false,
    paymentMethods: ["Transferencia Bancaria", "PayPal"],
  }
}
