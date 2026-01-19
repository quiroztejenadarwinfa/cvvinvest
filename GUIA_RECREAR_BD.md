# 🚀 GUÍA DE RECREACIÓN DE BASE DE DATOS

## ¿QUÉ SE VA A HACER?

Vamos a:
1. ✅ Eliminar TODAS las tablas y datos existentes
2. ✅ Crear las tablas desde cero con el esquema correcto
3. ✅ Insertar datos de ejemplo para pruebas
4. ✅ Deshabilitar RLS para desarrollo (cambiaremos para producción después)

---

## 🎯 PASOS A SEGUIR

### PASO 1: Abre Supabase SQL Editor

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **SQL Editor** (lado izquierdo)
4. Haz clic en **New Query**

### PASO 2: Limpia la Base de Datos

1. Abre el archivo: `01-reset-db.sql`
2. Copia TODO el contenido
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **▶ Run** (botón verde)
5. Espera a que se ejecute ✅

**⚠️ IMPORTANTE:** Este script elimina TODOS los datos. No hay vuelta atrás.

### PASO 3: Inserta Datos de Ejemplo

1. Abre el archivo: `02-seed-data.sql`
2. Copia TODO el contenido
3. Pégalo en un NUEVO SQL Query de Supabase
4. Haz clic en **▶ Run**
5. Espera a que se ejecute ✅

### PASO 4: Verifica que Funcione

En Supabase:
1. Ve a **Table Editor**
2. Deberías ver estas tablas:
   - ✅ `users` (5 usuarios de ejemplo)
   - ✅ `deposits` (3 depósitos de ejemplo)
   - ✅ `investments` (3 inversiones de ejemplo)
   - ✅ `chat_sessions` (vacía, se llena cuando chatean)
   - ✅ `chat_messages` (vacía)
   - ✅ `notifications` (vacía)

---

## 📋 CREDENCIALES DE PRUEBA

Después de ejecutar los scripts, puedes probar con:

### Admin
```
Email: exe.main.darwin@gmail.com
Contraseña: password123
Plan: elite
Balance: $50,000
```

### Usuario Gratuito
```
Email: usuario.gratuito@ejemplo.com
Contraseña: password123
Plan: gratuito
Balance: $100
```

### Usuario Estándar
```
Email: usuario.estandar@ejemplo.com
Contraseña: password123
Plan: estandar
Balance: $5,000
```

### Usuario Pro
```
Email: usuario.pro@ejemplo.com
Contraseña: password123
Plan: pro
Balance: $15,000
```

### Usuario VIP
```
Email: usuario.vip@ejemplo.com
Contraseña: password123
Plan: vip
Balance: $30,000
```

---

## 🔐 CONFIGURACIÓN DE SEGURIDAD

Actualmente, RLS está **DESHABILITADO** en todas las tablas para facilitar el desarrollo.

Para **producción**, necesitaremos cambiar esto. Ver archivo: `03-production-rls.sql`

---

## ✅ CHECKLIST DESPUÉS DE EJECUTAR LOS SCRIPTS

- [ ] Todos los scripts se ejecutaron sin errores
- [ ] La tabla `users` tiene 5 registros
- [ ] La tabla `deposits` tiene 3 registros
- [ ] La tabla `investments` tiene 3 registros
- [ ] Las demás tablas existen pero están vacías
- [ ] Puedo ver los datos en Table Editor
- [ ] El código puede conectarse a Supabase sin errores

---

## 🐛 SI ALGO FALLA

### Error: "Table already exists"
- Significa que no se ejecutó bien el primero. Copia este comando y ejecútalo:
```sql
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.deposits CASCADE;
DROP TABLE IF EXISTS public.investments CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
```

### Error: "RLS policy already exists"
- Ejecuta esto primero:
```sql
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.deposits DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_messages DISABLE ROW LEVEL SECURITY;
```

### Datos de prueba no se insertaron
- Verifica que la tabla `users` existe primero
- Asegúrate de ejecutar el script de reseteo ANTES del de datos

---

## 🚀 PRÓXIMOS PASOS

Después de esto:
1. ✅ El código debería conectarse sin errores
2. ✅ Puedes registrar nuevos usuarios
3. ✅ Puedes crear depósitos e inversiones
4. ✅ El panel de admin debería cargar usuarios

Si todavía hay problemas, verificaremos:
- Variables de entorno en `.env.local`
- Conexión a Supabase en el código
- Permisos de Supabase
