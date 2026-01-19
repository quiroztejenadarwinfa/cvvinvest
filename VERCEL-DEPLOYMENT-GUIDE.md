# 🚀 Guía de Deployment en Vercel - CVVInvest

## 📋 Información del Proyecto

- **Repositorio GitHub**: https://github.com/quiroztejenadarwinfa/cvvinvest.git
- **Supabase URL**: https://uofardoxcfxdzajcrzxh.supabase.co
- **Framework**: Next.js 14

## ☁️ Paso 1: Crear Proyecto en Vercel

### 1.1 Acceder a Vercel
1. Ve a: https://vercel.com/dashboard
2. Haz clic en **"New Project"**

### 1.2 Importar Repositorio
1. Selecciona **"Import Git Repository"**
2. Busca: `quiroztejenadarwinfa/cvvinvest`
3. Haz clic en **"Import"**

### 1.3 Configurar Proyecto
- **Framework Preset**: Next.js (auto-detectado)
- **Root Directory**: `./` (por defecto)
- **Build Command**: `pnpm build` (auto-detectado)
- **Output Directory**: `.next` (auto-detectado)

## 🔧 Paso 2: Configurar Variables de Entorno

### 2.1 Variables REQUERIDAS

En la sección **Environment Variables**, agrega estas variables:

```env
# Supabase Configuration (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=https://uofardoxcfxdzajcrzxh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZmFyZG94Y2Z4ZHphamNyenhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTI2MjksImV4cCI6MjA4NDEyODYyOX0.SEMMbAQyI93XYeJVCcGkWqXGN6a3Y1FxOG6stEUk0Lo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZmFyZG94Y2Z4ZHphamNyenhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODU1MjYyOSwiZXhwIjoyMDg0MTI4NjI5fQ.nyo9NakERd1r3SgOOL79GdViFYCNZ0l4osHxF4zHhYI

# NextAuth Configuration (REQUERIDO)
NEXTAUTH_SECRET=cvvinvest-super-secret-key-2025-production
NEXTAUTH_URL=https://tu-dominio.vercel.app
```

### 2.2 Variables OPCIONALES (OAuth)

```env
# Google OAuth (Opcional)
GOOGLE_CLIENT_ID=demo-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=demo-google-client-secret

# Microsoft OAuth (Opcional)
MICROSOFT_CLIENT_ID=demo-microsoft-client-id
MICROSOFT_CLIENT_SECRET=demo-microsoft-client-secret
MICROSOFT_TENANT_ID=common
```

### 2.3 Cómo Agregar Variables

Para cada variable:
1. **Name**: Nombre de la variable (ej: `NEXT_PUBLIC_SUPABASE_URL`)
2. **Value**: Valor de la variable (ej: `https://uofardoxcfxdzajcrzxh.supabase.co`)
3. **Environment**: Selecciona **Production**, **Preview**, y **Development**
4. Haz clic en **"Add"**

## 🚀 Paso 3: Deploy

1. **Después de configurar las variables**, haz clic en **"Deploy"**
2. **Espera 2-3 minutos** mientras Vercel hace el build
3. **¡Listo!** Tu sitio estará disponible en una URL como: `https://cvvinvest-xxx.vercel.app`

## 🔧 Paso 4: Actualizar NEXTAUTH_URL

1. **Copia la URL final** que te dio Vercel (ej: `https://cvvinvest-abc123.vercel.app`)
2. **Ve a Settings > Environment Variables** en tu proyecto Vercel
3. **Edita la variable** `NEXTAUTH_URL`
4. **Cambia el valor** a tu URL real de Vercel
5. **Redeploy** el proyecto (Settings > Deployments > Redeploy)

## 🧪 Paso 5: Verificar Deployment

### 5.1 Pruebas Básicas
- [ ] **Página principal**: https://tu-dominio.vercel.app
- [ ] **Registro**: https://tu-dominio.vercel.app/registro
- [ ] **Login**: https://tu-dominio.vercel.app/login

### 5.2 Pruebas de Admin
- [ ] **Login admin**: `exe.main.darwin@gmail.com` (password: `admin12345`)
- [ ] **Panel admin**: https://tu-dominio.vercel.app/admin
- [ ] **Ver usuarios**: Panel admin > Usuarios

### 5.3 Si hay errores
1. **Ve a Vercel Dashboard** > Tu proyecto > **Functions**
2. **Haz clic en "View Function Logs"**
3. **Busca errores** en tiempo real
4. **Verifica variables de entorno** en Settings

## 🎉 ¡Deployment Exitoso!

### 📝 Información Final
- **URL de Producción**: `https://tu-dominio.vercel.app`
- **Admin Login**: `exe.main.darwin@gmail.com` (password: `admin12345`)
- **GitHub Repo**: https://github.com/quiroztejenadarwinfa/cvvinvest.git
- **Supabase Dashboard**: https://supabase.com/dashboard

### 📞 Soporte
- **Logs de Vercel**: Dashboard > Functions > View Logs
- **Logs de Supabase**: Dashboard > Logs > API Logs
- **Consola del navegador**: F12 > Console (para errores frontend)

---

## 🚨 Troubleshooting Común

### Error: "relation does not exist"
- **Causa**: No ejecutaste el SQL en Supabase
- **Solución**: Ejecuta `00-CREAR-TABLAS.sql` en Supabase SQL Editor

### Error: "Invalid JWT"
- **Causa**: Variables de Supabase incorrectas
- **Solución**: Verifica las keys en Vercel Environment Variables

### Error: "NEXTAUTH_URL mismatch"
- **Causa**: `NEXTAUTH_URL` no coincide con tu dominio
- **Solución**: Actualiza la variable con tu URL real de Vercel

### Build Error
- **Causa**: Error de TypeScript o dependencias
- **Solución**: Revisa los logs de build en Vercel

---

**🚀 ¡Tu plataforma CVVInvest estará lista en menos de 10 minutos!**