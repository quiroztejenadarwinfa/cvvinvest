# GUÍA DE PRUEBA - SISTEMA DE RECUPERACIÓN DE CONTRASEÑA

## Descripción General
Sistema completo de recuperación de contraseña basado en OTP (One-Time Password) de 6 caracteres alfanuméricos, con validación de email y cambio de contraseña seguro.

## Características Implementadas

### 1. Generación de OTP
- **Formato**: 6 caracteres alfanuméricos (0-9, A-Z)
- **Ejemplo**: `A7X3KM`, `5FJ9L2`, `Q8W2P1`
- **Función**: `generateOtp()` en `/app/recuperar-password/page.tsx`

### 2. Almacenamiento Temporal
- **Clave localStorage**: `passwordResetOtp`
- **Datos guardados**:
  ```json
  {
    "otp": "ABC123",
    "email": "usuario@email.com",
    "timestamp": 1704067200000,
    "expires": 1704068400000
  }
  ```
- **Duración**: 10 minutos

### 3. Validaciones
- ✅ Email debe existir en la base de datos de usuarios
- ✅ OTP debe ser exacto (sin distinción de mayúsculas/minúsculas)
- ✅ OTP no debe estar expirado
- ✅ Contraseña mínimo 8 caracteres
- ✅ Contraseñas deben coincidir
- ✅ Usuario debe ser verificado antes de cambio

### 4. Flujo de Usuarios
```
Login Page
    ↓
¿Olvidaste tu contraseña? (Link a /recuperar-password)
    ↓
PASO 1: Ingresa Email
    ↓ (Genera OTP, guarda en localStorage)
PASO 2: Verifica Código OTP (6 caracteres)
    ↓ (Valida OTP contra localStorage)
PASO 3: Nueva Contraseña (min 8 caracteres)
    ↓ (Actualiza en localStorage['cvvinvest_users'])
PASO 4: Éxito ✓
    ↓ (Limpia OTP, redirige a login)
```

## Cómo Probar

### Prueba 1: Flujo Exitoso Completo

1. **Ir a página de login**
   - URL: `http://localhost:3000/login`

2. **Hacer clic en "¿Olvidaste tu contraseña?"**
   - Debe ir a `/recuperar-password`

3. **Paso 1 - Ingresa email**
   - Email: `test@test.com` (o cualquier usuario existente)
   - Botón: "Enviar Código OTP"
   - Resultado: Debe mostrar mensaje "Código OTP enviado"

4. **Paso 2 - Verifica OTP**
   - Abrir consola del navegador (F12)
   - Buscar en Aplicaciones → Storage → localStorage
   - Buscar `passwordResetOtp`
   - Copiar el campo `"otp"` (ej: "ABC123")
   - Pegar en el campo de código
   - Botón: "Verificar Código"
   - Resultado: Debe pasar a Paso 3

5. **Paso 3 - Nueva Contraseña**
   - Nueva Contraseña: `NuevaPass123`
   - Confirmar: `NuevaPass123`
   - Botón: "Cambiar Contraseña"
   - Resultado: Debe mostrar "¡Contraseña Cambiada!"

6. **Paso 4 - Volver a login**
   - Botón: "Ir al Login"
   - Intentar login con email y nueva contraseña
   - Debe iniciar sesión exitosamente

### Prueba 2: OTP Expirado

1. Iniciar proceso de recuperación
2. Esperar más de 10 minutos (o modificar localStorage con timestamp viejo)
3. Intentar verificar OTP
4. **Resultado esperado**: "El código OTP ha expirado"

### Prueba 3: OTP Incorrecto

1. Iniciar proceso de recuperación
2. Ingresa OTP incorrecto (ej: "XXXXXX")
3. Botón: "Verificar Código"
4. **Resultado esperado**: "Código OTP incorrecto"

### Prueba 4: Email No Existe

