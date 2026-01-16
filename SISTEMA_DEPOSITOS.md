# 🏦 Sistema de Depósitos y Administración

## Descripción General

Se ha implementado un sistema completo de gestión de depósitos que permite a los usuarios realizar depósitos y al administrador gestionarlos.

---

## 📋 Cambios Realizados

### 1. **Tipos y Funciones en `lib/auth.ts`**
- ✅ Agregado tipo `Deposit` con campos: `id`, `userId`, `userEmail`, `userName`, `amount`, `status`, `method`, `createdAt`, `approvedAt`, `notes`
- ✅ Agregado tipo `DepositStatus` con valores: `"pendiente" | "aprobado" | "rechazado"`
- ✅ Función `createDeposit(amount, method)` - Crea un depósito pendiente
- ✅ Función `getAllDeposits()` - Obtiene todos los depósitos
- ✅ Función `getUserDeposits()` - Obtiene depósitos del usuario autenticado
- ✅ Función `approveDeposit(depositId, notes)` - Aprueba un depósito y actualiza balance del usuario
- ✅ Función `rejectDeposit(depositId, notes)` - Rechaza un depósito
- ✅ Función `getAllUsers()` y `setAllUsers()` - Para gestionar usuarios

### 2. **Página de Depósitos del Usuario** (`app/depositos/page.tsx`)
**Cambios:**
- ✅ Agregado input para ingresar monto de depósito
- ✅ Validación: El botón de PayPal solo se muestra si hay monto ingresado
- ✅ Cuando se completa el pago, se crea automáticamente un depósito
- ✅ Mensaje de éxito: "Depósito registrado! Tu solicitud ha sido enviada al administrador"
- ✅ Visualización clara del monto a depositar

### 3. **Panel de Depósitos del Administrador** (`app/admin/depositos/page.tsx`)
**Características:**
- ✅ Vista de todos los depósitos con tabla responsive
- ✅ Estadísticas en tiempo real:
  - Depósitos pendientes (cantidad y total)
  - Total aprobado
  - Total de depósitos
- ✅ Búsqueda por email, nombre o ID
- ✅ Filtro por estado (Todos, Pendientes, Aprobados, Rechazados)
- ✅ Estados con colores y iconos:
  - 🟡 **Pendiente** (amarillo)
  - 🟢 **Aprobado** (verde)
  - 🔴 **Rechazado** (rojo)
- ✅ Botones de acción solo para depósitos pendientes
- ✅ Modal de aprobación/rechazo con notas opcionales
- ✅ Actualización automática cada 5 segundos

---

## 🔄 Flujo Completo

### Usuario:
```
1. Usuario autenticado va a /planes
2. Selecciona un plan premium
3. Redirige a /depositos
4. Ingresa monto (ej: $100)
5. Hace clic en botón de PayPal
6. Completa pago en PayPal
7. Se crea depósito con estado "pendiente"
8. Ve mensaje: "Depósito registrado!"
```

### Administrador:
```
1. Admin va a /admin/depositos
2. Ve tabla con depósitos pendientes
3. Busca/filtra depósitos
4. Selecciona "Aprobar" o "Rechazar"
5. Abre modal con datos del depósito
6. Agrega notas (opcional)
7. Confirma acción
8. Si aprueba: se actualiza balance del usuario
9. Depósito cambia estado a "aprobado"
```

---

## 💾 Almacenamiento

Los depósitos se guardan en `localStorage`:
```javascript
// Estructura en localStorage
localStorage.setItem("cvvinvest_deposits", JSON.stringify([
  {
    id: "ABC123XYZ",
    userId: "user_id",
    userEmail: "user@example.com",
    userName: "Juan Pérez",
    amount: 100,
    status: "pendiente",
    method: "PayPal",
    createdAt: "2026-01-14T10:30:00.000Z",
    approvedAt: undefined,
    notes: undefined
  }
]))
```

---

## 🔐 Validaciones

✅ Solo usuarios autenticados pueden ver `/depositos`
✅ Solo admin puede ver `/admin/depositos`
✅ No se puede aprobar depósitos rechazados
✅ El monto debe ser > 0
✅ Se valida que el admin sea admin válido

---

## 📊 Estados y Transiciones

```
PENDIENTE
    ↓
    ├─→ APROBADO (se actualiza balance)
    └─→ RECHAZADO (sin cambios en balance)
```

---

## 🎨 Interfaz

### Usuario:
- Input numérico con validación
- Mostrador de monto total
- Botón PayPal responsivo
- Mensaje de éxito con desaparición automática

### Admin:
- Tabla con diseño responsive
- Colores diferenciados por estado
- Modal de confirmación con notas
- Estadísticas en tiempo real
- Búsqueda y filtros dinámicos

---

## 📱 URLs

- **Página de depósitos:** `/depositos` (requiere autenticación)
- **Panel de admin:** `/admin/depositos` (requiere ser admin)
- **Datos:** Guardados en `localStorage` (cvvinvest_deposits)

---

## 🚀 Próximas Mejoras

- [ ] Integración con webhook de PayPal para aprobación automática
- [ ] Historial de depósitos en perfil del usuario
- [ ] Notificaciones por email cuando se aprueba/rechaza
- [ ] Exportar reporte de depósitos en PDF
- [ ] Límites de depósito según plan
- [ ] Recibos de depósito
- [ ] Sistema de comprobantes

---

## 🔧 Testing

Para probar el sistema:

1. **Como Usuario:**
   - Inicia sesión o crea cuenta
   - Ve a `/planes`
   - Selecciona un plan (no gratuito)
   - Ve a `/depositos`
   - Ingresa monto (ej: 100)
   - Haz clic en PayPal
   - Completa el pago en PayPal

2. **Como Admin:**
   - Inicia sesión como admin (exe.main.darwin@gmail.com / admin12345)
   - Ve a `/admin/depositos`
   - Verás los depósitos pendientes
   - Aprueba o rechaza con notas

---

¡Sistema de depósitos completamente funcional! 💰
