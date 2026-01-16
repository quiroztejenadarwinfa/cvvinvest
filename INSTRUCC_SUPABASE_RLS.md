# Solución: RLS Policy Error en Supabase

## Problema
Al iniciar sesión o registrarse, aparece el error:
```
new row violates row-level security policy for table "users"
```

## Solución

Las políticas RLS (Row Level Security) de Supabase están bloqueando las operaciones. Necesitas deshabilitarlas temporalmente para que el sistema funcione:

### Pasos en Supabase Dashboard:

1. **Accede a Supabase Console:**
   - Ve a https://supabase.com/dashboard
   - Inicia sesión con tu cuenta
   - Selecciona el proyecto: `uofardoxcfxdzajcrzxh`

2. **Deshabilita RLS en la tabla `users`:**
   - En el menú izquierdo, ve a **SQL Editor**
   - Ejecuta este comando SQL:

```sql
-- Deshabilitar RLS en la tabla users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- O alternativamente, en el panel de Supabase:
-- Ve a Authentication → Policies
-- Selecciona la tabla "users"
-- Haz clic en "Disable RLS"
```

3. **Alternativa: Desde el panel gráfico:**
   - Ve a **SQL Editor** en Supabase
   - Busca la sección de **Policies** en la tabla `users`
   - Haz clic en el botón **"Disable RLS"** (esquina superior derecha)

4. **Deshabilita RLS en todas las tablas (recomendado para desarrollo):**

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE deposits DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
```

## Después de hacer esto:

1. Vuelve a tu aplicación local o Vercel
2. Intenta iniciar sesión o registrarte
3. Debería funcionar sin el error de RLS

## ⚠️ Nota de Seguridad

En **producción**, SIEMPRE debes tener RLS habilitado con políticas adecuadas. Para desarrollo local está bien deshabilitarlo.

Cuando estés listo para producción, te ayudaré a crear políticas RLS correctas que:
- Permitan que usuarios anónimos se registren
- Permitan que usuarios vean solo sus propios datos
- Permitan que admins vean todos los datos

## Proximas acciones después de deshabilitar RLS:

1. Redeploy en Vercel (click en "Redeploy" en tu último build)
2. Prueba login/registro en tu aplicación
3. Si funciona, podemos agregar políticas RLS correctas después
