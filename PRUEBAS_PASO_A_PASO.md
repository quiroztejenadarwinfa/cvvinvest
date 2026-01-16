# GUÍA PASO A PASO - PRUEBAS DEL SISTEMA DE RECUPERACIÓN

## 🎯 Objetivo
Verificar que el sistema de recuperación de contraseña funciona correctamente en todas sus etapas.

---

## 📋 PREPARACIÓN

### Paso 0.1: Asegurar que hay usuarios en la base de datos
1. Abrir http://localhost:3000/registro
2. Crear usuario de prueba:
   - Email: `test@test.com`
   - Nombre: `Test User`
   - Contraseña: `Password123`
3. Hacer clic en "Crear Cuenta"
4. Ir a http://localhost:3000/login

---

## 🧪 PRUEBA 1: FLUJO COMPLETO EXITOSO

### Paso 1.1: Acceder a recuperación de contraseña
1. En `/login`, buscar el enlace "¿Olvidaste tu contraseña?"
2. Hacer clic en el enlace
3. **Verificar**: Debe ir a `/recuperar-password`
4. **Verificar**: Debe mostrar formulario para ingresar email

### Paso 1.2: Ingresar email
1. Campo "Email": Ingresar `test@test.com`
2. Botón: "Enviar Código OTP"
3. **Verificar**: Botón muestra "Enviando..." mientras se procesa
4. **Verificar**: Después de 2 segundos, debe mostrar mensaje "Código OTP enviado"

### Paso 1.3: Ver el código OTP (Testing)
1. Abrir Console del navegador (F12 → Console)
2. Buscar mensaje como: `🔐 Código OTP: ABC123`
3. **COPIAR el código OTP** (ej: ABC123)

### Paso 1.4: Verificar OTP
1. Página debe mostrar "VERIFICAR CÓDIGO"
2. Campo "Código OTP": Pegar el código copiado
3. **Verificar**: Código aparece en MAYÚSCULAS
4. Botón: "Verificar Código"
5. **Verificar**: Botón muestra "Verificando..."
6. **Verificar**: Avanza a siguiente paso

### Paso 1.5: Ingresar nueva contraseña
1. Página debe mostrar "NUEVA CONTRASEÑA"
2. Campo "Nueva Contraseña": Ingresar `NuevaPassword123`
3. Campo "Confirmar Contraseña": Ingresar `NuevaPassword123`
4. Botón: "Cambiar Contraseña"
5. **Verificar**: Botón muestra "Cambiando..."

### Paso 1.6: Éxito
1. Página debe mostrar "¡CONTRASEÑA CAMBIADA!"
2. Debe haber ✓ de confirmación
3. Botón: "Ir al Login"
4. Hacer clic

### Paso 1.7: Verificar nuevo login
1. Debe estar en `/login`
2. Email: `test@test.com`
3. Contraseña: `NuevaPassword123`
4. Botón: "Iniciar Sesión"
5. **Verificar**: Debe iniciar sesión exitosamente
6. **Verificar**: Debe ir a `/dashboard`

---

## 🧪 PRUEBA 2: OTP INCORRECTO

### Paso 2.1: Iniciar recuperación
1. Ir a `/login`
2. Clic en "¿Olvidaste tu contraseña?"
3. Email: `test@test.com`
4. Botón: "Enviar Código OTP"

### Paso 2.2: Ver OTP verdadero
1. Abrir Console (F12)
2. Ver código OTP (ej: `ABC123`)
3. **NO USAR ESTE CÓDIGO** - Usar uno diferente

### Paso 2.3: Ingresa OTP incorrecto
1. Campo "Código OTP": Ingresar `XXXXXX` (diferente al real)
2. Botón: "Verificar Código"
3. **RESULTADO ESPERADO**: 
   - Debe mostrar error: "Código OTP incorrecto"
   - Debe permanecer en paso 2
   - Debe permitir intentar de nuevo

### Paso 2.4: Volver atrás
1. Botón: "Volver"
2. **Verificar**: Vuelve a paso 1 (ingreso de email)

---

## 🧪 PRUEBA 3: OTP EXPIRADO

### Paso 3.1: Iniciar recuperación
1. Ir a `/login`
2. Clic en "¿Olvidaste tu contraseña?"
3. Email: `test@test.com`
4. Botón: "Enviar Código OTP"

### Paso 3.2: Esperar expiración
1. **ESPERAR 10 MINUTOS** (o simular: ver paso 3.3)
2. Campo "Código OTP": Ingresar el código que viste
3. Botón: "Verificar Código"
4. **RESULTADO ESPERADO**: Error "El código OTP ha expirado"

