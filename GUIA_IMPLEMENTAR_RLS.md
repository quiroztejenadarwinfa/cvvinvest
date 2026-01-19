# 🔒 Implementación de RLS (Row Level Security) - Guía Completa

**Fecha:** 19 de enero de 2026  
**Estado:** ✅ Listo para implementar  
**Archivo SQL:** [04-enable-rls-policies.sql](04-enable-rls-policies.sql)

---

## 📋 ¿Qué es RLS?

**Row Level Security (RLS)** es una característica de Supabase que permite:
- ✅ **Usuarios ven solo sus datos** (depósitos, inversiones, etc.)
- ✅ **Admin ve todos los datos** sin restricciones
- ✅ **Seguridad a nivel de base de datos** (no depende del código)
- ✅ **Prevenir acceso no autorizado** a datos sensibles

---

## 🚨 Problemas Actuales (Sin RLS)

| Problema | Riesgo | Solución |
|---|---|---|
| Tabla `users` pública | Cualquiera podría ver todos los usuarios | RLS: Solo usuario ve su perfil |
| Tabla `deposits` pública | Usuarios verían depósitos de otros | RLS: Solo usuario ve sus depósitos |
| Tabla `investments` pública | Acceso a inversiones de otros | RLS: Datos aislados por usuario |
| Tabla `withdrawals` pública | Exposición de retiros | RLS: Solo propietario y admin |
| Tabla `notifications` pública | Verían notificaciones de otros | RLS: Privadas por usuario |

---

## ✨ Solución Implementada

Se han creado **políticas RLS** que permiten:

### 1. **Usuarios Normales**
- ✅ Ver **solo sus propios datos**
- ✅ Crear **sus propios registros** (depósitos, inversiones, retiros)
- ✅ Actualizar **sus propios perfiles**
- ❌ No pueden ver datos de otros usuarios

### 2. **Administrador** (exe.main.darwin@gmail.com)
- ✅ Ver **todos los datos** de todas las tablas
- ✅ Crear, actualizar y eliminar **cualquier registro**
- ✅ Gestionar usuarios y operaciones sin restricciones

---

## 🔧 Cómo Implementar

### Paso 1: Copiar el SQL

El archivo [04-enable-rls-policies.sql](04-enable-rls-policies.sql) contiene todas las políticas.

### Paso 2: Ejecutar en Supabase

**Opción A: Dashboard Supabase**
1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Crea una nueva query
5. Copia el contenido de `04-enable-rls-policies.sql`
6. Haz click en **"Run"**
7. Espera a que complete ✅

**Opción B: Terminal (si tienes Supabase CLI)**
```bash
supabase db push
```

### Paso 3: Verificar

En Supabase Dashboard:
1. Ve a **Table Editor**
2. Selecciona tabla `users`
3. Ve a **Authentication** → **RLS policies**
4. Verifica que aparezcan las políticas creadas ✅

---

## 📊 Políticas Creadas

### Tabla: `public.users`

| Acción | Condición | Quién |
|---|---|---|
| SELECT | `auth.uid()::text = id` | Usuario ve su perfil |
| SELECT | `email = 'exe.main.darwin@gmail.com'` | Admin ve todos |
| UPDATE | `auth.uid()::text = id` | Usuario actualiza su perfil |
| UPDATE | `email = 'exe.main.darwin@gmail.com'` | Admin actualiza cualquiera |
| INSERT | `email = 'exe.main.darwin@gmail.com'` | Solo admin crea usuarios |
| DELETE | `email = 'exe.main.darwin@gmail.com'` | Solo admin elimina usuarios |

### Tabla: `public.deposits`

| Acción | Condición | Quién |
|---|---|---|
| SELECT | `auth.uid()::text = userId` | Usuario ve sus depósitos |
| SELECT | `email = 'exe.main.darwin@gmail.com'` | Admin ve todos |
| INSERT | `auth.uid()::text = userId` | Usuario crea su depósito |
| UPDATE | `email = 'exe.main.darwin@gmail.com'` | Admin aprueba/rechaza |

### Tabla: `public.investments`

| Acción | Condición | Quién |
|---|---|---|
| SELECT | `auth.uid()::text = userId` | Usuario ve sus inversiones |
| SELECT | `email = 'exe.main.darwin@gmail.com'` | Admin ve todas |
| INSERT | `auth.uid()::text = userId` | Usuario crea su inversión |
| UPDATE | `email = 'exe.main.darwin@gmail.com'` | Admin aprueba/rechaza |

### Tabla: `public.withdrawals`

| Acción | Condición | Quién |
|---|---|---|
| SELECT | `auth.uid()::text = userId` | Usuario ve sus retiros |
| SELECT | `email = 'exe.main.darwin@gmail.com'` | Admin ve todos |
| INSERT | `auth.uid()::text = userId` | Usuario solicita retiro |
| UPDATE | `email = 'exe.main.darwin@gmail.com'` | Admin aprueba/rechaza |

### Tabla: `public.notifications`

| Acción | Condición | Quién |
|---|---|---|
| SELECT | `auth.uid()::text = userId` | Usuario ve sus notificaciones |
| SELECT | `email = 'exe.main.darwin@gmail.com'` | Admin ve todas |
| INSERT | `auth.uid()::text = userId` | Usuario recibe notificación |
| UPDATE | `auth.uid()::text = userId` | Usuario marca como leída |

