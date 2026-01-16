# Datos de Ejemplo para Pruebas - Sistema de Filtros

## 📌 Instrucciones

Este archivo contiene datos de ejemplo que puedes agregar a localStorage para probar el sistema de filtros sin necesidad de crear inversiones manualmente.

### Cómo Usar

1. Abre la Developer Console (F12) en Chrome/Edge
2. Ve a la pestaña "Console"
3. Copia y pega los datos debajo según necesites
4. El sistema cargará automáticamente

---

## 📋 Ejemplo 1: 5 Inversiones Variadas (Prueba Rápida)

Copia y ejecuta en la consola:

```javascript
const testInvestments = [
  {
    id: "INV-001",
    userEmail: "juan@gmail.com",
    userName: "Juan Pérez",
    planName: "plan-60-150",
    amount: 100,
    status: "pendiente",
    notes: "Inversión inicial del usuario",
    createdAt: "2024-01-15T10:00:00",
    minAmount: 60,
    maxAmount: 150
  },
  {
    id: "INV-002",
    userEmail: "juan@gmail.com",
    userName: "Juan Pérez",
    planName: "plan-60-150",
    amount: 500,
    status: "aprobado",
    notes: "Aprobada con éxito",
    createdAt: "2024-02-10T14:30:00",
    minAmount: 60,
    maxAmount: 150
  },
  {
    id: "INV-003",
    userEmail: "carlos@hotmail.com",
    userName: "Carlos López",
    planName: "plan-200-500",
    amount: 300,
    status: "pendiente",
    notes: "",
    createdAt: "2024-03-05T09:15:00",
    minAmount: 200,
    maxAmount: 500
  },
  {
    id: "INV-004",
    userEmail: "maria@outlook.com",
    userName: "María González",
    planName: "plan-600-1500",
    amount: 1000,
    status: "rechazado",
    notes: "Montos fuera del rango permitido",
    createdAt: "2024-01-20T16:45:00",
    minAmount: 600,
    maxAmount: 1500
  },
  {
    id: "INV-005",
    userEmail: "pedro@gmail.com",
    userName: "Pedro Sánchez",
    planName: "plan-1500-plus",
    amount: 2000,
    status: "aprobado",
    notes: "Cliente premium",
    createdAt: "2024-03-20T11:00:00",
    minAmount: 1500,
    maxAmount: 99999
  }
];

localStorage.setItem('investments', JSON.stringify(testInvestments));
console.log('✅ 5 inversiones de prueba agregadas');
```

---

## 📋 Ejemplo 2: 10 Inversiones con Variabilidad (Prueba Completa)

```javascript
const testInvestments = [
  {
    id: "INV-001",
    userEmail: "juan@gmail.com",
    userName: "Juan Pérez",
    planName: "plan-60-150",
    amount: 75,
    status: "pendiente",
    notes: "",
    createdAt: "2024-01-01T08:00:00",
    minAmount: 60,
    maxAmount: 150
  },
  {
    id: "INV-002",
    userEmail: "juan@gmail.com",
    userName: "Juan Pérez",
    planName: "plan-60-150",
    amount: 150,
    status: "aprobado",
    notes: "Aprobada",
    createdAt: "2024-01-15T10:30:00",
    minAmount: 60,
    maxAmount: 150
  },
  {
    id: "INV-003",
    userEmail: "juan@gmail.com",
    userName: "Juan Pérez",
    planName: "plan-200-500",
    amount: 350,
    status: "pendiente",
    notes: "",
    createdAt: "2024-02-01T14:15:00",
    minAmount: 200,
    maxAmount: 500
  },
  {
    id: "INV-004",
    userEmail: "carlos@hotmail.com",
    userName: "Carlos López",
    planName: "plan-200-500",
    amount: 200,
    status: "aprobado",
    notes: "Monto mínimo",
    createdAt: "2024-01-05T09:00:00",
    minAmount: 200,
    maxAmount: 500
  },
  {
    id: "INV-005",
    userEmail: "carlos@hotmail.com",
    userName: "Carlos López",
    planName: "plan-600-1500",
    amount: 800,
    status: "pendiente",
    notes: "",
    createdAt: "2024-02-20T13:45:00",
    minAmount: 600,
    maxAmount: 1500
  },
  {
    id: "INV-006",
    userEmail: "maria@outlook.com",
    userName: "María González",
    planName: "plan-200-500",
    amount: 450,
    status: "rechazado",
    notes: "No cumple requisitos",
    createdAt: "2024-01-10T11:20:00",
    minAmount: 200,
    maxAmount: 500
  },
  {
    id: "INV-007",
    userEmail: "maria@outlook.com",
    userName: "María González",
    planName: "plan-600-1500",
    amount: 1200,
    status: "aprobado",
    notes: "Aprobada por méritos",
    createdAt: "2024-03-01T15:30:00",
    minAmount: 600,
    maxAmount: 1500
  },
  {
    id: "INV-008",
    userEmail: "pedro@gmail.com",
    userName: "Pedro Sánchez",
    planName: "plan-1500-plus",
    amount: 2500,
    status: "pendiente",
    notes: "",
    createdAt: "2024-03-15T10:00:00",
    minAmount: 1500,
    maxAmount: 99999
  },
  {
    id: "INV-009",
    userEmail: "ana@gmail.com",
    userName: "Ana Martínez",
    planName: "plan-60-150",
    amount: 100,
    status: "aprobado",
    notes: "Cliente nuevo",
    createdAt: "2024-03-10T12:30:00",
    minAmount: 60,
    maxAmount: 150
  },
  {
    id: "INV-010",
    userEmail: "luis@hotmail.com",
    userName: "Luis Rodríguez",
    planName: "plan-600-1500",
    amount: 900,
    status: "rechazado",
    notes: "Fondos insuficientes verificados",
    createdAt: "2024-02-28T14:00:00",
    minAmount: 600,
    maxAmount: 1500
  }
];

localStorage.setItem('investments', JSON.stringify(testInvestments));
console.log('✅ 10 inversiones de prueba agregadas');
```

