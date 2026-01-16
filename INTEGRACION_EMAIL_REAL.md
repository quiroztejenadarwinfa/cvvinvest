# GUÍA DE INTEGRACIÓN - EMAIL REAL PARA OTP

## 📧 Propósito
Reemplazar la simulación de envío de email por correo real usando servicios profesionales.

---

## 🚀 OPCIÓN 1: SendGrid (RECOMENDADO)

### Paso 1: Crear cuenta en SendGrid
1. Ir a https://sendgrid.com
2. Sign up para cuenta gratuita (100 emails/día)
3. Verificar email
4. En Dashboard → Settings → API Keys
5. Crear nueva API Key
6. Copiar la API Key

### Paso 2: Instalar dependencias
```bash
npm install @sendgrid/mail
```

### Paso 3: Crear archivo de configuración
Crear archivo `/app/api/send-email/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Inicializar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    const emailContent = `
      <h1>Código de Recuperación de Contraseña</h1>
      <p>Has solicitado recuperar tu contraseña.</p>
      <p>Usa el siguiente código para continuar:</p>
      <h2 style="color: #3b82f6; font-size: 2em; letter-spacing: 3px;">
        ${otp}
      </h2>
      <p><strong>⏱️ Este código expira en 10 minutos</strong></p>
      <p style="color: #999; font-size: 12px;">
        Si no solicitaste este código, ignora este email.
      </p>
    `

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@tuapp.com',
      subject: 'Código de Recuperación de Contraseña',
      html: emailContent,
    }

    await sgMail.send(msg)

    return NextResponse.json(
      { success: true, message: 'Email enviado correctamente' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error enviando email:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

### Paso 4: Variables de entorno
En `.env.local`:
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@tuapp.com
```

### Paso 5: Actualizar página de recuperación
En `/app/recuperar-password/page.tsx`, reemplazar la función `sendEmailWithOtp`:

```typescript
const sendEmailWithOtp = async (email: string, otp: string) => {
  const otpData = {
    otp: otp,
    email: email,
    timestamp: Date.now(),
    expires: Date.now() + 10 * 60 * 1000,
  }
  localStorage.setItem('passwordResetOtp', JSON.stringify(otpData))

  // ANTES (simulado):
  // console.log(`📧 Correo simulado enviado a ${email}`)

  // DESPUÉS (real):
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    })

    if (response.ok) {
      console.log(`✉️ Email enviado a ${email}`)
    } else {
      console.error('Error enviando email')
      setError('Error al enviar el código. Intenta de nuevo.')
    }
  } catch (error) {
    console.error('Error de conexión:', error)
    setError('Error de conexión. Intenta de nuevo.')
  }
}
```

---

## 🚀 OPCIÓN 2: Resend (MODERNO)

### Paso 1: Crear cuenta en Resend
1. Ir a https://resend.com
2. Sign up con GitHub
3. Crear proyecto nuevo
4. Copiar API Key

### Paso 2: Instalar dependencias
```bash
npm install resend
```

### Paso 3: Crear archivo de API
Crear `/app/api/send-email/route.ts`:

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Código de Recuperación de Contraseña',
      html: `
        <h1>Código de Recuperación</h1>
        <p>Tu código OTP es:</p>
        <h2 style="color: #3b82f6; font-size: 2em; letter-spacing: 3px;">
          ${otp}
        </h2>
        <p><strong>⏱️ Válido por 10 minutos</strong></p>
      `,
    })

    return Response.json(data)
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
}
```

### Paso 4: Variables de entorno
En `.env.local`:
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

---

## 🚀 OPCIÓN 3: Nodemailer (FLEXIBILIDAD MÁXIMA)

### Paso 1: Instalar dependencias
```bash
npm install nodemailer
npm install -D @types/nodemailer
```

### Paso 2: Crear archivo de API
Crear `/app/api/send-email/route.ts`:

```typescript
import nodemailer from 'nodemailer'

