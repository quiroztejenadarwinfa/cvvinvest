# 🔐 Credenciales de Administrador - CVVInvest

## 👨‍💼 Usuario Administrador

### 📧 Credenciales de Acceso
```
Email:    exe.main.darwin@gmail.com
Password: admin12345
Rol:      admin
Plan:     elite
Balance:  $100,000.00
```

### 🎯 Acceso al Sistema

#### 🌐 Desarrollo Local
```
URL:      http://localhost:3000/admin
Email:    exe.main.darwin@gmail.com
Password: admin12345
```

#### ☁️ Producción (Vercel)
```
URL:      https://tu-dominio.vercel.app/admin
Email:    exe.main.darwin@gmail.com
Password: admin12345
```

## 🛡️ Permisos de Administrador

### ✅ Acceso Completo a:
- 👥 **Gestión de Usuarios** - Ver, crear, editar, eliminar usuarios
- 💰 **Gestión de Depósitos** - Aprobar, rechazar, ver todos los depósitos
- 📈 **Gestión de Inversiones** - Aprobar, rechazar, ver todas las inversiones
- 💸 **Gestión de Retiros** - Procesar, aprobar, rechazar retiros
- 🔔 **Sistema de Notificaciones** - Enviar notificaciones a usuarios
- 📊 **Reportes y Analytics** - Ver estadísticas completas del sistema
- ⚙️ **Configuración del Sistema** - Cambiar configuraciones globales
- 🔒 **Seguridad** - Gestionar accesos y permisos

### 🎛️ Panel de Administración

#### Rutas Disponibles:
```
/admin                    - Dashboard principal
/admin/usuarios          - Gestión de usuarios
/admin/depositos         - Gestión de depósitos
/admin/inversiones       - Gestión de inversiones
/admin/retiros           - Gestión de retiros
/admin/reportes          - Reportes y estadísticas
/admin/configuracion     - Configuración del sistema
/admin/seguridad         - Configuración de seguridad
/admin/mensajes          - Sistema de mensajes
/admin/chat              - Chat con usuarios
```

## 🗄️ Base de Datos

### 📊 Registro en Tabla `users`
```sql
SELECT * FROM users WHERE email = 'exe.main.darwin@gmail.com';

-- Resultado esperado:
-- id: [UUID generado automáticamente]
-- email: exe.main.darwin@gmail.com
-- name: Darwin Quiroz - Administrador
-- role: admin
-- plan: elite
-- balance: 100000.00
-- is_active: true
-- created_at: [timestamp]
-- updated_at: [timestamp]
```

### 🔐 Hash de Contraseña
```sql
-- La contraseña 'admin12345' está hasheada con bcrypt
password_hash: $2b$10$K8BqaJ4iWNOy4wHADhdOOeIjHrqjcEu5v5dqxjdqxjdqxjdqxjdqxj
```

## 🧪 Verificación de Acceso

### ✅ Pasos para Verificar:

1. **Abrir la aplicación**
   ```
   http://localhost:3000  (desarrollo)
   https://tu-dominio.vercel.app  (producción)
   ```

2. **Ir al login de admin**
   - Buscar botón "Admin" en la esquina superior derecha
   - O ir directamente a `/admin`

3. **Ingresar credenciales**
   ```
   Email: exe.main.darwin@gmail.com
   Password: admin12345
   ```

4. **Verificar acceso**
   - ✅ Dashboard de admin carga correctamente
   - ✅ Menú lateral con todas las opciones
   - ✅ Puede ver lista de usuarios
   - ✅ Puede ver depósitos e inversiones
   - ✅ Todas las funciones admin funcionan

## 🚨 Troubleshooting

### ❌ "Login failed" o "Invalid credentials"
**Posibles causas:**
1. Contraseña incorrecta (verificar: `admin12345`)
2. Email incorrecto (verificar: `exe.main.darwin@gmail.com`)
3. Usuario no existe en la base de datos
4. Problema de conexión con Supabase

**Soluciones:**
1. Verificar credenciales exactas (case-sensitive)
2. Verificar que el usuario existe en tabla `users`
3. Ejecutar `00-CREAR-TABLAS.sql` si no existe
4. Verificar conexión con `node scripts/verify-supabase.js`

### ❌ "Access denied" o redirige a login
**Posibles causas:**
1. Usuario no tiene rol `admin`
2. Problema con la autenticación
3. Sesión expirada

**Soluciones:**
1. Verificar que `role = 'admin'` en la base de datos
2. Limpiar cookies y volver a hacer login
3. Verificar que `is_active = true`

### ❌ "No users found" en panel admin
**Posibles causas:**
1. Problema con RLS (Row Level Security)
2. Service Role Key incorrecta
3. Tablas vacías

**Soluciones:**
1. Verificar `SUPABASE_SERVICE_ROLE_KEY` en variables de entorno
2. Ejecutar `00-CREAR-TABLAS.sql` para crear datos de prueba
3. Verificar logs en Vercel/Supabase

## 🔄 Cambiar Contraseña (Opcional)

Si quieres cambiar la contraseña del admin:

1. **Generar nuevo hash:**
   ```bash
   # Instalar bcrypt si no está
   npm install bcrypt
   
   # Generar hash
   node -e "
   const bcrypt = require('bcrypt');
   bcrypt.hash('nueva-contraseña', 10).then(hash => {
     console.log('Nuevo hash:', hash);
   });
   "
   ```

2. **Actualizar en base de datos:**
   ```sql
   UPDATE users 
   SET password_hash = 'nuevo-hash-aqui'
   WHERE email = 'exe.main.darwin@gmail.com';
   ```

---

## 📞 Soporte

Si tienes problemas con el acceso de administrador:

1. **Verificar variables de entorno** en `.env.local` o Vercel
2. **Revisar logs** en Vercel Dashboard > Functions > View Logs
3. **Verificar base de datos** en Supabase Dashboard > Table Editor
4. **Probar conexión** con `node scripts/verify-supabase.js`

---

**🚀 ¡Tu cuenta de administrador está lista para gestionar CVVInvest!**