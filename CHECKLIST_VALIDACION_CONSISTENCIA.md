# ✓ Checklist de Validación - Consistencia de Planes

**Fecha de Creación:** 15 de enero de 2026  
**Status:** Listo para pruebas  
**Versión:** 1.0

---

## 🧪 Pruebas de Validación

### Test 1: Crear Inversión en Plan ESTANDAR

**Objetivo:** Verificar que crear una inversión en el plan ESTANDAR funcione correctamente.

**Pasos:**
1. [ ] Acceder a la página de planes (`/planes`)
2. [ ] Observar que el plan se llama "ESTANDAR" (sin acento)
3. [ ] Hacer clic en "Invertir" en el plan ESTANDAR
4. [ ] Llenar la modal con datos de inversión
5. [ ] Confirmar la inversión

**Resultado esperado:**
- [ ] Modal se abre sin errores
- [ ] Datos se guardan en localStorage
- [ ] No hay errores en consola
- [ ] Usuario permanece en plan ESTANDAR si ya era

**Comando para verificar en consola:**
```javascript
JSON.parse(localStorage.getItem('cvvinvest_user'))?.plan
// Debe retornar: "estandar"
```

---

### Test 2: Aprobar Inversión y Cambiar de Plan

**Objetivo:** Verificar que aprobar una inversión actualiza el plan correctamente.

**Pasos:**
1. [ ] Usuario creó inversión en plan ESTANDAR (con $60+ depositado)
2. [ ] Admin accede a panel `/admin`
3. [ ] Busca la inversión en la lista
4. [ ] Hace clic en "Aprobar"
5. [ ] Sistema ejecuta `approveInvestment()`

**Resultado esperado:**
- [ ] Usuario en inversión actualiza a plan ESTANDAR
- [ ] Datos se guardan correctamente
- [ ] Modal cierra sin errores
- [ ] Usuario puede ver nuevas features del plan

**Comando para verificar en consola:**
```javascript
const users = JSON.parse(localStorage.getItem('cvvinvest_users'))
const user = users.find(u => u.email === 'test@example.com')
console.log(user.plan) 
// Debe retornar: "estandar" (minúsculas)
```

---

### Test 3: Componente de Preview

**Objetivo:** Verificar que el componente de preview de planes muestra "ESTANDAR" correctamente.

**Pasos:**
1. [ ] Acceder a página de inicio
2. [ ] Scrollear a sección de planes
3. [ ] Observar que plan medio dice "ESTANDAR"
4. [ ] Inspeccionador: `Ctrl+Shift+I` → buscar "ESTANDAR" en HTML
5. [ ] Verificar que NO existe "ESTÁNDAR"

**Resultado esperado:**
- [ ] Text dice "ESTANDAR" (sin acento)
- [ ] Sin errores en consola
- [ ] HTML contiene `name: "ESTANDAR"`
- [ ] NO contiene `name: "ESTÁNDAR"`

**Verificación visual:**
```
Plan 1: GRATUITO ✓
Plan 2: ESTANDAR ✓ (sin acento)
Plan 3: PRO ✓
Plan 4: VIP ✓
Plan 5: ELITE ✓
```

---

### Test 4: Comparaciones en Lógica

**Objetivo:** Verificar que todas las comparaciones `plan.name === "ESTANDAR"` funcionan.

**Pasos:**
1. [ ] Crear usuario con plan ESTANDAR
2. [ ] Acceder a retiros (`/retiros`)
3. [ ] Verificar que muestra "Retiro en 5 días hábiles"
4. [ ] Acceder a inversiones
5. [ ] Verificar que permite hacer inversiones

**Resultado esperado:**
- [ ] Todos los condicionales que usan `plan.name === "ESTANDAR"` funcionan
- [ ] Mensajes y restricciones correctas
- [ ] Sin inconsistencias visuales
- [ ] Sin errores de JavaScript

**Verificación:**
- [ ] Tiempo de retiro: 5 días (ESTANDAR) vs 3 días (PRO)
- [ ] Protección de fondos: muestra en ESTANDAR
- [ ] Tipos de inversión: varía según plan
- [ ] Apoyo soporte: "Estándar (24h)" en ESTANDAR

---

### Test 5: Normalización de Acentos

