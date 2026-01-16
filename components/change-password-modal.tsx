"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { updateUserPassword, validatePassword } from "@/lib/auth"

interface ChangePasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userEmail: string
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export function ChangePasswordModal({
  open,
  onOpenChange,
  userEmail,
  onSuccess,
  onError,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
    match: false,
  })

  const validateNewPassword = (password: string) => {
    setValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*]/.test(password),
      match: password === confirmPassword && password.length > 0,
    })
  }

  const handleNewPasswordChange = (e: string) => {
    setNewPassword(e)
    validateNewPassword(e)
  }

  const handleConfirmPasswordChange = (e: string) => {
    setConfirmPassword(e)
    if (newPassword) {
      setValidations(prev => ({
        ...prev,
        match: newPassword === e && e.length > 0
      }))
    }
  }

  const handleChangePassword = async () => {
    // Validaciones
    if (!currentPassword) {
      onError("Por favor ingresa tu contraseña actual")
      return
    }

    if (!newPassword || !confirmPassword) {
      onError("Por favor completa todos los campos")
      return
    }

    if (newPassword !== confirmPassword) {
      onError("Las contraseñas nuevas no coinciden")
      return
    }

    if (newPassword.length < 8) {
      onError("La nueva contraseña debe tener al menos 8 caracteres")
      return
    }

    if (!/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      onError("La contraseña debe contener mayúsculas y números")
      return
    }

    // Validar contraseña actual
    if (!validatePassword(userEmail, currentPassword)) {
      onError("La contraseña actual es incorrecta")
      return
    }

    if (currentPassword === newPassword) {
      onError("La nueva contraseña debe ser diferente a la actual")
      return
    }

    setLoading(true)
    try {
      updateUserPassword(userEmail, newPassword)
      onSuccess("Contraseña cambiada exitosamente")
      onOpenChange(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setValidations({
        length: false,
        uppercase: false,
        number: false,
        special: false,
        match: false,
      })
    } catch (error) {
      onError("Error al cambiar la contraseña")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
          <DialogDescription>
            Actualiza tu contraseña para mantener tu cuenta segura
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contraseña Actual */}
          <div className="space-y-2">
            <Label htmlFor="current-password">Contraseña Actual</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Nueva Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Ingresa tu nueva contraseña"
                value={newPassword}
                onChange={(e) => handleNewPasswordChange(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Validaciones */}
            {newPassword && (
              <div className="mt-3 space-y-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  {validations.length ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={validations.length ? "text-green-700" : "text-gray-600"}>
                    Mínimo 8 caracteres
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {validations.uppercase ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={validations.uppercase ? "text-green-700" : "text-gray-600"}>
                    Una mayúscula
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {validations.number ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={validations.number ? "text-green-700" : "text-gray-600"}>
                    Un número
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirmar Nueva Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirma tu nueva contraseña"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {confirmPassword && newPassword && (
              <div className="mt-2">
                {validations.match ? (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Las contraseñas coinciden
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      Las contraseñas no coinciden
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 pt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleChangePassword}
            disabled={
              loading ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword ||
              !validations.match
            }
          >
            {loading ? "Cambiando..." : "Cambiar Contraseña"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
