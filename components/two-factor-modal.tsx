'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Copy, AlertTriangle, Smartphone, RefreshCw } from "lucide-react"
import { generateTwoFactorSecret, generateQRCode, verifyTwoFactorCode, enableTwoFactor, getTwoFactorStatus, getBackupCodes, type User } from "@/lib/auth"

interface TwoFactorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
}

export function TwoFactorModal({ open, onOpenChange, user }: TwoFactorModalProps) {
  const [step, setStep] = useState<'setup' | 'verify' | 'backup' | 'enabled' | 'disable'>('setup')
  const [secret, setSecret] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [disablePassword, setDisablePassword] = useState('')

  useEffect(() => {
    if (open) {
      const status = getTwoFactorStatus(user.id)
      setTwoFactorEnabled(status?.enabled || false)
      
      if (status?.enabled) {
        setStep('enabled')
      } else {
        setStep('setup')
      }
    }
  }, [open, user.id])

  const handleGenerateSecret = async () => {
    try {
      setLoading(true)
      setError('')
      
      const { secret: newSecret, qrCode: qr } = generateTwoFactorSecret(user.id)
      setSecret(newSecret)
      
      // Generar código QR
      const qrCodeUrl = await generateQRCode(qr)
      setQrCode(qrCodeUrl)
      
      setStep('verify')
    } catch (err) {
      setError('Error al generar el secreto. Intenta de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setLoading(true)
    setError('')
    
    try {
      if (verificationCode.length !== 6) {
        setError('El código debe tener 6 dígitos.')
        setLoading(false)
        return
      }

      const isValid = await verifyTwoFactorCode(user.id, verificationCode)
      
      if (!isValid) {
        setError('Código inválido. Verifica e intenta de nuevo.')
        setLoading(false)
        return
      }

      // Habilitar 2FA
      enableTwoFactor(user.id)
      setTwoFactorEnabled(true)
      
      // Obtener códigos de respaldo
      const backups = getBackupCodes(user.id)
      setBackupCodes(backups)
      
      setSuccess('¡2FA habilitado correctamente!')
      setStep('backup')
    } catch (err) {
      setError('Error al verificar el código.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    if (typeof window === 'undefined' || !navigator?.clipboard) {
      // Fallback para SSR o navegadores sin soporte
      setError('No se puede copiar al portapapeles en este contexto')
      return
    }
    
    navigator.clipboard.writeText(text).then(() => {
      setSuccess('Copiado al portapapeles')
      setTimeout(() => setSuccess(''), 2000)
    }).catch(() => {
      setError('Error al copiar al portapapeles')
    })
  }

  const handleDisable2FA = () => {
    if (disablePassword !== user.email) {
      setError('Verificación incorrecta. Debes ingresar tu email.')
      return
    }
    
    // Desabilitar 2FA
    const disableTwoFactor = (userId: string) => {
      const twoFactorData = localStorage.getItem(`cvvinvest_2fa_${userId}`)
      if (!twoFactorData) return false
      const data = JSON.parse(twoFactorData)
      data.enabled = false
      localStorage.setItem(`cvvinvest_2fa_${userId}`, JSON.stringify(data))
      return true
    }
    
    if (disableTwoFactor(user.id)) {
      setTwoFactorEnabled(false)
      setSuccess('2FA deshabilitado')
      setDisablePassword('')
      setError('')
      setTimeout(() => {
        setStep('setup')
      }, 2000)
    }
  }

  const handleClose = () => {
    if (step === 'enabled' || step === 'backup') {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Autenticación de Dos Factores (2FA)
          </DialogTitle>
          <DialogDescription>
            {twoFactorEnabled 
              ? 'Tu cuenta está protegida con 2FA'
              : 'Protege tu cuenta con Google Authenticator'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alert de Error */}
          {error && (
            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription>
                <p className="text-destructive">{error}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Alert de Éxito */}
          {success && (
            <Alert className="border-success/50 bg-success/5">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription>
                <p className="text-success">{success}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Paso 1: Setup */}
          {step === 'setup' && (
            <div className="space-y-4">
              <Card className="bg-secondary/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white text-sm font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Descargar Google Authenticator</p>
                        <p className="text-sm text-muted-foreground">
                          Descarga la app desde la App Store (iOS) o Google Play (Android)
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white text-sm font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Escanear código QR</p>
                        <p className="text-sm text-muted-foreground">
                          En el siguiente paso, escanea el código QR con tu teléfono
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white text-sm font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Verificar código</p>
                        <p className="text-sm text-muted-foreground">
                          Ingresa el código de 6 dígitos que aparece en tu app
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleGenerateSecret} disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Generando...
                  </>
                ) : (
                  'Comenzar Configuración'
                )}
              </Button>
            </div>
          )}

          {/* Paso 2: Verificar */}
          {step === 'verify' && (
            <div className="space-y-4">
              {/* Código QR */}
              <div className="space-y-2">
                <p className="font-medium text-sm">Código QR</p>
                <p className="text-sm text-muted-foreground">
                  Abre Google Authenticator y escanea este código:
                </p>
              </div>

              {qrCode && (
                <div className="flex justify-center p-6 bg-secondary rounded-lg border-2 border-border">
                  <img src={qrCode} alt="QR Code" className="w-64 h-64 object-contain" />
                </div>
              )}

              {/* Código manual */}
              <div className="space-y-2">
                <p className="font-medium text-sm">O ingresa el código manualmente:</p>
                <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg border border-border">
                  <code className="flex-1 font-mono text-lg tracking-widest font-bold text-center select-all">
                    {secret.match(/.{1,4}/g)?.join(' ')}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(secret)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Entrada de código */}
              <div className="space-y-2">
                <p className="font-medium text-sm">Código de verificación</p>
                <p className="text-sm text-muted-foreground">
                  Ingresa el código de 6 dígitos que ves en Google Authenticator:
                </p>
                <Input
                  placeholder="000000"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-3xl tracking-widest font-mono h-16 border-2"
                />
              </div>

              <Button 
                onClick={handleVerifyCode} 
                disabled={verificationCode.length !== 6 || loading} 
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Verificando...
                  </>
                ) : (
                  'Verificar Código'
                )}
              </Button>
            </div>
          )}

          {/* Paso 3: Códigos de respaldo */}
          {step === 'backup' && (
            <div className="space-y-4">
              <Alert className="border-warning/50 bg-warning/5">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription>
                  <p className="font-bold text-warning">Guarda tus códigos de respaldo</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Si pierdes acceso a tu teléfono, podrás usar estos códigos para acceder a tu cuenta. Guárdalos en un lugar seguro.
                  </p>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <p className="font-medium">Tus códigos de respaldo:</p>
                <div className="grid grid-cols-2 gap-2 p-4 bg-secondary rounded-lg border border-border">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-background rounded border border-border/50 hover:border-border cursor-pointer transition-colors" onClick={() => copyToClipboard(code)}>
                      <code className="font-mono text-xs font-bold flex-1">{code}</code>
                      <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => copyToClipboard(backupCodes.join('\n'))}
                  variant="outline"
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar todos
                </Button>
                <Button
                  onClick={handleClose}
                  className="w-full"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completado
                </Button>
              </div>
            </div>
          )}

          {/* Estado: 2FA Habilitado */}
          {step === 'enabled' && (
            <div className="space-y-4">
              <Alert className="border-success/50 bg-success/5">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertDescription>
                  <p className="font-bold text-success">✓ Autenticación de Dos Factores Activa</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tu cuenta está protegida. Se te pedirá un código cada vez que inicies sesión.
                  </p>
                </AlertDescription>
              </Alert>

              <Card className="bg-secondary/50">
                <CardHeader>
                  <CardTitle className="text-base">Protección Activa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Código TOTP de Google Authenticator requerido al iniciar sesión</p>
                  <p>✓ Códigos de respaldo disponibles en caso de emergencia</p>
                  <p>✓ Tu cuenta tiene mayor seguridad</p>
                </CardContent>
              </Card>

              <Button onClick={handleClose} className="w-full" size="lg">
                Cerrar
              </Button>

              <Button 
                onClick={() => setStep('disable')} 
                variant="destructive" 
                className="w-full"
              >
                Desabilitar 2FA
              </Button>
            </div>
          )}

          {/* Desabilitar 2FA */}
          {step === 'disable' && (
            <div className="space-y-4">
              <Alert className="border-destructive/50 bg-destructive/5">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertDescription>
                  <p className="font-bold text-destructive">Desabilitar 2FA</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Esto reducirá la seguridad de tu cuenta. Confirma ingresando tu email.
                  </p>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirma tu email:</label>
                <Input
                  placeholder={user.email}
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  className="border-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => {
                    setStep('enabled')
                    setDisablePassword('')
                    setError('')
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleDisable2FA}
                  variant="destructive" 
                  className="w-full"
                  disabled={!disablePassword}
                >
                  Desabilitar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
