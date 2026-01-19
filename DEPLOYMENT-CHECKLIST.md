# ✅ Checklist de Deployment - CVVInvest

## 📋 Pre-Deployment (Local)

### 🔧 Configuración Local
- [ ] ✅ Proyecto clonado/descargado
- [ ] ✅ `pnpm install` ejecutado sin errores
- [ ] ✅ `.env.local` creado con variables de Supabase
- [ ] ✅ Archivos críticos verificados (README, package.json, etc.)
- [ ] ✅ Build local exitoso (`pnpm build`)

### 🗄️ Base de Datos Supabase
- [ ] 🔗 Proyecto Supabase creado
- [ ] 📊 Script `00-CREAR-TABLAS.sql` ejecutado en SQL Editor
- [ ] 👤 Usuario admin creado (exe.main.darwin@gmail.com)
- [ ] 🔑 Variables de entorno copiadas (URL, ANON_KEY, SERVICE_ROLE_KEY)
- [ ] 🧪 Conexión verificada (opcional: `node scripts/verify-supabase.js`)

## 🐙 GitHub Setup

### 📤 Subir Código
- [ ] 🔄 Repositorio Git inicializado (`git init`)
- [ ] 📁 Repositorio GitHub creado (público/privado)
- [ ] 🔗 Remote origin configurado
- [ ] 📦 Primer commit realizado
- [ ] ⬆️ Código subido (`git push -u origin main`)

### 🔒 Seguridad
- [ ] ✅ `.gitignore` protege archivos `.env*`
- [ ] ❌ Ningún archivo `.env` en el repositorio
- [ ] 🔐 Secretos NO expuestos en código público

## ☁️ Vercel Deployment

### 🚀 Configuración Inicial
- [ ] 🔗 Repositorio GitHub conectado a Vercel
- [ ] ⚙️ Framework detectado como Next.js
- [ ] 📁 Root directory configurado como `./`
- [ ] 🏗️ Build command: `pnpm build` (auto)
- [ ] 📤 Output directory: `.next` (auto)

### 🔧 Variables de Entorno
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://uofardoxcfxdzajcrzxh.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIs...`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIs...`
- [ ] `NEXTAUTH_SECRET` = `tu-secreto-super-seguro-cambiar-esto`
- [ ] `NEXTAUTH_URL` = `https://tu-dominio.vercel.app`
- [ ] OAuth variables (opcional): `GOOGLE_CLIENT_ID`, etc.

### 🎯 Deploy
- [ ] 🚀 Deploy iniciado automáticamente
- [ ] ✅ Build exitoso (sin errores críticos)
- [ ] 🌐 URL de producción generada
- [ ] 📱 Sitio accesible públicamente

## 🧪 Testing Post-Deploy

### 🔍 Verificaciones Básicas
- [ ] 🏠 Página principal carga correctamente
- [ ] 📱 Diseño responsive funciona
- [ ] 🌙 Tema oscuro/claro funciona
- [ ] 🔗 Enlaces de navegación funcionan

### 🔐 Autenticación
- [ ] 📝 Página de registro accesible (`/registro`)
- [ ] 🔑 Página de login accesible (`/login`)
- [ ] ✅ Registro de nuevo usuario funciona
- [ ] 🔓 Login con credenciales funciona
- [ ] 📊 Dashboard carga después del login

### 👨‍💼 Panel Admin
- [ ] 🔑 Login admin funciona (exe.main.darwin@gmail.com)
- [ ] 🎛️ Panel admin accesible (`/admin`)
- [ ] 👥 Lista de usuarios carga
- [ ] 💰 Lista de depósitos carga
- [ ] 📊 Estadísticas básicas muestran datos

### 🔧 APIs
- [ ] ✅ `/api/auth/user` responde correctamente
- [ ] 👥 `/api/users-admin` funciona (solo admin)
- [ ] 💰 `/api/deposits-admin` funciona (solo admin)
- [ ] 🔄 Errores de API muestran mensajes apropiados

## 🚨 Troubleshooting

### Si algo falla:

#### 🔗 Error de Conexión Supabase
1. Verifica variables de entorno en Vercel
2. Confirma que las tablas existan en Supabase
3. Revisa logs en Vercel Dashboard > Functions

#### 🏗️ Error de Build
1. Revisa errores en Vercel build logs
2. Verifica que todas las dependencias estén en `package.json`
3. Confirma que no hay errores de TypeScript críticos

#### 🔐 Error de Autenticación
1. Verifica `NEXTAUTH_SECRET` y `NEXTAUTH_URL`
2. Confirma que Supabase Auth esté habilitado
3. Revisa configuración de OAuth (si se usa)

#### 📊 Datos No Cargan
1. Verifica que `SUPABASE_SERVICE_ROLE_KEY` esté configurada
2. Confirma que las tablas tengan datos de prueba
3. Revisa políticas RLS en Supabase

## 🎉 ¡Deployment Exitoso!

### 📝 Información Final
- **URL de Producción**: `https://tu-dominio.vercel.app`
- **Admin Login**: `exe.main.darwin@gmail.com`
- **Supabase Dashboard**: `https://supabase.com/dashboard`
- **Vercel Dashboard**: `https://vercel.com/dashboard`

### 📞 Soporte
- **Logs de Vercel**: Dashboard > Functions > View Logs
- **Logs de Supabase**: Dashboard > Logs
- **Documentación**: `scripts/deploy-setup.md`

---

**🚀 ¡Tu plataforma CVVInvest está lista para producción!**

### 📈 Próximos Pasos (Opcional)
- [ ] Configurar dominio personalizado
- [ ] Habilitar analytics
- [ ] Configurar monitoreo de errores
- [ ] Implementar backups automáticos
- [ ] Configurar alertas de rendimiento