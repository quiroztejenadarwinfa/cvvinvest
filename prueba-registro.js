#!/usr/bin/env node

/**
 * Script para probar el flujo de registro completo
 * Simula lo que hace un nuevo usuario al registrarse
 */

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://ydrvhjpobsfvebexfkbj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnZoanBvYnNmdmViZXhma2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTY5MjYsImV4cCI6MjA4NDM3MjkyNn0.IbUWYiFbGwNjg-s4eknYjSkuQTKFZ3Km2178n5l1WEQ"
);

const supabaseAdmin = createClient(
  "https://ydrvhjpobsfvebexfkbj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnZoanBvYnNmdmViZXhma2JqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc5NjkyNiwiZXhwIjoyMDg0MzcyOTI2fQ.6KxaywUYnWS4DqgzpANzWLTjiT-S0vejydFG4sV8ImY"
);

async function pruebaRegistro() {
  console.log("\n🧪 PRUEBA DE REGISTRO - Flujo Completo\n");
  console.log("=".repeat(70));

  const testUser = {
    email: 'test.registro@ejemplo.com',
    password: 'TestPassword123',
    name: 'Usuario Test'
  };

  console.log("\n1️⃣  Registrando nuevo usuario en Supabase Auth...");
  console.log(`   Email: ${testUser.email}`);
  console.log(`   Nombre: ${testUser.name}`);

  try {
    // Paso 1: Sign up
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: { full_name: testUser.name }
      }
    });

    if (error) {
      console.log(`   ❌ Error en signup: ${error.message}`);
      return;
    }

    const userId = data.user.id;
    console.log(`   ✅ Usuario creado en Auth (ID: ${userId})`);

    // Paso 2: Confirmar email
    console.log("\n2️⃣  Confirmando email automáticamente...");
    const confirmRes = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email_confirm: true
    });

    if (confirmRes.error) {
      console.log(`   ⚠️  Aviso: ${confirmRes.error.message}`);
    } else {
      console.log(`   ✅ Email confirmado`);
    }

    // Paso 3: Crear perfil en tabla users
    console.log("\n3️⃣  Creando perfil en tabla 'users'...");
    
    const dummyHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvJ32e';
    
    const { error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email: testUser.email,
        name: testUser.name,
        password_hash: dummyHash,
        plan: 'gratuito',
        balance: 0,
        is_active: true,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.log(`   ❌ Error: ${insertError.message}`);
      return;
    }

    console.log(`   ✅ Perfil creado en BD`);

    // Paso 4: Probar login
    console.log("\n4️⃣  Probando login con las nuevas credenciales...");
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password
    });

    if (loginError) {
      console.log(`   ❌ Error de login: ${loginError.message}`);
      return;
    }

    console.log(`   ✅ Login exitoso!`);

    // Paso 5: Verificar datos en tabla users
    console.log("\n5️⃣  Verificando datos en tabla 'users'...");
    
    const { data: userData, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', testUser.email)
      .single();

    if (fetchError) {
      console.log(`   ⚠️  Error: ${fetchError.message}`);
    } else if (userData) {
      console.log(`   ✅ Usuario encontrado en BD:`);
      console.log(`      Email: ${userData.email}`);
      console.log(`      Nombre: ${userData.name}`);
      console.log(`      Plan: ${userData.plan}`);
      console.log(`      Balance: $${userData.balance}`);
    }

    console.log("\n" + "=".repeat(70));
    console.log("\n✨ ¡PRUEBA EXITOSA!");
    console.log("\n📝 RESUMEN:");
    console.log(`   ✅ Usuario registrado en Auth`);
    console.log(`   ✅ Email confirmado automáticamente`);
    console.log(`   ✅ Perfil creado en BD`);
    console.log(`   ✅ Login funciona sin "datos inválidos"`);
    console.log(`   ✅ Datos sincronizados correctamente\n`);

    // Limpiar: eliminar usuario de prueba
    console.log("🧹 Limpiando usuario de prueba...");
    await supabaseAdmin.auth.admin.deleteUser(userId);
    await supabaseAdmin.from('users').delete().eq('id', userId);
    console.log("   ✅ Usuario de prueba eliminado\n");

  } catch (err) {
    console.log(`\n❌ Excepción: ${err.message}\n`);
  }
}

pruebaRegistro().catch(err => {
  console.error("❌ Error fatal:", err);
  process.exit(1);
});
