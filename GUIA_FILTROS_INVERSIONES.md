# Guía de Filtros de Inversiones - Gestión Completa

## Descripción General

El sistema de gestión de inversiones ahora incluye un sistema de filtrado avanzado que permite buscar, filtrar y organizar inversiones de múltiples formas.

## Funcionalidades de Filtrado

### 1. **Búsqueda por Usuario/Email**
- Busca en: Nombre de usuario, Email, ID de inversión
- **Sensibilidad**: No es sensible a mayúsculas/minúsculas
- **Uso**: Ingresa cualquier parte del nombre, email o ID
- **Ejemplo**: 
  - "juan" encontrará "Juan Pérez" y "juanperez@email.com"
  - "juan@" encontrará todos los emails de Juan
  - "INV-001" encontrará la inversión específica

### 2. **Filtro por Estado**
- **Opciones disponibles**:
  - `Todos los estados` - Muestra todas las inversiones
  - `Pendiente` - Inversiones en espera de aprobación
  - `Aprobado` - Inversiones aprobadas
  - `Rechazado` - Inversiones rechazadas
- **Uso**: Selecciona del dropdown para filtrar por estado
- **Combinable**: Sí, funciona con otros filtros

### 3. **Filtro por Monto**
- **Monto Mínimo ($)**: 
  - Muestra inversiones mayores o iguales al valor ingresado
  - Ejemplo: "100" muestra inversiones de $100 en adelante
  
- **Monto Máximo ($)**:
  - Muestra inversiones menores o iguales al valor ingresado
  - Ejemplo: "10000" muestra inversiones hasta $10,000
  
- **Rango**: Puedes usar ambos para crear un rango
  - Ejemplo: Min: 500, Max: 5000 muestra inversiones entre $500 y $5,000
  
- **Validación**: Sistema valida automáticamente números válidos

### 4. **Filtro por Rango de Fechas**
- **Fecha Inicio**:
  - Muestra inversiones a partir de esta fecha (incluida)
  - Formato: YYYY-MM-DD (selector de calendario)
  
- **Fecha Fin**:
  - Muestra inversiones hasta esta fecha (incluida todo el día)
  - Formato: YYYY-MM-DD
  
- **Rango**: Ambas fechas crean un rango de búsqueda
  - El sistema suma 1 día a la fecha final para incluir todo ese día
  - Ejemplo: Del 01/01/2024 al 01/01/2024 muestra toda la jornada del 1 de enero

### 5. **Auto-Actualizar**
- **Botón**: Toggle que activa/desactiva la actualización automática
- **Cuando está activo**: La lista se actualiza automáticamente cada cierto tiempo
- **Estado visual**: Verde cuando está activo

## Combinaciones de Filtros

Todos los filtros funcionan de manera combinada:

| Búsqueda | Estado | Monto Min | Monto Max | Fecha Inicio | Fecha Fin | Resultado |
|----------|--------|-----------|-----------|--------------|-----------|-----------|
| "juan" | Pendiente | 100 | 5000 | 01/01/2024 | 31/12/2024 | Inversiones de Juan, pendientes, entre $100-$5000 en 2024 |
| "" | Aprobado | "" | "" | "" | "" | Todas las inversiones aprobadas |
| "juan@" | Rechazado | 1000 | "" | "" | "" | Inversiones rechazadas de Juan sobre $1000 |
| "" | Todos | 500 | 10000 | 01/01/2024 | "" | Inversiones del 1 enero en adelante, entre $500-$10000 |

## Comportamiento del Sistema

### Contador de Resultados
- **Ubicación**: Parte inferior del panel de filtros
- **Formato**: "Mostrando X de Y inversiones"
- **X**: Inversiones que cumplen con los filtros actuales
- **Y**: Total de inversiones en el sistema
- **Se actualiza**: Automáticamente con cada cambio de filtro

### Botón "Limpiar Filtros"
- **Aparece**: Solo cuando hay filtros activos
- **Función**: Limpia todos los filtros a la vez
- **Resultado**: Vuelve a mostrar todas las inversiones
- **Estilo**: Botón rojo para distinguir que limpia todo

### Tabla de Inversiones
- **Se actualiza**: En tiempo real con cada cambio de filtro
- **Ordenamiento**: Mantiene el orden original
- **Paginación**: Si hay muchas inversiones (próxima mejora)

## Casos de Uso Comunes

### 1. Buscar inversión específica de un usuario
```
Búsqueda: "correo@usuario.com"
Estado: Todos
Monto: Sin especificar
Fecha: Sin especificar
```

### 2. Ver todas las inversiones pendientes de aprobación
```
Búsqueda: Vacío
Estado: Pendiente
Monto: Sin especificar
Fecha: Sin especificar
```

### 3. Filtrar inversiones grandes del mes actual
```
Búsqueda: Vacío
Estado: Todos
Monto Mínimo: 1000
Monto Máximo: Vacío
Fecha Inicio: Primer día del mes
Fecha Fin: Último día del mes
```

### 4. Auditoría de inversiones en rango específico
```
Búsqueda: Vacío
Estado: Todos
Monto Mínimo: 0
Monto Máximo: 500
Fecha Inicio: Fecha inicio del período
Fecha Fin: Fecha fin del período
```

### 5. Seguimiento de usuario específico
```
Búsqueda: Nombre del usuario
Estado: Todos (o específico)
Monto: Sin especificar (o específico)
Fecha: Rango deseado
```

## Validaciones

El sistema incluye validaciones automáticas:

- **Números inválidos en montos**: Se ignoran automáticamente
- **Fechas vacías**: Se ignoran en el filtro
- **Fechas inválidas**: No se aceptan
- **Búsqueda vacía**: Considera toda la base de datos
- **Estado "Todos"**: Muestra todos los estados

## Rendimiento

- **Filtrado en tiempo real**: Sin lag perceptible
- **Cálculo instantáneo**: Los contadores se actualizan inmediatamente
- **Optimización**: El sistema filtra en el cliente para máxima rapidez

## Próximas Mejoras Planeadas

- [ ] Exportar resultados filtrados a CSV/Excel
- [ ] Guardar filtros frecuentes como presets
- [ ] Ordenamiento por columnas
- [ ] Paginación con control de registros por página
- [ ] Gráficos de distribución de inversiones filtradas
- [ ] Búsqueda avanzada con operadores (>, <, >=, <=, entre)
- [ ] Filtros por plan de inversión
- [ ] Historial de cambios de estado

## Ejemplo de Flujo Típico

1. **Accede a Admin → Inversiones**
2. **Ves el panel de filtros en la parte superior**
3. **Ingresa criteria**: "juan" en búsqueda, "Pendiente" en estado, monto mín $100
4. **El sistema filtra automáticamente** - ves "Mostrando 3 de 15 inversiones"
5. **Haces clic en una inversión** para ver detalles o aprobar/rechazar
6. **Cambias un filtro** - la tabla se actualiza inmediatamente
7. **Haces clic en "Limpiar Filtros"** para volver a la vista completa

## Soporte Técnico

Si experimentas problemas:
- Verifica que los datos ingresados sean válidos
- Recarga la página si los filtros no responden
- Limpia todos los filtros para empezar de nuevo
- Comprueba que haya datos que coincidan con tus criterios
