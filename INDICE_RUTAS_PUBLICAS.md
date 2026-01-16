# 🗺️ Mapa de Rutas Públicas - CVVINVEST

## Rutas Principales

### Públicas (Acceso sin login)

| Ruta | Página | Descripción | Componentes |
|------|--------|-------------|------------|
| `/` | Home | Página de inicio principal | Hero, Features, CTA |
| `/login` | Login | Formulario de inicio de sesión | Form, Links a signup y recover |
| `/registro` | Registro | Formulario de registro de usuario | Form, Validaciones, Terms |
| `/recuperar-password` | Recuperar Contraseña | Recuperación de acceso | Email verification, Code input |
| `/contacto` | Contacto | Formulario de contacto | Textarea, Name, Email, Subject |
| `/seguridad` | Centro de Seguridad | Info de protección y consejos | Features, Tips, FAQs, Status |
| `/privacidad` | Privacidad | Política de privacidad | Texto legal |
| `/terminos` | Términos | Términos y condiciones | Texto legal |
| `/legal` | Legal | Información regulatoria | Links a privacidad, términos, etc |
| `/nosotros` | Nosotros | Información sobre CVVINVEST | Historia, Misión, Visión |
| `/planes` | Planes | Planes de inversión disponibles | Cards de planes, Comparación |
| `/chat` | Chat | Sistema de chatbot de IA | Chat interface, Messages |

### Autenticadas (Requieren login)

| Ruta | Página | Descripción | Componentes |
|------|--------|-------------|------------|
| `/dashboard` | Dashboard | Panel principal del usuario | Cards, Gráficos, Resumen |
| `/dashboard/configuracion` | Configuración | Configuración de cuenta | Tabs, Formularios |
| `/dashboard/planes` | Planes | Gestión de planes del usuario | Lista, Cambios |
| `/dashboard/depositos` | Depósitos | Gestión de depósitos | Tabla, Nuevo depósito |
| `/dashboard/retiros` | Retiros | Gestión de retiros | Tabla, Nuevo retiro |
| `/dashboard/inversiones` | Inversiones | Gestión de inversiones | Tabla, Filtros, Analytics |
| `/dashboard/reportes` | Reportes | Reportes financieros | Gráficos, Descargas |
| `/dashboard/mensajes` | Mensajes | Buzón de mensajes | Chat, Lista |
| `/dashboard/ayuda` | Ayuda | Centro de ayuda | FAQs, Contacto, Docs |

### Administrativas (Solo Admin)

| Ruta | Página | Descripción | Componentes |
|------|--------|-------------|------------|
| `/admin` | Admin Home | Panel de administración | Stats, Links |
| `/admin/usuarios` | Usuarios | Gestión de usuarios | Tabla, Búsqueda, Acciones |
| `/admin/depositos` | Depósitos | Auditoría de depósitos | Tabla, Filtros, Historial |
| `/admin/inversiones` | Inversiones | Auditoría de inversiones | Tabla, Gráficos |
| `/admin/retiros` | Retiros | Auditoría de retiros | Tabla, Filtros |
| `/admin/reportes` | Reportes | Reportes administrativos | Gráficos, Estadísticas |
| `/admin/mensajes` | Mensajes | Gestión de mensajes | Tabla, Respuestas |
| `/admin/seguridad` | Seguridad | Auditoría de seguridad | Logs, IPs, Eventos |
| `/admin/configuracion` | Configuración | Config de plataforma | Tasas, Límites, Global |

---

## Estructura de Directorios

```
app/
├── page.tsx                    # / (Home)
├── layout.tsx                  # Layout global
├── globals.css
├── login/
│   └── page.tsx               # /login
├── registro/
│   └── page.tsx               # /registro
├── recuperar-password/
│   └── page.tsx               # /recuperar-password
├── contacto/
│   └── page.tsx               # /contacto
├── seguridad/                 # ✨ NUEVO
│   ├── page.tsx               # /seguridad
│   └── layout.tsx             # Layout con metadata
├── privacidad/
│   └── page.tsx               # /privacidad
├── terminos/
│   └── page.tsx               # /terminos
├── legal/
│   └── page.tsx               # /legal
├── nosotros/
│   └── page.tsx               # /nosotros
├── planes/
│   └── page.tsx               # /planes
├── chat/
│   └── page.tsx               # /chat
├── dashboard/
│   ├── page.tsx               # /dashboard
│   ├── layout.tsx
│   ├── configuracion/
│   │   └── page.tsx           # /dashboard/configuracion
│   ├── planes/
│   │   └── page.tsx           # /dashboard/planes
│   ├── depositos/
│   │   └── page.tsx           # /dashboard/depositos
│   ├── retiros/
│   │   └── page.tsx           # /dashboard/retiros
│   ├── inversiones/
│   │   └── page.tsx           # /dashboard/inversiones
│   ├── reportes/
│   │   └── page.tsx           # /dashboard/reportes
│   ├── mensajes/
│   │   └── page.tsx           # /dashboard/mensajes
│   └── ayuda/
│       └── page.tsx           # /dashboard/ayuda
├── admin/
│   ├── page.tsx               # /admin
│   ├── layout.tsx
│   ├── usuarios/
│   │   └── page.tsx           # /admin/usuarios
│   ├── depositos/
│   │   └── page.tsx           # /admin/depositos
│   ├── inversiones/
│   │   └── page.tsx           # /admin/inversiones
│   ├── retiros/
│   │   └── page.tsx           # /admin/retiros
│   ├── reportes/
│   │   └── page.tsx           # /admin/reportes
│   ├── mensajes/
│   │   └── page.tsx           # /admin/mensajes
│   ├── seguridad/
│   │   └── page.tsx           # /admin/seguridad
│   └── configuracion/
│       └── page.tsx           # /admin/configuracion
└── api/
    └── [rutas de API]
```

