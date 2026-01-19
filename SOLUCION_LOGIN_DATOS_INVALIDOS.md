# 🔧 SOLUCIÓN: "Datos Inválidos" en Login

## ¿Cuál es el problema?

El error **"datos inválidos"** ocurre porque:

1. ✗ Los usuarios NO están creados en **Supabase Auth**
2. ✓ Los usuarios SÍ están en la tabla `users` (BD regular)
3. ✗ Cuando intentas hacer login, Supabase Auth no reconoce las credenciales

## Diferencia importante

- **Supabase Auth**: Sistema de autenticación de Supabase (email/password)
- **Tabla `users`**: Tu tabla de BD para guardar perfil del usuario

Están **separados**. Necesitas crear usuarios en AMBOS lugares.

---

## ✅ SOLUCIÓN RÁPIDA

### Opción 1: Usar panel de Supabase (MÁS FÁCIL)

1. Abre https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **Authentication > Users**
4. Haz clic en **"Invite a user"**
5. Ingresa los datos:
   - Email: `exe.main.darwin@gmail.com`
   - Password: `admin12345`
6. Haz clic en **"Send invite"**
7. **Repite para cada usuario** que quieras que pueda hacer login

**Usuarios a crear:**
```
1. exe.main.darwin@gmail.com / admin12345 (Admin)
2. usuario.gratuito@ejemplo.com / password123 (Gratuito)
3. usuario.estandar@ejemplo.com / password123 (Estándar)
4. usuario.pro@ejemplo.com / password123 (Pro)
5. usuario.vip@ejemplo.com / password123 (VIP)
```

---

### Opción 2: Usar API de Supabase (Automático)

Copia y ejecuta este código en la **consola del navegador** en tu aplicación:

```javascript
// Script para crear usuarios en Supabase Auth
async function crearUsuariosEnSupabase() {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
  
  const supabase = createClient(
    'https://ydrvhjpobsfvebexfkbj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnZoanBvYnNmdmViZXhma2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTY5MjYsImV4cCI6MjA4NDM3MjkyNn0.IbUWYiFbGwNjg-s4eknYjSkuQTKFZ3Km2178n5l1WEQ'
  );

  const usuarios = [
    { email: 'exe.main.darwin@gmail.com', password: 'admin12345' },
    { email: 'usuario.gratuito@ejemplo.com', password: 'password123' },
    { email: 'usuario.estandar@ejemplo.com', password: 'password123' },
    { email: 'usuario.pro@ejemplo.com', password: 'password123' },
    { email: 'usuario.vip@ejemplo.com', password: 'password123' },
  ];

  for (const usuario of usuarios) {
    console.log(`\nCreando usuario: ${usuario.email}...`);
    
    // Primero intenta signup (crea en auth y tabla users)
    const { data, error } = await supabase.auth.signUp({
      email: usuario.email,
      password: usuario.password,
      options: {
        data: {
          full_name: usuario.email.split('@')[0],
        }
      }
    });

    if (error) {
      console.log(`❌ Error: ${error.message}`);
      
      // Si el usuario ya existe, intenta login para verificar
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: usuario.email,
        password: usuario.password,
      });
      
      if (!loginError) {
        console.log(`✅ Usuario ya existe y credenciales son correctas`);
      } else {
        console.log(`❌ Error de login: ${loginError.message}`);
      }
    } else {
      console.log(`✅ Usuario creado correctamente`);
      console.log(`   ID: ${data.user?.id}`);
    }
  }
}

// Ejecuta la función
crearUsuariosEnSupabase();
```

---

### Opción 3: Script Node.js

Crea un archivo `crear-usuarios-supabase.js`:

```javascript
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://ydrvhjpobsfvebexfkbj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnZoanBvYnNmdmViZXhma2JqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc5NjkyNiwiZXhwIjoyMDg0MzcyOTI2fQ.6KxaywUYnWS4DqgzpANzWLTjiT-S0vejydFG4sV8ImY"
);

const usuarios = [
  { email: 'exe.main.darwin@gmail.com', password: 'admin12345' },
  { email: 'usuario.gratuito@ejemplo.com', password: 'password123' },
  { email: 'usuario.estandar@ejemplo.com', password: 'password123' },
  { email: 'usuario.pro@ejemplo.com', password: 'password123' },
  { email: 'usuario.vip@ejemplo.com', password: 'password123' },
];

async function crearUsuarios() {
  console.log("🔄 Creando usuarios en Supabase Auth...\n");

  for (const usuario of usuarios) {
    console.log(`📧 ${usuario.email}...`);
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: usuario.email,
      password: usuario.password,
      email_confirm: true,
      user_metadata: {
        full_name: usuario.email.split('@')[0],
      }
    });

    if (error) {
      console.log(`  ❌ Error: ${error.message}`);
    } else {
      console.log(`  ✅ Creado correctamente (ID: ${data.user?.id})`);
    }
  }

  console.log("\n✨ ¡Proceso completado!");
}

crearUsuarios();
```

Ejecuta con:
```bash
node crear-usuarios-supabase.js
```

---

## ✅ VERIFICAR QUE FUNCIONE

1. Ve a la página de login
2. Intenta con:
   ```
   Email: usuario.gratuito@ejemplo.com
   Contraseña: password123
   ```
3. Si funciona ✅, el problema está resuelto

Si aún dice "datos inválidos":
- Verifica que el email esté escrito correctamente
- Verifica que la contraseña sea exacta (mayúsculas importan)
- Intenta crear otro usuario desde cero

---

## 🔐 Credenciales Correctas

Después de ejecutar cualquier opción, puedes hacer login con:

| Email | Contraseña | Rol | Plan |
|-------|-----------|-----|------|
| exe.main.darwin@gmail.com | admin12345 | Admin | Elite |
| usuario.gratuito@ejemplo.com | password123 | User | Gratuito |
| usuario.estandar@ejemplo.com | password123 | User | Estándar |
| usuario.pro@ejemplo.com | password123 | User | Pro |
| usuario.vip@ejemplo.com | password123 | User | VIP |

---

## 📝 Notas Técnicas

El flujo correcto es:

```
┌─────────────────────────────────────────┐
│ 1. Usuario intenta hacer Login          │
│    (email + password)                   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 2. Supabase Auth valida credenciales    │
│    (debe estar en sistema de auth)      │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
    ✅ Válido         ❌ Inválido
        │             "Datos inválidos"
        ▼
┌─────────────────────────────────────────┐
│ 3. Obtener perfil de tabla users        │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 4. Crear sesión y redirigir a dashboard │
└─────────────────────────────────────────┘
```

Si no están en Supabase Auth → Falla en paso 2.

---

## ❓ ¿Aún tiene problemas?

1. Verifica las URLs en `.env.local`
2. Confirma que usas las claves correctas de Supabase
3. Revisa que la tabla `users` exista y tenga datos
4. En consola del navegador, abre DevTools > Network y mira las respuestas de Supabase

