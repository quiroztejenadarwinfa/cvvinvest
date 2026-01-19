# Solución: Balance no se actualiza al aprobar depósitos

## Problema
Cuando el admin aprobaba un depósito, el estado cambiaba a "aprobado" y se mostraba en la lista, pero el balance total del usuario no se actualizaba en la base de datos de Supabase.

## Causa Raíz
La función `approveDeposit()` en `lib/auth.ts` solo actualizaba el balance en localStorage, no en la base de datos de Supabase. Esto causaba que:
1. El balance se actualizaba localmente para el admin
2. Pero la base de datos de Supabase mantenía el balance anterior
3. Cuando el usuario recargaba la página, el balance no se reflejaba

## Solución Implementada

### 1. Crear API Endpoint para Aprobar Depósitos
**Archivo:** `app/api/admin/deposits/approve/route.ts`

```typescript
POST /api/admin/deposits/approve
Body: {
  depositId: string
  userId: string
  amount: number
  notes?: string
  deposits: string (JSON)
}
```

Este endpoint:
- Obtiene el usuario desde Supabase
- Calcula el nuevo balance
- Actualiza el balance en la tabla `users` de Supabase
- Retorna el nuevo balance

### 2. Mejorar approveDeposit() en lib/auth.ts
- Cambiar de función síncrona a `async`
- Llamar al endpoint `/api/admin/deposits/approve`
- Mantener actualización de localStorage como respaldo
- Logging para depuración

### 3. Crear API para Refrescar Datos del Usuario
**Archivo:** `app/api/user/refresh/route.ts`

```typescript
GET /api/user/refresh?userId=xxx
```

Este endpoint:
- Obtiene los datos más recientes del usuario desde Supabase
- Retorna el balance actualizado
- Permite sincronizar datos en tiempo real

### 4. Mejorar UI en app/depositos/page.tsx
- Cuando se aprueba un depósito, refrescar los datos del usuario desde Supabase
- Actualizar el estado local con el nuevo balance
- Guardar en localStorage para consistencia

## Flujo de Aprobación Ahora

```
1. Admin aprueba depósito
   ↓
2. handleApprove() llama approveDeposit()
   ↓
3. approveDeposit() llama /api/admin/deposits/approve
   ↓
4. API endpoint actualiza balance en Supabase users table
   ↓
5. approveDeposit() también actualiza localStorage (respaldo)
   ↓
6. Admin recibe confirmación de éxito
   ↓
7. Usuario ve su balance actualizado cuando recarga página
   (o en tiempo real si tiene polling)
```

## Archivos Modificados

1. **lib/auth.ts**
   - `approveDeposit()` ahora es async
   - Llama a `/api/admin/deposits/approve`
   - Mantiene sincronización con localStorage

2. **app/admin/depositos/page.tsx**
   - `handleApprove()` ahora es async
   - Espera resultado de `approveDeposit()`

3. **app/depositos/page.tsx**
   - Monitoreo mejorado de depósitos aprobados
   - Refresca datos del usuario desde Supabase cuando se aprueba
   - Actualiza balance en tiempo real

## Archivos Creados

1. **app/api/admin/deposits/approve/route.ts** - Endpoint para aprobar depósitos
2. **app/api/user/refresh/route.ts** - Endpoint para refrescar datos del usuario

## Pruebas Sugeridas

1. Admin aprueba un depósito
2. Verificar que el balance en Supabase se actualiza
3. Usuario recarga página y ve nuevo balance
4. Verificar logs en consola para debugging

## Notas Técnicas

- El endpoint usa `service_role` de Supabase (bypass de RLS)
- Mantiene respaldo en localStorage para fallback
- Implementa logging para facilitar debugging
- Maneja errores gracefully