1. En paso 1, ingresar email que no existe (ej: `noexiste@email.com`)
2. Botón: "Enviar Código OTP"
3. **Resultado esperado**: "No existe cuenta asociada a este email"

### Prueba 5: Contraseña Muy Corta

1. Completar pasos 1-2 exitosamente
2. En paso 3, ingresar contraseña con menos de 8 caracteres (ej: "short")
3. **Resultado esperado**: "La contraseña debe tener al menos 8 caracteres"

### Prueba 6: Contraseñas No Coinciden

1. Completar pasos 1-2 exitosamente
2. En paso 3:
   - Nueva Contraseña: `Password123`
   - Confirmar Contraseña: `Password456`
3. **Resultado esperado**: "Las contraseñas no coinciden"

### Prueba 7: Volver Atrás

1. En paso 1: Clic en "Volver al login" debe ir a `/login`
2. En paso 2: Clic en "Volver" debe volver a paso 1
3. En paso 3: Clic en "Volver" debe volver a paso 2

## Archivos Modificados

### 1. `/app/login/page.tsx`
- **Cambio**: Link actualizado de `/recuperar` a `/recuperar-password`
- **Línea**: ~142
- **Antes**: `<Link href="/recuperar" ...`
- **Después**: `<Link href="/recuperar-password" ...`

### 2. `/app/recuperar-password/page.tsx`
- **Estado**: Archivo ya existe con implementación completa
- **Características**:
  - 4 pasos: email → otp → password → success
  - OTP de 6 caracteres alfanuméricos
  - Validaciones completas
  - Actualización de contraseña en localStorage

## Base de Datos de Usuarios (localStorage)

**Clave**: `cvvinvest_users`

Estructura de usuario:
```json
{
  "id": "user-001",
  "email": "test@test.com",
  "name": "Test User",
  "password": "TuContraseña123",
  "role": "user",
  "plan": "gratuito",
  "balance": 1000,
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

## Integración de Email Real (TODO)

Actualmente, el OTP se simula en console.log. Para producción:

```typescript
// Reemplazar en handleSendOtp():
// De:
console.log(`📧 Correo simulado enviado a ${email}`)

// A:
await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: email,
    otp: newOtp
  })
})
```

## Seguridad

✅ **Implementado**:
- OTP genera caracteres aleatorios
- Almacenamiento con timestamp de expiración
- Validación de email existente
- Validación de longitud de contraseña
- OTP se limpia después de uso

🔒 **Recomendaciones**:
- Implementar rate limiting (máx 3 intentos por email/hora)
- Enviar OTP por email real (no simular)
- Usar HTTPS en producción
- Considerar agregar pregunta de seguridad
- Implementar notificación de cambio de contraseña

## Prueba de Integración Completa

1. Crear usuario en `/registro`
2. Olvidar contraseña propositalmente
3. Usar `/recuperar-password` para resetear
4. Login con nueva contraseña
5. Verificar que sesión funciona normalmente

## URLs Importantes

| Página | URL |
|--------|-----|
| Login | http://localhost:3000/login |
| Recuperar Contraseña | http://localhost:3000/recuperar-password |
| Registro | http://localhost:3000/registro |
| Dashboard | http://localhost:3000/dashboard |

## Notas

- El sistema usa localStorage, por lo que es específico del navegador/dispositivo
- OTP se almacena de forma simple (en producción, usar servidor)
- Contraseñas se guardan en texto plano en localStorage (usar encriptación en producción)
- Console.log muestra el OTP para testing (remover en producción)

## Estado Actual

✅ **Completado**:
- Página de recuperación creada
- Flujo de 4 pasos implementado
- OTP de 6 caracteres generado
- Validaciones completas
- Link en login actualizado
- Cambio de contraseña guardado
- Sin errores de compilación

🔄 **Pendiente**:
- Integración de servicio de email real
- Rate limiting
- Notificación de cambio de contraseña
- Encriptación de contraseñas

