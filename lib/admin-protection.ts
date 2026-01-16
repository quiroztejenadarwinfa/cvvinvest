import { ReactNode } from "react"
import { getSessionUser, ADMIN_EMAIL, clearSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export function AdminProtection() {
  const sessionUser = getSessionUser()
  
  if (!sessionUser) {
    redirect("/login")
  }
  
  // SOLO el email de admin puede acceder
  if (sessionUser.email !== ADMIN_EMAIL) {
    clearSession()
    redirect("/login")
  }
  
  return null
}

export function requireAdmin() {
  const sessionUser = getSessionUser()
  
  if (!sessionUser) {
    redirect("/login")
  }
  
  if (sessionUser.email !== ADMIN_EMAIL) {
    clearSession()
    redirect("/login")
  }
  
  return sessionUser
}