**Objetivo:** Verificar que la función `normalizePlanName()` maneja variantes correctamente.

**Pasos (ejecutar en consola del navegador):**

```javascript
// Simular función normalizePlanName() en lib/auth.ts
const normalizePlanName = (name) => {
  const normalized = name
    .toLowerCase()
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u")
    .trim()
  
  const planMap = {
    gratuito: "gratuito",
    estandar: "estandar",
    pro: "pro",
    vip: "vip",
    elite: "elite",
  }
  
  return planMap[normalized] || null
}

// Pruebas
console.log(normalizePlanName("ESTANDAR"))      // ✓ "estandar"
console.log(normalizePlanName("ESTÁNDAR"))      // ✓ "estandar"
console.log(normalizePlanName("estandar"))      // ✓ "estandar"
console.log(normalizePlanName("estándar"))      // ✓ "estandar"
console.log(normalizePlanName("Estándar"))      // ✓ "estandar"
console.log(normalizePlanName("GRATUITO"))      // ✓ "gratuito"
console.log(normalizePlanName("gratuito"))      // ✓ "gratuito"
console.log(normalizePlanName("PRO"))           // ✓ "pro"
console.log(normalizePlanName("Pro"))           // ✓ "pro"
console.log(normalizePlanName("INVALID"))       // null
```

**Resultado esperado:**
- [ ] Todas las variantes de "ESTANDAR" → "estandar"
- [ ] Todas las variantes de "GRATUITO" → "gratuito"
- [ ] Nuevos planes funcionan igual
- [ ] Planes inválidos retornan null

---

### Test 6: Búsqueda de Acentos en Código

**Objetivo:** Verificar que NO existen acentos en comparaciones de código.

**Pasos (ejecutar en terminal):**

```bash
# Buscar "ESTÁNDAR" con acento
grep -r "ESTÁNDAR\|estándar\|ESTANDAR" app/ lib/ components/ --include="*.ts" --include="*.tsx"

# Solo debe encontrar ESTANDAR (sin acento) en:
# - app/planes/page.tsx (múltiples líneas)
# - components/sections/plans-preview.tsx (línea ~17)
# - lib/auth.ts (comentarios y función)
```

**Resultado esperado:**
- [ ] Grep retorna solo hits de "ESTANDAR" (sin acento)
- [ ] NO retorna "ESTÁNDAR" (con acento) en líneas de código
- [ ] Los únicos "estándar" son en comentarios/texto

---

### Test 7: Flujo Completo de Plan Upgrade

**Objetivo:** Verificar que todo el flujo de cambio de plan funciona.

**Pasos:**
1. [ ] Usuario comienza en plan GRATUITO
2. [ ] Hace 2-3 depósitos hasta acumular $60+
3. [ ] Accede a `/planes`
4. [ ] Ve disponible cambiar a ESTANDAR
5. [ ] Hace clic en "Actualizar a ESTANDAR"
6. [ ] Crea inversión en ESTANDAR
7. [ ] Admin aprueba inversión
8. [ ] Usuario ahora está en plan ESTANDAR

**Verificación en cada paso:**
```javascript
// Paso 1
JSON.parse(localStorage.getItem('cvvinvest_user')).plan
// "gratuito"

// Paso 8
JSON.parse(localStorage.getItem('cvvinvest_user')).plan
// "estandar" (sin acento)
```

**Resultado esperado:**
- [ ] Plan cambia de "gratuito" a "estandar"
- [ ] Todos los valores son minúsculas
- [ ] Sin acentos en almacenamiento
- [ ] Features de ESTANDAR están disponibles

---

### Test 8: Sidebar Filtra Correctamente

**Objetivo:** Verificar que el sidebar muestra opciones según el plan.

**Pasos (usuario en ESTANDAR):**
1. [ ] Acceder a cualquier página autenticada
2. [ ] Abrir sidebar
3. [ ] Verificar que "Inversiones" está visible (ESTANDAR permite)
4. [ ] Verificar que "Retiros" está visible (ESTANDAR permite)
5. [ ] Cambiar a GRATUITO
6. [ ] Verificar que "Retiros" NO está visible (GRATUITO no permite)

**Código relevante:**
```typescript
// En sidebar.tsx
const canAccessFeature = (featureName: string, userPlan: string) => {
  const features = getPlanFeatures(userPlan)
  return features[featureName] === true
}
```