### Paso 3.3: Simular expiración (sin esperar 10 min)
1. Abrir Console (F12)
2. Ejecutar:
   ```javascript
   let otp = JSON.parse(localStorage.getItem('passwordResetOtp'));
   otp.expires = Date.now() - 1000; // Expirado hace 1 segundo
   localStorage.setItem('passwordResetOtp', JSON.stringify(otp));
   ```
3. Intentar verificar OTP
4. **RESULTADO ESPERADO**: Error "El código OTP ha expirado"

---

## 🧪 PRUEBA 4: EMAIL NO EXISTE

### Paso 4.1: Intentar recuperar email inexistente
1. Ir a `/login`
2. Clic en "¿Olvidaste tu contraseña?"
3. Email: `noexiste@email.com`
4. Botón: "Enviar Código OTP"
5. **RESULTADO ESPERADO**: Error "No existe cuenta asociada a este email"

### Paso 4.2: Verificar que no envía OTP
1. Abrir Console (F12)
2. **Verificar**: NO debe haber mensaje de "Código OTP: ..."
3. localStorage NO debe contener `passwordResetOtp`

---

## 🧪 PRUEBA 5: CONTRASEÑA MUY CORTA

### Paso 5.1: Completar pasos 1-2
1. Email: `test@test.com`
2. Generar OTP
3. Verificar OTP correctamente
4. Llegar a paso 3 ("NUEVA CONTRASEÑA")

### Paso 5.2: Ingresar contraseña corta
1. Campo "Nueva Contraseña": Ingresar `short` (4 caracteres)
2. Campo "Confirmar": Ingresar `short`
3. Botón: "Cambiar Contraseña"
4. **RESULTADO ESPERADO**: Error "Mínimo 8 caracteres"

### Paso 5.3: Verificar que no cambió contraseña
1. Abrir Console (F12)
2. Ejecutar:
   ```javascript
   JSON.parse(localStorage.getItem('cvvinvest_users')).find(u => u.email === 'test@test.com').password
   ```
3. Contraseña debe ser la anterior, no "short"

---

## 🧪 PRUEBA 6: CONTRASEÑAS NO COINCIDEN

### Paso 6.1: Completar pasos 1-2
1. Email: `test@test.com`
2. Generar OTP
3. Verificar OTP
4. Llegar a paso 3

### Paso 6.2: Ingresar contraseñas diferentes
1. Campo "Nueva Contraseña": Ingresar `Password123`
2. Campo "Confirmar": Ingresar `Password456`
3. Botón: "Cambiar Contraseña"
4. **RESULTADO ESPERADO**: Error "Las contraseñas no coinciden"

### Paso 6.3: Corregir y continuar
1. Campo "Nueva Contraseña": `Password123`
2. Campo "Confirmar": `Password123`
3. Botón: "Cambiar Contraseña"
4. **Debe funcionar ahora**

---

## 🧪 PRUEBA 7: VALIDACIONES DE EMAIL

### Prueba 7.1: Email vacío
1. Campo "Email": Dejar vacío
2. Botón: "Enviar Código OTP"
3. **RESULTADO**: HTML validation (no debe permitir submit)

### Prueba 7.2: Email sin @
1. Campo "Email": Ingresar `testgmail.com` (sin @)
2. Botón: "Enviar Código OTP"
3. **RESULTADO**: HTML validation

### Prueba 7.3: Email válido pero no existe
1. Campo "Email": Ingresar `otro@email.com`
2. Botón: "Enviar Código OTP"
3. **RESULTADO**: Error "No existe cuenta asociada a este email"

---

## 🧪 PRUEBA 8: NAVEGACIÓN Y VOLVER ATRÁS

### Paso 8.1: Desde paso 1
1. Ir a `/recuperar-password`
2. Enlace: "← Volver a iniciar sesión"
3. **Debe ir a** `/login`

### Paso 8.2: Desde paso 2
1. Completar paso 1 (enviar OTP)
2. En paso 2, botón: "Volver"
3. **Debe ir a** paso 1
4. **Verificar**: Email permanece llenado
5. Botón: "Enviar Código OTP" (genera nuevo OTP)
6. **Verificar**: Nuevo OTP es diferente al anterior

### Paso 8.3: Desde paso 3
1. Completar pasos 1-2
2. En paso 3, botón: "Volver"
3. **Debe ir a** paso 2
4. **Verificar**: Campo OTP está vacío
5. Botón: "Volver"
6. **Debe ir a** paso 1

---

## 📊 CHECKLIST DE VERIFICACIÓN

