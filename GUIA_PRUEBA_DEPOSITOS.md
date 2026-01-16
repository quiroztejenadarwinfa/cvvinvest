# Guía de Prueba - Sistema de Confirmación de Pagos

## 📋 Requisitos Previos

- ✅ Usuario registrado en `/registro`
- ✅ Cuenta admin en `/login` con email: `admin@cvvinvest.com` y contraseña: `Admin123!`
- ✅ Navegador actualizado (Chrome, Firefox, Safari)

## 🧪 Casos de Prueba

### **Caso 1: Flujo Completo de Aprobación ✓**

#### Paso 1: Usuario crea depósito
```
1. Ir a: http://localhost:3000/depositos
2. Ingresar monto: $50.00
3. Presionar "Pagar $50.00"
4. Observar: Botón → "Procesando..." (spinner)
5. Observar: Redirección a PayPal (simulada)
```

**Resultado esperado:**
- ✅ Botón cambia a estado procesando
- ✅ Se muestra spinner animado
- ✅ URL se redirige a PayPal

#### Paso 2: Admin recibe notificación
```
1. En otra pestaña: Ir a http://localhost:3000/login
2. Login con admin@cvvinvest.com / Admin123!
3. Ir a: /admin/notifications
4. Observar: Notificación "Nuevo Depósito Pendiente"
```

**Resultado esperado:**
- ✅ Notificación aparece en panel admin
- ✅ Muestra: usuario@email, $50.00, vía PayPal
- ✅ Timestamp de creación

#### Paso 3: Admin accede a panel de depósitos
```
1. Admin cliquea en notificación o navega a /admin/depositos
2. Observar: Tabla con depósitos pendientes
3. Ver estadísticas: "Depósitos Pendientes: 1, Total: $50.00"
```

**Resultado esperado:**
- ✅ Tabla muestra el depósito del usuario
- ✅ Estado: "⏳ Pendiente" (amarillo)
- ✅ Email, monto, método PayPal son visibles
- ✅ Botones: Aprobar, Rechazar, Cancelar

#### Paso 4: Admin aprueba depósito
```
1. Admin cliquea botón "Aprobar"
2. Se abre dialog con detalles
3. Admin ingresa nota: "Pago verificado correctamente"
4. Admin cliquea "Aprobar Depósito"
5. Toast confirma: "Éxito: Depósito aprobado..."
```

**Resultado esperado:**
- ✅ Dialog muestra info correcta
- ✅ Button "Aprobar Depósito" está habilitado
- ✅ Toast verde confirma aprobación
- ✅ Tabla se actualiza inmediatamente
- ✅ Depósito ahora muestra: "✓ Aprobado" (verde)

#### Paso 5: Usuario ve cambio en tiempo real
```
1. Volver a pestaña del usuario en /depositos
2. Esperar máximo 2 segundos
3. Observar: Botón transita a "✓ ¡Pago Exitoso!" (verde)
4. Observar: Alerta verde: "¡Su pago fue aprobado!..."
5. Observar: Partículas animadas salen del botón
```

**Resultado esperado:**
- ✅ Botón cambia a verde
- ✅ Check mark aparece con animación spring
- ✅ Alerta verde visible con mensaje
- ✅ Partículas explotan del botón (8 partículas)
- ✅ Dura 3 segundos

#### Paso 6: Formulario se resetea
```
1. Esperar 5 segundos desde aprobación
2. Observar: Alerta desaparece
3. Observar: Monto en input se limpia
4. Observar: Botón regresa a estado inicial
5. Observar: Historial se actualiza
```

**Resultado esperado:**
- ✅ Alerta desaparece
- ✅ Input monto: vacío
- ✅ Botón: "Pagar $0.00"
- ✅ Historial muestra nuevo depósito con "✓ Aprobado"
- ✅ Nota: "Pago verificado correctamente"

#### Paso 7: Verificar balance actualizado
```
1. Ir a /dashboard
2. Observar: Balance anterior + $50
```

**Resultado esperado:**
- ✅ Balance se incrementó en $50.00
- ✅ Se refleja en Card de "Balance"

---

### **Caso 2: Flujo de Rechazo ❌**

#### Pasos 1-3: Idéntico a Caso 1
```
Usuario crea $100, Admin ve notificación, accede a panel
```

#### Paso 4: Admin rechaza depósito
```
1. Admin cliquea botón "Rechazar"
2. Dialog abre con opción de notas
3. Admin ingresa: "Verificación de identidad fallida"
4. Admin cliquea "Rechazar Depósito"
5. Toast rojo: "Error: No se pudo rechazar..."
   (Este mensaje es del Toast, pero el depósito SÍ se rechaza)
```

**Resultado esperado:**
- ✅ Dialog abre correctamente
- ✅ Textarea permite notas
- ✅ Tabla se actualiza
- ✅ Depósito muestra: "✗ Rechazado" (rojo)

#### Paso 5: Usuario ve rechazo
```
1. Usuario ve en su pantalla:
   - Botón regresa a estado inicial
   - Alerta ROJA: "Su pago fue rechazado: Verificación de identidad fallida"
   - Historial muestra: "✗ Rechazado"
```

