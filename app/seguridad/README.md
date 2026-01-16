# Centro de Seguridad - /seguridad

## Descripción

Esta es la página pública de Centro de Seguridad de CVVINVEST. Proporciona información completa a los usuarios sobre las características de protección disponibles en la plataforma.

## 📁 Estructura de Archivos

```
seguridad/
├── page.tsx         # Componente principal de la página
└── layout.tsx       # Layout con metadata SEO
```

## 📄 Archivos

### page.tsx
- Componente principal (client-side)
- Muestra 6 características de seguridad
- Muestra 6 consejos de seguridad
- Incluye 6 FAQs
- Acciones rápidas para el usuario
- Estado general de seguridad

### layout.tsx
- Define metadata para SEO
- Title: "Centro de Seguridad | CVVINVEST"
- Description: Información sobre protección
- Keywords: seguridad, protección, contraseña, autenticación

## 🎯 Funcionalidades

### Status Cards
- Estado de Seguridad: Óptimo/Advertencia/Crítico
- Verificaciones Activas: 6/6
- Cumplimiento: 100% GDPR

### Features de Seguridad (6)
1. ✅ Autenticación Segura
2. ✅ Gestión de Credenciales
3. ✅ Verificación de Dispositivos
4. ✅ Protección de Datos
5. 🔓 Validación de Transacciones (Premium)
6. ✅ Monitoreo Continuo

### Consejos de Seguridad (6)
1. 🔐 Usa contraseñas fuertes
2. 👁️ No compartas tu contraseña
3. 📧 Verifica los correos
4. 📱 Usa dispositivos seguros
5. 📊 Revisa tu historial
6. ⚠️ Reporta problemas

### FAQs (6 preguntas)
- ¿Cómo cambio mi contraseña?
- ¿Qué hago si olvido mi contraseña?
- ¿Cómo veo qué dispositivos tienen acceso?
- ¿Es seguro usar WiFi público?
- ¿Qué debo hacer si sospecho una violación?
- ¿Compartis mis datos?

### Acciones Rápidas
- Link a `/dashboard/configuracion#seguridad`
- Link para descargar guía de seguridad
- Link a `/contacto` para soporte
- Link a `/centro-ayuda`

## 🔗 Enlaces Relacionados

**Dentro de la aplicación:**
- `/dashboard/configuracion#seguridad` - Configuración de cuenta
- `/admin/seguridad` - Panel administrativo
- `/contacto` - Formulario de contacto
- `/centro-ayuda` - Centro de ayuda
- `GUIA_SEGURIDAD.md` - Descarga la guía completa

**Documentación:**
- [DOCUMENTACION_SEGURIDAD_PUBLICA.md](../DOCUMENTACION_SEGURIDAD_PUBLICA.md)
- [GUIA_SEGURIDAD.md](../GUIA_SEGURIDAD.md)
- [MEJORES_PRACTICAS_SEGURIDAD.md](../MEJORES_PRACTICAS_SEGURIDAD.md)
- [INDICE_RUTAS_PUBLICAS.md](../INDICE_RUTAS_PUBLICAS.md)

## 🎨 Diseño

**Tema:** Oscuro (Dark Mode)
- Colores: Slate 800-900 para fondo
- Acentos: Blue, Green, Yellow, Purple
- Responsive: Mobile, Tablet, Desktop

**Componentes UI:**
- Card
- Badge
- Button
- Layout Grid (1/2/3 columnas según pantalla)

**Iconos (Lucide React):**
- Shield, Lock, Key, Smartphone, Globe, AlertCircle
- CheckCircle, Zap, FileText, Users, BarChart3, Download, ArrowRight
- Eye, EyeOff

## 🔒 Seguridad

✅ No requiere autenticación
✅ Información pública y segura
✅ No accede a datos sensibles
✅ No hace peticiones a APIs privadas

## 📱 Responsive

- **Desktop (lg):** 3 columnas para features y tips
- **Tablet (md):** 2 columnas para features y tips
- **Mobile (sm):** 1 columna para features y tips

## ✅ Testing Checklist

- [ ] La página carga sin errores
- [ ] Todos los iconos se muestran correctamente
- [ ] Las cards tienen layout correcto
- [ ] Los botones son funcionales
- [ ] Los links navegan correctamente
- [ ] Responsive en móvil, tablet y desktop
- [ ] Los colores tienen buen contraste
- [ ] Los FAQs son legibles
- [ ] No hay errores en consola
- [ ] La metadata SEO es correcta

## 🚀 Deployment

Esta página se despliega automáticamente con el resto de la aplicación:

1. Push a GitHub
2. Vercel automáticamente detecta cambios
3. Deploy en producción

## 📊 Estadísticas

- Líneas de código: ~400 (page.tsx)
- Componentes: 6 features + 6 tips + 6 FAQs
- Iconos: 15+ de lucide-react
- Responsive points: 3 (mobile, tablet, desktop)

## 🔄 Mantenimiento

Para actualizar la página:

1. Editar `page.tsx` para cambiar contenido
2. Editar `layout.tsx` para cambiar metadata
3. Actualizar [DOCUMENTACION_SEGURIDAD_PUBLICA.md](../DOCUMENTACION_SEGURIDAD_PUBLICA.md)
4. Commit y push a GitHub

## 📞 Soporte

Para reportar problemas:
- Email: soportecvvinvest@proton.me
- Teléfono: +593 99 969 3683
- Formulario: /contacto
