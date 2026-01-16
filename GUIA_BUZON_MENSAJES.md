# 📧 Sistema de Buzón de Mensajes - Guía de Uso

## ¿Qué es el Buzón de Mensajes?

Es un apartado exclusivo para el administrador donde se centralizan **todos los mensajes de contacto** que envían los usuarios desde la página de "Contáctanos".

## 📍 Ubicación

### Para Usuarios:
- Página: `/contacto`
- Los usuarios rellenan un formulario con:
  - Nombre
  - Email
  - Asunto
  - Mensaje

### Para Administrador:
- Página: `/admin/mensajes`
- Accesible desde el menú lateral del panel admin
- También hay un badge en el header mostrando **mensajes sin leer**

## 🚀 Características

### 1. **Listado de Mensajes**
- Vista de todos los mensajes ordenados por fecha (más recientes primero)
- Indicador visual si está leído o sin leer
- Click en un mensaje para ver detalles completos

### 2. **Información Completa del Mensaje**
Cada mensaje muestra:
- Nombre del remitente
- Email del remitente (para responder)
- Asunto
- Contenido del mensaje
- Fecha y hora exacta de envío
- Estado (Leído/Sin leer)

### 3. **Acciones Disponibles**
- ✅ **Marcar como Leído**: Cambiar estado del mensaje
- ❌ **Eliminar**: Borrar un mensaje específico
- 🗑️ **Eliminar Todos**: Limpiar todo el buzón (con confirmación)

### 4. **Indicadores de Estado**
- 🟦 **Azul**: Mensaje sin leer
- 🟩 **Verde**: Mensaje ya leído

### 5. **Badge de Notificación**
En el header del admin aparece un número rojo mostrando cuántos mensajes sin leer hay.

## 💾 Almacenamiento de Datos

Los mensajes se guardan en **localStorage** del navegador, lo que significa:
- ✅ Los mensajes persisten aunque cierre el navegador
- ✅ Acceso inmediato sin servidor
- ✅ Privacidad - datos solo en el navegador del admin

## 🔄 Flujo de Contacto

```
Usuario en /contacto
        ↓
Rellena formulario y envía
        ↓
Mensaje se guarda en localStorage
        ↓
Toast: "Mensaje enviado"
        ↓
Administrador ve badge en header
        ↓
Admin va a /admin/mensajes
        ↓
Visualiza, marca como leído y responde por email
```

## 📧 Responder a Mensajes

Para responder a un usuario:
1. Ver el mensaje en el buzón
2. Copiar el email del remitente (aparece al final del mensaje)
3. Enviar email desde tu cliente de correo a ese email

El email de respuesta debería ser: `soportecvvinvest@proton.me`

## 🔐 Seguridad

- Solo administradores pueden acceder (`/admin/mensajes`)
- Requiere login y verificación de rol de admin
- Los datos se guardan localmente en el navegador

## 📊 Estadísticas

El buzón muestra:
- Total de mensajes
- Cantidad de mensajes sin leer
- Fecha exacta de cada mensaje

## ⚙️ Configuración Técnica

### Archivos Involucrados:
- `lib/messages.ts` - Servicios de gestión de mensajes
- `app/admin/mensajes/page.tsx` - Página del buzón
- `app/contacto/page.tsx` - Formulario de contacto
- `components/admin/sidebar.tsx` - Menú del admin
- `components/admin/header.tsx` - Header con notificaciones

### Estructura de Datos:
```typescript
interface ContactMessage {
  id: string              // Identificador único (timestamp)
  name: string            // Nombre del remitente
  email: string           // Email del remitente
  subject: string         // Asunto del mensaje
  message: string         // Contenido del mensaje
  createdAt: string       // Fecha ISO
  read: boolean          // Estado leído/no leído
}
```

## 💡 Ejemplos de Uso

### Enviar Mensaje (Usuario):
1. Ir a `/contacto`
2. Llenar los campos
3. Click "Enviar Mensaje"
4. Ver confirmación

### Ver Mensajes (Admin):
1. Login en admin
2. Click en "Buzón de Mensajes" en el menú
3. Ver listado de mensajes
4. Click en un mensaje para ver detalles
5. Marcar como leído o eliminar

## 🎯 Próximas Mejoras (Opcionales)
- [ ] Envío automático de email a administrador
- [ ] Búsqueda y filtros en el buzón
- [ ] Exportar mensajes a PDF
- [ ] Respuestas automáticas a usuarios
- [ ] Sincronización con base de datos real
