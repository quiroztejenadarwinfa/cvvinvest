# 🗄️ Crear Supabase desde Cero - CVVInvest

## 📋 Guía Completa para Configurar Supabase

### 🚀 Paso 1: Crear Cuenta y Proyecto

#### 1.1 Crear Cuenta en Supabase
1. Ve a: **https://supabase.com**
2. Haz clic en **"Start your project"**
3. **Regístrate** con GitHub, Google o email
4. **Confirma tu email** si es necesario

#### 1.2 Crear Nuevo Proyecto
1. En el dashboard, haz clic en **"New Project"**
2. **Selecciona tu organización** (o crea una nueva)
3. **Configuración del proyecto**:
   - **Name**: `CVVInvest Platform`
   - **Database Password**: Genera una contraseña segura (guárdala)
   - **Region**: Selecciona la más cercana (ej: `South America (São Paulo)`)
   - **Pricing Plan**: `Free` (suficiente para empezar)
4. Haz clic en **"Create new project"**
5. **Espera 2-3 minutos** mientras se crea el proyecto

### 🔑 Paso 2: Obtener Credenciales

#### 2.1 Acceder a Settings
1. Una vez creado el proyecto, ve a **Settings** (⚙️) en el menú lateral
2. Haz clic en **"API"**

#### 2.2 Copiar Credenciales Importantes
Copia y guarda estos valores (los necesitarás después):

```env
# URL del Proyecto
Project URL: https://[tu-proyecto-id].supabase.co

# API Keys
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE**: 
- `anon public` es segura para el frontend
- `service_role` es SECRETA, solo para backend

### 🗄️ Paso 3: Crear Base de Datos

#### 3.1 Acceder al SQL Editor
1. Ve a **SQL Editor** en el menú lateral
2. Haz clic en **"New query"**

#### 3.2 Ejecutar Script de Creación
Copia y pega este script completo:

```sql
-- =============================================
-- CREAR TABLAS CVVINVEST - SUPABASE
-- =============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- LIMPIAR TABLAS EXISTENTES (si existen)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS withdrawals CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS deposits CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. TABLA USERS (Usuarios del sistema)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user', -- 'user' o 'admin'
  plan VARCHAR(50) DEFAULT 'gratuito', -- 'gratuito', 'estandar', 'pro', 'vip', 'elite'
  balance DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  
  -- Campos adicionales para seguridad
  password_hash VARCHAR(255),
  profile_image_url TEXT,
  provider VARCHAR(50) DEFAULT 'email', -- 'email', 'google', 'microsoft'
  provider_id VARCHAR(255),
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_pin VARCHAR(6),
  plan_changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT users_plan_check CHECK (plan IN ('gratuito', 'estandar', 'pro', 'vip', 'elite')),
  CONSTRAINT users_role_check CHECK (role IN ('user', 'admin')),
  CONSTRAINT users_balance_check CHECK (balance >= 0)
);

-- 2. TABLA DEPOSITS (Depósitos de usuarios)
CREATE TABLE deposits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'aprobado', 'rechazado'
  method VARCHAR(100) DEFAULT 'transferencia', -- 'transferencia', 'paypal', 'crypto'
  notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT deposits_amount_check CHECK (amount > 0),
  CONSTRAINT deposits_status_check CHECK (status IN ('pendiente', 'aprobado', 'rechazado'))
);

-- 3. TABLA INVESTMENTS (Inversiones activas)
CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  plan_name VARCHAR(50) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  min_amount DECIMAL(15, 2) DEFAULT 0,
  max_amount DECIMAL(15, 2),
  status VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'aprobado', 'rechazado', 'activo', 'completado'
  notes TEXT,
  admin_notes TEXT,
  plan_at_time VARCHAR(50), -- Plan del usuario al momento de la inversión
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT investments_amount_check CHECK (amount > 0),
  CONSTRAINT investments_status_check CHECK (status IN ('pendiente', 'aprobado', 'rechazado', 'activo', 'completado')),
  CONSTRAINT investments_plan_check CHECK (plan_name IN ('gratuito', 'estandar', 'pro', 'vip', 'elite'))
);

