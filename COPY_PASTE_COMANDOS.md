# 🔗 INSTRUCCIONES COPY-PASTE (Más Fácil Posible)

## MÉTODO RÁPIDO: Copia estos comandos

### ✅ PASO 1: Abre Supabase Dashboard
```
Dirección: https://app.supabase.com
```

### ✅ PASO 2: Nueva Query SQL

En Supabase:
1. Lado izquierdo → SQL Editor
2. Botón azul → "New Query"

### ✅ PASO 3: Limpia la base de datos

**OPCIÓN A (RECOMENDADO - Lo hace todo):**

En Supabase SQL Editor, copia y pega EXACTAMENTE esto:

```sql
-- ELIMINAR TODAS LAS TABLAS
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.deposits CASCADE;
DROP TABLE IF EXISTS public.investments CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- CREAR TABLA USERS
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  plan TEXT DEFAULT 'gratuito' CHECK (plan IN ('gratuito', 'estandar', 'pro', 'vip', 'elite')),
  balance DECIMAL(15, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREAR TABLA INVESTMENTS
CREATE TABLE public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  plan_at_time TEXT NOT NULL,
  return_percentage DECIMAL(5, 2) DEFAULT 0,
  roi_amount DECIMAL(15, 2) DEFAULT 0,
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'aprobado', 'rechazado', 'completado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREAR TABLA DEPOSITS
CREATE TABLE public.deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'aprobado', 'rechazado')),
  method TEXT DEFAULT 'paypal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREAR TABLA CHAT_SESSIONS
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved')),
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREAR TABLA CHAT_MESSAGES
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREAR TABLA NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DESHABILITAR RLS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
```

Luego:
1. Haz clic en botón ▶ **RUN** (verde, arriba a la derecha)
2. Espera a que diga "Query executed successfully" ✅

---

### ✅ PASO 4: Inserta Datos de Ejemplo

**NUEVO SQL Query** (no sobrescribas el anterior):

1. SQL Editor → New Query
2. Copia y pega EXACTAMENTE esto:

```sql
-- INSERTAR USUARIOS
INSERT INTO public.users (email, name, password_hash, plan, balance, is_active) VALUES
('exe.main.darwin@gmail.com', 'Admin User', 'hash_admin', 'elite', 50000.00, true),
('usuario.gratuito@ejemplo.com', 'Usuario Gratuito', 'hash_free', 'gratuito', 100.00, true),
('usuario.estandar@ejemplo.com', 'Usuario Estándar', 'hash_std', 'estandar', 5000.00, true),
('usuario.pro@ejemplo.com', 'Usuario Pro', 'hash_pro', 'pro', 15000.00, true),
('usuario.vip@ejemplo.com', 'Usuario VIP', 'hash_vip', 'vip', 30000.00, true);

-- VERIFICAR
SELECT COUNT(*) as total_usuarios FROM public.users;
SELECT COUNT(*) as total_deposits FROM public.deposits;
SELECT COUNT(*) as total_investments FROM public.investments;
```

Luego:
1. Haz clic en ▶ **RUN**
2. Espera a que diga "Query executed successfully" ✅

---

### ✅ PASO 5: Verifica que Funcione

En Supabase:
1. Ve a **Table Editor** (lado izquierdo)
2. Haz clic en tabla **users**
3. Deberías ver **5 usuarios** ✅

---

## 🧪 Usuarios para Probar

Copia y pega estas credenciales en tu app:

```
1. Email: exe.main.darwin@gmail.com
   Password: password123

2. Email: usuario.gratuito@ejemplo.com
   Password: password123

3. Email: usuario.estandar@ejemplo.com
   Password: password123

4. Email: usuario.pro@ejemplo.com
   Password: password123

5. Email: usuario.vip@ejemplo.com
   Password: password123
```

---

## ⚙️ Configura tu `.env.local`

En la raíz de tu proyecto, crea o edita `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anonimous_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

Para obtener estas claves:
1. Supabase Dashboard → Tu proyecto
2. Configuración (rueda dentada) → API
3. Copia las URLs y claves

---

## ✅ Verifica que el Código Funcione

En terminal:
```bash
npm run dev
```

Luego abre:
```
http://localhost:3000
```

Intenta iniciar sesión con uno de los usuarios de prueba.

---

## ❌ Si Falla

### "Table already exists"
→ Ejecuta el script de PASO 3 nuevamente

### No veo los usuarios
→ Ejecuta el script de PASO 4 nuevamente

### El código dice "Connection failed"
→ Verifica tu `.env.local` (URLs y claves correctas)

### "RLS policy error"
→ El script ya desactiva RLS, pero si persiste:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE deposits DISABLE ROW LEVEL SECURITY;
```

---

## 🎉 ¡Listo!

Ya tienes:
- ✅ Base de datos nueva y correcta
- ✅ 5 usuarios de prueba
- ✅ Datos de ejemplo
- ✅ Sistema listo para usar

Ahora:
1. Prueba con `npm run dev`
2. Intenta registrarte
3. Crea depósitos e inversiones
4. Verifica en Table Editor que se guardan

**¡Adelante!** 🚀
