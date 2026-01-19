# ✅ Checklist: Crear Supabase desde Cero

## 🎯 Objetivo
Crear un proyecto Supabase completamente nuevo y configurarlo para CVVInvest.

---

## 📋 Paso a Paso

### 🚀 1. Crear Proyecto Supabase
- [ ] Ve a https://supabase.com
- [ ] Regístrate o inicia sesión
- [ ] Haz clic en **"New Project"**
- [ ] Configuración:
  - **Name**: `CVVInvest Platform`
  - **Password**: Genera una segura (guárdala)
  - **Region**: Más cercana a ti
  - **Plan**: Free
- [ ] Haz clic en **"Create new project"**
- [ ] ⏳ Espera 2-3 minutos

### 🔑 2. Obtener Credenciales
- [ ] Ve a **Settings** ⚙️ > **API**
- [ ] Copia y guarda:
  - [ ] **Project URL**: `https://xxx.supabase.co`
  - [ ] **anon public**: `eyJhbGciOiJIUzI1NiIs...`
  - [ ] **service_role**: `eyJhbGciOiJIUzI1NiIs...`

### 🗄️ 3. Crear Base de Datos
- [ ] Ve a **SQL Editor**
- [ ] Haz clic en **"New query"**
- [ ] Copia TODO el contenido de `00-CREAR-TABLAS.sql`
- [ ] Pega en el editor
- [ ] Haz clic en **"Run"** ▶️
- [ ] ⏳ Espera 30-60 segundos
- [ ] ✅ Verifica que no haya errores

### ✅ 4. Verificar Tablas Creadas
- [ ] Ve a **Table Editor**
- [ ] Verifica que existan estas tablas:
  - [ ] `users` (2 registros)
  - [ ] `deposits` (1 registro)
  - [ ] `investments` (1 registro)
  - [ ] `withdrawals` (0 registros)
  - [ ] `notifications` (2 registros)
  - [ ] `chat_sessions` (0 registros)
  - [ ] `chat_messages` (0 registros)

### 👥 5. Verificar Usuarios de Prueba
- [ ] Haz clic en tabla **`users`**
- [ ] Verifica que existan:
  - [ ] **Admin**: `exe.main.darwin@gmail.com` (password: `admin12345`)
  - [ ] **Usuario**: `test@cvvinvest.com`

### 🔧 6. Actualizar Proyecto Local
- [ ] Ejecuta: `node update-env-credentials.js`
- [ ] Ingresa las credenciales cuando se soliciten
- [ ] ✅ Verifica que se crearon:
  - [ ] `.env.local` (actualizado)
  - [ ] `vercel-env-variables.txt` (nuevo)
  - [ ] `next.config.mjs` (actualizado)

### 🧪 7. Probar Conexión
- [ ] Ejecuta: `node scripts/verify-supabase.js`
- [ ] ✅ Debe mostrar conexión exitosa
- [ ] Si hay errores, verifica credenciales

### 🚀 8. Probar Localmente
- [ ] Ejecuta: `pnpm dev`
- [ ] Ve a: http://localhost:3000
- [ ] Prueba:
  - [ ] Página principal carga
  - [ ] Registro funciona
  - [ ] Login funciona
  - [ ] Dashboard carga

---

## 🎉 ¡Supabase Configurado!

### ✅ Lo que tienes ahora:
- 🗄️ **Base de datos** completa con 7 tablas
- 👥 **Usuarios de prueba** listos
- 🔑 **Credenciales** actualizadas en el proyecto
- 📊 **Datos de ejemplo** incluidos
- 🔧 **Configuración** optimizada

### 📝 Próximos pasos:
1. **Desarrollo local**: `pnpm dev`
2. **Deploy en Vercel**: Usar `vercel-env-variables.txt`
3. **Personalizar**: Agregar más usuarios, datos, etc.

---

## 🚨 Si algo falla:

### Error: "relation does not exist"
- ❌ **Problema**: No ejecutaste el SQL
- ✅ **Solución**: Ejecuta `00-CREAR-TABLAS.sql` en SQL Editor

### Error: "Invalid JWT"
- ❌ **Problema**: Credenciales incorrectas
- ✅ **Solución**: Verifica las keys en Settings > API

### Error: "fetch failed"
- ❌ **Problema**: Proyecto no está listo o URL incorrecta
- ✅ **Solución**: Espera unos minutos, verifica URL

### Build Error
- ❌ **Problema**: Variables de entorno no actualizadas
- ✅ **Solución**: Ejecuta `node update-env-credentials.js`

---

## 📞 Recursos Útiles

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Documentación**: https://supabase.com/docs
- **SQL Editor**: Dashboard > SQL Editor
- **Table Editor**: Dashboard > Table Editor
- **Logs**: Dashboard > Logs

---

**🚀 ¡Tu nueva Supabase estará lista en 10 minutos!**