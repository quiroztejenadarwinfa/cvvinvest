# 🚀 Referencia Rápida de Seguridad - CVVINVEST

**Última actualización:** 15 de enero de 2026

---

## ⚡ Cosas Importantes

### 🔴 NUNCA HACER

```
❌ Guardar contraseña en localStorage sin hashear
❌ Loggear información sensible (password, tokens, SSN)
❌ Confiar en datos sin validar
❌ Usar innerHTML con input de usuario
❌ Hardcodear secretos en código
❌ Ejecutar operaciones sensibles sin validar permisos
❌ Mostrar errores técnicos al usuario
❌ Dejar sesión sin expiración
❌ Permitir retiros en plan gratuito
❌ Sin verificación en cada ruta protegida
```

### 🟢 SIEMPRE HACER

```
✅ Validar TODA entrada de usuario
✅ Verificar autorización en operaciones sensibles
✅ Usar canAccessFeature() antes de permitir features
✅ Sanitizar strings de usuario
✅ Logout limpia completamente la sesión
✅ Verificar sesión válida en rutas protegidas
✅ Usar mensajes genéricos de error
✅ Registrar operaciones críticas (audit log)
✅ Usar FeatureGuard en componentes sensibles
✅ Validar plan del usuario antes de operaciones financieras
```

---

## 🔐 Validaciones Rápidas

### Email
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) {
  throw new Error('Email inválido')
}
```

### Cantidad (Monto)
```typescript
if (typeof amount !== 'number' || amount <= 0 || amount > 1000000) {
  throw new Error('Monto inválido')
}
```

### Contraseña
```typescript
if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
  throw new Error('Contraseña muy débil')
}
```

### Plan
```typescript
const validPlans = ['gratuito', 'estandar', 'pro', 'vip', 'elite']
if (!validPlans.includes(plan)) {
  throw new Error('Plan inválido')
}
```

---

## 🎯 Acceso por Plan

### Plan Gratuito
```
✅ Puede: Depositar
❌ NO puede: Retirar, Invertir, Ver informes
```

### Plan Estándar+
```
✅ Puede: Depositar, Retirar, Invertir, Ver informes
❌ NO puede: Ver analytics (hasta Pro)
```

### Verificar Acceso
```typescript
if (!canAccessFeature(user.plan, 'canWithdraw')) {
  throw new Error('No permitido en tu plan')
}
```

---

## 🔑 Autenticación Rápida

### Login
```typescript
const user = loginUser(email, password)
if (!user) {
  alert('Email o contraseña incorrecta')
  return
}
setSessionUser(user)
```

### Logout
```typescript
function logout() {
  localStorage.removeItem('cvvinvest_user')
  router.push('/login')
}
```

### Verificar Sesión
```typescript
const user = getSessionUser()
if (!user) {
  router.push('/login')
  return
}
```

### Admin Check
```typescript
if (!isAdmin(email, password)) {
  throw new Error('Acceso denegado')
}
```

---

## 🔐 2FA TOTP

### Generar
```typescript
const { secret, qrCode } = generateTwoFactorSecret(userId)
// Mostrar QR a usuario para escanear
```

### Habilitar
```typescript
if (verifyTOTPToken(userToken, secret)) {
  enableTwoFactor(userId, userToken)
  // Guardar códigos de respaldo
}
```

### Verificar
```typescript
if (await verifyTOTPToken(userToken, secret)) {
  // Login exitoso con 2FA
} else {
  alert('Token 2FA inválido')
}
```

---

## 🛡️ Rutas Protegidas

### Rutas Admin
```
/admin/* - Solo si isAdmin()
```

### Rutas con Features
```
/retiros - Requiere canWithdraw
/inversiones - Requiere canInvest
/informes - Requiere canViewReports
/analytics - Requiere canViewAnalytics
```

### Validación
```tsx
<FeatureGuard user={user} feature="canWithdraw">
  {/* Contenido solo si tiene acceso */}
