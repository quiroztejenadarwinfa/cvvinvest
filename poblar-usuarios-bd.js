#!/usr/bin/env node

/**
 * Script para poblar la tabla 'users' con datos de los usuarios creados en Auth
 * Ejecutar con: node poblar-usuarios-bd.js
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ydrvhjpobsfvebexfkbj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnZoanBvYnNmdmViZXhma2JqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc5NjkyNiwiZXhwIjoyMDg0MzcyOTI2fQ.6KxaywUYnWS4DqgzpANzWLTjiT-S0vejydFG4sV8ImY";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// IDs de los usuarios creados anteriormente
const usuariosParaInsertar = [
  {
    id: '4d3de601-429b-48a2-b202-f6784bbf7cbe',
    email: 'exe.main.darwin@gmail.com',
    name: 'Administrador',
    plan: 'elite',
    balance: 50000.00
  },
  {
    id: '08851291-ea0c-4dad-98ce-8daa3c409ed8',
    email: 'usuario.gratuito@ejemplo.com',
    name: 'Usuario Gratuito',
    plan: 'gratuito',
    balance: 100.00
  },
  {
    id: '2b182753-316e-4d53-a95e-dfedcf25e88f',
    email: 'usuario.estandar@ejemplo.com',
    name: 'Usuario Estándar',
    plan: 'estandar',
    balance: 5000.00
  },
  {
    id: 'd608b5d8-90de-4cdd-8e8e-852f778f9c56',
    email: 'usuario.pro@ejemplo.com',
    name: 'Usuario Pro',
    plan: 'pro',
    balance: 15000.00
  },
  {
    id: 'ad3dabf0-508f-477d-9576-453cf8c6b942',
    email: 'usuario.vip@ejemplo.com',
    name: 'Usuario VIP',
    plan: 'vip',
    balance: 30000.00
  }
];

async function poblarUsuarios() {
  console.log("📝 Poblando tabla 'users' con datos de usuarios...\n");
  console.log("=" .repeat(70));

  let exitosos = 0;
  let fallos = 0;

  for (const usuario of usuariosParaInsertar) {
    try {
      console.log(`\n👤 ${usuario.email}`);
      console.log(`   Plan: ${usuario.plan}`);
      console.log(`   Balance: $${usuario.balance}`);

      // Primero verificar si ya existe
      const { data: existente, error: errorExistente } = await supabase
        .from('users')
        .select('id')
        .eq('email', usuario.email)
        .single();

      if (!errorExistente && existente) {
        console.log(`   ⚠️  Ya existe en la tabla`);
        exitosos++;
        continue;
      }

      // Insertar usuario
      // Hash dummy para password_hash (no se usa con Supabase Auth)
      const dummyHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvJ32e';
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: usuario.id,
          email: usuario.email,
          name: usuario.name,
          password_hash: dummyHash,
          plan: usuario.plan,
          balance: usuario.balance,
          is_active: true,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        console.log(`   Detalles: ${JSON.stringify(error.details)}`);
        fallos++;
      } else if (data && data.length > 0) {
        console.log(`   ✅ Insertado exitosamente`);
        exitosos++;
      }
    } catch (err) {
      console.log(`   ❌ Excepción: ${err.message}`);
      fallos++;
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("\n📊 RESUMEN:");
  console.log(`   ✅ Exitosos: ${exitosos}`);
  console.log(`   ❌ Fallos: ${fallos}`);
  console.log(`   📈 Total: ${usuariosParaInsertar.length}`);

  if (fallos === 0) {
    console.log("\n🎉 ¡Tabla 'users' poblada correctamente!");
    console.log("\n✅ Ahora puedes hacer login con:");
    console.log("   Email: usuario.gratuito@ejemplo.com");
    console.log("   Contraseña: password123");
  } else {
    console.log("\n⚠️  Algunos registros no se insertaron.");
  }

  console.log("\n");
}

poblarUsuarios().catch(err => {
  console.error("❌ Error fatal:", err);
  process.exit(1);
});
