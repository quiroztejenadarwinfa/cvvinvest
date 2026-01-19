#!/usr/bin/env node

/**
 * Script de diagnóstico para verificar usuarios en Supabase
 * Ejecutar con: node diagnostico-login.js
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ydrvhjpobsfvebexfkbj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnZoanBvYnNmdmViZXhma2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTY5MjYsImV4cCI6MjA4NDM3MjkyNn0.IbUWYiFbGwNjg-s4eknYjSkuQTKFZ3Km2178n5l1WEQ";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnZoanBvYnNmdmViZXhma2JqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc5NjkyNiwiZXhwIjoyMDg0MzcyOTI2fQ.6KxaywUYnWS4DqgzpANzWLTjiT-S0vejydFG4sV8ImY";

async function diagnostico() {
  console.log("🔍 DIAGNÓSTICO DE CONEXIÓN Y USUARIOS EN SUPABASE\n");
  console.log("=" .repeat(70));

  // Paso 1: Verificar conexión
  console.log("\n✓ PASO 1: Verificar conexión a Supabase");
  console.log(`  URL: ${SUPABASE_URL}`);
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data, error } = await supabase.from('users').select('count()', { count: 'exact' });
    if (!error) {
      console.log(`  ✅ Conexión exitosa - Tabla 'users' accesible`);
    }
  } catch (err) {
    console.log(`  ❌ Error: ${err.message}`);
  }

  // Paso 2: Verificar usuarios en tabla users
  console.log("\n✓ PASO 2: Usuarios en tabla 'users' (BD)");
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email, name, plan')
      .order('created_at');

    if (error) {
      console.log(`  ❌ Error: ${error.message}`);
    } else if (!data || data.length === 0) {
      console.log(`  ⚠️  No hay usuarios en la tabla`);
    } else {
      console.log(`  ✅ Encontrados ${data.length} usuarios:`);
      data.forEach(u => {
        console.log(`     - ${u.email} (${u.name}) [${u.plan}]`);
      });
    }
  } catch (err) {
    console.log(`  ❌ Excepción: ${err.message}`);
  }

  // Paso 3: Verificar usuarios en Supabase Auth
  console.log("\n✓ PASO 3: Usuarios en Supabase Auth (Autenticación)");
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.log(`  ❌ Error: ${error.message}`);
      console.log(`  💡 Verifica que SUPABASE_SERVICE_ROLE_KEY sea correcta`);
    } else if (!data || data.users.length === 0) {
      console.log(`  ⚠️  No hay usuarios en Supabase Auth`);
      console.log(`  💡 Los usuarios en la BD no pueden hacer login sin estar en Auth`);
    } else {
      console.log(`  ✅ Encontrados ${data.users.length} usuarios en Auth:`);
      data.users.forEach(u => {
        const status = u.email_confirmed_at ? '✅ Confirmado' : '⏳ Pendiente';
        console.log(`     - ${u.email} (${status})`);
      });
    }
  } catch (err) {
    console.log(`  ❌ Excepción: ${err.message}`);
  }

  // Paso 4: Probar login
  console.log("\n✓ PASO 4: Probar login con usuario de prueba");
  
  const testUser = {
    email: 'usuario.gratuito@ejemplo.com',
    password: 'password123'
  };

  console.log(`  Intentando login con: ${testUser.email}`);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password,
    });

    if (error) {
      console.log(`  ❌ Login falló: ${error.message}`);
      console.log(`  💡 Esto significa que:`);
      console.log(`     1. El usuario NO existe en Supabase Auth`);
      console.log(`     2. O la contraseña es incorrecta`);
      console.log(`  💡 Solución: Ejecuta 'node crear-usuarios-supabase.js'`);
    } else if (data.user) {
      console.log(`  ✅ Login exitoso!`);
      console.log(`     ID: ${data.user.id}`);
      console.log(`     Email: ${data.user.email}`);
    }
  } catch (err) {
    console.log(`  ❌ Excepción: ${err.message}`);
  }

  console.log("\n" + "=".repeat(70));
  console.log("\n📋 RESUMEN Y RECOMENDACIONES:\n");

  // Verificar estado actual
  try {
    const { data: usersAuth, error: errorAuth } = await supabaseAdmin.auth.admin.listUsers();
    const { data: usersBD, error: errorBD } = await supabase
      .from('users')
      .select('count()', { count: 'exact' });

    const countAuth = !errorAuth ? usersAuth.users.length : 0;
    const countBD = !errorBD && usersBD ? usersBD.count : 0;

    console.log(`  👥 Usuarios en BD: ${countBD}`);
    console.log(`  🔐 Usuarios en Auth: ${countAuth}`);

    if (countAuth === 0) {
      console.log(`\n  ⚠️  PROBLEMA DETECTADO: No hay usuarios en Supabase Auth`);
      console.log(`  ✅ SOLUCIÓN:`);
      console.log(`     1. Ejecuta: node crear-usuarios-supabase.js`);
      console.log(`     2. O usa el panel: https://app.supabase.com > Authentication > Users`);
      console.log(`     3. Luego intenta hacer login nuevamente`);
    } else if (countAuth > 0) {
      console.log(`\n  ✅ Hay usuarios en Auth, pero puede haber problema con credenciales`);
      console.log(`  💡 Verifica que escribas el email y contraseña correctamente`);
    }
  } catch (err) {
    console.log(`  Error al resumir: ${err.message}`);
  }

  console.log("\n");
}

diagnostico().catch(err => {
  console.error("❌ Error en diagnóstico:", err);
  process.exit(1);
});