**Resultado esperado:**
- [ ] GRATUITO: Solo depósitos, sin retiros
- [ ] ESTANDAR: Depósitos y retiros
- [ ] Condiciones se evalúan correctamente
- [ ] No hay bugs de visibilidad

---

### Test 9: Tabla de Comparación de Planes

**Objetivo:** Verificar que tabla de comparación muestra datos correctamente.

**Pasos:**
1. [ ] Acceder a `/planes`
2. [ ] Scrollear a tabla de comparación
3. [ ] Verificar encabezados: GRATUITO, ESTANDAR, PRO, VIP, ELITE
4. [ ] Verificar que ESTANDAR (sin acento) aparece en cada fila relevante
5. [ ] Inspeccionador: buscar "ESTÁNDAR" → NO debe haber resultados

**Resultado esperado:**
- [ ] Encabezados correctos (mayúsculas, sin acentos)
- [ ] Datos consistentes en toda la tabla
- [ ] Sin inconsistencias de acento
- [ ] Todos los planes visibles

---

### Test 10: Mensajes y Textos

**Objetivo:** Verificar que mensajes usan convención correcta.

**Casos a verificar:**
1. [ ] "Cambiar a Plan ESTANDAR" - mayúscula, sin acento ✓
2. [ ] "user.plan === 'estandar'" - minúscula, sin acento ✓
3. [ ] "Retiro: 5 días (ESTANDAR)" - mayúscula, sin acento ✓
4. [ ] Mensajes de descripción: pueden usar "Estándar" (title case)

**Resultado esperado:**
- [ ] Coherencia en todo el código
- [ ] Sin mezcla de convenciones
- [ ] Usuarios entienden que es "ESTANDAR"

---

## 📋 Checklist de Verificación Final

- [ ] **Código:** No hay `"ESTÁNDAR"` con acento en comparaciones
- [ ] **Almacenamiento:** Planes siempre son minúsculas en localStorage
- [ ] **UI:** Planes se muestran como mayúsculas sin acentos
- [ ] **Función normalización:** Existe y maneja variantes
- [ ] **Componentes:** No hay referencias a "ESTÁNDAR" en planes-preview
- [ ] **Sidebar:** Filtra correctamente por plan
- [ ] **Tabla:** Comparación muestra nombres correctos
- [ ] **Inversiones:** Se crean y aprueban correctamente
- [ ] **Retiros:** Funciona solo para planes permitidos
- [ ] **Mensajes:** Consistentes en toda la plataforma

---

## 🎯 Resultado Final

**Status de Validación:**

| Test | Status | Nota |
|------|--------|------|
| 1. ESTANDAR en planes | ⬜ Pendiente | Ejecutar después de desplegar |
| 2. Aprobar inversión | ⬜ Pendiente | Ejecutar después de desplegar |
| 3. Componente preview | ⬜ Pendiente | Verificar visualmente |
| 4. Comparaciones | ⬜ Pendiente | Validar lógica |
| 5. Normalización | ⬜ Pendiente | Test en consola |
| 6. Grep de acentos | ⬜ Pendiente | Búsqueda exhaustiva |
| 7. Flujo upgrade | ⬜ Pendiente | End-to-end testing |
| 8. Sidebar | ⬜ Pendiente | Verificar visibilidad |
| 9. Tabla | ⬜ Pendiente | Inspeccionar HTML |
| 10. Mensajes | ⬜ Pendiente | Review final |

---

## 📝 Instrucciones de Uso

**Para ejecutar el checklist:**

1. **Actualiza la rama** con los cambios de auditoría
2. **Abre el navegador** en `http://localhost:3000`
3. **Abre consola** con `Ctrl+Shift+I`
4. **Ejecuta pruebas** del Test 5 (normalización)
5. **Navega por la app** y verifica Tests 1-4, 7-10
6. **Ejecuta grep** desde terminal para Test 6

**Marcas:**
- ⬜ Pendiente de validar
- ⏳ En progreso
- ✓ Completado
- ✗ Falló

---

**Documento creado:** 15 de enero de 2026  
**Versión:** 1.0  
**Siguiente revisión:** Después de pruebas de validación  
**Responsable:** QA Team

