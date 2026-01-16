# GUÍA RÁPIDA DE PRUEBA - Sistema de Notificaciones

## 🧪 Cómo Probar el Sistema de Notificaciones

### 1. **Iniciar la Aplicación**
```bash
pnpm dev
```
Se ejecutará en `http://localhost:3000`

---

### 2. **Probar Notificaciones de Usuario**

#### Paso 1: Crear una cuenta
1. Ve a `/registro`
2. Completa el formulario
3. Haz clic en "Crear Cuenta"
4. 📌 El admin recibirá una notificación: "Nuevo Usuario Registrado"

#### Paso 2: Realizar un depósito
1. Ve a `/dashboard`
2. Haz clic en "Depósitos"
3. Ingresa un monto (ej: $100)
4. Selecciona PayPal
5. 💰 Recibirás una notificación: "Depósito Registrado"
6. 🔔 Ver en el bell icon del header

#### Paso 3: Solicitar un retiro
1. Ve a `/retiros`
2. Ingresa monto a retirar
3. Selecciona método
4. 💸 Recibirás una notificación: "Retiro Solicitado"

#### Paso 4: Crear una inversión
1. Ve a `/planes`
2. Selecciona un plan
3. Ingresa monto de inversión
4. 📈 Recibirás una notificación: "Inversión Creada"
5. El admin verá: "Nueva Inversión Pendiente"

---

### 3. **Probar Notificaciones del Admin**

#### Credenciales de Admin:
```
Email: admin@cvvinvest.com
Password: admin123456
```

#### Paso 1: Ver actividades de usuarios
1. Ve a `/login`
2. Ingresa credenciales de admin
3. Ve a `/admin`
4. 🔔 El bell icon muestra todas las actividades
5. Haz clic para ver detalles

#### Paso 2: Aprobar/Rechazar inversión
1. Ve a `/admin/inversiones`
2. Selecciona una inversión pendiente
3. Haz clic en "Aprobar" o "Rechazar"
4. ✅/❌ El usuario recibirá notificación de aprobación/rechazo
5. El admin verá la notificación de la acción

#### Paso 3: Cambiar plan de usuario
1. Ve a `/admin/usuarios`
2. Haz clic en el ícono de cambiar plan
3. Selecciona nuevo plan
4. 👑 El usuario recibirá: "Plan Actualizado"
5. El admin verá: "Plan de Usuario Actualizado"

#### Paso 4: Ver nuevas inversiones
1. Ve a `/admin/inversiones`
2. 📈 Verás todas las inversiones pendientes
3. El bell icon se actualizará cada 3 segundos

---

### 4. **Características para Probar**

✅ **Bell Icon:**
- Muestra número de notificaciones sin leer
- Actualiza automáticamente
- Usuario: cada 5 segundos
- Admin: cada 3 segundos

✅ **Diálogo de Notificaciones:**
- Abre haciendo clic en el bell icon
- Muestra lista de todas las notificaciones
- Incluye timestamp relativo (ej: "hace 5 minutos")
- Colores diferentes por tipo

✅ **Marcar como Leída:**
- Haz clic en notificación individual
- O haz clic en "Marcar todas como leídas"
- El badge se reduce

✅ **Eliminar Notificaciones:**
- Haz clic en el ícono X
- Se elimina del sistema
- El contador se reduce

---

### 5. **Verifica el localStorage**

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Ver notificaciones del usuario actual
console.log(localStorage.getItem('cvvinvest_notifications_user123'))

// Ver notificaciones del admin
console.log(localStorage.getItem('cvvinvest_admin_notifications'))

// Limpiar todas las notificaciones (desarrollo)
localStorage.removeItem('cvvinvest_notifications_user123')
localStorage.removeItem('cvvinvest_admin_notifications')
```

---

### 6. **Flujo Completo de Prueba**

```
1. Crea usuario A
   → Admin ve: "Nuevo Usuario Registrado"

2. Usuario A realiza depósito de $100
   → Usuario A ve: "Depósito Registrado"
   → Admin ve: "Depósito de Usuario A"

3. Usuario A crea inversión de $50
   → Usuario A ve: "Inversión Creada"
   → Admin ve: "Nueva Inversión Pendiente"

4. Admin aprueba inversión
   → Usuario A ve: "Inversión Aprobada"
   → Admin ve confirmación

5. Admin cambia plan de Usuario A
   → Usuario A ve: "Plan Actualizado"
   → Admin ve: "Plan de Usuario A Actualizado"

6. Usuario A solicita retiro de $100
   → Usuario A ve: "Retiro Solicitado"
   → Admin ve en /admin/retiros
```

---

### 7. **Verificación de Errores**

Si algo no funciona, revisa:

1. **Console del navegador (F12):**
   - Busca errores JavaScript
   - Revisa Network tab para peticiones fallidas

2. **Terminal (pnpm dev):**
   - Revisa errores de compilación
   - Busca warnings en hot reload

3. **Storage:**
   - Abre DevTools → Application → localStorage
   - Verifica que las keys se crean correctamente

4. **Bell Icon:**
   - Si no aparece, revisa que los componentes estén importados
   - Verifica que el header esté usando los nuevos componentes

---

### 8. **Datos de Prueba**

**Usuarios por defecto:**
```
Admin:
  Email: admin@cvvinvest.com
  Password: admin123456

Usuario demo:
  Email: user@example.com
  Password: user123456
```

---

### 9. **Tips de Debugging**

**Para ver todas las notificaciones activas:**
```javascript
// En consola del navegador
const allNotifs = JSON.parse(localStorage.getItem('cvvinvest_notifications_USER_ID'))
console.table(allNotifs)
```

**Para ver contador sin leer:**
```javascript
const unread = allNotifs.filter(n => !n.read).length
console.log(`Notificaciones sin leer: ${unread}`)
```

**Para forzar actualización:**
```javascript
// Recarga la página
window.location.reload()
```

---

### 10. **Comportamiento Esperado**

✅ Bell icon muestra número rojo con contador
✅ Haz clic → Abre diálogo con lista
✅ Cada notificación tiene:
   - Emoji del tipo
   - Título
   - Mensaje
   - Tiempo relativo
   - Botón de marcar como leída
   - Botón de eliminar

✅ Se actualiza automáticamente sin recargar
✅ Admin ve más notificaciones que usuario

---

**Sistema de Notificaciones Completamente Funcional ✅**
