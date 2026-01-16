# 🧪 Guía de Testing - Sistema de Planes

## Requisitos Previos

- Servidor de desarrollo ejecutándose: `npm run dev`
- Navegador web (Chrome, Firefox, Safari, Edge)
- Console abierta (F12)

## Datos de Prueba

### Usuarios Pre-configurados

```
ADMIN:
- Email: exe.main.darwin@gmail.com
- Contraseña: admin12345

Crear usuarios nuevos en /registro con diferentes planes
```

## Flujo de Testing

### 1️⃣ Test: Acceso por Plan - Página Informes

**Objetivo:** Verificar que solo usuarios con `canViewReports` vean la página

**Pasos:**

1. Abre la aplicación: `http://localhost:3000`
2. **Con Plan Gratuito:**
   - Crea usuario con Plan Gratuito
   - Intenta navegar a `/dashboard/informes`
   - ✅ Debes ver: Banner "Informes no disponibles"
   - ✅ Debes ver: Enlace "Ver planes disponibles"

3. **Con Plan Estándar:**
   - Crea usuario con Plan Estándar
   - Navega a `/dashboard/informes`
   - ✅ Debes ver: Página con gráficos
   - ✅ Debes ver: KPIs (Inversión Total, Ganancias, ROI, Valor Cartera)
   - ✅ Debes ver: Gráficos de evolución
   - ✅ Debes ver: Tabla de inversiones

### 2️⃣ Test: Acceso por Plan - Página Analytics

**Objetivo:** Verificar que solo usuarios Pro+ vean analytics

**Pasos:**

1. **Con Plan Pro:**
   - Crea usuario con Plan Pro
   - Navega a `/dashboard/analytics`
   - ✅ Debes ver: Indicadores de riesgo
   - ✅ Debes ver: Gráficos técnicos

2. **Con Plan Estándar:**
   - Cambia a usuario Plan Estándar
   - Intenta navegar a `/dashboard/analytics`
   - ✅ Debes ver: Banner "Analytics Avanzado no disponible"

### 3️⃣ Test: Menú Dinámico Sidebar

**Objetivo:** Verificar que el menú se filtra según el plan

**Pasos:**

1. **Plan Gratuito:**
   ```
   ✅ Debe mostrar:
   - Panel
   - Configuración
   - Ayuda
   - Cerrar Sesión
   
   ❌ NO debe mostrar:
   - Inversiones
   - Depositar
   - Retirar
   - Informes
   - Analytics
   ```

2. **Plan Estándar:**
   ```
   ✅ Debe mostrar:
   - Panel
   - Inversiones (NEW!)
   - Depositar (NEW!)
   - Retirar (NEW!)
   - Informes (NEW!)
   - Historial (NEW!)
   - Configuración
   
   ❌ NO debe mostrar:
   - Analytics (requiere Pro)
   ```

3. **Plan Pro:**
   ```
   ✅ Debe mostrar:
   - Panel
   - Inversiones
   - Depositar
   - Retirar
   - Informes
   - Analytics (NEW!)
   - Historial
   - Configuración
   ```

### 4️⃣ Test: Métodos de Pago

**Objetivo:** Verificar que los métodos de pago se muestren según el plan

**Pasos:**

1. Abre la página de Retiros: `/retiros`

2. **Plan Estándar:**
   - ✅ Debes ver: "Métodos disponibles: Banco Local, Binance"
   - ✅ Debes ver: "Tiempo de retiro: 5 día(s) hábil(es)"

3. **Plan Pro:**
   - ✅ Debes ver: "Métodos disponibles: Banco Local, Binance, PayPal"
   - ✅ Debes ver: "Tiempo de retiro: 3 día(s) hábil(es)"

4. **Plan VIP:**
   - ✅ Debes ver: "Métodos disponibles: Banco Local, Binance, PayPal, Transferencia Bancaria"
   - ✅ Debes ver: "Tiempo de retiro: 2 día(s) hábil(es)"

### 5️⃣ Test: Componente FeatureGuard

**Objetivo:** Verificar que el componente funciona correctamente

**Pasos:**

1. Con un usuario Plan Gratuito
2. Abre el Inspector (F12)
3. Ve a `/dashboard`
4. ✅ En la sección "Acciones Rápidas", los botones "Depositar" y "Retirar" deben estar deshabilitados
5. Con usuario Plan Pro
6. ✅ Los mismos botones deben estar habilitados

### 6️⃣ Test: Validación de Depósitos

**Objetivo:** Verificar control de acceso en página de depósitos

**Pasos:**