### Flujo General
- [ ] Link en login funciona
- [ ] 4 pasos se muestran en orden correcto
- [ ] Mensajes de error son claros
- [ ] Botones muestran estados (Enviando, Verificando, etc.)
- [ ] Se puede volver atrás desde cualquier paso

### Paso 1: Email
- [ ] Validación HTML de email
- [ ] Rechaza emails que no existen
- [ ] Acepta emails válidos
- [ ] Genera OTP después de 2 segundos
- [ ] OTP es aleatorio (6 caracteres)

### Paso 2: OTP
- [ ] Valida formato (máx 6 caracteres)
- [ ] Auto-convierte a mayúsculas
- [ ] Rechaza OTP incorrecto
- [ ] Rechaza OTP expirado
- [ ] Acepta OTP correcto

### Paso 3: Password
- [ ] Valida longitud (mínimo 8)
- [ ] Valida que coincidan
- [ ] Muestra/oculta contraseña
- [ ] Actualiza en localStorage
- [ ] Limpia OTP después

### Paso 4: Success
- [ ] Botón lleva a login
- [ ] Nueva contraseña funciona en login
- [ ] localStorage se actualizó correctamente

### localStorage
- [ ] passwordResetOtp se crea
- [ ] passwordResetOtp se limpia después
- [ ] cvvinvest_users tiene contraseña actualizada
- [ ] Otras propiedades del usuario no cambian

### UI/UX
- [ ] Responsive en mobile
- [ ] Mensajes claros en español
- [ ] Iconos apropiados
- [ ] Colores consistentes con tema

---

## 🔍 DEBUGGING

### Ver OTP
```javascript
JSON.parse(localStorage.getItem('passwordResetOtp')).otp
```

### Ver si OTP expiró
```javascript
let data = JSON.parse(localStorage.getItem('passwordResetOtp'));
console.log('Expirado:', Date.now() > data.expires);
```

### Ver contraseña guardada
```javascript
JSON.parse(localStorage.getItem('cvvinvest_users')).find(u => u.email === 'test@test.com').password
```

### Limpiar todo
```javascript
localStorage.removeItem('passwordResetOtp');
// Reiniciar usuario manualmente
```

### Ver todo localStorage
```javascript
console.table(Object.entries(localStorage).map(([k,v]) => ({ key: k, size: new Blob([v]).size + ' bytes' })))
```

---

## ⏱️ TIEMPO ESTIMADO

| Prueba | Tiempo |
|--------|--------|
| Prueba 1 (Completa) | 5 min |
| Prueba 2 (OTP Incorrecto) | 1 min |
| Prueba 3 (OTP Expirado) | 2 min (o 10+ min sin simular) |
| Prueba 4 (Email No Existe) | 1 min |
| Prueba 5 (Contraseña Corta) | 1 min |
| Prueba 6 (No Coinciden) | 1 min |
| Prueba 7 (Validaciones Email) | 2 min |
| Prueba 8 (Navegación) | 3 min |
| **TOTAL** | **~16 min** |

---

## ✅ RESULTADO ESPERADO

Después de completar todas las pruebas:

✅ Sistema rechaza datos inválidos
✅ Sistema genera OTP correctamente
✅ OTP expira después de 10 minutos
✅ Contraseña se cambia correctamente
✅ Usuario puede hacer login con nueva contraseña
✅ UI es responsiva y clara
✅ Navegación funciona correctamente
✅ localStorage se actualiza correctamente
✅ No hay errores en console
✅ No hay errores TypeScript

---

## 🆘 SI ALGO FALLA

### El OTP no aparece
1. Verificar console.log (F12 → Console)
2. Verificar localStorage (F12 → Application → Storage)
3. Verificar que el email existe

### No se puede pasar del paso 1
1. Verificar que el email existe (crear usuario si no existe)
2. Ver error exacto en la pantalla
3. Revisar console para errores

### Contraseña no se cambia
1. Verificar que hay 8+ caracteres
2. Verificar que coinciden las contraseñas
3. Revisar console para errores
4. Verificar que OTP fue verificado correctamente

### No se puede loguear con nueva contraseña
1. Ir a localStorage y copiar contraseña exacta guardada
2. Intentar login con esa contraseña
3. Si no funciona, revisar `/app/login/page.tsx` para ver validación

---

## 📝 NOTAS

- **Testing**: Console.log muestra OTP (remover en producción)
- **Seguridad**: Contraseñas en texto plano en localStorage (usar encriptación en producción)
- **Email**: Simulado con console.log (integrar servicio real en producción)
- **10 Minutos**: Duración del OTP (configurable en código)
- **8 Caracteres**: Longitud mínima de contraseña (configurable)

---

Última actualización: 2024

