#!/usr/bin/env node

/**
 * Script para diagnosticar el error 500 en registro
 */

const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  "https://ydrvhjpobsfvebexfkbj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnZoanBvYnNmdmViZXhma2JqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc5NjkyNiwiZXhwIjoyMDg0MzcyOTI2fQ.6KxaywUYnWS4DqgzpANzWLTjiT-S0vejydFG4sV8ImY"
);

async function diagnosticar() {
  console.log("\n🔍 Diagnosticando error 500 en registro...\n");
  console.log("=" .repeat(70));

  try {
    // Simular lo que hace el endpoint
    console.log("\n1️⃣  Intentando insertar usuario de prueba...");
    
    const testUser = {
      id: 'test-user-' + Date.now(),
      email: 'test-' + Date.now() + '@ejemplo.com',
      name: 'Test User',
      password_hash: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvJ32e',
      plan: 'gratuito',
      balance: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log(`   Email: ${testUser.email}`);

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(testUser)
      .select('*');

    if (error) {
      console.log(`\n   ❌ ERROR:`);
      console.log(`      Código: ${error.code}`);
      console.log(`      Mensaje: ${error.message}`);
      console.log(`      Detalles: ${error.details}`);
      console.log(`      Hint: ${error.hint}`);
      
      console.log("\n   🔧 DIAGNÓSTICO:");
      
      if (error.code === '42501') {
        console.log("      → Problema de permisos (RLS)");
        console.log("      → Solución: Desactivar RLS o ajustar políticas");
      } else if (error.code === '23505') {
        console.log("      → Usuario duplicado");
        console.log("      → Solución: Usar otro ID");
      } else if (error.code === '23502') {
        console.log("      → Campo requerido falta");
        console.log("      → Solución: Revisar que todos los campos obligatorios estén");
      } else if (error.message.includes('password_hash')) {
        console.log("      → password_hash es requerido");
        console.log("      → Solución: Incluir password_hash en la inserción");
      }
      
      return;
    }

    if (data && data.length > 0) {
      console.log(`\n   ✅ INSERCIÓN EXITOSA`);
      console.log(`      Usuario creado: ${data[0].email}`);
      
      // Limpiar
      await supabaseAdmin.from('users').delete().eq('id', testUser.id);
      console.log(`      Usuario eliminado (prueba)`);
    }

  } catch (err) {
    console.log(`\n❌ Excepción: ${err.message}`);
    console.log(`   Stack: ${err.stack}`);
  }

  console.log("\n" + "=".repeat(70));
  console.log("\n");
}

diagnosticar().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