---

## 📋 Ejemplo 3: 20 Inversiones (Stress Test)

```javascript
const testInvestments = [
  // Juan (usuario frecuente)
  { id: "INV-001", userEmail: "juan@gmail.com", userName: "Juan Pérez", planName: "plan-60-150", amount: 75, status: "pendiente", notes: "", createdAt: "2024-01-01T08:00:00", minAmount: 60, maxAmount: 150 },
  { id: "INV-002", userEmail: "juan@gmail.com", userName: "Juan Pérez", planName: "plan-60-150", amount: 120, status: "aprobado", notes: "", createdAt: "2024-01-15T10:30:00", minAmount: 60, maxAmount: 150 },
  { id: "INV-003", userEmail: "juan@gmail.com", userName: "Juan Pérez", planName: "plan-200-500", amount: 250, status: "pendiente", notes: "", createdAt: "2024-02-01T14:15:00", minAmount: 200, maxAmount: 500 },
  { id: "INV-004", userEmail: "juan@gmail.com", userName: "Juan Pérez", planName: "plan-200-500", amount: 450, status: "aprobado", notes: "", createdAt: "2024-02-20T09:00:00", minAmount: 200, maxAmount: 500 },
  
  // Carlos
  { id: "INV-005", userEmail: "carlos@hotmail.com", userName: "Carlos López", planName: "plan-200-500", amount: 200, status: "aprobado", notes: "", createdAt: "2024-01-05T09:00:00", minAmount: 200, maxAmount: 500 },
  { id: "INV-006", userEmail: "carlos@hotmail.com", userName: "Carlos López", planName: "plan-600-1500", amount: 800, status: "pendiente", notes: "", createdAt: "2024-02-20T13:45:00", minAmount: 600, maxAmount: 1500 },
  { id: "INV-007", userEmail: "carlos@hotmail.com", userName: "Carlos López", planName: "plan-600-1500", amount: 1200, status: "aprobado", notes: "", createdAt: "2024-03-05T15:30:00", minAmount: 600, maxAmount: 1500 },
  
  // María
  { id: "INV-008", userEmail: "maria@outlook.com", userName: "María González", planName: "plan-200-500", amount: 350, status: "rechazado", notes: "", createdAt: "2024-01-10T11:20:00", minAmount: 200, maxAmount: 500 },
  { id: "INV-009", userEmail: "maria@outlook.com", userName: "María González", planName: "plan-600-1500", amount: 1000, status: "aprobado", notes: "", createdAt: "2024-03-01T15:30:00", minAmount: 600, maxAmount: 1500 },
  { id: "INV-010", userEmail: "maria@outlook.com", userName: "María González", planName: "plan-1500-plus", amount: 2000, status: "pendiente", notes: "", createdAt: "2024-03-20T10:00:00", minAmount: 1500, maxAmount: 99999 },
  
  // Pedro
  { id: "INV-011", userEmail: "pedro@gmail.com", userName: "Pedro Sánchez", planName: "plan-1500-plus", amount: 2500, status: "aprobado", notes: "", createdAt: "2024-03-15T10:00:00", minAmount: 1500, maxAmount: 99999 },
  { id: "INV-012", userEmail: "pedro@gmail.com", userName: "Pedro Sánchez", planName: "plan-1500-plus", amount: 3000, status: "pendiente", notes: "", createdAt: "2024-03-25T12:30:00", minAmount: 1500, maxAmount: 99999 },
  
  // Ana
  { id: "INV-013", userEmail: "ana@gmail.com", userName: "Ana Martínez", planName: "plan-60-150", amount: 100, status: "aprobado", notes: "", createdAt: "2024-03-10T12:30:00", minAmount: 60, maxAmount: 150 },
  { id: "INV-014", userEmail: "ana@gmail.com", userName: "Ana Martínez", planName: "plan-200-500", amount: 300, status: "rechazado", notes: "", createdAt: "2024-03-12T14:00:00", minAmount: 200, maxAmount: 500 },
  
  // Luis
  { id: "INV-015", userEmail: "luis@hotmail.com", userName: "Luis Rodríguez", planName: "plan-600-1500", amount: 900, status: "rechazado", notes: "", createdAt: "2024-02-28T14:00:00", minAmount: 600, maxAmount: 1500 },
  
  // Rosa
  { id: "INV-016", userEmail: "rosa@gmail.com", userName: "Rosa García", planName: "plan-60-150", amount: 80, status: "pendiente", notes: "", createdAt: "2024-03-22T08:45:00", minAmount: 60, maxAmount: 150 },
  
  // Diego
  { id: "INV-017", userEmail: "diego@outlook.com", userName: "Diego Fernández", planName: "plan-200-500", amount: 400, status: "aprobado", notes: "", createdAt: "2024-03-18T16:20:00", minAmount: 200, maxAmount: 500 },
  
  // Sofía
  { id: "INV-018", userEmail: "sofia@hotmail.com", userName: "Sofía López", planName: "plan-600-1500", amount: 1100, status: "pendiente", notes: "", createdAt: "2024-03-23T09:30:00", minAmount: 600, maxAmount: 1500 },
  
  // Otros
  { id: "INV-019", userEmail: "test@gmail.com", userName: "Test User", planName: "plan-200-500", amount: 250, status: "aprobado", notes: "", createdAt: "2024-03-08T10:15:00", minAmount: 200, maxAmount: 500 },
  { id: "INV-020", userEmail: "admin@platform.com", userName: "Admin Test", planName: "plan-1500-plus", amount: 5000, status: "aprobado", notes: "", createdAt: "2024-03-01T13:00:00", minAmount: 1500, maxAmount: 99999 }
];

localStorage.setItem('investments', JSON.stringify(testInvestments));
console.log('✅ 20 inversiones de prueba agregadas (Stress Test)');
```

