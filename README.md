# 🏦 CVVInvest Platform

Una plataforma de inversiones moderna y segura construida con Next.js 14, Supabase y TypeScript.

## ✨ Características Principales

- 🔐 **Autenticación segura** con Supabase Auth + OAuth
- 📊 **Dashboard interactivo** para usuarios e inversores  
- 👨‍💼 **Panel de administración** completo
- 💰 **Sistema de depósitos** con múltiples métodos de pago
- 📈 **Gestión de inversiones** con planes flexibles
- 🔔 **Notificaciones en tiempo real**
- 🎨 **Diseño responsive** con tema oscuro/claro
- 🚀 **Optimizado para producción**

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Backend** | Supabase (PostgreSQL) |
| **Estilos** | Tailwind CSS, shadcn/ui |
| **Auth** | Supabase Auth, NextAuth.js |
| **Deploy** | Vercel |

## 🚀 Inicio Rápido (5 minutos)

### 1. Preparación automática
```bash
# Clona y prepara el proyecto
git clone https://github.com/tu-usuario/cvvinvest-platform.git
cd cvvinvest-platform

# Ejecuta el script de inicio rápido
chmod +x quick-start.sh
./quick-start.sh
```

### 2. Configurar Supabase
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Crea un nuevo proyecto
3. En **SQL Editor**, ejecuta el contenido de `00-CREAR-TABLAS.sql`
4. Copia las credenciales a `.env.local`

### 3. Verificar conexión
```bash
# Verifica que todo esté configurado
node scripts/verify-supabase.js

# Inicia en desarrollo
pnpm dev
```

¡Listo! Tu plataforma estará en http://localhost:3000

## 📋 Deployment a Producción

Sigue la guía completa: **[scripts/deploy-setup.md](scripts/deploy-setup.md)**

### Resumen rápido:
1. ✅ Ejecutar SQL en Supabase
2. 🐙 Subir a GitHub  
3. ☁️ Deploy en Vercel
4. 🔧 Configurar variables de entorno
5. 🎉 ¡Listo!

## 🏗️ Estructura del Proyecto

```
cvvinvest-platform/
├── app/                    # App Router (Next.js 14)
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard de usuario
│   ├── admin/            # Panel de administración
│   └── (auth)/           # Páginas de autenticación
├── components/            # Componentes reutilizables
├── lib/                  # Utilidades y configuración
├── scripts/              # Scripts de utilidad
└── 00-CREAR-TABLAS.sql   # Schema de base de datos
```

## 👥 Roles y Funcionalidades

### 🙋‍♂️ Usuario Regular
- ✅ Registro y login seguro
- 📊 Dashboard personalizado
- 💰 Realizar depósitos
- 📈 Ver inversiones activas
- 📱 Notificaciones en tiempo real

### 👨‍💼 Administrador
- 🎛️ Panel de control completo
- 👥 Gestión de usuarios
- ✅ Aprobación de depósitos/retiros
- 📊 Reportes y analytics
- 🔧 Configuración del sistema

## 🔐 Seguridad Implementada

- 🛡️ **Supabase Auth** con confirmación de email
- 🔒 **Row Level Security (RLS)** en base de datos
- ✅ **Validación de datos** en frontend y backend
- 🌐 **Headers de seguridad** (CSP, HSTS, etc.)
- 🔑 **Service Role Key** para operaciones admin
- 🚫 **Protección CSRF** y XSS

## 📊 Base de Datos

### Tablas principales:
- **users**: Información de usuarios
- **deposits**: Depósitos y pagos
- **investments**: Inversiones activas
- **withdrawals**: Retiros solicitados
- **notifications**: Sistema de notificaciones

### Ejecutar schema:
```sql
-- Ejecuta en Supabase SQL Editor
-- Contenido completo en: 00-CREAR-TABLAS.sql
```

## 🧪 Testing y Desarrollo

```bash
# Verificar conexión Supabase
node scripts/verify-supabase.js

# Desarrollo local
pnpm dev

# Build de producción
pnpm build

# Verificar build
pnpm start
```

## 📞 Soporte y Troubleshooting

### Problemas comunes:
1. **Error de conexión**: Verifica variables en `.env.local`
2. **Tablas no existen**: Ejecuta `00-CREAR-TABLAS.sql`
3. **RLS bloqueando**: Usa service_role_key en APIs admin
4. **Build fallando**: Revisa errores de TypeScript

### Logs útiles:
- **Vercel**: Dashboard > Functions > View Logs
- **Supabase**: Dashboard > Logs
- **Browser**: F12 > Console/Network

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

**¿Necesitas ayuda?** Revisa la [guía de deployment](scripts/deploy-setup.md) o abre un issue.

🚀 **¡Hecho con ❤️ para la comunidad de inversores!**