**Resultado esperado:**
- ✅ Alerta roja con icono X
- ✅ Mensaje incluye razón del admin
- ✅ Balance NO cambió
- ✅ Puede intentar otro depósito

#### Paso 6: Verificar balance sin cambios
```
1. Ir a /dashboard
2. Observar: Balance igual que antes
```

**Resultado esperado:**
- ✅ Balance no cambió
- ✅ El dinero nunca se agregó

---

### **Caso 3: Flujo de Cancelación ⊘**

#### Pasos 1-3: Idéntico a Caso 1
```
Usuario crea $75, Admin ve notificación, accede a panel
```

#### Paso 4: Admin cancela depósito
```
1. Admin cliquea botón "Cancelar"
2. Dialog abre con tipo "Cancelar Depósito"
3. Admin ingresa: "Usuario solicitó cancelación"
4. Admin cliquea "Cancelar Depósito" (botón gris)
5. Tabla se actualiza
```

**Resultado esperado:**
- ✅ Dialog muestra opción de cancelación
- ✅ Botón es gris y dice "Cancelar Depósito"
- ✅ Depósito muestra: "⊘ Cancelado" (gris)

#### Paso 5: Usuario ve cancelación
```
1. Usuario ve:
   - Alerta GRIS: "Su pago fue cancelado: Usuario solicitó cancelación"
   - Historial muestra: "⊘ Cancelado"
```

**Resultado esperado:**
- ✅ Alerta gris con icono
- ✅ Mensaje indica cancelación
- ✅ Puede intentar nuevo depósito

---

### **Caso 4: Múltiples Depósitos Simultáneos**

#### Prueba:
```
1. Usuario A (pestaña 1): Inicia depósito $25
2. Usuario B (pestaña 2): Inicia depósito $40
3. Admin: Ve 2 notificaciones
4. Admin: Aprueba depósito de Usuario A
5. Admin: Rechaza depósito de Usuario B
6. Usuarios ven sus resultados independientemente
```

**Resultado esperado:**
- ✅ Admin ve ambos depósitos en tabla
- ✅ Cada usuario recibe notificación correcta
- ✅ Balances se actualizan independientemente
- ✅ No hay conflictos de ID

---

## 🎯 Validaciones de Seguridad

### Prueba: Admin solo acceso autorizado
```
1. Intentar acceder /admin/depositos sin login
   → Redirige a /login ✓
2. Intentar con usuario normal (plan="gratuito")
   → Redirige a /dashboard ✓
3. Solo con admin@cvvinvest.com y role="admin"
   → Acceso permitido ✓
```

### Prueba: Usuario solo ve sus depósitos
```
1. Usuario A en /depositos
   → Solo ve depósitos del usuario A ✓
2. Usuario B en /depositos
   → Solo ve depósitos del usuario B ✓
3. Historial está filtrado correctamente ✓
```

---

## 📊 Verificación de Datos

### En localStorage:
```javascript
// Verificar depósitos guardados
localStorage.getItem('cvvinvest_deposits')
// Debe mostrar array con todos los depósitos

// Verificar usuario actualizado
localStorage.getItem('currentUser')
// Balance debe reflejar aprobaciones

// Verificar notificaciones
localStorage.getItem('adminNotifications')
// Debe mostrar notificaciones de depósitos
```

---

## ⏱️ Checklist de Tiempos

- [ ] Polling cada 2 segundos (usuario detecta cambios)
- [ ] Estado "Éxito" visible por 3 segundos
- [ ] Reseteo completo en 5 segundos
- [ ] Admin polling cada 5 segundos

---

## 🐛 Posibles Errores y Soluciones

### Error: "Usuario no encontrado"
```
Solución: Verificar que el depositId existe en localStorage
```

### Error: "Balance no actualizado"
```
Solución: Verificar que approveDeposit() se ejecutó correctamente
```

### Error: "Usuario no recibe notificación"
```
Solución: Verificar que createAdminNotification() fue llamado
```

### Error: "Botón no transita a éxito"
```
Solución: Verificar que isConfirmed se propaga correctamente
```

---

## ✅ Checklist Final

```
Sistema de Depósitos:
- [ ] Usuario puede crear depósito
- [ ] Depósito se guarda en localStorage
- [ ] Admin recibe notificación
- [ ] Admin ve depósitos en tabla
- [ ] Admin puede aprobar
- [ ] Admin puede rechazar
- [ ] Admin puede cancelar
- [ ] Usuario ve cambios en tiempo real
- [ ] Mensajes personalizados según estado
- [ ] Balance se actualiza correctamente
- [ ] Historial se actualiza
- [ ] Formulario se resetea
- [ ] Animaciones funcionan
- [ ] Sin errores de consola
```

---

## 📝 Notas de Prueba

**Primer intento:** Puede tardar hasta 2 segundos en detectar cambios (normal con polling)

**Múltiples navegadores:** Prueba en pestaña separada (como en Caso 1)

**localStorage:** Si hay problemas, limpiar con `localStorage.clear()`

**Refresh:** Si hace F5, se pierde el estado pero los depósitos persisten en localStorage