---

## 🧪 Casos de Prueba Sugeridos

Después de agregar los datos, prueba estos filtros:

### Prueba 1: Búsqueda por Usuario
```
Ingresa: "juan"
Resultado Esperado: 4 inversiones de Juan Pérez
```

### Prueba 2: Filtro por Estado
```
Selecciona: "Pendiente"
Resultado Esperado: Todas las inversiones con status "pendiente"
```

### Prueba 3: Rango de Montos
```
Mínimo: 200
Máximo: 600
Resultado Esperado: Inversiones entre $200-$600
```

### Prueba 4: Rango de Fechas
```
Inicio: 2024-03-01
Fin: 2024-03-31
Resultado Esperado: Inversiones de marzo de 2024
```

### Prueba 5: Filtro Combinado
```
Búsqueda: "juan"
Estado: "aprobado"
Mínimo: 100
Máximo: 500
Resultado Esperado: Inversiones aprobadas de Juan entre $100-$500
```

---

## 🗑️ Limpiar Datos

Para eliminar todos los datos de prueba:

```javascript
localStorage.removeItem('investments');
console.log('✅ Datos de prueba eliminados');
```

---

## 📊 Estadísticas de Datos de Ejemplo

**Ejemplo 1 (5 inversiones)**:
- Usuarios únicos: 5
- Pendientes: 2
- Aprobadas: 2
- Rechazadas: 1
- Monto total: $4,000
- Monto promedio: $800

**Ejemplo 2 (10 inversiones)**:
- Usuarios únicos: 6
- Pendientes: 4
- Aprobadas: 4
- Rechazadas: 2
- Monto total: $6,525
- Monto promedio: $652.50

**Ejemplo 3 (20 inversiones)**:
- Usuarios únicos: 10
- Pendientes: 8
- Aprobadas: 9
- Rechazadas: 3
- Monto total: $20,415
- Monto promedio: $1,020.75

---

## 💡 Notas

1. **Las fechas están en formato ISO**: 2024-01-01T08:00:00
2. **Los IDs son únicos**: INV-001 a INV-020
3. **Los montos varían**: De $75 a $5,000
4. **Usuarios repetidos**: Algunos usuarios tienen múltiples inversiones
5. **Todos los estados**: Pendiente, Aprobado, Rechazado

---

## 🔍 Verificar Datos Agregados

Para ver los datos que agregaste:

```javascript
console.log(JSON.parse(localStorage.getItem('investments')));
```

Esto mostrará un array con todas las inversiones.

---

**Última actualización**: 2024
**Ejemplos proporcionados**: 3
**Total de inversiones en ejemplos**: 35
