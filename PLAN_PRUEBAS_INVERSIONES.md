# Plan de Pruebas - Sistema de Filtros de Inversiones

## Resumen Ejecutivo

El sistema de gestión de inversiones incluye un filtrado avanzado con 4 criterios principales:
- Búsqueda por usuario/email
- Filtro por estado
- Filtro por rango de montos
- Filtro por rango de fechas

Cada filtro puede usarse independientemente o en combinación con otros.

---

## Pruebas Unitarias

### Test 1: Búsqueda por Usuario/Email (Case-Insensitive)

**Objetivo**: Verificar que la búsqueda funciona sin importar mayúsculas/minúsculas

**Datos de Prueba**:
```
Inversión 1: usuario="Juan Pérez", email="juan@email.com"
Inversión 2: usuario="Carlos López", email="carlos@email.com"
Inversión 3: usuario="María González", email="maria@email.com"
```

**Casos de Prueba**:
| Búsqueda | Esperado | ✓/✗ |
|----------|----------|------|
| "juan" | Inversión 1 | |
| "JUAN" | Inversión 1 | |
| "Juan" | Inversión 1 | |
| "carlos" | Inversión 2 | |
| "maria@" | Inversión 3 | |
| "@email" | Todas (3) | |
| "xyz" | Ninguna | |
| "" | Todas (3) | |

---

### Test 2: Filtro por Estado

**Objetivo**: Verificar que cada estado filtra correctamente

**Datos de Prueba**:
```
Inversión 1: estado="pendiente"
Inversión 2: estado="aprobado"
Inversión 3: estado="aprobado"
Inversión 4: estado="rechazado"
```

**Casos de Prueba**:
| Estado | Esperado | ✓/✗ |
|--------|----------|------|
| "all" | Todas (4) | |
| "pendiente" | Inversión 1 | |
| "aprobado" | Inversiones 2, 3 | |
| "rechazado" | Inversión 4 | |

---

### Test 3: Filtro por Monto Mínimo

**Objetivo**: Verificar que el filtro de monto mínimo funciona

**Datos de Prueba**:
```
Inv A: monto=$50
Inv B: monto=$100
Inv C: monto=$500
Inv D: monto=$1000
```

**Casos de Prueba**:
| Min | Esperado | ✓/✗ |
|-----|----------|------|
| (vacío) | Todas (4) | |
| 0 | Todas (4) | |
| 100 | B, C, D | |
| 500 | C, D | |
| 1000 | D | |
| 1001 | Ninguna | |
| abc | Ignorado | |

---

### Test 4: Filtro por Monto Máximo

**Objetivo**: Verificar que el filtro de monto máximo funciona

**Datos de Prueba**: Mismos que Test 3

**Casos de Prueba**:
| Max | Esperado | ✓/✗ |
|-----|----------|------|
| (vacío) | Todas (4) | |
| 50 | A | |
| 100 | A, B | |
| 500 | A, B, C | |
| 1000 | Todas (4) | |
| 999 | A, B, C | |
| abc | Ignorado | |

---

### Test 5: Rango de Montos (Min + Max)

**Objetivo**: Verificar que ambos filtros funcionan juntos

**Datos de Prueba**: Mismos que Test 3

**Casos de Prueba**:
| Min | Max | Esperado | ✓/✗ |
|-----|-----|----------|------|
| 100 | 500 | B, C | |
| 100 | 100 | B | |
| 0 | 1000 | Todas (4) | |
| 50 | 50 | A | |
| 200 | 800 | C | |
| 600 | 900 | Ninguna | |

---

### Test 6: Filtro por Fecha Inicio

**Objetivo**: Verificar que el filtro de fecha inicio funciona (inclusive)

**Datos de Prueba**:
```
Inv 1: createdAt="2024-01-01"
Inv 2: createdAt="2024-01-15"
Inv 3: createdAt="2024-02-01"
Inv 4: createdAt="2024-03-01"
```

**Casos de Prueba**:
| Inicio | Esperado | ✓/✗ |
|--------|----------|------|
| (vacío) | Todas (4) | |
| 2024-01-01 | Todas (4) | |
| 2024-01-15 | Inv 2, 3, 4 | |
| 2024-02-01 | Inv 3, 4 | |
| 2024-03-02 | Ninguna | |
| 2025-01-01 | Ninguna | |

---

### Test 7: Filtro por Fecha Fin

**Objetivo**: Verificar que el filtro de fecha fin funciona (inclusive todo el día)

**Datos de Prueba**: Mismos que Test 6

