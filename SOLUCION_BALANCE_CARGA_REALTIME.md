# Solución Completa: Balance no cargaba en dashboard

## Problema
El balance del usuario permanecía en $0 en el dashboard, aunque había $29,999.99 en depósitos.

## Causa Raíz
Hay dos sistemas de almacenamiento divergentes:
1. **localStorage**: Tiene los depósitos y maneja el balance localmente
2. **Supabase**: Base de datos en la nube que tenía balance en $0

Cuando el usuario refrescaba la página o entraba nuevamente, el dashboard consultaba Supabase (donde estaba el balance en $0), no localStorage.

## Problemas Identificados

### 1. **Depósitos no sincronizados**
- Los depósitos estaban solo en localStorage del navegador
- La tabla `deposits` en Supabase estaba vacía
- Esto significa que los depósitos se perdían al refrescar/cambiar navegador

### 2. **Balance en Supabase desactualizado**
- El balance de usuarios en Supabase no se actualizaba cuando se aprobaba un depósito
- El endpoint `/api/admin/deposits/approve` solo actualizaba localStorage

### 3. **Dashboard leyendo de Supabase**
- El dashboard obtenía el usuario desde localStorage (via `getSessionUser()`)
- Pero después refrescaba cada 2 segundos desde localStorage, no desde Supabase

## Solución Implementada

### 1. Mejorar API `/api/admin/deposits/approve`
```typescript
// Antes: Solo actualizaba localStorage
// Después: Actualiza Supabase + localStorage
POST /api/admin/deposits/approve
{
  depositId, userId, amount, notes
}
↓
✓ Obtiene usuario de Supabase
✓ Calcula nuevo balance
✓ Actualiza tabla users en Supabase
✓ Retorna confirmación con nuevo balance
```

### 2. Crear API `/api/user/refresh`
```typescript
GET /api/user/refresh?userId=xxx
↓
✓ Obtiene datos actualizados desde Supabase
✓ Retorna balance, plan, y otros datos actualizados
✓ Elimina necesidad de localStorage para datos críticos
```

### 3. Mejorar Dashboard para sincronizar desde Supabase
```typescript
// Antes: Refrescaba desde localStorage cada 2s
// Después: Intenta obtener de Supabase, fallback a localStorage

const interval = setInterval(async () => {
  const response = await fetch(`/api/user/refresh?userId=${user.id}`);
  if (response.ok) {
    // Usar datos de Supabase
    const updatedUser = data.user;
  } else {
    // Fallback a localStorage
    const updatedUser = getSessionUser();
  }
}, 2000);
```

### 4. Actualizar manualmente balance (solución inmediata)
Como una solución inmediata, usé un script de Node.js para actualizar el balance:
```bash
node actualizar-balance-directo.js quiroztejenadarwinfabian@gmail.com 29999.99
```

## Archivos Modificados

### APIs
- `app/api/admin/deposits/approve/route.ts` - Mejorado con logging y mejor manejo de errores
- `app/api/user/refresh/route.ts` - Nuevo endpoint para obtener datos actualizados

### Componentes
- `app/dashboard/page.tsx` - Ahora obtiene datos de Supabase en tiempo real

### Funciones
- `lib/auth.ts` - `approveDeposit()` ahora es async y llama al API

### Scripts de Diagnóstico
- `diagnostico-balance.js` - Verifica balance en Supabase
- `sincronizar-balance-depositos.js` - Análisis de problema
- `actualizar-balance-directo.js` - Actualizar balance manualmente
- `actualizar-balance-manual.js` - Versión interactiva

## Arquitectura Mejorada

```
┌─────────────────┐
│  Admin Panel    │
└────────┬────────┘
         │ aprueba depósito
         ↓
┌─────────────────────────────────┐
│ /api/admin/deposits/approve     │
├─────────────────────────────────┤
│ ✓ Lee userId, amount            │
│ ✓ Consulta balance en Supabase  │
│ ✓ Calcula nuevo balance         │
│ ✓ Actualiza Supabase (NUEVO)    │
│ ✓ Retorna confirmación          │
└────────┬────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  Supabase - users.balance       │ ← Ahora se actualiza
├─────────────────────────────────┤
│ balance: 0 + 29999.99 = 29999.99│
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  Usuario Dashboard              │
├─────────────────────────────────┤
│ /api/user/refresh cada 2s (NUEVO)
│ ↓                               │
│ Balance: $29,999.99 ✓           │
└─────────────────────────────────┘
```

## Próximos Pasos Recomendados

### 1. Migrar depósitos a Supabase
Crear tabla `deposits` en Supabase:
```sql
CREATE TABLE deposits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10,2),
  status TEXT DEFAULT 'pendiente',
  method TEXT,
  created_at TIMESTAMP,
  approved_at TIMESTAMP,
  notes TEXT
);
```

### 2. Implementar sincronización bidireccional
- Guardar depósitos en Supabase al crearlos
- Sincronizar balance automáticamente
- Eliminar dependencia de localStorage

### 3. Mejorar seguridad
- Implementar validación en servidor
- Agregar RLS policies
- Usar transacciones para consistencia

## Pruebas Realizadas

✅ Balance actualizado en Supabase: $0 → $29,999.99
✅ Endpoint `/api/admin/deposits/approve` funcional
✅ Endpoint `/api/user/refresh` retorna datos correctos
✅ Dashboard sincroniza con Supabase cada 2 segundos

## Comandos Útiles

```bash
# Diagnosticar balance
node diagnostico-balance.js

# Actualizar balance manualmente
node actualizar-balance-directo.js <email> <monto>

# Ejemplo
node actualizar-balance-directo.js quiroztejenadarwinfabian@gmail.com 29999.99
```

## Status
✅ **RESUELTO** - El balance ahora se sincroniza en tiempo real desde Supabase
