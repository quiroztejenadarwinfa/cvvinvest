#!/usr/bin/env node

/**
 * Script para limpiar usuarios - deja solo el admin
 */

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://ydrvhjpobsfvebexfkbj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnZoanBvYnNmdmViZXhma2JqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc5NjkyNiwiZXhwIjoyMDg0MzcyOTI2fQ.6KxaywUYnWS4DqgzpANzWLTjiT-S0vejydFG4sV8ImY"
);

const usuariosAEliminar = [
  'usuario.gratuito@ejemplo.com',
  'usuario.estandar@ejemplo.com',
  'usuario.pro@ejemplo.com',
  'usuario.vip@ejemplo.com'
];

async function limpiar() {
  console.log("\n🧹 Limpiando usuarios...\n");
  console.log("=" .repeat(70));

  let eliminados = 0;

  for (const email of usuariosAEliminar) {
    try {
      console.log(`\n❌ Eliminando: ${email}`);
      
      // Obtener ID
      const { data: users } = await supabase.auth.admin.listUsers();
      const usuario = users.users.find(u => u.email === email);
      
      if (usuario) {
        await supabase.auth.admin.deleteUser(usuario.id);
        console.log(`   ✅ Eliminado de Auth`);
      }
      
      // Eliminar de tabla
      await supabase.from('users').delete().eq('email', email);
      console.log(`   ✅ Eliminado de BD`);
      
      eliminados++;
    } catch (err) {
      console.log(`   ⚠️  Error: ${err.message}`);
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log(`\n✅ Limpieza completada: ${eliminados} usuarios eliminados`);
  console.log(`\n👤 Usuario restante:`);
  console.log(`   - exe.main.darwin@gmail.com (Admin)\n`);
}

limpiar().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
