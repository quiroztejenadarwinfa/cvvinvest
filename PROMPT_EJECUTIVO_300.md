# 📱 PROMPT EJECUTIVO: CVVINVEST - PLATAFORMA DE INVERSIÓN

## Visión Rápida

**CVVINVEST** es una plataforma moderna, segura y completamente **responsive** para gestión de inversiones financieras. Diseñada mobile-first con stack tecnológico profesional (Next.js, React, Supabase, Tailwind).

---

## Características Principales

### 🔐 Autenticación & Seguridad
- Email/Contraseña, OAuth, 2FA (Google Authenticator)
- Confirmación automática de email
- RLS en BD, CSRF protection, rate limiting
- Logging de auditoría completo

### 💳 Sistema de 5 Planes Tier
```
Gratuito → Estándar ($9.99) → Pro ($29) → VIP ($99) → Elite ($299)
```
- Control granular de features por plan
- Acceso dinámico a funcionalidades
- Límites configurables por nivel

### 📱 Totalmente Responsive
- **Mobile** (< 640px): Hamburguesa, cards stacked
- **Tablet** (640-1024px): Sidebar colapsable
- **Desktop** (1024px+): Layout 3-4 columnas
- **TV** (> 1920px): UI simplificada, texto grande

### 🎨 Diseño Profesional
- Paleta: Azul (#2563eb), Gris, Colores de estado
- Dark/Light mode con persistencia
- Accesibilidad WCAG 2.1 AA
- Tipografía Inter, espaciado coherente

---

## Estructura de Páginas

**Públicas**: Home, Planes, Login, Registro, Recuperar contraseña, Nosotros, Contacto, Legal

**Usuario**: Dashboard, Inversiones, Depósitos, Retiros, Reportes (Pro+), Analytics (Pro+), Seguridad, Configuración

**Admin**: Dashboard, Usuarios, Inversiones, Depósitos, Retiros, Reportes, Configuración

---

## Funcionalidades Avanzadas

✅ Sistema de notificaciones en tiempo real
✅ Reportes exportables (PDF, CSV, Excel)
✅ Gráficos interactivos (Recharts)
✅ i18n (Español/Inglés)
✅ Análisis técnico avanzado
✅ Integración de pagos

---

## Performance & Seguridad

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms
- **Lighthouse**: > 95 en todas métricas
- **Bundle**: < 300KB gzipped
- **HTTPS, CSP headers, Rate limiting, Input validation**

---

## Tecnologías

Next.js 14+ | React 18+ | TypeScript | Supabase | PostgreSQL | Shadcn/UI | Tailwind | Recharts | Lucide Icons | Vercel

---

## Estado

✅ Autenticación completa
✅ Sistema de planes funcional
✅ Dashboard responsivo
✅ Admin panel completo
✅ Notificaciones implementadas
✅ Seguridad enterprise-grade

**Listo para producción y escalabilidad** 🚀