-- 4. TABLA WITHDRAWALS (Retiros solicitados)
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'aprobado', 'rechazado', 'procesado'
  method VARCHAR(100) DEFAULT 'transferencia', -- 'transferencia', 'paypal', 'crypto'
  account_details JSONB, -- Detalles de la cuenta (número, banco, etc.)
  notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP WITH TIME ZONE,
  processed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT withdrawals_amount_check CHECK (amount > 0),
  CONSTRAINT withdrawals_status_check CHECK (status IN ('pendiente', 'aprobado', 'rechazado', 'procesado'))
);

-- 5. TABLA NOTIFICATIONS (Sistema de notificaciones)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL, -- 'deposit', 'withdrawal', 'investment', 'system', 'security'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}', -- Información adicional en formato JSON
  read BOOLEAN DEFAULT false,
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT notifications_type_check CHECK (type IN ('deposit', 'withdrawal', 'investment', 'system', 'security', 'general')),
  CONSTRAINT notifications_priority_check CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- 6. TABLA CHAT_SESSIONS (Sesiones de chat)
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) DEFAULT 'Nueva conversación',
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'closed', 'archived'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT chat_sessions_status_check CHECK (status IN ('active', 'closed', 'archived'))
);

-- 7. TABLA CHAT_MESSAGES (Mensajes del chat)
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender_type VARCHAR(20) DEFAULT 'user', -- 'user', 'admin', 'system', 'bot'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT chat_messages_sender_check CHECK (sender_type IN ('user', 'admin', 'system', 'bot'))
);

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

-- Índices para tabla users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Índices para tabla deposits
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);
CREATE INDEX IF NOT EXISTS idx_deposits_created_at ON deposits(created_at);
CREATE INDEX IF NOT EXISTS idx_deposits_amount ON deposits(amount);

-- Índices para tabla investments
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);
CREATE INDEX IF NOT EXISTS idx_investments_plan_name ON investments(plan_name);
CREATE INDEX IF NOT EXISTS idx_investments_created_at ON investments(created_at);

-- Índices para tabla withdrawals
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON withdrawals(created_at);

-- Índices para tabla notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Índices para chat
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Insertar usuario administrador
INSERT INTO users (
  email, 
  name, 
  role, 
  plan, 
  balance, 
  is_active,
  provider
) VALUES (
  'admin@cvvinvest.com', 
  'Administrador CVVInvest', 
  'admin', 
  'elite', 
  100000.00, 
  true,
  'email'
) ON CONFLICT (email) DO NOTHING;

-- Insertar usuario de prueba
INSERT INTO users (
  email, 
  name, 
  role, 
  plan, 
  balance, 
  is_active,
  provider
) VALUES (
  'test@cvvinvest.com', 
  'Usuario de Prueba', 
  'user', 
  'gratuito', 
  1000.00, 
  true,
  'email'
) ON CONFLICT (email) DO NOTHING;

-- Insertar datos de ejemplo para depósitos
INSERT INTO deposits (
  user_id, 
  email, 
  name, 
  amount, 
  status, 
  method, 
  notes
) 
SELECT 
  u.id,
  u.email,
  u.name,
  500.00,
  'aprobado',
  'transferencia',
  'Depósito inicial de prueba'
FROM users u 
WHERE u.email = 'test@cvvinvest.com'
ON CONFLICT DO NOTHING;

-- Insertar datos de ejemplo para inversiones
INSERT INTO investments (
  user_id, 
  email, 
  name, 
  plan_name, 
  amount, 
  min_amount, 
  max_amount, 
  status, 
  plan_at_time
) 
SELECT 
  u.id,
  u.email,
  u.name,
  'gratuito',
  250.00,
  100.00,
  1000.00,
  'activo',
  u.plan
FROM users u 
WHERE u.email = 'test@cvvinvest.com'
ON CONFLICT DO NOTHING;

