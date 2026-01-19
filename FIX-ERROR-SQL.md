# 🔧 SOLUCIÓN RÁPIDA - ERROR EN SQL

## ¿QUÉ PASÓ?

Obtuviste este error:
```
ERROR: 42703: column "role" of relation "users" does not exist
```

**Causa:** La tabla `users` ya existía en tu Supabase pero sin la columna `role`.

---

## ✅ SOLUCIÓN (3 pasos)

### PASO 1: Ir a Supabase Console
1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **SQL Editor**

### PASO 2: Limpiar tablas antiguas
Ejecuta este SQL primero:

```sql
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS withdrawals CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS deposits CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

**Esto eliminará todas las tablas antiguas.**

### PASO 3: Crear tablas nuevas
Ahora copia y ejecuta el SQL actualizado:
- Abre el archivo: `00-CREAR-TABLAS.sql`
- Copia TODO el contenido (ya está actualizado)
- Pégalo en Supabase SQL Editor
- Click **RUN**

---

## ✅ VERIFICACIÓN

Después de ejecutar el SQL:

1. Ve a **Table Editor** en Supabase
2. Deberías ver 5 tablas:
   - [x] users
   - [x] deposits
   - [x] investments
   - [x] withdrawals
   - [x] notifications

3. Haz clic en **users**
4. Deberías ver 2 registros:
   - exe.main.darwin@gmail.com (admin)
   - test@example.com (user)

5. Si ves esto → **¡LISTO!** ✅

---

## 🚀 AHORA SÍ

Vuelve a seguir el [INICIO-RAPIDO-5MIN.md](./INICIO-RAPIDO-5MIN.md):

```bash
# 1. Ejecuta la app
pnpm dev

# 2. Abre navegador
http://localhost:3000

# 3. Login como admin
# Email: exe.main.darwin@gmail.com
# Password: admin12345
```

---

**¿Sigue habiendo errores?** Lee [PRUEBAS-RAPIDAS.md](./PRUEBAS-RAPIDAS.md#-si-algo-no-funciona)