</FeatureGuard>
```

---

## 🔍 Validación de Operaciones Financieras

### Crear Depósito
```typescript
// 1. Validar email
// 2. Validar cantidad
// 3. Validar método
// 4. Buscar usuario
// 5. Verificar canDeposit
// 6. Guardar depósito
```

### Crear Retiro
```typescript
// 1. Validar cantidad
// 2. Verificar canWithdraw
// 3. Verificar balance suficiente
// 4. Validar método
// 5. Guardar retiro
// 6. Notificar admin
```

### Aprobar Operación (Admin)
```typescript
// 1. Verificar que es admin
// 2. Verificar que existe operación
// 3. Verificar estado válido (pendiente)
// 4. Actualizar operación
// 5. Actualizar balance
// 6. Auditar acción
// 7. Notificar usuario
```

---

## 📝 Logging de Seguridad

### Eventos a Loggear
```
✅ LOGIN / LOGOUT
✅ CAMBIO DE CONTRASEÑA
✅ 2FA HABILITADO/DESHABILITADO
✅ DEPÓSITO APROBADO/RECHAZADO
✅ RETIRO APROBADO/RECHAZADO
✅ CAMBIO DE PLAN
✅ ACCESO ADMIN
✅ OPERACIÓN DENEGADA (intentos no autorizados)
```

### NO Loggear
```
❌ Contraseñas
❌ Tokens 2FA
❌ Números de tarjeta
❌ Información personal sensible
```

---

## 🔐 Recuperación de Contraseña

### Generador OTP
```typescript
const { otp, expiresAt } = generatePasswordResetOTP()
// OTP válido por 15 minutos
```

### Verificar OTP
```typescript
if (verifyPasswordResetOTP(email, otp)) {
  // Permitir cambio de contraseña
} else {
  alert('OTP inválido o expirado')
}
```

### Reset Contraseña
```typescript
resetPassword(email, newPassword)
localStorage.removeItem('passwordResetOtp')
```

---

## 🧪 Testing de Seguridad

### Test 2FA
```bash
npx ts-node test-totp.ts
```

### Test Manual
```
1. Login
2. Habilitar 2FA
3. Logout
4. Login con 2FA
5. Verificar acceso
6. Cambiar contraseña
7. Verificar nueva contraseña
```

---

## 📚 Documentación Completa

Para más detalles, revisar:

1. **[GUIA_SEGURIDAD.md](GUIA_SEGURIDAD.md)** - Guía técnica completa
2. **[MEJORES_PRACTICAS_SEGURIDAD.md](MEJORES_PRACTICAS_SEGURIDAD.md)** - Ejemplos de código
3. **[CHECKLIST_SEGURIDAD.md](CHECKLIST_SEGURIDAD.md)** - Checklist de implementación

---

## 🎯 Checklist Rápido

### Antes de Implementar Feature

- [ ] ¿Validé toda entrada de usuario?
- [ ] ¿Verifiqué autorización?
- [ ] ¿Usé canAccessFeature()?
- [ ] ¿Saniticé strings?
- [ ] ¿Usé FeatureGuard si es UI sensible?
- [ ] ¿Registré para auditoría?
- [ ] ¿Mostré mensajes seguros?
- [ ] ¿Limpié datos sensibles?

### Antes de Hacer Merge

- [ ] ¿Pasó code review de seguridad?
- [ ] ¿No tiene secrets en código?
- [ ] ¿No loggea información sensible?
- [ ] ¿Validaciones completadas?
- [ ] ¿Tests de seguridad pasaron?
- [ ] ¿Documentación actualizada?

---

## 🚨 Emergencias de Seguridad

### Si encuentras vulnerabilidad

1. **NO** publicar en redes sociales
2. **NO** abrir issue público
3. **Contactar:** security@cvvinvest.com
4. Proporcionar detalles técnicos
5. Dar 48 horas para respuesta

### Si hay breach

1. Cambiar todas las contraseñas
2. Habilitar 2FA si no está activo
3. Revisar actividad reciente
4. Contactar administrador

---

## 📊 Nivel de Seguridad Actual

```
Autenticación:   ⭐⭐⭐⭐⭐ (5/5)
Autorización:    ⭐⭐⭐⭐⭐ (5/5)
Validación:      ⭐⭐⭐⭐⭐ (5/5)
Almacenamiento:  ⭐⭐⭐⭐☆ (4/5) - Necesita BD
Encriptación:    ⭐⭐⭐☆☆ (3/5) - Necesita TLS
Logging:         ⭐⭐⭐⭐☆ (4/5) - Parcial
─────────────────────────────────────
PROMEDIO:        ⭐⭐⭐⭐☆ (4/5 estrellas)
```

---

## 🎓 Aprender Más

### Estándares Mencionados

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [RFC 6238 - TOTP](https://tools.ietf.org/html/rfc6238)
- [NIST Cybersecurity](https://www.nist.gov/cyberframework)

### Herramientas Útiles

- **Google Authenticator** - Para 2FA
- **Burp Suite** - Para testing
- **OWASP ZAP** - Para scanning
- **bcrypt** - Para hashear contraseñas
- **jsonwebtoken** - Para JWT

---

## ✨ Tips Finales

### Desarrollo Seguro

```
1. Pensar primero en seguridad
2. Validar, validar, validar
3. Confiar en documentación
4. Revisar código con pares
5. Testear casos extremos
6. Loggear lo importante
7. Actualizar dependencias
8. Mantenerse educado
```

### En Producción

```
1. HTTPS obligatorio
2. Rate limiting activo
3. Backups diarios
4. Monitoring 24/7
5. Alertas de anomalías
6. Logs auditables
7. Planes de respuesta
8. Cumplimiento regulatorio
```

---

**Preguntas frecuentes? → Ver [GUIA_SEGURIDAD.md](GUIA_SEGURIDAD.md)**

**¿Cómo implemento? → Ver [MEJORES_PRACTICAS_SEGURIDAD.md](MEJORES_PRACTICAS_SEGURIDAD.md)**

**¿Qué está hecho? → Ver [CHECKLIST_SEGURIDAD.md](CHECKLIST_SEGURIDAD.md)**
