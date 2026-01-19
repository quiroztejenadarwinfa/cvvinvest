# 🚀 Guía de Deployment - CVVInvest

## 📋 Pre-requisitos

1. ✅ Cuenta de GitHub
2. ✅ Cuenta de Vercel
3. ✅ Proyecto Supabase configurado
4. ✅ Variables de entorno preparadas

## 🔧 Paso 1: Preparar Supabase

### 1.1 Ejecutar SQL en Supabase Console

1. Ve a tu proyecto Supabase: https://supabase.com/dashboard
2. Navega a **SQL Editor**
3. Ejecuta el contenido de `00-CREAR-TABLAS.sql`
4. Verifica que las tablas se crearon correctamente

### 1.2 Configurar RLS (Opcional para producción)

```sql
-- Ejecutar en SQL Editor si quieres activar RLS
-- (El proyecto funciona sin RLS usando service_role_key)

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Ejecutar el contenido de 03-production-rls.sql
```

## 🐙 Paso 2: Subir a GitHub

### 2.1 Inicializar repositorio (si no existe)

```bash
git init
git add .
git commit -m "Initial commit - CVVInvest platform"
```

### 2.2 Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `cvvinvest-platform` (o el que prefieras)
3. Descripción: `Investment platform with Supabase and Next.js`
4. Público o Privado (tu elección)
5. **NO** inicializar con README (ya tienes archivos)

### 2.3 Conectar y subir

```bash
git remote add origin https://github.com/TU_USUARIO/cvvinvest-platform.git
git branch -M main
git push -u origin main
```

## ☁️ Paso 3: Deploy en Vercel

### 3.1 Conectar repositorio

1. Ve a https://vercel.com/dashboard
2. Click **"New Project"**
3. Importa tu repositorio de GitHub
4. Framework: **Next.js** (auto-detectado)
5. Root Directory: `./` (raíz)

### 3.2 Configurar Variables de Entorno

En Vercel Dashboard > Settings > Environment Variables, agrega:

```env
# Supabase (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=https://uofardoxcfxdzajcrzxh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZmFyZG94Y2Z4ZHphamNyenhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTI2MjksImV4cCI6MjA4NDEyODYyOX0.SEMMbAQyI93XYeJVCcGkWqXGN6a3Y1FxOG6stEUk0Lo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZmFyZG94Y2Z4ZHphamNyenhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODU1MjYyOSwiZXhwIjoyMDg0MTI4NjI5fQ.nyo9NakERd1r3SgOOL79GdViFYCNZ0l4osHxF4zHhYI

# NextAuth (REQUERIDO)
NEXTAUTH_SECRET=tu-secreto-super-seguro-para-produccion-cambiar-esto
NEXTAUTH_URL=https://tu-dominio.vercel.app

# OAuth (OPCIONAL)
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
MICROSOFT_CLIENT_ID=tu-microsoft-client-id
MICROSOFT_CLIENT_SECRET=tu-microsoft-client-secret
MICROSOFT_TENANT_ID=common
```

**⚠️ IMPORTANTE:**
- Cambia `NEXTAUTH_SECRET` por un valor único y seguro
- Actualiza `NEXTAUTH_URL` con tu dominio real de Vercel
- Las claves OAuth son opcionales (puedes usar valores demo)

### 3.3 Deploy

1. Click **"Deploy"**
2. Espera 2-3 minutos
3. ✅ ¡Listo!

## 🧪 Paso 4: Verificar Deployment

### 4.1 Pruebas básicas

1. **Página principal**: https://tu-dominio.vercel.app
2. **Registro**: https://tu-dominio.vercel.app/registro
3. **Login**: https://tu-dominio.vercel.app/login
4. **Dashboard**: https://tu-dominio.vercel.app/dashboard (después de login)

### 4.2 Pruebas de admin

1. Login con: `exe.main.darwin@gmail.com`
2. Ve a: https://tu-dominio.vercel.app/admin
3. Verifica que puedas ver usuarios, depósitos, etc.

### 4.3 Si hay errores

1. Ve a Vercel Dashboard > Functions > View Function Logs
2. Busca errores en los logs
3. Verifica variables de entorno
4. Confirma que las tablas existan en Supabase

## 🔧 Comandos útiles para desarrollo

```bash
# Verificar conexión Supabase
node scripts/verify-supabase.js

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Verificar build
npm run start
```

## 📞 Soporte

Si encuentras problemas:

1. **Logs de Vercel**: Dashboard > Functions > View Logs
2. **Logs de Supabase**: Dashboard > Logs
3. **Consola del navegador**: F12 > Console
4. **Network tab**: F12 > Network (para errores de API)

## 🎯 URLs importantes

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/TU_USUARIO/cvvinvest-platform

---

¡Tu plataforma CVVInvest estará lista para producción! 🚀