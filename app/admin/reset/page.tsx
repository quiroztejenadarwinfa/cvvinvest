"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { clearSession, resetAllData } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ResetPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [success, setSuccess] = useState(false)

  const handleReset = async () => {
    if (!confirmed) {
      setConfirmed(true)
      return
    }

    if (confirmText !== "CONFIRMAR") {
      return
    }

    setLoading(true)
    try {
      resetAllData()
      clearSession()
      setSuccess(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      router.push("/login")
    } catch (error) {
      console.error("Error al resetear:", error)
      setLoading(false)
    }
  }


  if (success) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-green-600">✅ Reset Completado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Todos los datos han sido limpiados correctamente. Serás redirigido al login...
          </p>
          <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-green-600 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl">
      <Card className="border-red-900/50 bg-red-950/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <CardTitle className="text-red-600">Resetear Sistema</CardTitle>
              <CardDescription>Limpiar todos los datos (irreversible)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Advertencia */}
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-red-400">⚠️ ADVERTENCIA - ACCIÓN IRREVERSIBLE</h3>
            <ul className="text-sm text-red-300 space-y-2 ml-4">
              <li>• Todos los usuarios serán eliminados (excepto admin)</li>
              <li>• Todas las estadísticas se limpiarán</li>
              <li>• Todos los depósitos y retiros se borrarán</li>
              <li>• Todos los mensajes y notificaciones se eliminarán</li>
              <li>• Solo quedará el admin disponible</li>
              <li>• NO PUEDE SER REVERTIDO</li>
            </ul>
          </div>

          {/* Confirmación inicial */}
          {!confirmed ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                ¿Estás seguro de que deseas continuar?
              </p>
              <Button
                onClick={handleReset}
                variant="destructive"
                className="w-full"
              >
                Proceder con el Reset
              </Button>
            </div>
          ) : (
            /* Confirmación final */
            <div className="space-y-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-300">
                CONFIRMACIÓN FINAL: Escribe "CONFIRMAR" exactamente para proceder:
              </p>
              <input
                type="text"
                placeholder="CONFIRMAR"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                disabled={loading}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono text-center text-sm"
              />
              {confirmText === "CONFIRMAR" && (
                <p className="text-xs text-green-400 text-center">✓ Listo para resetear</p>
              )}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setConfirmed(false)
                    setConfirmText("")
                  }}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReset}
                  disabled={loading || confirmText !== "CONFIRMAR"}
                  className="flex-1"
                >
                  {loading ? "Reseteando..." : "Ejecutar Reset"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

