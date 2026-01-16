"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function OAuthButtons() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleOAuthSignIn = async (provider: "google" | "microsoft") => {
    setLoading(provider)
    try {
      await signIn(provider, {
        redirect: true,
        callbackUrl: "/admin",
      })
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={() => handleOAuthSignIn("google")}
        disabled={loading !== null}
        className="w-full bg-white text-black border border-gray-300 hover:bg-gray-50"
      >
        {loading === "google" ? "Conectando..." : "🔵 Sign in with Google"}
      </Button>
      <Button
        onClick={() => handleOAuthSignIn("microsoft")}
        disabled={loading !== null}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading === "microsoft" ? "Conectando..." : "🔷 Sign in with Microsoft"}
      </Button>
    </div>
  )
}
