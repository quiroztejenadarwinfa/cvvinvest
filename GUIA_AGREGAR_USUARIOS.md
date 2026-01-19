# 👥 Cómo Agregar Más Usuarios (Guía Paso a Paso)

## 🎯 Objetivo

Crear nuevos usuarios en el sistema para que puedan hacer login y acceder a la plataforma.

---

## 📋 Método 1: Panel de Supabase (MÁS FÁCIL - Sin Terminal)

### Paso 1: Acceder al Panel

1. Ve a https://app.supabase.com
2. Selecciona tu proyecto `financial-investment-platform`
3. En el menú izquierdo, haz clic en **"Authentication"**
4. Selecciona la pestaña **"Users"**

### Paso 2: Crear Usuario

1. Haz clic en el botón **"Invite a user"** (esquina superior derecha)
2. Completa los datos:
   - **Email**: El correo del nuevo usuario (ej: juan@ejemplo.com)
   - **Password**: La contraseña que usará para login (ej: password123)
3. Haz clic en **"Send invite"**

### Paso 3: Completar Perfil en Base de Datos

El usuario ahora puede hacer login, pero también necesita un perfil en la tabla `users`:

1. En el panel, ve a **"SQL Editor"**
2. Haz clic en **"New query"**
3. Copia y pega este SQL (reemplaza los valores):

```sql
-- Ejemplo: Agregar nuevo usuario
INSERT INTO public.users (
  email,
  name,
  password_hash,
  plan,
  balance,
  is_active,
  created_at
) VALUES (
  'juan@ejemplo.com',
  'Juan Pérez',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvJ32e',
  'estandar',
  5000.00,
  true,
  NOW()
);
```

4. Haz clic en **"Run"**

---

## 🖥️ Método 2: Script Node.js (RÁPIDO - Terminal)

### Paso 1: Modificar Script

Edita el archivo `crear-usuarios-supabase.js` y cambia el array `usuarios`:

```javascript
const usuarios = [
  {
    email: 'juan@ejemplo.com',
    password: 'password123',
    name: 'Juan Pérez',
    role: 'user'
  },
  {
    email: 'maria@ejemplo.com',
    password: 'password456',
    name: 'María García',
    role: 'user'
  },
  // Agregar más aquí...
];
```

### Paso 2: Ejecutar Script

```bash
node crear-usuarios-supabase.js
```

### Paso 3: Completar Perfiles en Base de Datos

Edita `poblar-usuarios-bd.js` y agrega los nuevos usuarios:

```javascript
const usuariosParaInsertar = [
  {
    id: '08851291-ea0c-4dad-98ce-8daa3c409ed8',  // ID asignado por Supabase
    email: 'juan@ejemplo.com',
    name: 'Juan Pérez',
    plan: 'estandar',
    balance: 5000.00
  },
  // Más usuarios...
];
```

Nota: Necesitas obtener el ID que Supabase genera. Aparece en la salida del script anterior.

Luego ejecuta:
```bash
node poblar-usuarios-bd.js
```

---

## 🤖 Método 3: Crear Usuario Completo (Todo en Uno)

### Opción A: Usar Script Interactivo

Crea un archivo `agregar-usuario.js`:

```javascript
#!/usr/bin/env node

const prompt = require('prompt-sync')();
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  "https://ydrvhjpobsfvebexfkbj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnZoanBvYnNmdmViZXhma2JqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc5NjkyNiwiZXhwIjoyMDg0MzcyOTI2fQ.6KxaywUYnWS4DqgzpANzWLTjiT-S0vejydFG4sV8ImY"
);

async function crearUsuarioCompleto() {
  console.log("\n📝 CREAR NUEVO USUARIO\n");

  const email = prompt("Email: ");
  const password = prompt("Contraseña: ");
  const name = prompt("Nombre: ");
  const plan = prompt("Plan (gratuito/estandar/pro/vip): ") || "estandar";
  const balance = parseFloat(prompt("Balance inicial: ") || "0");

  console.log("\n🔄 Creando usuario...\n");

  // Paso 1: Crear en Auth
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: name,
    }
  });

  if (error) {
    console.log(`❌ Error: ${error.message}`);
    return;
  }

  const userId = data.user.id;
  console.log(`✅ Usuario creado en Auth (ID: ${userId})`);

  // Paso 2: Crear perfil en BD
  const dummyHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvJ32e';
  
  const { error: errorBD } = await supabaseAdmin
    .from('users')
    .insert({
      id: userId,
      email,
      name,
      password_hash: dummyHash,
      plan,
      balance: parseFloat(String(balance)),
      is_active: true,
      created_at: new Date().toISOString()
    });

  if (errorBD) {
    console.log(`❌ Error al crear perfil: ${errorBD.message}`);
    return;
  }

  console.log(`✅ Perfil creado en BD`);
  console.log(`\n✨ Usuario creado correctamente!\n`);
  console.log(`📧 Email: ${email}`);
  console.log(`🔐 Contraseña: ${password}`);
  console.log(`👤 Nombre: ${name}`);
  console.log(`📊 Plan: ${plan}`);
  console.log(`💰 Balance: $${balance}\n`);
}

crearUsuarioCompleto().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
```

