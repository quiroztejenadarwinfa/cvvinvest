# 🔐 Guía Completa de Seguridad - CVVINVEST

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura de Seguridad](#arquitectura-de-seguridad)
3. [Autenticación](#autenticación)
4. [Autorización](#autorización)
5. [Almacenamiento de Datos](#almacenamiento-de-datos)
6. [Comunicaciones](#comunicaciones)
7. [Validaciones](#validaciones)
8. [Recuperación de Contraseña](#recuperación-de-contraseña)
9. [Seguridad del Admin](#seguridad-del-admin)
10. [Mejores Prácticas](#mejores-prácticas)
11. [Checklist de Seguridad](#checklist-de-seguridad)

---

## Introducción

Esta guía documenta los mecanismos de seguridad implementados en la plataforma CVVINVEST para proteger:

- ✅ Cuentas de usuario y contraseñas
- ✅ Datos financieros y balances
- ✅ Transacciones (depósitos y retiros)
- ✅ Información personal
- ✅ Acceso administrativo
- ✅ Validación de operaciones críticas

---

## Arquitectura de Seguridad

### Stack de Seguridad

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│  - Validación de entrada                                 │
│  - Protección XSS                                        │
│  - CSRF tokens (si aplica)                              │
│  - Sanitización de datos                                │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              SESIÓN (localStorage)                       │
│  - Usuario autenticado                                   │
│  - Token de sesión                                       │
│  - Datos temporales                                      │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│         VALIDACIÓN & AUTORIZACIÓN                        │
│  - Verificación de sesión                                │
│  - Control de acceso por plan                           │
│  - Validación de permisos                                │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│        LÓGICA DE NEGOCIO (lib/auth.ts)                  │
│  - Gestión de usuarios                                   │
│  - Verificación de credenciales                         │
│  - Operaciones financieras                               │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│        ALMACENAMIENTO (localStorage)                    │
│  - Base de datos de usuarios                             │
│  - Registro de transacciones                             │
│  - Histórico                                             │
└─────────────────────────────────────────────────────────┘
```

---

## Autenticación

### 1. Autenticación de Usuario Regular

#### Flujo de Login

```
┌──────────┐
│  Login   │ email + password
└────┬─────┘
     │
     ▼
┌──────────────────────────────┐
│ Verificar en localStorage     │ cvvinvest_users
│ cvvinvest_passwords          │
└────┬─────────────────────────┘
     │
     ├─ ✓ Válido ─→ Crear sesión
     │
     └─ ✗ Inválido ─→ Mostrar error

Sesión creada:
└─ localStorage: cvvinvest_user = JSON(user)
└─ Redirigir a /dashboard
```

#### Validaciones de Contraseña

```typescript
// La contraseña debe cumplir:
- Mínimo 6 caracteres (recomendado 8+)
- Idealmente: mayúscula + minúscula + número
```

**Archivo:** `lib/auth.ts` - `loginUser()` función

```typescript
export function loginUser(email: string, password: string): User | null {
  // Recuperar usuarios de localStorage
  const usersData = localStorage.getItem("cvvinvest_users")
  const users = usersData ? JSON.parse(usersData) : []
  
  // Buscar usuario por email
  const user = users.find((u: User) => u.email === email)
  if (!user) return null
  
  // Verificar contraseña
  const passwordsData = localStorage.getItem("cvvinvest_passwords")
  const passwords = passwordsData ? JSON.parse(passwordsData) : {}
  if (passwords[email] !== password) return null
  
  // Crear sesión
  return user
}
```

### 2. Autenticación de Admin

#### Credenciales de Admin

```
Email:    exe.main.darwin@gmail.com
Password: admin12345
```

**Archivo:** `lib/auth.ts`

```typescript
export const ADMIN_EMAIL = "exe.main.darwin@gmail.com"
export const ADMIN_PASSWORD = "admin12345"

export function isAdmin(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}
```

⚠️ **IMPORTANTE EN PRODUCCIÓN:**
- Cambiar credenciales admin inmediatamente
- Usar variables de entorno (no hardcodear)
- Implementar OAuth2 o SAML
- Usar bases de datos seguras con hash de contraseña

### 3. Autenticación de Dos Factores (2FA) - TOTP

#### ¿Qué es TOTP?

Time-based One-Time Password (TOTP) es un algoritmo que genera códigos de 6 dígitos que cambian cada 30 segundos, usado por:
- Google Authenticator
- Microsoft Authenticator
- Authy

#### Implementación 2FA

**Generar Secreto 2FA:**

```typescript
export function generateTwoFactorSecret(userId: string): { 
  secret: string
  qrCode: string 
} {
  // 1. Generar secreto aleatorio (32 bytes)
  const secret = generateRandomSecret(32)
  
  // 2. Generar 10 códigos de respaldo
  const backupCodes = Array.from({ length: 10 }, () =>
    // Formato: XXXX-XXXX-XXXX
    generateBackupCode()
  )
  
  // 3. Crear URL OTPAuth para QR
  const otpauthUrl = `otpauth://totp/CVVINVEST:${email}?secret=${secret}&issuer=CVVINVEST`
  
  // 4. Guardar en localStorage
  localStorage.setItem(`cvvinvest_2fa_${userId}`, JSON.stringify(twoFactorData))
  
  return { secret, qrCode: otpauthUrl }
}
```

**Habilitar 2FA:**

```typescript
export function enableTwoFactor(userId: string, token: string): boolean {
  // 1. Obtener 2FA data
  const twoFactorData = getTwoFactorSecret(userId)
  
  // 2. Verificar token TOTP
  if (!verifyTOTPToken(token, twoFactorData.secret)) {
    return false
  }
  
  // 3. Habilitar 2FA
  twoFactorData.enabled = true
  localStorage.setItem(`cvvinvest_2fa_${userId}`, JSON.stringify(twoFactorData))
  
  return true
}
```

**Verificar TOTP Token:**

```typescript
export async function verifyTOTPToken(
  token: string,
  secret: string
): Promise<boolean> {
  // 1. Obtener token TOTP actual
  const currentToken = await calculateTOTP(secret)
  
  // 2. También aceptar token de hace 30 segundos (ventana)
  const previousTimestamp = Date.now() - 30000
  const previousToken = await calculateTOTP(secret, previousTimestamp)
  
  // 3. Comparar
  return token === currentToken || token === previousToken
}
```

**Códigos de Respaldo:**

```
- 10 códigos generados cuando se activa 2FA
- Cada código solo se puede usar UNA VEZ
- Formato: XXXXXXXX-XXXXXXXX-XXXXXXXX
- Guardados en localStorage
```

---

## Autorización

### 1. Control de Acceso por Plan

Cada usuario tiene un plan que determina qué características puede usar.

**Archivo:** `lib/plan-features.ts`

```typescript
export interface PlanFeatures {
  canDeposit: boolean        // Puede depositar
  canWithdraw: boolean       // Puede retirar (NO para gratuito)
  withdrawalDays: number     // Días para procesar retiro
  canInvest: boolean         // Puede invertir
  canViewReports: boolean    // Puede ver informes
  canViewAnalytics: boolean  // Puede ver analytics
  canHavePersonalAdvisor: boolean
  customizableLimits: boolean
  apiAccess: boolean
  paymentMethods: string[]
}
```

**Planes disponibles:**

| Plan | Depósitos | Retiros | Invertir | Informes | Analytics | Asesor | API |
|------|-----------|---------|----------|----------|-----------|--------|-----|
| 🆓 Gratuito | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 💳 Estándar | ✅ | ✅ (5d) | ✅ | ✅ | ❌ | ❌ | ❌ |
| ⭐ Pro | ✅ | ✅ (3d) | ✅ | ✅ | ✅ | ❌ | ❌ |
| 👑 VIP | ✅ | ✅ (2d) | ✅ | ✅ | ✅ | ✅ | ❌ |
| 💎 Elite | ✅ | ✅ (1d) | ✅ | ✅ | ✅ | ✅ | ✅ |

### 2. Función: canAccessFeature()

**Ubicación:** `lib/plan-features.ts`

```typescript
export function canAccessFeature(
  userPlan: string, 
  feature: string
): boolean {
  const features = getPlanFeatures(userPlan as PlanType)
  
  switch (feature) {
    case "canDeposit":
      return features.canDeposit
    case "canWithdraw":
      return features.canWithdraw
    case "canInvest":
      return features.canInvest
    // ... más validaciones
    default:
      return false
  }
}
```

### 3. Componente: FeatureGuard

**Ubicación:** `components/feature-guard.tsx`

Componente React que protege secciones según el plan del usuario.

```tsx
<FeatureGuard
  user={user}
  feature="canWithdraw"
  featureLabel="Retiros"
>
  {/* Contenido solo visible si puede retirar */}
  <WithdrawalForm />
</FeatureGuard>
```

Si el usuario no tiene acceso, muestra un mensaje de alerta.

### 4. Validación en Páginas Críticas

**Ejemplo - Página de Retiros:**

```tsx
// app/retiros/page.tsx
if (user && !canAccessFeature(user.plan, "canWithdraw")) {
  return (
    <Alert>
      <AlertDescription>
        Los retiros no están disponibles en tu plan actual.
        Actualiza a un plan pago.
      </AlertDescription>
    </Alert>
  )
}
```

---

## Almacenamiento de Datos

### localStorage - Estructura

```javascript
// Usuario actual en sesión
cvvinvest_user = {
  id: "user-001",
  email: "usuario@ejemplo.com",
  name: "Usuario",
  role: "user",
  plan: "gratuito",
  balance: 0,
  createdAt: "2026-01-15T..."
}

// Directorio de usuarios (PÚBLICO)
cvvinvest_users = [
  { id, email, name, role, plan, balance, createdAt },
  ...
]

// Contraseñas (CUIDADO: en localStorage, NUNCA en producción)
cvvinvest_passwords = {
  "usuario@ejemplo.com": "Password123",
  ...
}

// 2FA del usuario
cvvinvest_2fa_${userId} = {
  userId: "user-001",
  secret: "JBSWY3DPEBLW64TMMQQQ====",
  enabled: false,
  backupCodes: ["XXXX-XXXX-XXXX", ...],
  createdAt: "2026-01-15T..."
}

// Depósitos
cvvinvest_deposits = [
  {
    id: "deposit-001",
    userId: "user-001",
    amount: 1000,
    status: "aprobado",
    method: "PayPal",
    createdAt: "2026-01-15T..."
  },
  ...
]

// Retiros
cvvinvest_withdrawals = [
  {
    id: "withdraw-001",
    userId: "user-001",
    amount: 500,
    status: "pendiente",
    method: "Transferencia Bancaria",
    createdAt: "2026-01-15T..."
  },
  ...
]

// Inversiones
cvvinvest_investments = [
  {
    id: "inv-001",
    userId: "user-001",
    amount: 2000,
    investmentType: "Acciones",
    status: "aprobado",
    expectedReturn: 15,
    createdAt: "2026-01-15T..."
  },
  ...
]
```

### ⚠️ Datos NUNCA en localStorage

```
❌ Contraseñas en texto plano
❌ Tokens de API
❌ Números de tarjeta
❌ SSN / Documento de identidad
❌ Información sensible sin encriptación
```

---

## Comunicaciones

### 1. HTTPS/TLS (En Producción)

```
Protocolo: HTTPS (TLS 1.3 mínimo)
Certificado: SSL/TLS válido
Cipher Suites: Modernos y seguros
```

### 2. Headers de Seguridad (En Producción)

**next.config.mjs:**

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        }
      ]
    }
  ]
}
```

### 3. CORS (En Producción)

```typescript
// Solo aceptar requests desde dominio autorizado
const allowedOrigins = [
  'https://cvvinvest.com',
  'https://www.cvvinvest.com'
]

if (!allowedOrigins.includes(req.headers.origin)) {
  return new Response('Forbidden', { status: 403 })
}
```

---

## Validaciones

### 1. Validación de Entrada

**En el Frontend:**

```tsx
// Validación de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) {
  alert("Email inválido")
  return
}

// Validación de cantidad
const amount = parseFloat(withdrawalAmount)
if (amount <= 0 || amount > user.balance) {
  alert("Monto inválido")
  return
}
```

### 2. Validación de Negocio

```typescript
// No permitir retiro si plan no soporta
if (!canAccessFeature(user.plan, "canWithdraw")) {
  throw new Error("Plan no permite retiros")
}

// No permitir retiro mayor al balance
if (amount > user.balance) {
  throw new Error("Balance insuficiente")
}

// Validar método de pago permitido por plan
const planFeatures = getPlanFeatures(user.plan)
if (!planFeatures.paymentMethods.includes(method)) {
  throw new Error("Método de pago no permitido")
}
```

### 3. Sanitización de Datos

```typescript
// Sanitizar nombre de usuario
const sanitizedName = name
  .trim()
  .slice(0, 100)  // Máximo 100 caracteres
  .replace(/[<>]/g, '')  // Remover caracteres peligrosos

// Sanitizar email
const sanitizedEmail = email
  .toLowerCase()
  .trim()
  .slice(0, 255)
```

---

## Recuperación de Contraseña

### Flujo Seguro

```
1. Usuario ingresa email
   ↓
2. Sistema genera OTP (One-Time Password) de 6 caracteres
   - Códigos alfanuméricos
   - Válido por 15 minutos
   ↓
3. Sistema guarda OTP en localStorage (temporal)
   ↓
4. Usuario recibe OTP (en email en producción)
   ↓
5. Usuario ingresa OTP
   ↓
6. Sistema verifica OTP
   - Verificar formato correcto
   - Verificar que no expiró
   - Verificar que pertenece al usuario
   ↓
7. Si válido: permitir reset de contraseña
   ↓
8. Usuario ingresa nueva contraseña
   ↓
9. Sistema actualiza contraseña en localStorage
   ↓
10. Limpiar OTP temporal
```

**Archivo:** `lib/auth.ts`

```typescript
// Generar OTP
export function generatePasswordResetOTP(): {
  otp: string
  expiresAt: number
} {
  const otp = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map(x => {
      // Generar número 0-9 o letra A-Z
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      return chars[x % chars.length]
    })
    .join('')
  
  const expiresAt = Date.now() + 15 * 60 * 1000  // 15 minutos
  
  return { otp, expiresAt }
}

// Verificar OTP
export function verifyPasswordResetOTP(
  email: string,
  otp: string
): boolean {
  const otpData = localStorage.getItem('passwordResetOtp')
  if (!otpData) return false
  
  const { email: storedEmail, otp: storedOTP, expiresAt } = JSON.parse(otpData)
  
  // Verificaciones
  return (
    email === storedEmail &&
    otp === storedOTP &&
    Date.now() < expiresAt
  )
}
```

---

## Seguridad del Admin

### Panel Administrativo

**Ubicación:** `/admin`

**Requisitos de Acceso:**

```typescript
// Verificar que es admin
if (sessionUser.email !== ADMIN_EMAIL || sessionUser.role !== "admin") {
  router.push("/dashboard")
  return
}
```

### Funciones Administrativas Protegidas

| Función | Protección |
|---------|-----------|
| Ver todos los usuarios | ✅ Solo admin |
| Modificar balance | ✅ Solo admin |
| Aprobar/rechazar depósitos | ✅ Solo admin |
| Aprobar/rechazar retiros | ✅ Solo admin |
| Ver historial completo | ✅ Solo admin |
| Cambiar plan de usuario | ✅ Solo admin |
| Ver estadísticas | ✅ Solo admin |
| Gestionar notificaciones | ✅ Solo admin |

### Operaciones Sensitivas

**Aprobar Depósito:**

```typescript
export function approveDeposit(
  depositId: string,
  notes?: string
): boolean {
  // 1. Validar que existe
  const deposit = getDepositById(depositId)
  if (!deposit) return false
  
  // 2. Validar estado actual
  if (deposit.status !== 'pendiente') return false
  
  // 3. Actualizar usuario balance
  const user = getUserById(deposit.userId)
  if (!user) return false
  user.balance += deposit.amount
  updateUser(user)
  
  // 4. Actualizar depósito
  deposit.status = 'aprobado'
  deposit.approvedAt = new Date().toISOString()
  if (notes) deposit.notes = notes
  updateDeposit(deposit)
  
  // 5. Registrar en auditoría (en producción)
  logAdminAction('APPROVE_DEPOSIT', { depositId, adminEmail })
  
  return true
}
```

---

## Mejores Prácticas

### 1. Para Desarrolladores

#### ✅ HACER

```typescript
// ✅ Validar siempre entrada del usuario
function createDeposit(email: string, amount: number) {
  if (!isValidEmail(email)) throw new Error('Email inválido')
  if (amount <= 0) throw new Error('Monto inválido')
  // ...
}

// ✅ Verificar permisos
if (!canAccessFeature(user.plan, 'canWithdraw')) {
  throw new Error('No permitido')
}

// ✅ Sanitizar datos
const name = userInput.trim().slice(0, 100)

// ✅ Usar sesión
const user = getSessionUser()
if (!user) redirect('/login')
```

#### ❌ NO HACER

```typescript
// ❌ Confiar en datos sin validar
function createDeposit(email, amount) {
  // SIN VALIDACIONES
  updateBalance(email, amount)
}

// ❌ Exponer datos sensibles
console.log(password)
return { user, password }

// ❌ Dejar código de seguridad comentado
// if (!isAdmin(user)) return
processAdminAction()

// ❌ Hardcodear secretos
const API_KEY = "sk-1234567890"
```

### 2. Para Usuarios

#### ✅ HACER

```
✅ Usar contraseña fuerte (8+ caracteres)
✅ Usar contraseña única para cada sitio
✅ Habilitar 2FA (Google Authenticator)
✅ Guardar códigos de respaldo 2FA en lugar seguro
✅ Nunca compartir contraseña
✅ Logout cuando termines de usar
✅ Usar conexión segura (HTTPS)
```

#### ❌ NO HACER

```
❌ Usar contraseña débil (123456, password)
❌ Reutilizar contraseña en otros sitios
❌ Dejar sesión abierta en computadora pública
❌ Compartir acceso con otros
❌ Clickear links sospechosos
❌ Usar WiFi público sin VPN
❌ Dejar pantalla desbloqueada
```

### 3. Cambio de Contraseña

**En Producción:**

```typescript
export function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): boolean {
  // 1. Verificar contraseña vieja
  const user = getUserById(userId)
  if (!verifyPassword(oldPassword, user.passwordHash)) {
    return false
  }
  
  // 2. Validar nueva contraseña
  if (!isStrongPassword(newPassword)) {
    return false
  }
  
  // 3. Hashear nueva contraseña
  const hash = hashPassword(newPassword)
  
  // 4. Guardar
  user.passwordHash = hash
  user.passwordChangedAt = new Date()
  updateUser(user)
  
  // 5. Logout de todas las sesiones (opcional)
  invalidateAllSessions(userId)
  
  return true
}
```

---

## Checklist de Seguridad

### Antes de Producción

- [ ] Cambiar credenciales de admin
- [ ] Habilitar HTTPS/TLS
- [ ] Configurar CORS correctamente
- [ ] Añadir headers de seguridad
- [ ] Implementar rate limiting
- [ ] Hashear contraseñas (bcrypt/argon2)
- [ ] Mover secretos a variables de entorno
- [ ] Implementar logging de acceso
- [ ] Configurar backup de datos
- [ ] Test de penetración
- [ ] Auditoría de código
- [ ] Remover logs sensibles
- [ ] Configurar WAF (Web Application Firewall)
- [ ] Implementar monitoring
- [ ] Plan de incidentes de seguridad

### En Desarrollo

- [x] Validación de entrada
- [x] Control de acceso por plan
- [x] 2FA TOTP implementado
- [x] Recuperación de contraseña con OTP
- [x] Logout limpia sesión
- [x] Cambio de contraseña validado
- [x] localStorage limpiado en logout
- [x] Datos sensibles sanitizados
- [x] Permisos por plan verificados
- [x] Admin solo acceso admin

### Monitoreo Continuo

- [ ] Auditar accesos no autorizados
- [ ] Revisar logs de depósitos/retiros
- [ ] Verificar cambios de contraseña
- [ ] Monitorear login fallidos
- [ ] Alertas de actividad sospechosa
- [ ] Backup automático diario
- [ ] Verificación de integridad de datos

---

## Puntos Clave de Seguridad

### 1. Planes y Restricciones

```
🆓 Gratuito: SOLO DEPÓSITOS (no retiros)
💳 Estándar+: Depósitos + Retiros
```

### 2. Sesión de Usuario

```
- Guardada en localStorage
- Se valida en cada página
- Se limpia al logout
- Se regenera al cambiar plan
```

### 3. Autenticación 2FA

```
- TOTP basado en tiempo
- QR code para escanear
- 10 códigos de respaldo
- Ventana de 60 segundos aceptada
```

### 4. Recuperación de Contraseña

```
- OTP de 6 caracteres alfanuméricos
- Válido solo por 15 minutos
- Se valida antes de cambiar contraseña
- Se limpia después de uso
```

### 5. Transacciones Financieras

```
- Validación del monto
- Verificación del balance
- Validación del método de pago
- Aprobación manual del admin
- Notificación al usuario
```

---

## Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad:

1. **NO** abrir issue público
2. **NO** compartir en redes sociales
3. **Contactar:** security@cvvinvest.com
4. Proporcionar detalles técnicos
5. Permitir 48 horas para respuesta
6. Esperamos disclosure responsable

---

## Referencias Externas

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [RFC 6238 - TOTP](https://tools.ietf.org/html/rfc6238)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

## Historial de Cambios

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2026-01-15 | 1.0 | Creación inicial de documentación |

---

**Última actualización:** 15 de enero de 2026

**Versión:** 1.0

**Autor:** CVVINVEST Security Team