---

## ✅ ¿Afecta el Código Existente?

**¡NO!** Las políticas RLS funcionan transparentemente con el código:

### ¿Por qué?

1. **Usa `auth.uid()`** → Tu código ya usa `getSessionUser()` que obtiene el ID
2. **Usa JWT email** → Tu código ya valida Admin por email
3. **Filtrado automático** → Supabase filtra automáticamente los datos
4. **Sin cambios en código** → No hay que modificar funciones

### Ejemplo: GET de depósitos de usuario

**Antes (sin RLS):**
```typescript
// Tu código filtraba manualmente
const deposits = allDeposits.filter(d => d.userId === user.id)
```

**Después (con RLS):**
```typescript
// Supabase filtra automáticamente (RLS hace el trabajo)
const deposits = await supabase.from('deposits').select()
// Solo retorna depósitos del usuario actual ✅
```

---

## 🧪 Pruebas Recomendadas

### Test 1: Usuario No Ve Datos de Otros

1. Login como `usuario1@example.com`
2. Abre DevTools → Network
3. Intenta acceder a depósitos de `usuario2`
4. **Resultado esperado:** ❌ Error 403 Forbidden (RLS bloquea)

### Test 2: Admin Ve Todo

1. Login como `exe.main.darwin@gmail.com`
2. Ve a `/admin/usuarios`
3. **Resultado esperado:** ✅ Ve todos los usuarios
4. Ve a `/admin/depositos`
5. **Resultado esperado:** ✅ Ve todos los depósitos

### Test 3: Funcionalidad Normal Sigue Funcionando

1. Login como usuario regular
2. Crea un depósito
3. **Resultado esperado:** ✅ Se crea correctamente
4. Ve a dashboard
5. **Resultado esperado:** ✅ Ve solo sus datos

---

## 🔐 Seguridad Mejorada

### Antes (Sin RLS)
```
┌─────────────┐
│   Cliente   │  ← Cualquiera podría hackear y ver todo
│  (Browser)  │
└──────┬──────┘
       │ SELECT * FROM users
       ▼
┌─────────────────┐
│   Supabase DB   │  ← Sin filtrado (INSEGURO)
│  (Public Access)│
└─────────────────┘
```

### Después (Con RLS)
```
┌─────────────┐
│   Cliente   │  ← Usa auth.uid() del usuario
│  (Browser)  │
└──────┬──────┘
       │ SELECT * FROM users
       ▼
┌─────────────────────────────┐
│ RLS Policy (Supabase BD)    │  ← Valida: ¿Es tu ID?
│ IF auth.uid() = user.id     │     (SEGURO)
│   THEN retorna dato         │
│   ELSE rechaza (403)        │
└─────────────────────────────┘
       ▼
┌─────────────┐
│  Tu Usuario │  ← Solo ve sus datos
│    Data     │
└─────────────┘
```

---

## ⚠️ Consideraciones Especiales

### 1. Service Role Key
Si usas la **Service Role Key** (sin autenticación):
- ✅ Byppassea RLS automáticamente
- ✅ Útil para funciones administrativas en servidor
- ⚠️ Úsalo solo en servidor, **NUNCA en cliente**

### 2. Anon Key
Si usas la **Anon Key** (cliente):
- ✅ Respeta RLS completamente
- ✅ Usuario solo ve sus datos
- ✅ Más seguro para cliente

### 3. Tu Código Actual
Verifica en `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  ← Usa Anon Key (bien)
```

---

## 🐛 Troubleshooting

### Problema: "No tengo permiso"

**Solución:**
```sql
-- Verifica que RLS está habilitado
SELECT relname, rowsecurity 
FROM pg_class 
WHERE relname IN ('users', 'deposits', 'investments', 'withdrawals', 'notifications');

-- Debería mostrar rowsecurity = true para todas
```

### Problema: "Acceso denegado en admin"

**Verificar:**
1. Email del admin es exactamente: `exe.main.darwin@gmail.com`
2. Las políticas usan `auth.jwt() ->> 'email'` (no `auth.user().email`)

### Problema: "Error 403 en selects normales"

**Solución:**
1. Verifica que el usuario está autenticado (`auth.uid()` no es null)
2. El `userId` en tabla coincide con `auth.uid()`

---

## 📝 Script de Limpieza (Si Necesitas Rollback)

Si necesitas desactivar RLS:

```sql
-- Desactivar RLS (vuelve a versión anterior)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
```

---

## ✅ Checklist de Implementación

- [ ] Copia el SQL de `04-enable-rls-policies.sql`
- [ ] Abre Supabase Dashboard → SQL Editor
- [ ] Ejecuta el SQL completo
- [ ] Verifica que no hay errores
- [ ] Revisa RLS policies en cada tabla
- [ ] Haz login como usuario normal
- [ ] Verifica que ves solo tus datos
- [ ] Haz login como admin
- [ ] Verifica que ves todos los datos
- [ ] Prueba crear/actualizar datos
- [ ] ¡Confirma que funciona! ✅

---

## 📚 Referencias

- [Supabase RLS Docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Linter - RLS Policy](https://supabase.com/docs/guides/database/database-linter?lint=0013_rls_disabled_in_public)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

---

**Versión:** 1.0  
**Última actualización:** 19 de enero de 2026  
**Estado:** ✅ Listo para producción
