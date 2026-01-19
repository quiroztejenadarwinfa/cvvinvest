#!/usr/bin/env node

/**
 * Script para crear usuarios en Supabase Auth
 * Ejecutar con: node crear-usuarios-supabase.js
 */

const { createClient } = require("@supabase/supabase-js");

// Configuración de Supabase
const SUPABASE_URL = "https://ydrvhjpobsfvebexfkbj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnZoanBvYnNmdmViZXhma2JqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc5NjkyNiwiZXhwIjoyMDg0MzcyOTI2fQ.6KxaywUYnWS4DqgzpANzWLTjiT-S0vejydFG4sV8ImY";

// Crear cliente con service_role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Usuarios a crear
const usuarios = [
  {
    email: 'exe.main.darwin@gmail.com',
    password: 'admin12345',
    name: 'Administrador',
    role: 'admin'
  },
  {
    email: 'usuario.gratuito@ejemplo.com',
    password: 'password123',
    name: 'Usuario Gratuito',
    role: 'user'
  },
  {
    email: 'usuario.estandar@ejemplo.com',
    password: 'password123',
    name: 'Usuario Estándar',
    role: 'user'
  },
  {
    email: 'usuario.pro@ejemplo.com',
    password: 'password123',
    name: 'Usuario Pro',
    role: 'user'
  },
  {
    email: 'usuario.vip@ejemplo.com',
    password: 'password123',
    name: 'Usuario VIP',
    role: 'user'
  }
];

async function crearUsuarios() {
  console.log("🚀 Iniciando creación de usuarios en Supabase Auth...\n");
  console.log(`📍 Supabase URL: ${SUPABASE_URL}`);
  console.log(`🔑 Usando service_role key\n`);
  console.log("=" .repeat(60));

  let exitosos = 0;
  let fallos = 0;

  for (const usuario of usuarios) {
    try {
      console.log(`\n📧 Creando: ${usuario.email}`);
      console.log(`   Rol: ${usuario.role}`);
      console.log(`   Nombre: ${usuario.name}`);

      // Primero intenta obtener el usuario (si existe)
      const { data: existingUsers, error: getError } = await supabase.auth.admin.listUsers();
      
      if (!getError && existingUsers) {
        const usuarioExistente = existingUsers.users.find(u => u.email === usuario.email);
        
        if (usuarioExistente) {
          console.log(`   ⚠️  Usuario ya existe`);
          console.log(`   ID: ${usuarioExistente.id}`);
          exitosos++;
          continue;
        }
      }

      // Crear nuevo usuario
      const { data, error } = await supabase.auth.admin.createUser({
        email: usuario.email,
        password: usuario.password,
        email_confirm: true, // Confirmar email automáticamente
        user_metadata: {
          full_name: usuario.name,
          role: usuario.role
        }
      });

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        fallos++;
      } else if (data && data.user) {
        console.log(`   ✅ Creado exitosamente`);
        console.log(`   ID: ${data.user.id}`);
        exitosos++;
      }
    } catch (err) {
      console.log(`   ❌ Excepción: ${err.message}`);
      fallos++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n📊 RESUMEN:");
  console.log(`   ✅ Exitosos: ${exitosos}`);
  console.log(`   ❌ Fallos: ${fallos}`);
  console.log(`   📈 Total: ${usuarios.length}`);

  if (fallos === 0) {
    console.log("\n🎉 ¡Todos los usuarios creados correctamente!");
    console.log("\n✅ Puedes hacer login con:");
    console.log("   Email: usuario.gratuito@ejemplo.com");
    console.log("   Contraseña: password123");
  } else {
    console.log("\n⚠️  Algunos usuarios no se crearon correctamente.");
    console.log("   Verifica el error anterior y intenta de nuevo.");
  }

  console.log("\n");
}

// Ejecutar
crearUsuarios().catch(err => {
  console.error("❌ Error fatal:", err);
  process.exit(1);
});
