#!/usr/bin/env node

/**
 * Script para diagnosticar el estado completo del sistema
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ydrvhjpobsfvebexfkbj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERROR: SUPABASE_SERVICE_ROLE_KEY no está configurada');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function diagnostico() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 DIAGNÓSTICO COMPLETO DEL SISTEMA');
  console.log('='.repeat(60) + '\n');

  // Paso 1: Verificar tabla users
  console.log('PASO 1️⃣ : Verificar tabla "users"');
  console.log('-'.repeat(60));
  try {
    const { data, error, count } = await supabaseAdmin
      .from('users')
      .select('id, email, name, plan, balance, is_active', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log(`✅ Usuarios encontrados: ${count}`);
      if (data && data.length > 0) {
        console.log('\n📋 Lista de usuarios:');
        data.forEach((u, i) => {
          console.log(`   ${i + 1}. ${u.email}`);
          console.log(`      - Nombre: ${u.name}`);
          console.log(`      - Plan: ${u.plan}`);
          console.log(`      - Balance: $${u.balance}`);
          console.log(`      - Activo: ${u.is_active}`);
        });
      }
    }
  } catch (err) {
    console.log('❌ Excepción:', err.message);
  }

  // Paso 2: Verificar usuarios en Auth
  console.log('\n\nPASO 2️⃣ : Verificar usuarios en Supabase Auth');
  console.log('-'.repeat(60));
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.log('❌ Error:', error.message);
    } else if (!data || data.users.length === 0) {
      console.log('⚠️ No hay usuarios en Supabase Auth');
    } else {
      console.log(`✅ Usuarios en Auth: ${data.users.length}`);
      data.users.forEach((u) => {
        const status = u.email_confirmed_at ? '✅ Confirmado' : '⏳ Pendiente';
        console.log(`   - ${u.email} (${status})`);
      });
    }
  } catch (err) {
    console.log('❌ Excepción:', err.message);
  }

  // Paso 3: Verificar RLS
  console.log('\n\nPASO 3️⃣ : Verificar estado de RLS');
  console.log('-'.repeat(60));
  try {
    const { data, error } = await supabaseAdmin
      .rpc('check_table_rls', { table_name: 'users' });

    if (error && error.message.includes('does not exist')) {
      console.log('⚠️ Función "check_table_rls" no existe, verificando manualmente...');
      console.log('   💡 RLS probablemente está HABILITADO');
    } else if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('Resultado:', data);
    }
  } catch (err) {
    console.log('⚠️ No se pudo verificar RLS directamente');
  }

  // Paso 4: Intentar insertar un usuario de prueba
  console.log('\n\nPASO 4️⃣ : Intentar insertar usuario de prueba');
  console.log('-'.repeat(60));
  try {
    const testEmail = `test-${Date.now()}@ejemplo.com`;
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: testEmail,
        name: 'Usuario Prueba',
        password_hash: '$2a$10$dummyhash',
        plan: 'gratuito',
        balance: 0,
        is_active: true,
      })
      .select();

    if (error) {
      console.log('❌ Error al insertar:', error.message);
      console.log('   Code:', error.code);
      console.log('   Details:', error.details);
      console.log('   Hint:', error.hint);
    } else {
      console.log('✅ Inserción exitosa');
      console.log('   Email:', testEmail);
    }
  } catch (err) {
    console.log('❌ Excepción:', err.message);
  }

  // Paso 5: Verificar endpoint API
  console.log('\n\nPASO 5️⃣ : Verificar endpoint API /api/users-admin');
  console.log('-'.repeat(60));
  try {
    const response = await fetch('http://localhost:3000/api/users-admin');
    const result = await response.json();

    if (!response.ok) {
      console.log(`❌ Error HTTP ${response.status}`);
      console.log('   Respuesta:', result);
    } else {
      console.log(`✅ Endpoint funcionando`);
      console.log(`   Usuarios retornados: ${result.count}`);
      if (result.data && result.data.length > 0) {
        console.log('   Primeros usuarios:');
        result.data.slice(0, 3).forEach((u) => {
          console.log(`     - ${u.email} (${u.plan})`);
        });
      }
    }
  } catch (err) {
    console.log('❌ Error conectando al endpoint:', err.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Diagnóstico completado');
  console.log('='.repeat(60) + '\n');
}

diagnostico().catch((err) => {
  console.error('❌ Error en diagnóstico:', err);
  process.exit(1);
});
