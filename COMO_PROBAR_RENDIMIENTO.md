# 🚀 Cómo Ver el Sistema de Rendimiento Progresivo en Acción

## Pasos para Probar

### 1. Acceder al Sistema

```
URL: http://192.168.100.68:3000/login
Email: usuario@ejemplo.com
Contraseña: Password123
```

### 2. Ir a Inversiones

```
Dashboard → Mis Inversiones
o
URL: http://192.168.100.68:3000/dashboard/inversiones
```

### 3. Ver Inversiones Activas

Busca la sección **"Tus Inversiones Activas"** que mostrará tarjetas con:

- ✅ Plan actual (PRO, VIP, etc.)
- ✅ Ganancia actual en $
- ✅ Porcentaje de ganancia
- ✅ Valor total (capital + ganancias)
- ✅ Proyección de ganancias en 15 días
- ✅ Barra de progreso
- ✅ Días restantes
- ✅ Rendimiento diario en %

---

## Crear una Inversión para Probar

### Si no tienes inversiones aprobadas:

1. **Obtén más saldo**:
   - Ve a Depósitos
   - Simula un depósito (simulado)
   - Tu balance aumentará

2. **Crea una inversión**:
   - Ve a Inversiones
   - Haz click en "Crear Nueva Inversión"
   - Selecciona un plan (recomendado: PRO o VIP)
   - Ingresa un monto ($300-500)
   - Envía la solicitud

3. **Aprueba la inversión** (como admin):
   - Abre sesión como admin:
     ```
     Email: exe.main.darwin@gmail.com
     Contraseña: admin12345
     ```
   - Ve a Admin → Inversiones
   - Encuentra tu inversión
   - Haz click en "Aprobar"

4. **Vuelve a tu usuario y verás**:
   - La tarjeta de ganancias apareció
   - Las ganancias están creciendo en tiempo real
   - El contador de días regresivo funciona

---

## Qué Observarás

### En la Tarjeta de Ganancias:

```
┌──────────────────────────────────┐
│ 🟢 PRO - ACTIVO                  │
│                                  │
│ Invertido: $300                  │
│                                  │
│ Ganancia Actual:    $2.93        │
│ Valor Total:        $302.93      │
│ Proyectado (15d):   $302.93      │
│                                  │
│ Progreso del Plan:               │
│ ████████░░ 53%                   │
│ 7 días restantes                 │
│                                  │
│ 📈 Rendimiento: 0.065% diario    │
│ Interés compuesto diariamente    │
└──────────────────────────────────┘
```

### Actualización en Tiempo Real:

Abre dos pestañas del navegador:
1. Una con el dashboard
2. Otra haciendo otra cosa

Vuelve al dashboard después de 1 minuto y verás:
- ✅ Las ganancias habrán aumentado (aunque sea poco)
- ✅ El porcentaje habrá aumentado
- ✅ El valor total habrá aumentado
- ✅ El progreso avanzará día a día

---

## Datos de Prueba Disponibles

### Usuarios de Prueba

```
USUARIO ESTÁNDAR:
Email: usuario@ejemplo.com
Contraseña: Password123
Plan: Gratuito
Balance: $0 (simular depósito)

USUARIO TEST:
Email: test@test.com
Contraseña: Test12345
Plan: Estándar
Balance: $5,000

ADMINISTRADOR:
Email: exe.main.darwin@gmail.com
Contraseña: admin12345
```

### Planes Disponibles

| Plan | Min | Max | Tasa Diaria | Ganancia Esperada |
|------|-----|-----|-------------|-------------------|
| GRATUITO | $0 | $1M | 0.05% | $0.75 por $100 |
| ESTÁNDAR | $60 | $150 | 0.06% | $0.90 por $100 |
| PRO | $200 | $500 | 0.065% | $0.98 por $100 |
| VIP | $600 | $1,500 | 0.072% | $1.08 por $100 |
| ELITE | $2,000 | $5,000 | 0.078% | $1.17 por $100 |

---

## Ejemplos de Cálculo Que Verás

### Inversión PRO de $300:

**Día 1:**
```
Ganancias: $0.20
ROI: 0.067%
Valor Total: $300.20
```

**Día 7:**
```
Ganancias: $1.37
ROI: 0.46%
Valor Total: $301.37
```

**Día 15:**
```
Ganancias: $2.93
ROI: 0.977%
Valor Total: $302.93
```

---

## Funcionalidades a Probar

### 1. Auto-Actualización ⚡
- Espera 1 minuto sin hacer nada
- Las ganancias deberían aumentar automáticamente
- Se actualiza cada segundo

### 2. Múltiples Inversiones 📊
- Crea 2-3 inversiones diferentes
- Verás múltiples tarjetas
- Cada una con su propio contador y ganancias

### 3. Progreso Visual 📈
- La barra de progreso avanza cada día
- El contador de días disminuye
- Al llegar a 15 días: "Plan finalizado"

### 4. Proyección de Ganancias 🎯
- Compara ganancia actual vs proyectada
- Verás exactamente cuánto ganarás en 15 días

### 5. Transparencia 🔍
- Haz click en "Rendimiento Diario"
- Verá el % exacto de ganancia diaria
- La fórmula es: `Capital × (1 + 0.065%)^Días`

---

## Reseteando el Sistema

Si quieres empezar de cero:

### Opción 1: Botón en Admin Panel
1. Inicia sesión como admin
2. Ve a Admin Panel → Resetear Sistema
3. Confirma (escribe "CONFIRMAR")
4. Se limpiará todo

### Opción 2: Script desde Terminal
```bash
node reset-data.js
```

---

## Moneda y Formato

Todo está en **USD** ($):
- Ganancias mostradas con 2 decimales
- Porcentajes con 2-3 decimales
- Símbolos de moneda incluidos

---

## Comportamiento Esperado

### Tarjeta de Ganancias Aparece Cuando:
✅ La inversión está aprobada (`status: "aprobado"`)
✅ Está en la sección de inversiones activas
✅ Solo se muestran las 3 más recientes por defecto

### Tarjeta de Ganancias NO Aparece Cuando:
❌ Inversión está pendiente
❌ Inversión fue rechazada
❌ Ya pasaron más de 15 días

### Actualización Ocurre:
🔄 Cada segundo: ganancias se recalculan
🔄 Cada 2 segundos: página se refresca
🔄 Después de 15 días: plan se marca como finalizado

---

## Resolución de Problemas

### "No veo las tarjetas de ganancias"
1. Asegúrate de que las inversiones estén **aprobadas**
2. Recarga la página (F5)
3. Verifica que haya inversiones en estado "aprobado"

### "Los números no cambian"
1. Espera más tiempo (cambios son pequeños, especialmente al inicio)
2. Recarga la página
3. Verifica que los cálculos sean correctos manualmente

### "La página no se actualiza"
1. Cierra navegador y vuelve a abrir
2. Borra cache (Ctrl+Shift+Delete)
3. Intenta en otro navegador

---

## Verificación Manual del Cálculo

Puedes verificar los números usando cualquier calculadora:

**Fórmula**: `Capital × (1 + TasaDiaria/100)^Días`

**Ejemplo PRO a 7 días:**
```
300 × (1.00065)^7 = ?

Resultado: $301.37
Ganancia: $1.37 ✓ (Coincide!)
```

---

## Documentación Completa

Para más detalles técnicos, ver:

1. `SISTEMA_RENDIMIENTO_PROGRESIVO.md` - Explicación técnica
2. `GUIA_VISUAL_RENDIMIENTO.md` - Visualización y ejemplos
3. `IMPLEMENTACION_RENDIMIENTO_PROGRESIVO.md` - Cambios implementados

---

## ¿Preguntas?

Todos los valores mostrados son:
- ✅ Calculados en tiempo real
- ✅ Basados en interés compuesto
- ✅ Actualizados automáticamente
- ✅ Verificables matemáticamente
- ✅ Profesionales y realistas

¡Disfruta viendo tus inversiones crecer de forma real y transparente! 🎯

---

**Última actualización**: 15 de enero de 2026
**Versión**: 1.0
