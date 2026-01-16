'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Copy, Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getSessionUser } from '@/lib/auth'
import { getActiveBankAccounts } from '@/lib/bank-config'
import { createAdminNotification } from '@/lib/notifications'

export default function TransferenciaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bankAccounts] = useState(getActiveBankAccounts())
  const [amount, setAmount] = useState<number>(0)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    const sessionUser = getSessionUser()
    if (!sessionUser) {
      router.push('/login')
      return
    }
    setUser(sessionUser)
    
    // Get amount from URL params
    const amountParam = searchParams.get('amount')
    if (amountParam) {
      setAmount(parseFloat(amountParam))
    }
    
    setLoading(false)
  }, [router, searchParams])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate image
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Por favor selecciona una imagen válida')
        return
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        setErrorMessage('La imagen no puede exceder 5MB')
        return
      }
      
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setErrorMessage('')
    }
  }

  const handleCopyAccount = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleSubmitComprobante = async () => {
    if (!imageFile) {
      setErrorMessage('Debes adjuntar un comprobante de transferencia')
      return
    }

    if (amount <= 0) {
      setErrorMessage('Monto inválido')
      return
    }

    setSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      // Convert image to base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageBase64 = e.target?.result as string

        // Create comprobante record
        const comprobanteId = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        const comprobanteData = {
          id: comprobanteId,
          userId: user.id,
          userEmail: user.email,
          userName: user.name || user.email,
          amount: amount,
          image: imageBase64,
          fileName: imageFile.name,
          status: 'pendiente',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        // Save to localStorage
        const allComprobantes = JSON.parse(localStorage.getItem('cvvinvest_comprobantes') || '[]')
        allComprobantes.unshift(comprobanteData)
        localStorage.setItem('cvvinvest_comprobantes', JSON.stringify(allComprobantes))

        // Send admin notification
        createAdminNotification({
          type: "comprobante_transfer",
          title: "Nuevo Comprobante de Transferencia",
          message: `${user.email} ha enviado comprobante de transferencia por $${amount.toFixed(2)}`,
          details: {
            userId: user.id,
            amount: amount,
            userEmail: user.email
          },
          read: false
        })

        setSuccessMessage(`✓ Comprobante enviado. Monto en proceso: $${amount.toFixed(2)}`)
        
        // Store as pending deposit
        const depositId = `dep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const newDeposit = {
          id: depositId,
          userId: user.id,
          amount: amount,
          method: "Transferencia Bancaria",
          status: "en proceso",
          createdAt: new Date().toISOString(),
          userName: user.name || user.email,
          userEmail: user.email,
          comprobanteId: comprobanteId,
          notes: "Comprobante de transferencia enviado - En revisión"
        }
        
        const allDeposits = JSON.parse(localStorage.getItem('cvvinvest_deposits') || '[]')
        localStorage.setItem('cvvinvest_deposits', JSON.stringify([newDeposit, ...allDeposits]))

        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
      reader.readAsDataURL(imageFile)
    } catch (error) {
      console.error('Error:', error)
      setErrorMessage('Error al enviar comprobante. Intenta de nuevo.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">Cargando...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Transferencia Bancaria</h1>
              <p className="text-muted-foreground">Monto: <span className="text-primary font-bold">${amount.toFixed(2)}</span></p>
            </div>

            {/* Bank Details Card */}
            <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Datos para Recibir el Dinero</h2>
              
              <div className="space-y-4">
                {bankAccounts.length > 0 && bankAccounts.map((account) => (
                  <div key={account.id} className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Banco</p>
                      <div className="flex items-center justify-between bg-muted/50 p-3 rounded">
                        <span className="font-semibold">{account.bankName}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Titular</p>
                      <div 
                        className={`flex items-center justify-between bg-muted/50 p-3 rounded hover:bg-muted/70 transition-colors cursor-pointer ${copiedField === 'titular' ? 'ring-2 ring-green-500' : ''}`}
                        onClick={() => handleCopyAccount(account.accountHolder, 'titular')}
                      >
                        <code className="text-sm font-mono">{account.accountHolder}</code>
                        <Copy className={`h-4 w-4 ${copiedField === 'titular' ? 'text-green-500' : 'text-primary'}`} />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Número de Cuenta</p>
                      <div 
                        className={`flex items-center justify-between bg-muted/50 p-3 rounded hover:bg-muted/70 transition-colors cursor-pointer ${copiedField === 'cuenta' ? 'ring-2 ring-green-500' : ''}`}
                        onClick={() => handleCopyAccount(account.accountNumber, 'cuenta')}
                      >
                        <code className="text-sm font-mono font-bold text-lg">{account.accountNumber}</code>
                        <Copy className={`h-4 w-4 ${copiedField === 'cuenta' ? 'text-green-500' : 'text-primary'}`} />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Cédula</p>
                      <div 
                        className={`flex items-center justify-between bg-muted/50 p-3 rounded hover:bg-muted/70 transition-colors cursor-pointer ${copiedField === 'cedula' ? 'ring-2 ring-green-500' : ''}`}
                        onClick={() => handleCopyAccount(account.ci, 'cedula')}
                      >
                        <code className="text-sm font-mono">{account.ci}</code>
                        <Copy className={`h-4 w-4 ${copiedField === 'cedula' ? 'text-green-500' : 'text-primary'}`} />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">SWIFT</p>
                      <div 
                        className={`flex items-center justify-between bg-muted/50 p-3 rounded hover:bg-muted/70 transition-colors cursor-pointer ${copiedField === 'swift' ? 'ring-2 ring-green-500' : ''}`}
                        onClick={() => handleCopyAccount(account.swift, 'swift')}
                      >
                        <code className="text-sm font-mono">{account.swift}</code>
                        <Copy className={`h-4 w-4 ${copiedField === 'swift' ? 'text-green-500' : 'text-primary'}`} />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Email de Soporte</p>
                      <div 
                        className={`flex items-center justify-between bg-muted/50 p-3 rounded hover:bg-muted/70 transition-colors cursor-pointer ${copiedField === 'email' ? 'ring-2 ring-green-500' : ''}`}
                        onClick={() => handleCopyAccount(account.email, 'email')}
                      >
                        <code className="text-sm font-mono">{account.email}</code>
                        <Copy className={`h-4 w-4 ${copiedField === 'email' ? 'text-green-500' : 'text-primary'}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Instructions */}
            <Alert className="border-blue-500/50 bg-blue-500/10 mb-8">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                <p className="font-semibold mb-2">Instrucciones:</p>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Copia los datos haciendo clic en cada campo</li>
                  <li>Realiza la transferencia desde tu banco</li>
                  <li>Una vez completada, adjunta el comprobante abajo</li>
                  <li>Nosotros verificaremos y aprobaremos en las próximas 24 horas</li>
                </ol>
              </AlertDescription>
            </Alert>

            {/* Comprobante Upload Card */}
            <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Adjuntar Comprobante de Transferencia</h2>
              
              {/* Error Message */}
              {errorMessage && (
                <Alert className="border-red-500/50 bg-red-500/10 mb-4">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Success Message */}
              {successMessage && (
                <Alert className="border-green-500/50 bg-green-500/10 mb-4">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
                </Alert>
              )}

              {/* File Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Selecciona una imagen (obligatorio)
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-input"
                    disabled={submitting}
                  />
                  <label
                    htmlFor="image-input"
                    className="flex items-center justify-center border-2 border-dashed border-primary/50 rounded-lg p-6 cursor-pointer hover:bg-primary/5 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium">
                        {imageFile ? imageFile.name : 'Haz clic para seleccionar una imagen'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG o JPEG (máx 5MB)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Vista previa:</p>
                  <div className="relative rounded-lg overflow-hidden border-2 border-primary/30">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-auto max-h-64 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mt-6">
                <Button
                  onClick={handleSubmitComprobante}
                  disabled={!imageFile || submitting || successMessage !== ''}
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                >
                  {submitting ? 'Enviando...' : successMessage ? '✓ Depósito en Proceso' : 'Enviar Comprobante'}
                </Button>

                <Button
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  className="w-full"
                >
                  Volver al Inicio
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
