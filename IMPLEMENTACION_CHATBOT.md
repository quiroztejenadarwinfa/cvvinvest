# Sistema de Chatbot - Documentación de Implementación

## Resumen General

Se ha implementado un sistema completo de chat en tiempo real que permite:
- Comunicación entre usuarios y administradores
- Persistencia de mensajes usando localStorage
- Widget flotante disponible globalmente
- Panel de administración para gestionar chats por usuario
- Página dedicada para usuario final en /chat
- Integración con página de depósitos para redirigir al chatbot

## Archivos Creados

### 1. **lib/chat.ts** (157 líneas)
Core del sistema de chat con:
- Interfaz `ChatSession`: almacena información de sesión, mensajes, estado (open/pending/resolved)
- Interfaz `ChatMessage`: estructura individual de cada mensaje
- Funciones principales:
  - `getAllChatSessions()`: obtiene todas las sesiones
  - `getUserCurrentSession(userId)`: obtiene sesión actual del usuario
  - `createOrGetChatSession(userId)`: crea o recupera sesión
  - `addMessageToSession(sessionId, userId, message, type)`: añade mensaje
  - `markSessionAsRead(sessionId)`: marca como leída
  - `updateSessionStatus(sessionId, status)`: actualiza estado
  - `getUnreadSessions()`: obtiene sesiones no leídas

**Almacenamiento:**
- Key: `CHAT_SESSIONS_KEY` (todas las sesiones)
- Key: `USER_CURRENT_SESSION_KEY_{userId}` (sesión actual del usuario)

### 2. **components/chatbot/chat-widget.tsx** (180 líneas)
Widget flotante que aparece en todas las páginas para usuarios autenticados:
- Botón flotante en esquina inferior derecha
- Tabs para diferentes métodos de pago (PayPal/Binance/Banco)
- Display de historial de mensajes
- Input para escribir mensajes
- 4 botones de mensajes rápidos:
  - "Problema con depósito"
  - "Problema con retiro"
  - "Pregunta general"
  - "Ayuda con cuenta"
- Auto-expandir cuando tiene mensajes sin leer

### 3. **app/chat/page.tsx** (193 líneas)
Página completa de chat para usuarios:
- Interfaz full-screen para conversación
- Sidebar con plantillas rápidas
- Información de horarios de atención
- Botón "Atrás" para regresar
- Auto-creación de sesión al entrar
- Soporte para mensajes en tiempo real

**Configuración:**
- Dynamic page: `force-dynamic` (evita prerendering)
- Requiere sesión de usuario autenticado

### 4. **app/admin/chat/page.tsx** (304 líneas)
Dashboard de administrador para gestionar chats:
- Panel izquierdo: lista de chats organizados por usuario
- Badges de sesiones sin leer
- Filtros por estado (all/open/pending/resolved)
- Panel derecho: chat completo con mensajes
- Botones para cambiar estado de sesión
- Input para responder a usuarios

**Configuración:**
- Dynamic page: `force-dynamic` (evita prerendering)
- Requiere sesión de administrador (ADMIN_EMAIL)

### 5. **components/client-layout.tsx** (25 líneas)
Wrapper para inyectar ChatWidget globalmente:
- Verifica si usuario está autenticado
- Determina si es admin o usuario
- Renderiza ChatWidget solo para usuarios no-admin

### 6. **app/layout.tsx** (modificado)
Root layout actualizado:
- Import de `ClientLayout`
- Envuelve `{children}` con `<ClientLayout>{children}</ClientLayout>`

### 7. **app/depositos/page.tsx** (modificado)
Página de depósitos actualizada:
- Import de `MessageCircle` icon
- Nuevo botón: "Depositar a través de Asistente"
- Link a `/chat` para acceder al chatbot
- Visible cuando hay monto válido ingresado

### 8. **app/chat/layout.tsx** (Nuevo)
Layout para asegurar renderizado dinámico:
- Export: `dynamic = 'force-dynamic'`
- Previene prerendering estático que causaba errores

### 9. **app/admin/chat/layout.tsx** (Nuevo)
Layout para asegurar renderizado dinámico:
- Export: `dynamic = 'force-dynamic'`
- Previene prerendering estático

## Flujos de Usuario

### Usuario Final
1. Accede a cualquier página autenticada
2. ChatWidget flotante aparece en esquina inferior derecha
3. Puede escribir mensajes o usar plantillas rápidas
4. Opcionalmente accede a `/chat` para interfaz full-screen
5. Desde `/depositos` puede hacer clic en "Depositar a través de Asistente" → `/chat`

### Administrador
1. Accede a `/admin/chat`
2. Ve lista de todos los chats de usuarios en panel izquierdo
3. Selecciona un chat para ver conversación completa
4. Puede responder mensajes
5. Puede filtrar por estado (open/pending/resolved)
6. Puede cambiar estado de sesión
7. Ve badges de chats sin leer

## Integración con Sistema Existente

### Autenticación
- Usa funciones de `lib/auth.ts`:
  - `getSessionUser()`: obtiene usuario actual
  - `clearSession()`: para logout
  - `ADMIN_EMAIL`: constante para validar admin

### Componentes UI
- Reutiliza componentes Shadcn/UI:
  - Button, Card, Badge
  - Icons de Lucide React

### Almacenamiento
- localStorage para persistencia de sesiones
- Sin base de datos (totalmente client-side)

## Compilación y Build

**Estado:** ✅ BUILD EXITOSO

Errores resueltos:
1. Faltaban props en AdminSidebar/AdminHeader → Agregados
2. Prerendering de páginas client → Agregadas directivas `dynamic = 'force-dynamic'`

Comando de compilación: `npm run build`

## Testing Recomendado

1. **Como Usuario:**
   - Iniciar sesión
   - Verificar que ChatWidget aparece en esquina
   - Escribir un mensaje
   - Hacer clic en plantilla rápida
   - Acceder a `/chat` y verificar historial
   - Desde `/depositos`, hacer clic en "Depositar a través de Asistente"

2. **Como Admin:**
   - Iniciar sesión con email admin
   - Acceder a `/admin/chat`
   - Verificar que aparecen todos los chats de usuarios
   - Seleccionar un chat y responder
   - Cambiar estado de sesión
   - Probar filtros

## Próximas Mejoras Sugeridas

1. Integración con backend real (base de datos)
2. Notificaciones en tiempo real con WebSockets
3. Historial de chats archivados
4. Búsqueda de chats
5. Emojis y formateo de mensajes
6. Attachment de archivos
7. Estadísticas de chats por período

## Ambiente de Producción

Para deployar a producción:
1. Build: `npm run build`
2. Verificar que no hay errores de compilación
3. Deploy a Vercel o servidor preferido
4. Verificar localStorage está disponible en navegadores objetivo