1. **Plan Gratuito:**
   - Intenta acceder a `/depositos`
   - ✅ Debes ver: Banner "Acceso Restringido"
   - ✅ Debes ver: "Los depósitos no están disponibles en tu plan actual"

2. **Plan Estándar:**
   - Accede a `/depositos`
   - ✅ Debes ver: Formulario de depósito
   - ✅ Debes ver: Banner "Métodos disponibles para tu plan"

### 7️⃣ Test: Validación de Retiros

**Objetivo:** Verificar control de acceso en página de retiros

**Pasos:**

1. **Plan Gratuito:**
   - Intenta acceder a `/retiros`
   - ✅ Debes ver: Banner "Acceso Restringido"

2. **Plan Estándar:**
   - Accede a `/retiros`
   - ✅ Debes ver: Formulario de retiro
   - ✅ Debes ver: Tiempo de procesamiento (5 días)

## Tests Automáticos (Consola)

### Test 1: Verificar función canAccessFeature

```javascript
// Abre la consola (F12 → Console)
// Ejecuta en una página del dashboard:

// Estos deberían retornar true para Plan Pro
console.log(document.body.innerHTML.includes("Analytics"))

// Estos deberían retornar false para Plan Gratuito
console.log(document.body.innerHTML.includes("Inversiones"))
```

### Test 2: Verificar datos del usuario

```javascript
// En la consola:
const user = JSON.parse(localStorage.getItem('cvvinvest_user'))
console.log(user.plan) // Debería mostrar: "gratuito", "estandar", "pro", "vip", "elite"
console.log(user.balance) // Debería mostrar un número
```

## Checklist de Validación

### ✅ Sistema de Planes
- [ ] Las 5 características por plan están configuradas
- [ ] Los métodos de pago son correctos por plan
- [ ] Los días de retiro son correctos
- [ ] Los mensajes de acceso denegado son informativos

### ✅ Páginas Nuevas
- [ ] Página Informes existe en `/dashboard/informes`
- [ ] Página Analytics existe en `/dashboard/analytics`
- [ ] Ambas páginas muestran gráficos
- [ ] Ambas páginas validan acceso correctamente

### ✅ Protecciones
- [ ] Sidebar filtra ítems según plan
- [ ] FeatureGuard bloquea acceso sin permisos
- [ ] Mensajes son claros y actionables
- [ ] Enlaces a planes funcionan

### ✅ Transacciones
- [ ] Depósitos solo para Estándar+
- [ ] Retiros solo para Estándar+
- [ ] Inversiones solo para Estándar+
- [ ] Informes solo para Estándar+
- [ ] Analytics solo para Pro+

### ✅ UX/UI
- [ ] Colores de planes son diferenciados
- [ ] Mensajes de error son visibles
- [ ] Botones deshabilitados tienen hover tooltip
- [ ] Responsive en mobile

## Bugs Comunes y Soluciones

### Bug 1: No veo el menú actualizado
**Solución:** 
```
1. Cierra la sesión (Logout)
2. Limpia el localStorage: localStorage.clear()
3. Recarga la página
4. Vuelve a iniciar sesión
```

### Bug 2: La página de Informes no carga
**Solución:**
```
1. Verifica que el usuario sea Estándar+
2. Abre la consola (F12) y busca errores
3. Si hay error de componente faltante, ejecuta: npm run dev
```

### Bug 3: Los gráficos no aparecen
**Solución:**
```
1. Verifica que Recharts esté instalado: npm list recharts
2. Si no está, instala: npm install recharts
3. Reinicia el servidor: npm run dev
```

## Datos Esperados en Respuestas

### Para Plan Gratuito:
```json
{
  "canDeposit": false,
  "canWithdraw": false,
  "canInvest": false,
  "canViewReports": false,
  "canViewAnalytics": false
}
```

### Para Plan Pro:
```json
{
  "canDeposit": true,
  "canWithdraw": true,
  "canInvest": true,
  "canViewReports": true,
  "canViewAnalytics": true,
  "withdrawalDays": 3,
  "paymentMethods": ["Banco Local", "Binance", "PayPal"]
}
```

## Performance Testing

### Verificar carga de página

```javascript
// En consola del navegador:
console.time("pageLoad")
// Navega a /dashboard/informes
console.timeEnd("pageLoad") // Debería ser < 2 segundos
```

## Notas Finales

- 📝 Todos los tests deben ejecutarse con el servidor corriendo
- 🔄 Limpia localStorage después de cada sesión para tests limpios
- 📸 Toma capturas para documentación
- 🐛 Reporta cualquier comportamiento inesperado

---

**Última actualización:** 14 de enero de 2026
**Estado de Testing:** Listo para QA
