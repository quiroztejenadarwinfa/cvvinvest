# 📚 Guía de Ayuda del Usuario - Centro de Ayuda

## ¿Qué es el Centro de Ayuda?

Es una sección completa del dashboard del usuario diseñada para proporcionar soporte, respuestas a preguntas frecuentes y documentación importante sobre cómo usar la plataforma de inversión.

## 📍 Ubicación

- **Ruta:** `/dashboard/ayuda`
- **Acceso:** Desde el Dashboard del usuario → Menú Lateral → "Ayuda"
- **Disponible para:** Todos los usuarios registrados (no administrador)

## 🎯 Secciones del Centro de Ayuda

### 1. **Canales de Contacto** (3 cards)

Proporciona múltiples formas de contactar al soporte:

- **📧 Email**
  - Correo: `soportecvvinvest@proton.me`
  - Respuesta: 24 horas

- **📞 Teléfono**
  - Número: `+593 99 969 3683`
  - Disponibilidad: 24/7

- **📝 Formulario Web**
  - Enlace directo a `/contacto`
  - Disponibilidad: 24/7

### 2. **Preguntas Frecuentes (FAQs)**

8 preguntas comunes sobre inversiones:

1. ¿Cómo funciona el proceso de inversión?
2. ¿Cuál es el depósito mínimo?
3. ¿Cuánto tiempo tarda en procesarse un retiro?
4. ¿Es segura la plataforma?
5. ¿Qué métodos de pago aceptan?
6. ¿Cómo veo mis reportes de inversión?
7. ¿Cuáles son los riesgos?
8. ¿Puedo cambiar mi plan?

**Formato:** Acordeones interactivos (expandibles)
- Click para ver la respuesta completa
- Icono descriptivo para cada pregunta

### 3. **Formulario Web - Contáctanos**

Sección destacada sobre cómo usar el formulario de contacto:

- **Descripción:** Explicación de cómo enviar mensajes
- **Ventajas:** Lista de beneficios
- **Contenido del formulario:**
  - Nombre
  - Email
  - Asunto
  - Mensaje
- **Botón:** Enlace directo a `/contacto`

### 4. **Documentación Legal**

3 cards con links a documentos importantes:

- **Términos y Condiciones** (`/terminos`)
  - Descripción: Lee nuestros términos legales completos
  
- **Política de Privacidad** (`/privacidad`)
  - Descripción: Cómo protegemos tus datos personales
  
- **Centro Legal** (`/legal`)
  - Descripción: Información regulatoria y de cumplimiento

**Característica:** Hover effects y links directos

### 5. **Tu Nivel de Soporte**

Información personalizada según el plan del usuario:

- Muestra el plan actual del usuario
- Lista de beneficios incluidos
- Información de tiempo de respuesta promedio
- Mensaje motivacional de contacto

## 🎨 Características de Diseño

- **Diseño Responsivo:** Funciona en desktop, tablet y móvil
- **Acordeones Interactivos:** FAQs con expandir/contraer
- **Color Coding:** Iconos y cards con colores distintivos
- **Gradientes:** Secciones con degradados sutiles
- **Hover Effects:** Interacción visual en cards y botones
- **Iconografía:** Iconos de Lucide React para cada sección

## 💻 Componentes Usados

```tsx
// Componentes del Dashboard
- DashboardSidebar: Menú lateral
- DashboardHeader: Encabezado del dashboard

// Iconos (Lucide React)
- Mail, Phone, MessageSquare (Contacto)
- FileText, Shield, Book (Documentación)
- HelpCircle, CheckCircle, AlertCircle (Estados)
- ExternalLink (Enlaces externos)
```

## 🔐 Seguridad & Acceso

- ✅ Requiere login de usuario
- ✅ No permite acceso a administrador
- ✅ Redirige automáticamente si no está autenticado
- ✅ Redirige admin a `/admin`

## 📱 Flujo de Uso del Usuario

1. Usuario inicia sesión en el dashboard
2. Busca ayuda en el menú lateral
3. Click en "Ayuda"
4. Ve el Centro de Ayuda
5. **Opciones:**
   - Leer las FAQs
   - Contactar por email, teléfono o formulario
   - Revisar documentación legal
   - Cambiar su plan

## 🔗 Relación con Otras Páginas

```
Dashboard (Usuario)
    ↓
Centro de Ayuda (/dashboard/ayuda)
    ├→ /contacto (Formulario)
    ├→ /terminos (Legal)
    ├→ /privacidad (Legal)
    └→ /legal (Legal)
```

## ✨ Información Mostrada

El Centro de Ayuda muestra información sobre:

✅ Cómo invertir
✅ Depósitos y montos mínimos
✅ Tiempos de retiro
✅ Seguridad de la plataforma
✅ Métodos de pago
✅ Cómo acceder a reportes
✅ Riesgos de inversión
✅ Cambios de plan
✅ Contacto del soporte
✅ Información legal
✅ Beneficios del plan del usuario

## 🎯 Objetivos

1. **Autoservicio:** Responder preguntas comunes automáticamente
2. **Soporte:** Facilitar contacto con el equipo
3. **Transparencia:** Acceso a documentación legal
4. **Confianza:** Mostrar seguridad y profesionalismo
5. **Experiencia:** Interface clara y fácil de usar

## 📊 Datos Mostrados

```
Canales de Contacto: 3
Preguntas Frecuentes: 8
Documentos Legales: 3
Información de Plan: 1 (personalizada)
```

## 🚀 Próximas Mejoras (Opcionales)

- [ ] Chat en vivo integrado
- [ ] Búsqueda de FAQs
- [ ] Historial de contactos enviados
- [ ] Video tutoriales
- [ ] Guías paso a paso
- [ ] Base de conocimiento completa
- [ ] Integración con sistema de tickets

---

**Nota:** Esta página está completamente integrada con el sistema de contacto que ya existe. Los mensajes que los usuarios envían desde el formulario aparecen en el Buzón de Mensajes del administrador.
