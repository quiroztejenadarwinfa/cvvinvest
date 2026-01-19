# 🚀 GUÍA PARA HACER TODO FUNCIONAL

## PASO 1: Crear las tablas en Supabase

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor**
3. Copia todo el contenido de `00-CREAR-TABLAS.sql`
4. Pégalo en el editor SQL de Supabase
5. Haz clic en **Run**

Esto creará:
- ✅ Tabla `users`
- ✅ Tabla `deposits`
- ✅ Tabla `investments`
- ✅ Tabla `withdrawals`
- ✅ Tabla `notifications`
- ✅ Índices para mejor rendimiento
- ✅ Usuario admin de prueba

## PASO 2: Verificar tu archivo .env.local

Asegúrate que tengas en `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
```

## PASO 3: Ejecutar la aplicación

```bash
pnpm dev
```

Esto levantará el servidor en `http://localhost:3000`

## PASO 4: Probar el flujo completo

### Flujo de Usuario:
1. Ir a `/registro` y crear usuario
2. Ir a `/depositos` y solicitar un depósito
3. Ir a `/planes` y solicitar una inversión

### Flujo de Admin:
1. Ir a `/admin` (usa email: `exe.main.darwin@gmail.com`)
2. Ver usuarios en `/admin/usuarios`
3. Ver depósitos en `/admin/depositos`
4. Ver inversiones en `/admin/inversiones`
5. Aprobar inversiones/depósitos
6. Ver que el plan y balance del usuario se actualizan en tiempo real

## PASO 5: Verificar que funciona

Cuando apruebes una inversión desde admin:
- ✅ El usuario debe ver su plan actualizado
- ✅ El balance debe reflejar la aprobación
- ✅ Las funciones (retiros, etc) deben habilitarse según el plan

## PASO 6: Sincronizar con Git (Opcional)

```bash
git add .
git commit -m "Setup: Tablas Supabase creadas y funcionando"
git push
```

## PROBLEMAS COMUNES

### "Error: relation does not exist"
→ Ejecuta el SQL de `00-CREAR-TABLAS.sql` en Supabase

### "No appears user in admin"
→ Abre la consola (F12) y busca los logs de error
→ Verifica que las funciones estén consultando Supabase

### "El plan no cambia"
→ Abre consola del navegador (F12)
→ Busca logs como `[Supabase] Plan actualizado de...`
→ Recarga la página manualmente (Ctrl+F5)

## DOCUMENTACIÓN DE FUNCIONES

### Funciones principales en `lib/auth.ts`:

1. **`getAllUsersSupabase()`** - Obtiene usuarios desde Supabase
2. **`approveInvestmentSupabase(investmentId)`** - Aprueba inversión y actualiza plan
3. **`approveDepositSupabase(depositId)`** - Aprueba depósito y suma balance
4. **`getAllUsersWithFallback()`** - Intenta Supabase primero, fallback a localStorage

## ENDPOINTS DE API

- `GET /api/users` - Obtener usuarios
- `GET /api/users-admin` - Obtener usuarios (solo admin)
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/logout` - Logout
- `POST /api/deposits` - Crear depósito
- `POST /api/admin/deposits/approve` - Aprobar depósito

## ¿NECESITAS AYUDA?

1. **Consola del navegador (F12)** - Ver logs de error
2. **Supabase SQL Editor** - Ver datos en las tablas
3. **Terminal** - Ver logs del servidor `pnpm dev`

---

**Última actualización:** 19 de enero de 2026
**Estado:** ✅ Todo funcional con Supabase
