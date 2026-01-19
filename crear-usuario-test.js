#!/usr/bin/env node

/**
 * Script rápido para crear un usuario de prueba si no hay usuarios
 * Ejecución: node crear-usuario-test.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ydrvhjpobsfvebexfkbj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERROR: SUPABASE_SERVICE_ROLE_KEY no está configurada en .env.local');
  console.log('\n💡 Agrega a tu archivo .env.local:');
  console.log('SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log('\n🔍 Verificando usuarios existentes...\n');

  try {
    // Verificar usuarios existentes
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('email', { count: 'exact' });

    if (checkError) {
      console.error('❌ Error al verificar usuarios:', checkError.message);
      process.exit(1);
    }

    const userCount = existingUsers?.length || 0;
    console.log(`📊 Usuarios actuales: ${userCount}\n`);

    if (userCount > 0) {
      console.log('✅ Ya hay usuarios en la base de datos:');
      existingUsers?.forEach(u => {
        console.log(`   - ${u.email}`);
      });
      console.log('\n💡 No se necesita crear usuarios de prueba.\n');
      return;
    }

    // No hay usuarios, crear uno
    console.log('🆕 Creando usuario de prueba...\n');

    const testUser = {
      email: 'usuario.prueba@ejemplo.com',
      name: 'Usuario Prueba',
      password_hash: '$2a$10$YIjlrPNoS9cHWa0vHemH2OPST9/PgBkqquzi.Oy1D3pK7K5b7Z8NO',
      plan: 'estandar',
      balance: 5000,
      is_active: true,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .insert([testUser])
      .select();

    if (error) {
      console.error('❌ Error al crear usuario:');
      console.error('   Mensaje:', error.message);
      console.error('   Código:', error.code);
      console.error('   Detalles:', error.details);
      process.exit(1);
    }

    console.log('✅ Usuario creado exitosamente:\n');
    console.log(`   📧 Email: ${testUser.email}`);
    console.log(`   👤 Nombre: ${testUser.name}`);
    console.log(`   💳 Plan: ${testUser.plan}`);
    console.log(`   💰 Balance: $${testUser.balance}`);
    console.log('\n💡 Ahora puedes:');
    console.log('   1. Ir a /admin para ver el panel');
    console.log('   2. Los usuarios deberían aparecer en el dashboard\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
