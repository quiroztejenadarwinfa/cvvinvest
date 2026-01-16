'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { getAllUsers, setAllUsers } from '@/lib/auth'
import Link from 'next/link'

type Step = 'email' | 'otp' | 'password' | 'success'

export default function RecuperarPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [userEmail, setUserEmail] = useState('')

  // Generar código OTP de 6 dígitos alfanuméricos
  const generateOtp = (): string => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Simular envío de correo (en producción, usar servicio real)
  const sendEmailWithOtp = (email: string, otp: string) => {
    // Guardar OTP en localStorage con timestamp
    const otpData = {
      otp: otp,
      email: email,
      timestamp: Date.now(),
      expires: Date.now() + 10 * 60 * 1000, // 10 minutos
    }
    localStorage.setItem('passwordResetOtp', JSON.stringify(otpData))

    // En producción, aquí iría la llamada a un servicio de email
    console.log(`📧 Correo simulado enviado a ${email}`)
    console.log(`🔐 Código OTP: ${otp}`)
    
    // Mostrar mensaje
    setMessage(`Código OTP enviado a ${email}. Revisa tu bandeja de entrada.`)
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      // Validar email
      if (!email || !email.includes('@')) {
        setError('Por favor ingresa un email válido')
        setLoading(false)
        return
      }

      // Verificar que el usuario existe
      const users = getAllUsers()
      const user = users.find(u => u.email === email)

      if (!user) {
        setError('No existe cuenta asociada a este email')
        setLoading(false)
        return
      }

      // Generar y enviar OTP
      const newOtp = generateOtp()
      setGeneratedOtp(newOtp)
      setUserEmail(email)
      sendEmailWithOtp(email, newOtp)

      // Pasar al siguiente paso
      setTimeout(() => {
        setStep('otp')
        setMessage('')
      }, 2000)
    } catch (err) {
      setError('Error al procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      // Obtener OTP guardado
      const otpData = JSON.parse(localStorage.getItem('passwordResetOtp') || '{}')

      // Verificar que el OTP no haya expirado
      if (Date.now() > otpData.expires) {
        setError('El código OTP ha expirado. Por favor solicita uno nuevo.')
        setLoading(false)
        return
      }

      // Verificar que el OTP sea correcto
      if (otp.toUpperCase() !== otpData.otp) {
        setError('Código OTP incorrecto')
        setLoading(false)
        return
      }

      // OTP válido, pasar al siguiente paso
      setStep('password')
      setMessage('Código verificado. Ahora ingresa tu nueva contraseña.')
    } catch (err) {
      setError('Error al verificar el código')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      // Validar contraseñas
      if (newPassword.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres')
        setLoading(false)
        return
      }

      if (newPassword !== confirmPassword) {
        setError('Las contraseñas no coinciden')
        setLoading(false)
        return
      }

      // Actualizar contraseña del usuario
      const users = getAllUsers()
      const updatedUsers = users.map(u => 
        u.email === userEmail 
          ? { ...u, password: newPassword }
          : u
      )
      setAllUsers(updatedUsers)

      // Limpiar OTP
      localStorage.removeItem('passwordResetOtp')

      // Pasar a pantalla de éxito
      setStep('success')
    } catch (err) {
      setError('Error al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          {step === 'email' && (
            <Card className="p-8">
              <div className="text-center mb-6">
                <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h1 className="text-2xl font-bold mb-2">Recuperar Contraseña</h1>
                <p className="text-sm text-muted-foreground">
                  Ingresa tu email para recibir un código de recuperación
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {error && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                {message && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700">{message}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Código OTP'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-primary hover:underline flex items-center justify-center gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Volver al login
                </Link>
              </div>
            </Card>
          )}

          {step === 'otp' && (
            <Card className="p-8">
              <div className="text-center mb-6">
                <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h1 className="text-2xl font-bold mb-2">Verificar Código</h1>
                <p className="text-sm text-muted-foreground">
                  Hemos enviado un código a {userEmail}
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Código OTP (6 caracteres)</label>
                  <Input
                    type="text"
                    placeholder="ABC123"
                    value={otp.toUpperCase()}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    maxLength={6}
                    disabled={loading}
                    className="text-center text-lg tracking-widest font-mono"
                  />
                </div>

                {error && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                {message && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700">{message}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Verificando...' : 'Verificar Código'}
                </Button>
              </form>

              <div className="mt-6 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep('email')}
                  disabled={loading}
                >
                  Volver
                </Button>
              </div>
            </Card>
          )}

          {step === 'password' && (
            <Card className="p-8">
              <div className="text-center mb-6">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h1 className="text-2xl font-bold mb-2">Nueva Contraseña</h1>
                <p className="text-sm text-muted-foreground">
                  Ingresa una nueva contraseña para tu cuenta
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nueva Contraseña</label>
                  <Input
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Confirmar Contraseña</label>
                  <Input
                    type="password"
                    placeholder="Confirma tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {error && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                {message && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700">{message}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </Button>
              </form>
            </Card>
          )}

          {step === 'success' && (
            <Card className="p-8">
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
                <h1 className="text-2xl font-bold">¡Contraseña Cambiada!</h1>
                <p className="text-muted-foreground">
                  Tu contraseña ha sido actualizada correctamente.
                </p>

                <Button
                  onClick={() => router.push('/login')}
                  className="w-full mt-6"
                >
                  Ir al Login
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