// Crear transporte (ejemplo con Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Código de Recuperación de Contraseña',
      html: `
        <h1>Recuperar Contraseña</h1>
        <p>Tu código de verificación es:</p>
        <h2 style="color: #3b82f6; font-size: 2em; letter-spacing: 3px;">
          ${otp}
        </h2>
        <p><strong>⏱️ Válido por 10 minutos</strong></p>
        <p style="color: #999; font-size: 12px;">
          Si no solicitaste este código, ignora este email.
        </p>
      `,
    }

    await transporter.sendMail(mailOptions)

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Error enviando email' }, { status: 500 })
  }
}
```

### Paso 3: Variables de entorno
En `.env.local`:
```
EMAIL_USER=tuaplicacion@gmail.com
EMAIL_PASSWORD=tu_contraseña_de_app
```

---

## 📊 COMPARACIÓN DE SERVICIOS

| Servicio | Precio | Facilidad | Confiabilidad |
|----------|--------|-----------|---------------|
| **SendGrid** | Gratis (100/día) | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Resend** | Gratis (100/día) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Mailgun** | Gratis (100/día) | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Gmail/Nodemailer** | Gratis | ⭐⭐ | ⭐⭐⭐ |

**Recomendación**: SendGrid o Resend para producción

---

## 🔐 SEGURIDAD - CONSIDERACIONES

### 1. Rate Limiting
Agregar límite de intentos:

```typescript
const rateLimit = new Map<string, number[]>()

function checkRateLimit(email: string, maxAttempts = 3): boolean {
  const now = Date.now()
  const times = rateLimit.get(email) || []
  const recent = times.filter(t => now - t < 3600000) // 1 hora

  if (recent.length >= maxAttempts) {
    return false
  }

  rateLimit.set(email, [...recent, now])
  return true
}
```

### 2. Validación de Email
```typescript
const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
```

### 3. Logs de Auditoría
```typescript
function logPasswordReset(email: string, status: string) {
  console.log(`[${new Date().toISOString()}] Password reset: ${email} - ${status}`)
  // En producción: guardar en base de datos
}
```

---

## 🧪 PRUEBA DE INTEGRACIÓN

### Paso 1: Configurar variables de entorno
```bash
# .env.local
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@tuapp.com
```

### Paso 2: Actualizar código
Reemplazar sendEmailWithOtp en `/app/recuperar-password/page.tsx`

### Paso 3: Probar flujo
1. Ir a /recuperar-password
2. Ingresar email válido
3. Verificar que email llegó
4. Usar código del email para continuar
5. Cambiar contraseña
6. Login con nueva contraseña

### Paso 4: Verificar logs
```bash
npm run dev
# Ver logs en terminal
```

---

## 🐛 TROUBLESHOOTING

### Email no se envía
1. Verificar API Key en .env.local
2. Verificar que email_usuario existe en SendGrid
3. Ver logs del servidor
4. Verificar configuración del firewall

### Email llega tarde
1. Esperar: SendGrid puede tardar 30 seg
2. Revisar carpeta de spam
3. Verificar que email "from" es válido

### Código no coincide
1. Revisar que OTP se guardó bien en localStorage
2. Verificar timestamp de expiración
3. Revisar console.log en navegador

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

- [ ] Crear cuenta en servicio de email
- [ ] Obtener API Key
- [ ] Instalar dependencia (npm install)
- [ ] Crear archivo `/app/api/send-email/route.ts`
- [ ] Configurar .env.local
- [ ] Actualizar `sendEmailWithOtp()` en `/app/recuperar-password/page.tsx`
- [ ] Probar flujo completo
- [ ] Verificar que email llega
- [ ] Verificar que OTP funciona
- [ ] Agregar rate limiting
- [ ] Documentar en README
- [ ] Hacer commit de cambios

---

## 📝 PLANTILLA COMPLETA - sendEmailWithOtp()

```typescript
const sendEmailWithOtp = async (email: string, otp: string) => {
  const otpData = {
    otp: otp,
    email: email,
    timestamp: Date.now(),
    expires: Date.now() + 10 * 60 * 1000,
  }
  localStorage.setItem('passwordResetOtp', JSON.stringify(otpData))

  try {
    // Llamar a API de email
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    })

    if (!response.ok) {
      throw new Error('Error enviando email')
    }

    const data = await response.json()
    console.log('✉️ Email enviado correctamente a:', email)
    setMessage(`Código OTP enviado a ${email}. Revisa tu bandeja de entrada.`)

  } catch (error) {
    console.error('Error:', error)
    setError('Error al enviar el código. Por favor intenta de nuevo.')
  }
}
```

---

## 🚀 PASOS FINALES PARA PRODUCCIÓN

1. **Cambiar dominio "from"** de test a real
2. **Implementar rate limiting**
3. **Agregar notificación de cambio de contraseña**
4. **Hacer pruebas completas**
5. **Actualizar documentación**
6. **Hacer deploy en producción**

---

## 📞 RECURSOS ÚTILES

- SendGrid Docs: https://docs.sendgrid.com
- Resend Docs: https://resend.com/docs
- Nodemailer: https://nodemailer.com
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

**Nota**: Este sistema funciona perfecto en testing sin email real. Solo agregar esta integración cuando esté listo para producción.

