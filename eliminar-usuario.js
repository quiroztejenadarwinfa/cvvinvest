#!/usr/bin/env node

/**
 * Script para eliminar usuarios de Supabase Auth y tabla users
 * Ejecutar con: node eliminar-usuario.js
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ydrvhjpobsfvebexfkbj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnZoanBvYnNmdmViZXhma2JqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc5NjkyNiwiZXhwIjoyMDg0MzcyOTI2fQ.6KxaywUYnWS4DqgzpANzWLTjiT-S0vejydFG4sV8ImY";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function eliminarUsuario(email) {
  console.log(`\n🗑️  Eliminando usuario: ${email}\n`);
  console.log("=" .repeat(70));

  try {
    // Paso 1: Obtener ID del usuario en Auth
    console.log("\n1️⃣  Buscando usuario en Supabase Auth...");
    
    const { data: users, error: errorList } = await supabase.auth.admin.listUsers();
    
    if (errorList) {
      console.log(`   ❌ Error: ${errorList.message}`);
      return;
    }

    const usuario = users.users.find(u => u.email === email);
    
    if (!usuario) {
      console.log(`   ⚠️  Usuario NO encontrado en Auth`);
    } else {
      console.log(`   ✅ Encontrado en Auth (ID: ${usuario.id})`);
      
      // Paso 2: Eliminar de Supabase Auth
      console.log("\n2️⃣  Eliminando de Supabase Auth...");
      
      const { error: deleteError } = await supabase.auth.admin.deleteUser(usuario.id);
      
      if (deleteError) {
        console.log(`   ❌ Error: ${deleteError.message}`);
        return;
      }
      
      console.log(`   ✅ Eliminado de Auth`);
    }

    // Paso 3: Eliminar de tabla users
    console.log("\n3️⃣  Eliminando de tabla 'users' en BD...");
    
    const { data, error: deleteError2 } = await supabase
      .from('users')
      .delete()
      .eq('email', email);
    
    if (deleteError2) {
      console.log(`   ❌ Error: ${deleteError2.message}`);
      return;
    }
    
    console.log(`   ✅ Eliminado de BD`);

    console.log("\n" + "=".repeat(70));
    console.log(`\n✨ Usuario '${email}' eliminado correctamente!\n`);

  } catch (err) {
    console.log(`\n❌ Excepción: ${err.message}\n`);
  }
}

// Usuario a eliminar (cambia este email)
const emailAEliminar = "quiroztejenadarwinfabian@gmail.com";

eliminarUsuario(emailAEliminar).catch(err => {
  console.error("❌ Error fatal:", err);
  process.exit(1);
});
