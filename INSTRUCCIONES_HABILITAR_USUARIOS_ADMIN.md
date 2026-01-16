# 🔧 Instrucciones para Habilitar Carga de Usuarios en Panel Admin

## Problema
El panel admin `/admin/usuarios` no puede cargar los usuarios de la base de datos Supabase aunque existan registros, porque las **RLS Policies** están bloqueando el acceso.

## Solución
Necesitas desabilitar o modificar las RLS policies en la tabla `users` para permitir que:
1. ✅ Los usuarios autenticados puedan leer todos los usuarios
2. ✅ El admin pueda actualizar estado de usuarios (es_aprobado, etc)

---

## ⚡ Opción 1: Deshabilitar RLS Completamente (RÁPIDO - Para Development)

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto: `cvvinvest`
3. Ve a **SQL Editor**
4. Ejecuta este comando SQL:

```sql
-- Deshabilitar RLS en tabla users
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

Esto permitirá que cualquier usuario autenticado lea todos los usuarios.

---

## ✅ Opción 2: Usar RLS Policies (RECOMENDADO - Para Producción)

### Paso 1: Habilitar RLS en tabla users
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

### Paso 2: Crear policy para que usuarios autenticados lean todos los usuarios
```sql
-- Política para LECTURA: usuarios autenticados pueden leer todos los usuarios
CREATE POLICY "allow_authenticated_read_users" ON public.users
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Política para ACTUALIZACIÓN: solo admin (el email debe ser administrador)
CREATE POLICY "allow_admin_update_users" ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE email = 'exe.main.darwin@gmail.com'
      AND auth.uid() = id
    )
  );
```

---

## 📝 Pasos en Supabase Dashboard

### Para Opción 1 (Rápido):
1. **Abre el SQL Editor**
   - Ve a `SQL Editor` en el sidebar izquierdo
   - Click en `+ New Query`

2. **Ejecuta el comando**
   ```sql
   ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
   ```

3. **Espera confirmación** - Debería decir: "Success"

### Para Opción 2 (Seguro):
1. **Ve a Authentication > Policies**
   - Tabla: `public.users`
   - Click en `+ New Policy`

2. **Crea la primera policy**
   - Tipo: SELECT
   - Nombre: `allow_authenticated_read_users`
   - WITH CHECK: `(auth.role() = 'authenticated')`
   - Click `Save`

3. **Crea la segunda policy** (opcional, para updates)
   - Tipo: UPDATE
   - Nombre: `allow_admin_update_users`
   - etc...

---

## 🧪 Verificar que Funciona

Después de hacer los cambios:

1. Abre en el navegador el panel admin:
   - URL: `http://localhost:3000/admin/usuarios`
   - Email admin: `exe.main.darwin@gmail.com`

2. Abre la **consola del navegador** (F12 → Console)

3. Deberías ver logs como:
   ```
   🔐 Current auth user: exe.main.darwin@gmail.com
   📨 Supabase response: { dataLength: 1, error: 'No error' }
   ✅ Loaded 1 users from Supabase
   👥 Users loaded: [{ email: 'darwinfabianquiroztejena1@gmail.com', name: 'Rosa Irene Tejena Alonso', plan: 'gratuito' }]
   ```

4. El panel debería mostrar **1 usuario** en la tabla

---

## 🚀 Después de Habilitar

Una vez habilitado el acceso, estos features funcionarán:
- ✅ Ver lista de usuarios registrados
- ✅ Aprobar/Rechazar nuevos usuarios
- ✅ Cambiar plan de usuario
- ✅ Actualizar balance
- ✅ Desactivar usuarios
- ✅ Sincronización cada 5 segundos

---

## ❌ Posibles Errores y Soluciones

### Error: "No data returned from Supabase"
→ Las RLS policies bloquean la lectura. Ejecuta la Opción 1.

### Error: "Supabase error loading users: <error message>"
→ Verifica los logs en consola del navegador para el mensaje exacto.

### Admin no puede cargar usuarios pero puede cargarse a sí mismo
→ Crea una policy específica para el email admin.

---

## 📞 Soporte

Si hay problemas:
1. Verifica los logs en consola del navegador (F12)
2. Mira el SQL error exacto en Supabase Dashboard → SQL Editor
3. Asegúrate que el usuario autenticado es: `exe.main.darwin@gmail.com`