-- Insertar notificaciones de ejemplo
INSERT INTO notifications (
  user_id, 
  type, 
  title, 
  message, 
  details
) 
SELECT 
  u.id,
  'system',
  '¡Bienvenido a CVVInvest!',
  'Tu cuenta ha sido creada exitosamente. Comienza a invertir hoy mismo.',
  '{"welcome": true, "first_login": true}'::jsonb
FROM users u 
WHERE u.email IN ('admin@cvvinvest.com', 'test@cvvinvest.com')
ON CONFLICT DO NOTHING;

-- =============================================
-- FUNCIONES ÚTILES
-- =============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deposits_updated_at BEFORE UPDATE ON deposits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON withdrawals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VERIFICACIÓN FINAL
-- =============================================

-- Mostrar resumen de tablas creadas
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'deposits', 'investments', 'withdrawals', 'notifications', 'chat_sessions', 'chat_messages')
ORDER BY tablename;

-- Mostrar conteo de registros iniciales
SELECT 
  'users' as tabla, COUNT(*) as registros FROM users
UNION ALL
SELECT 
  'deposits' as tabla, COUNT(*) as registros FROM deposits
UNION ALL
SELECT 
  'investments' as tabla, COUNT(*) as registros FROM investments
UNION ALL
SELECT 
  'notifications' as tabla, COUNT(*) as registros FROM notifications;
```

#### 3.3 Ejecutar el Script
1. **Pega todo el script** en el editor SQL
2. Haz clic en **"Run"** (▶️)
3. **Espera** a que termine (puede tomar 30-60 segundos)
4. **Verifica** que no haya errores en la consola

### ✅ Paso 4: Verificar Creación

#### 4.1 Verificar Tablas
1. Ve a **Table Editor** en el menú lateral
2. Deberías ver estas tablas:
   - ✅ `users` (2 registros)
   - ✅ `deposits` (1 registro)
   - ✅ `investments` (1 registro)
   - ✅ `withdrawals` (0 registros)
   - ✅ `notifications` (2 registros)
   - ✅ `chat_sessions` (0 registros)
   - ✅ `chat_messages` (0 registros)

#### 4.2 Verificar Datos de Prueba
1. Haz clic en la tabla **`users`**
2. Deberías ver:
   - **Admin**: `admin@cvvinvest.com`
   - **Usuario de prueba**: `test@cvvinvest.com`

### 🔐 Paso 5: Configurar Autenticación

#### 5.1 Habilitar Autenticación
1. Ve a **Authentication** en el menú lateral
2. Ve a **Settings**
3. **Configuración recomendada**:
   - ✅ **Enable email confirmations**: `Disabled` (para desarrollo)
   - ✅ **Enable phone confirmations**: `Disabled`
   - ✅ **Enable custom SMTP**: `Disabled` (usar Supabase SMTP por ahora)

#### 5.2 Configurar Providers (Opcional)
Si quieres OAuth con Google/Microsoft:
1. Ve a **Authentication** > **Providers**
2. Configura **Google** y/o **Microsoft** con tus credenciales

### 📝 Paso 6: Guardar Credenciales

Crea un archivo temporal con tus nuevas credenciales:

```env
# NUEVAS CREDENCIALES SUPABASE
NEXT_PUBLIC_SUPABASE_URL=https://[tu-nuevo-proyecto-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-nueva-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[tu-nueva-service-role-key]

# USUARIOS DE PRUEBA
Admin: admin@cvvinvest.com
Usuario: test@cvvinvest.com
```

## 🎉 ¡Supabase Configurado!

Tu nueva base de datos Supabase está lista con:
- ✅ **7 tablas** creadas con relaciones
- ✅ **Índices** optimizados para rendimiento
- ✅ **Datos de prueba** incluidos
- ✅ **Triggers** automáticos para timestamps
- ✅ **Constraints** de validación
- ✅ **Usuarios de ejemplo** para testing

### 📋 Próximo Paso
Actualiza las variables de entorno en tu proyecto local y en Vercel con las nuevas credenciales.