**Casos de Prueba**:
| Fin | Esperado | Nota | ✓/✗ |
|-----|----------|------|------|
| (vacío) | Todas (4) | | |
| 2024-01-01 | Inv 1 | Incluye todo el 01/01 | |
| 2024-01-15 | Inv 1, 2 | Incluye todo el 15/01 | |
| 2024-02-01 | Inv 1, 2, 3 | Incluye todo el 01/02 | |
| 2024-12-31 | Todas (4) | Cubre todo 2024 | |
| 2023-12-31 | Ninguna | Antes de todas las fechas | |

---

### Test 8: Rango de Fechas (Inicio + Fin)

**Objetivo**: Verificar que ambas fechas funcionan juntas

**Datos de Prueba**: Mismos que Test 6

**Casos de Prueba**:
| Inicio | Fin | Esperado | ✓/✗ |
|--------|-----|----------|------|
| 2024-01-01 | 2024-02-01 | Inv 1, 2, 3 | |
| 2024-01-15 | 2024-01-15 | Inv 2 | |
| 2024-01-10 | 2024-01-20 | Inv 2 | |
| 2024-02-01 | 2024-03-01 | Inv 3, 4 | |
| 2024-02-15 | 2024-02-28 | Ninguna | |

---

## Pruebas de Integración

### Test 9: Búsqueda + Estado

**Objetivo**: Verificar que búsqueda y estado filtran juntos

**Datos de Prueba**:
```
Inv 1: usuario="Juan", email="juan@email.com", estado="pendiente"
Inv 2: usuario="Juan", email="juan@email.com", estado="aprobado"
Inv 3: usuario="Carlos", email="carlos@email.com", estado="pendiente"
```

**Casos de Prueba**:
| Búsqueda | Estado | Esperado | ✓/✗ |
|----------|--------|----------|------|
| "juan" | "all" | Inv 1, 2 | |
| "juan" | "pendiente" | Inv 1 | |
| "juan" | "aprobado" | Inv 2 | |
| "carlos" | "pendiente" | Inv 3 | |
| "carlos" | "aprobado" | Ninguna | |
| "juan" | "rechazado" | Ninguna | |

---

### Test 10: Búsqueda + Montos + Estado

**Objetivo**: Verificar que tres filtros funcionan juntos

**Datos de Prueba**:
```
Inv 1: usuario="Juan", monto=$100, estado="pendiente"
Inv 2: usuario="Juan", monto=$500, estado="aprobado"
Inv 3: usuario="Juan", monto=$1000, estado="pendiente"
Inv 4: usuario="Carlos", monto=$200, estado="pendiente"
```

**Casos de Prueba**:
| Búsqueda | Min | Max | Estado | Esperado | ✓/✗ |
|----------|-----|-----|--------|----------|------|
| "juan" | 100 | 1000 | "all" | Inv 1, 2, 3 | |
| "juan" | 500 | 1000 | "pendiente" | Inv 3 | |
| "juan" | 100 | 500 | "all" | Inv 1, 2 | |
| "carlos" | 0 | 500 | "all" | Inv 4 | |
| "juan" | 0 | 0 | "all" | Ninguna | |

---

### Test 11: Todos los Filtros Combinados

**Objetivo**: Verificar que todos 5 filtros funcionan juntos

**Datos de Prueba**:
```
Inv 1: usuario="Juan", email="juan@email.com", monto=$100, estado="pendiente", fecha="2024-01-01"
Inv 2: usuario="Juan", email="juan@email.com", monto=$500, estado="aprobado", fecha="2024-01-15"
Inv 3: usuario="Carlos", email="carlos@email.com", monto=$300, estado="pendiente", fecha="2024-02-01"
Inv 4: usuario="María", email="maria@email.com", monto=$1000, estado="rechazado", fecha="2024-03-01"
```

**Caso de Prueba Principal**:
| Criterio | Valor | |
|----------|-------|---|
| Búsqueda | "juan" | |
| Estado | "pendiente" | |
| Monto Mínimo | 50 | |
| Monto Máximo | 200 | |
| Fecha Inicio | 2024-01-01 | |
| Fecha Fin | 2024-12-31 | |
| **Esperado** | Inv 1 | ✓/✗ |

**Casos Adicionales**:
| Búsqueda | Estado | Min | Max | Inicio | Fin | Esperado | ✓/✗ |
|----------|--------|-----|-----|--------|-----|----------|------|
| "juan" | "aprobado" | 0 | 1000 | 2024-01-01 | 2024-12-31 | Inv 2 | |
| "carlos" | "pendiente" | 0 | 500 | 2024-01-01 | 2024-12-31 | Inv 3 | |
| "" | "all" | 500 | 1000 | 2024-02-01 | 2024-03-31 | Inv 3, 4 | |