---

## Estado de Implementación

### ✅ Completadas
- ✅ `/` - Home
- ✅ `/login` - Login
- ✅ `/registro` - Registro
- ✅ `/recuperar-password` - Recuperar contraseña
- ✅ `/contacto` - Contacto
- ✅ `/privacidad` - Privacidad
- ✅ `/terminos` - Términos
- ✅ `/legal` - Legal
- ✅ `/nosotros` - Nosotros
- ✅ `/planes` - Planes
- ✅ `/chat` - Chat
- ✅ `/dashboard` - Dashboard
- ✅ `/dashboard/configuracion` - Configuración
- ✅ `/dashboard/planes` - Planes
- ✅ `/dashboard/depositos` - Depósitos
- ✅ `/dashboard/retiros` - Retiros
- ✅ `/dashboard/inversiones` - Inversiones
- ✅ `/dashboard/reportes` - Reportes
- ✅ `/dashboard/mensajes` - Mensajes
- ✅ `/dashboard/ayuda` - Ayuda
- ✅ `/admin` - Admin Home
- ✅ `/admin/usuarios` - Usuarios
- ✅ `/admin/depositos` - Depósitos
- ✅ `/admin/inversiones` - Inversiones
- ✅ `/admin/retiros` - Retiros
- ✅ `/admin/reportes` - Reportes
- ✅ `/admin/mensajes` - Mensajes
- ✅ `/admin/seguridad` - Seguridad
- ✅ `/admin/configuracion` - Configuración

### ✨ NUEVA (Implementada)
- ✨ `/seguridad` - Centro de Seguridad Pública

---

## Información de Cada Ruta

### 1. `/seguridad` - Centro de Seguridad (NUEVA)

**Tipo:** Pública (Acceso sin login)

**Descripción:**
Centro informativo para que los usuarios conozcan las características de seguridad de CVVINVEST.

**Secciones:**
1. Estado General (3 cards)
2. Características de Seguridad (6 features)
3. Consejos de Seguridad (6 tips)
4. Acciones Rápidas (2 cards)
5. Preguntas Frecuentes (6 FAQs)
6. Contacto de Soporte

**Componentes:**
- Card, Badge, Button
- Iconos: Shield, Lock, Key, Smartphone, Globe, AlertCircle, CheckCircle, Zap, FileText, Users, BarChart3, Download, ArrowRight, Eye, EyeOff

**Metadata:**
- Title: "Centro de Seguridad | CVVINVEST"
- Description: "Centro de Seguridad de CVVINVEST. Información sobre protección de cuenta, autenticación, validación de transacciones y consejos de seguridad."

**Links Relacionados:**
- `/dashboard/configuracion#seguridad` - Configuración de seguridad
- `/admin/seguridad` - Panel de auditoría (solo admin)
- `/contacto` - Contactar soporte
- `/centro-ayuda` - Centro de ayuda

---

## Acceso a Rutas

### Públicas
Cualquier usuario puede acceder sin autenticación.

### Autenticadas
Requieren `localStorage.getItem("cvvinvest_user")` no null.
Redirigen a `/login` si no están autenticados.

### Administrativas
Requieren que el usuario tenga `rol === "admin"`.
Redirigen a `/dashboard` si no son admin.

---

## Seguridad

### Validaciones
- ✅ No se ejecuta código del usuario
- ✅ Validación de entrada en formularios
- ✅ CSRF protection (si aplica)
- ✅ XSS protection (React)
- ✅ Rate limiting en APIs

### Protecciones
- ✅ LocalStorage encryption (datos sensibles)
- ✅ Sesión con expiración
- ✅ Logout automático
- ✅ Validación de credenciales

---

## Documentación Relacionada

- [DOCUMENTACION_SEGURIDAD_PUBLICA.md](./DOCUMENTACION_SEGURIDAD_PUBLICA.md) - Documentación de la página /seguridad
- [GUIA_CENTRO_AYUDA.md](./GUIA_CENTRO_AYUDA.md) - Guía del centro de ayuda
- [GUIA_SEGURIDAD.md](./GUIA_SEGURIDAD.md) - Guía completa de seguridad
- [MEJORES_PRACTICAS_SEGURIDAD.md](./MEJORES_PRACTICAS_SEGURIDAD.md) - Mejores prácticas
