# 🛡️ Mejores Prácticas de Seguridad para Desarrolladores

## Tabla de Contenidos

1. [Validación de Entrada](#validación-de-entrada)
2. [Control de Acceso](#control-de-acceso)
3. [Gestión de Sesiones](#gestión-de-sesiones)
4. [Manejo de Errores](#manejo-de-errores)
5. [Logs y Auditoría](#logs-y-auditoría)
6. [Code Review Checklist](#code-review-checklist)
7. [Ejemplos de Código Seguro](#ejemplos-de-código-seguro)
8. [Ejemplos de Código Inseguro](#ejemplos-de-código-inseguro)

---

## Validación de Entrada

### Regla #1: NUNCA confiar en datos del usuario

```typescript
// ❌ INSEGURO - Sin validación
async function createDeposit(email: string, amount: number) {
  const user = users.find(u => u.email === email)
  user.balance += amount
  return user
}

// ✅ SEGURO - Con validación completa
async function createDeposit(email: string, amount: number) {
  // 1. Validar email
  if (!isValidEmail(email)) {
    throw new Error('Email inválido')
  }
  
  // 2. Validar cantidad
  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error('Monto debe ser un número positivo')
  }
  
  // 3. Validar máximo
  if (amount > 1000000) {
    throw new Error('Monto excede límite máximo')
  }
  
  // 4. Buscar usuario
  const user = users.find(u => u.email === email)
  if (!user) {
    throw new Error('Usuario no encontrado')
  }
  
  // 5. Ejecutar
  user.balance += amount
  return user
}
```

### Validadores Útiles

```typescript
// Email
function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email) && email.length <= 255
}

// Número (monto)
function isValidAmount(amount: any): boolean {
  return (
    typeof amount === 'number' &&
    !isNaN(amount) &&
    isFinite(amount) &&
    amount > 0 &&
    amount <= 1000000
  )
}

// Nombre
function isValidName(name: string): boolean {
  return (
    typeof name === 'string' &&
    name.trim().length > 0 &&
    name.length <= 100 &&
    !/[<>{}\"'/]/.test(name)  // Sin caracteres peligrosos
  )
}

// Contraseña
function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&      // Al menos una mayúscula
    /[a-z]/.test(password) &&      // Al menos una minúscula
    /[0-9]/.test(password)         // Al menos un número
  )
}

// Plan
function isValidPlan(plan: string): boolean {
  const validPlans = ['gratuito', 'estandar', 'pro', 'vip', 'elite']
  return validPlans.includes(plan)
}

// Método de pago
function isValidPaymentMethod(method: string): boolean {
  const validMethods = [
    'PayPal',
    'Transferencia Bancaria',
    'Tarjeta de Crédito'
  ]
  return validMethods.includes(method)
}
```

### Sanitización de Entrada

```typescript
function sanitizeString(input: any): string {
  // Asegurar que es string
  if (typeof input !== 'string') {
    throw new Error('Input debe ser string')
  }
  
  return input
    .trim()                              // Remover espacios
    .slice(0, 1000)                      // Limitar longitud
    .replace(/[<>{}\"']/g, '')           // Remover caracteres HTML
    .replace(/javascript:/gi, '')        // Remover javascript:
    .replace(/on\w+=/gi, '')             // Remover event handlers
}

function sanitizeEmail(email: string): string {
  return sanitizeString(email).toLowerCase()
}

function sanitizeName(name: string): string {
  const sanitized = sanitizeString(name)
  if (!isValidName(sanitized)) {
    throw new Error('Nombre inválido')
  }
  return sanitized
}
```

---

## Control de Acceso

### Regla #2: Verificar permisos en cada operación

```typescript
// ❌ INSEGURO - Sin verificación de permisos
function approveDeposit(depositId: string) {
  const deposit = deposits.find(d => d.id === depositId)
  deposit.status = 'aprobado'
  return deposit
}

// ✅ SEGURO - Con verificación de permisos
function approveDeposit(
  depositId: string,
  adminUser: User
): Deposit {
  // 1. Verificar que es admin
  if (adminUser.role !== 'admin') {
    throw new Error('No autorizado: se requiere rol admin')
  }
  
  // 2. Verificar que existe
  const deposit = deposits.find(d => d.id === depositId)
  if (!deposit) {
    throw new Error('Depósito no encontrado')
  }
  
  // 3. Verificar estado válido
  if (deposit.status !== 'pendiente') {
    throw new Error('Solo depósitos pendientes pueden ser aprobados')
  }
  
  // 4. Ejecutar operación
  deposit.status = 'aprobado'
  
  // 5. Registrar auditoría
  logAdminAction({
    admin: adminUser.email,
    action: 'APPROVE_DEPOSIT',
    depositId,
    timestamp: new Date()
  })
  
  return deposit
}
```

### FeatureGuard - Control de Acceso por Plan

```typescript
// ✅ Usar FeatureGuard en componentes
<FeatureGuard
  user={user}
  feature="canWithdraw"
  featureLabel="Retiros"
>
  {/* Solo visible si puede retirar */}
  <WithdrawalForm user={user} />
</FeatureGuard>

// ✅ Validar en lógica de negocio
if (!canAccessFeature(user.plan, 'canWithdraw')) {
  throw new Error('Tu plan no permite retiros')
}

// ❌ NO hacer esto
if (user.plan === 'estandar') {  // Hardcodear planes = frágil
  // ...
}
```

### Función: canAccessFeature()

```typescript
import { canAccessFeature } from '@/lib/plan-features'

// Usar en toda lógica de negocio sensible
function createWithdrawal(user: User, amount: number) {
  // Validar acceso
  if (!canAccessFeature(user.plan, 'canWithdraw')) {
    throw new Error('Retiros no disponibles en tu plan')
  }
  
  // Continuar...
  return createWithdrawal(user.id, amount)
}
```

---

## Gestión de Sesiones

### Regla #3: Validar sesión en rutas protegidas

```typescript
// ❌ INSEGURO - Sin validación
export default function DashboardPage() {
  const user = getSessionUser()
  return <Dashboard user={user} />
}

// ✅ SEGURO - Con validación
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Obtener usuario
    const sessionUser = getSessionUser()
    
    // Validar que existe
    if (!sessionUser) {
      router.push('/login')
      return
    }
    
    // Validar que no está expirado
    const createdAt = new Date(sessionUser.createdAt).getTime()
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000  // 24 horas
    
    if (now - createdAt > maxAge) {
      clearSession()
      router.push('/login')
      return
    }
    
    setUser(sessionUser)
    setLoading(false)
  }, [router])
  
  if (loading) return <LoadingSpinner />
  if (!user) return null
  
  return <Dashboard user={user} />
}
```

### Logout Seguro

```typescript
// ✅ SEGURO - Limpia completamente
export function logoutUser(): void {
  // Limpiar todos los datos de sesión
  localStorage.removeItem('cvvinvest_user')
  localStorage.removeItem('admin_session')
  localStorage.removeItem('passwordResetOtp')
  localStorage.removeItem('passwordResetToken')
  
  // Limpiar cualquier dato sensible temporal
  sessionStorage.clear()
  
  // Opcional: Limpiar cookies
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
  })
}
```

---

## Manejo de Errores

### Regla #4: No exponer detalles técnicos en errores

```typescript
// ❌ INSEGURO - Expone información sensible
try {
  const user = findUserByEmail(email)
  const withdrawal = createWithdrawal(user, amount)
} catch (error) {
  console.log(error.message)  // Logging expuesto
  console.log(error.stack)    // Stack trace expuesto
  alert(error.message)        // Usuario ve detalles técnicos
}

// ✅ SEGURO - Mensajes genéricos
try {
  const user = findUserByEmail(email)
  if (!user) {
    // Log para admin (nunca para usuario)
    logAdminError('User not found', { email })
    // Mensaje genérico para usuario
    throw new Error('GENERIC_ERROR')
  }
  
  const withdrawal = createWithdrawal(user, amount)
} catch (error) {
  // Log solo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error(error)
  } else {
    // En producción, usar servicio de logging
    logToService({
      level: 'error',
      message: 'Withdrawal creation failed',
      userId: user?.id,
      timestamp: new Date()
    })
  }
  
  // Mostrar mensaje genérico
  alert('Operación fallida. Por favor intenta de nuevo.')
}
```

### Manejo de Errores de Validación

```typescript
// ✅ Proporcionar feedback útil sin exponer detalles
function validateEmail(email: string) {
  const errors: string[] = []
  
  if (!email) {
    errors.push('Email es requerido')
  } else if (!isValidEmail(email)) {
    errors.push('Email inválido')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Usar en formularios
const validation = validateEmail(userEmail)
if (!validation.isValid) {
  validation.errors.forEach(error => {
    showFieldError('email', error)
  })
}
```

---

## Logs y Auditoría

### Regla #5: Registrar operaciones sensibles

```typescript
// ✅ Auditoría de operaciones críticas
interface AuditLog {
  timestamp: string
  action: string
  userId: string
  adminId?: string
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  success: boolean
  error?: string
}

function logAuditEvent(log: AuditLog) {
  // En desarrollo: localStorage
  if (process.env.NODE_ENV === 'development') {
    const logs = JSON.parse(
      localStorage.getItem('audit_logs') || '[]'
    )
    logs.push(log)
    localStorage.setItem('audit_logs', JSON.stringify(logs))
  }
  
  // En producción: enviar a servidor
  else {
    fetch('/api/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    })
  }
}

// Ejemplos de uso
function approveDeposit(depositId: string, adminId: string) {
  try {
    const deposit = deposits.find(d => d.id === depositId)
    deposit.status = 'aprobado'
    
    logAuditEvent({
      timestamp: new Date().toISOString(),
      action: 'APPROVE_DEPOSIT',
      adminId,
      details: { depositId, amount: deposit.amount },
      success: true
    })
  } catch (error) {
    logAuditEvent({
      timestamp: new Date().toISOString(),
      action: 'APPROVE_DEPOSIT',
      adminId,
      details: { depositId },
      success: false,
      error: error.message
    })
    throw error
  }
}
```

### Eventos a Auditar

```typescript
const AUDIT_EVENTS = {
  // Autenticación
  LOGIN_SUCCESS: 'Usuario login exitoso',
  LOGIN_FAILED: 'Fallo de login',
  LOGOUT: 'Usuario logout',
  PASSWORD_CHANGED: 'Contraseña cambiada',
  PASSWORD_RESET: 'Password reset',
  
  // 2FA
  '2FA_ENABLED': '2FA habilitado',
  '2FA_DISABLED': '2FA deshabilitado',
  '2FA_VERIFIED': 'Token 2FA verificado',
  
  // Finanzas
  DEPOSIT_CREATED: 'Depósito creado',
  DEPOSIT_APPROVED: 'Depósito aprobado',
  DEPOSIT_REJECTED: 'Depósito rechazado',
  WITHDRAWAL_CREATED: 'Retiro creado',
  WITHDRAWAL_APPROVED: 'Retiro aprobado',
  WITHDRAWAL_REJECTED: 'Retiro rechazado',
  
  // Admin
  PLAN_CHANGED: 'Plan cambiado',
  USER_MODIFIED: 'Usuario modificado',
  ADMIN_ACCESSED: 'Admin accedió panel',
  SUSPICIOUS_ACTIVITY: 'Actividad sospechosa detectada'
}
```

---

## Code Review Checklist

Usar cuando revises código de otros desarrolladores:

### Seguridad

- [ ] ¿Se valida toda entrada de usuario?
- [ ] ¿Se verifica autorización antes de operaciones sensibles?
- [ ] ¿Se sanitizan strings de usuario?
- [ ] ¿Se evita hardcodear secretos?
- [ ] ¿Se limpian sesiones al logout?
- [ ] ¿Se evita SQL injection/XSS?
- [ ] ¿Se usan HTTPS para comunicaciones?
- [ ] ¿Se encriptan datos sensibles?

### Validación

- [ ] ¿Se valida tipo de dato?
- [ ] ¿Se valida longitud?
- [ ] ¿Se valida formato (email, número, etc)?
- [ ] ¿Se valida rango de valores?
- [ ] ¿Se maneja null/undefined?

### Control de Acceso

- [ ] ¿Se verifica autenticación en rutas protegidas?
- [ ] ¿Se verifica autorización por plan?
- [ ] ¿Se verifica rol (admin/user)?
- [ ] ¿Se usa FeatureGuard en componentes?
- [ ] ¿Se valida permisos en lógica de negocio?

### Manejo de Errores

- [ ] ¿Se capturan excepciones?
- [ ] ¿Se registran errores (logs)?
- [ ] ¿Se muestran mensajes útiles sin exponer detalles?
- [ ] ¿Se recupera gracefully de errores?

### Datos Sensibles

- [ ] ¿Se evita loggear contraseñas?
- [ ] ¿Se evita loggear tokens?
- [ ] ¿Se evita exponer información personal?
- [ ] ¿Se limpia data sensible después de usar?

---

## Ejemplos de Código Seguro

### Crear Depósito de Forma Segura

```typescript
interface CreateDepositRequest {
  email: string
  amount: number
  method: string
}

async function createDeposit(
  request: CreateDepositRequest,
  currentUser: User
): Promise<Deposit> {
  const { email, amount, method } = request
  
  // 1. VALIDAR INPUT
  if (!isValidEmail(email)) {
    throw new ValidationError('Email inválido')
  }
  
  if (!isValidAmount(amount)) {
    throw new ValidationError('Monto inválido')
  }
  
  if (!isValidPaymentMethod(method)) {
    throw new ValidationError('Método no válido')
  }
  
  // 2. BUSCAR USUARIO
  const user = findUserByEmail(email)
  if (!user) {
    throw new NotFoundError('Usuario no encontrado')
  }
  
  // 3. VALIDAR AUTORIZACIÓN (puede el usuario crear depósito)
  if (!canAccessFeature(user.plan, 'canDeposit')) {
    throw new UnauthorizedError('Plan no permite depósitos')
  }
  
  // 4. VALIDAR MÉTODO PERMITIDO
  const planFeatures = getPlanFeatures(user.plan)
  if (!planFeatures.paymentMethods.includes(method)) {
    throw new ValidationError('Método no permitido en tu plan')
  }
  
  // 5. CREAR DEPÓSITO
  const deposit: Deposit = {
    id: generateId(),
    userId: user.id,
    userEmail: email,
    userName: user.name,
    amount,
    method,
    status: 'pendiente',
    createdAt: new Date().toISOString()
  }
  
  // 6. GUARDAR
  const deposits = getDeposits()
  deposits.push(deposit)
  saveDeposits(deposits)
  
  // 7. NOTIFICAR
  createUserNotification(user.id, {
    type: 'deposit_created',
    title: 'Depósito Solicitado',
    message: `Depósito de $${amount} pendiente de aprobación`,
    details: { depositId: deposit.id, amount }
  })
  
  // 8. AUDITAR
  logAuditEvent({
    timestamp: new Date().toISOString(),
    action: 'DEPOSIT_CREATED',
    userId: user.id,
    details: { depositId: deposit.id, amount, method },
    success: true
  })
  
  return deposit
}
```

### Cambiar Plan de Forma Segura

```typescript
async function changePlan(
  targetUserId: string,
  newPlan: string,
  adminUser: User
): Promise<User> {
  // 1. VALIDAR QUE ES ADMIN
  if (adminUser.role !== 'admin') {
    throw new UnauthorizedError('Solo admin puede cambiar planes')
  }
  
  // 2. VALIDAR PLAN VÁLIDO
  if (!isValidPlan(newPlan)) {
    throw new ValidationError(`Plan ${newPlan} no existe`)
  }
  
  // 3. BUSCAR USUARIO TARGET
  const user = getUserById(targetUserId)
  if (!user) {
    throw new NotFoundError('Usuario no encontrado')
  }
  
  // 4. VERIFICAR CAMBIO VÁLIDO
  const oldPlan = user.plan
  if (oldPlan === newPlan) {
    throw new ValidationError('Usuario ya tiene ese plan')
  }
  
  // 5. APLICAR CAMBIO
  user.plan = newPlan
  updateUser(user)
  
  // 6. NOTIFICAR AL USUARIO
  createUserNotification(user.id, {
    type: 'plan_changed',
    title: 'Plan Actualizado',
    message: `Tu plan fue actualizado a ${newPlan}`,
    details: { oldPlan, newPlan }
  })
  
  // 7. AUDITAR
  logAuditEvent({
    timestamp: new Date().toISOString(),
    action: 'PLAN_CHANGED',
    adminId: adminUser.id,
    userId: targetUserId,
    details: { oldPlan, newPlan },
    success: true
  })
  
  return user
}
```

---

## Ejemplos de Código Inseguro

### ❌ Retiro SIN Validación

```typescript
// ❌ INSEGURO - NO HACER ESTO
function createWithdrawal(email: string, amount: number) {
  // Sin validar email
  // Sin validar amount
  // Sin validar plan
  // Sin verificar balance
  
  const user = users.find(u => u.email === email)
  user.balance -= amount
  
  return { status: 'success' }
}

// Problemas:
// - ¿Qué si email no existe?
// - ¿Qué si amount es negativo?
// - ¿Qué si el plan no permite retiros?
// - ¿Qué si no hay balance suficiente?
// - ¿Qué si es admin haciéndolo?
```

### ❌ Depósito Aprobado por Cualquiera

```typescript
// ❌ INSEGURO - NO HACER ESTO
function approveDeposit(depositId: string) {
  const deposit = deposits.find(d => d.id === depositId)
  // Sin verificar que quien llama es admin
  // Sin verificar que depósito está pendiente
  // Sin validar monto
  
  const user = users.find(u => u.id === deposit.userId)
  user.balance += deposit.amount
  deposit.status = 'aprobado'
  
  return deposit
}

// Problemas:
// - Cualquiera puede aprobar depósitos
// - Sin auditoría de quién lo hizo
// - Sin validaciones de negocio
// - Sin notificaciones
```

### ❌ Contraseña en Log

```typescript
// ❌ INSEGURO - NO HACER ESTO
function loginUser(email: string, password: string) {
  console.log(`Login: ${email}:${password}`)  // ❌ EXPONE CONTRASEÑA
  
  const user = users.find(u => u.email === email)
  if (!user || users[email] !== password) {  // Sin validar
    console.error(`Login failed: ${email}:${password}`)  // ❌ MÁS EXPOSICIÓN
  }
  
  return user
}

// Problemas:
// - Contraseña en logs
// - Expuesto en browser console
// - Guardado en archivos de log
// - Accesible a desarrolladores
```

### ❌ Inyección XSS

```typescript
// ❌ INSEGURO - NO HACER ESTO
function displayUserMessage(name: string) {
  document.getElementById('message').innerHTML = 
    `Bienvenido ${name}`  // ❌ innerHTML con input del usuario
}

// Si name = "<script>alert('hacked')</script>"
// Se ejecuta el script malicioso

// ✅ SEGURO - Usar React o textContent
function displayUserMessage(name: string) {
  const element = document.getElementById('message')
  element.textContent = `Bienvenido ${name}`  // ✅ Seguro
}

// O en React
return <div>Bienvenido {name}</div>  // ✅ React escapa automáticamente
```

### ❌ Hardcodear Secretos

```typescript
// ❌ INSEGURO - NO HACER ESTO
const ADMIN_PASSWORD = "admin12345"  // En código
const API_KEY = "sk_live_1234567890"  // En código
const DATABASE_URL = "postgresql://user:pass@host/db"  // En código

// Problemas:
// - Visible en control de versión (git)
// - Visible para todos los desarrolladores
// - Expuesto si repositorio es público
// - No se puede cambiar sin actualizar código

// ✅ SEGURO - Usar variables de entorno
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const API_KEY = process.env.API_KEY
const DATABASE_URL = process.env.DATABASE_URL
```

---

## Resumen de Mejores Prácticas

1. **Validar TODO input de usuario**
   - Email, números, strings, etc
   - Validar formato, longitud, rango
   - Sanitizar caracteres peligrosos

2. **Verificar autorización en cada operación**
   - Verificar autenticación
   - Verificar rol (admin/user)
   - Verificar plan (features)
   - Auditar acciones

3. **Proteger datos sensibles**
   - No loggear contraseñas
   - No exponer errores técnicos
   - Limpiar sesión al logout
   - Usar HTTPS en producción

4. **Manejar errores gracefully**
   - Capturar excepciones
   - Registrar para admin
   - Mostrar mensajes genéricos
   - Recuperarse sin exponer detalles

5. **Mantener auditoría**
   - Registrar operaciones críticas
   - Incluir quién, qué, cuándo
   - Almacenar en lugar seguro
   - Revisar regularmente

---

**Última actualización:** 15 de enero de 2026

**Versión:** 1.0