Ejecutar:
```bash
npm install prompt-sync
node agregar-usuario.js
```

---

## ✅ Verificar que se Creó Correctamente

```bash
node diagnostico-login.js
```

O verificar solo la tabla:
```bash
node check-users-admin.js
```

---

## 📊 Planes Disponibles

| Plan | Descripción | Uso |
|------|------------|-----|
| `gratuito` | Plan básico | Usuarios nuevos |
| `estandar` | Plan intermedio | Usuarios pagos |
| `pro` | Plan profesional | Usuarios premium |
| `vip` | Plan VIP | Usuarios VIP |
| `elite` | Plan administrativo | Administradores |

---

## 🎯 Ejemplo Práctico Completo

### Crear Usuario: "Carlos López" (Plan Pro)

#### Opción 1: Panel Supabase

**En Authentication > Users:**
- Email: `carlos@ejemplo.com`
- Password: `miPassword123`

**En SQL Editor:**
```sql
INSERT INTO public.users (
  email,
  name,
  password_hash,
  plan,
  balance,
  is_active,
  created_at
) VALUES (
  'carlos@ejemplo.com',
  'Carlos López',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvJ32e',
  'pro',
  20000.00,
  true,
  NOW()
);
```

#### Opción 2: Terminal

Editar `crear-usuarios-supabase.js`:
```javascript
const usuarios = [
  {
    email: 'carlos@ejemplo.com',
    password: 'miPassword123',
    name: 'Carlos López',
    role: 'user'
  }
];
```

Editar `poblar-usuarios-bd.js` (con el ID que salga del script anterior):
```javascript
const usuariosParaInsertar = [
  {
    id: 'OBTENER-DEL-OUTPUT',
    email: 'carlos@ejemplo.com',
    name: 'Carlos López',
    plan: 'pro',
    balance: 20000.00
  }
];
```

Ejecutar:
```bash
node crear-usuarios-supabase.js
# Copiar el ID que aparece en la salida
# Pegar en poblar-usuarios-bd.js
node poblar-usuarios-bd.js
```

---

## ❌ Errores Comunes

### Error: "Email already exists"
- El usuario ya está registrado
- Solución: Usa otro email o elimina el usuario anterior

### Error: "null value in password_hash"
- Olvidaste agregar el hash de contraseña
- Solución: Incluye `password_hash: dummyHash` en la inserción

### Error: "Invalid email"
- El email no es válido
- Solución: Verifica que sea un email correcto (ej: usuario@ejemplo.com)

### El usuario no puede hacer login
- Probablemente no está en Supabase Auth
- Solución: Ejecuta `node diagnostico-login.js`

---

## 🔐 Notas de Seguridad

⚠️ **IMPORTANTE:**
1. Las contraseñas en la tabla `users` (password_hash) no se usan con Supabase Auth
2. El verdadero hash de contraseña está en Supabase Auth (no accesible directamente)
3. Nunca compartas las credenciales de `SUPABASE_SERVICE_ROLE_KEY`
4. Para producción, usa mejores prácticas de seguridad

---

## 📞 Soporte

Si tienes problemas:

1. Ejecuta: `node diagnostico-login.js`
2. Revisa el error que reporta
3. Consulta la sección de "Errores Comunes"
4. Revisa [SOLUCION_COMPLETA_LOGIN.md](./SOLUCION_COMPLETA_LOGIN.md)

---

*Última actualización: 19 de enero de 2026*