---

## Pruebas de Interfaz

### Test 12: Botón Limpiar Filtros

**Objetivo**: Verificar que el botón limpia todos los filtros

**Pasos**:
1. Ingresa: Búsqueda="juan", Estado="pendiente", Min=100, Max=500, Inicio="2024-01-01", Fin="2024-12-31"
2. Verifica que el botón "Limpiar Filtros" sea visible (rojo)
3. Haz clic en el botón
4. Verifica que:
   - [ ] Búsqueda = vacío
   - [ ] Estado = "all"
   - [ ] Monto Mínimo = vacío
   - [ ] Monto Máximo = vacío
   - [ ] Fecha Inicio = vacío
   - [ ] Fecha Fin = vacío
   - [ ] Botón desaparece (no hay filtros activos)
   - [ ] Se muestran todas las inversiones

---

### Test 13: Contador de Resultados

**Objetivo**: Verificar que el contador se actualiza correctamente

**Datos de Prueba**: 10 inversiones totales

**Casos**:
| Filtros | Esperado | Mostrado | ✓/✗ |
|---------|----------|----------|------|
| Ninguno | "Mostrando 10 de 10" | | |
| Estado="pendiente" | "Mostrando X de 10" | | |
| Búsqueda="juan" | "Mostrando Y de 10" | | |
| Búsqueda="xyz" | "Mostrando 0 de 10" | | |

---

### Test 14: Validación de Entrada

**Objetivo**: Verificar que los campos validan entrada

**Pruebas**:
- [ ] Monto Mínimo acepta solo números
- [ ] Monto Máximo acepta solo números
- [ ] Fecha Inicio muestra selector de calendario
- [ ] Fecha Fin muestra selector de calendario
- [ ] Búsqueda acepta cualquier texto
- [ ] Auto-actualizar toggle funciona

---

## Pruebas de Rendimiento

### Test 15: Tiempo de Filtrado

**Objetivo**: Verificar que el filtrado es instantáneo

**Datos**: 1000 inversiones

**Medición**:
| Acción | Tiempo | Objetivo | Estado |
|--------|--------|----------|--------|
| Escribir carácter en búsqueda | < 100ms | Inmediato | |
| Cambiar estado | < 50ms | Inmediato | |
| Cambiar rango fechas | < 50ms | Inmediato | |
| Cambiar monto | < 50ms | Inmediato | |

---

## Casos Edge Cases

### Test 16: Datos Extremos

**Objetivo**: Verificar comportamiento con datos extremos

**Casos**:
- [ ] Montos muy grandes ($999,999.99)
- [ ] Montos muy pequeños ($0.01)
- [ ] Fechas antiguas (2000-01-01)
- [ ] Fechas futuras (2099-12-31)
- [ ] Búsqueda con caracteres especiales (!@#$%^&*)
- [ ] Búsqueda con espacios múltiples
- [ ] Emails con múltiples @
- [ ] Nombres con ñ, acentos, caracteres especiales

---

## Resumen de Resultados

Total de Pruebas: _____ / 16 categorías
Pruebas Exitosas: _____ / _____
Pruebas Fallidas: _____ / _____
Cobertura: _____%

**Observaciones**:
```
[Espacio para anotaciones]
```

**Conclusión**:
```
[Espacio para conclusión]
```

---

## Notas Técnicas

### Implementación del Filtrado

```typescript
// Función principal de filtrado
function filterInvestments(
  data: Investment[],
  search: string,
  status: string,
  minAmt: string,
  maxAmt: string,
  startDt: string,
  endDt: string
): Investment[]

// Criterios:
1. Búsqueda: case-insensitive en userEmail, userName, id
2. Estado: igualdad exacta (pendiente, aprobado, rechazado)
3. Monto Mínimo: amount >= parseFloat(minAmt)
4. Monto Máximo: amount <= parseFloat(maxAmt)
5. Fecha Inicio: createdAt >= startDate (inclusive)
6. Fecha Fin: createdAt <= endDate + 1 día (inclusive todo el día)
```

### Ubicación del Código

- **Archivo**: `/app/admin/inversiones/page.tsx`
- **Función Principal**: `filterInvestments()`
- **Handlers**: `handleSearch()`, `handleStatusFilter()`, `handleMinAmountChange()`, `handleMaxAmountChange()`, `handleStartDateChange()`, `handleEndDateChange()`, `resetFilters()`
- **UI**: Líneas ~430-540 (Panel de filtros)
