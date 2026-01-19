#!/usr/bin/env node

/**
 * Script para verificar la conexión con Supabase
 * Ejecutar con: node scripts/verify-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Verificando configuración de Supabase...\n');

// Verificar variables de entorno
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL no está configurada');
  process.exit(1);
}

if (!supabaseKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY no está configurada');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY no está configurada');
  process.exit(1);
}

console.log('✅ Variables de entorno configuradas correctamente');
console.log(`📍 URL: ${supabaseUrl}`);
console.log(`🔑 Anon Key: ${supabaseKey.substring(0, 20)}...`);
console.log(`🔐 Service Role Key: ${serviceRoleKey.substring(0, 20)}...`);

// Crear clientes
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function verifyConnection() {
  try {
    console.log('\n🔗 Probando conexión con cliente anónimo...');
    
    // Test básico de conexión
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Error con cliente anónimo:', error.message);
      
      // Probar con service role
      console.log('\n🔗 Probando conexión con service role...');
      const { data: adminData, error: adminError } = await supabaseAdmin.from('users').select('count').limit(1);
      
      if (adminError) {
        console.error('❌ Error con service role:', adminError.message);
        console.log('\n💡 Posibles soluciones:');
        console.log('1. Ejecutar el script 00-CREAR-TABLAS.sql en Supabase');
        console.log('2. Verificar que las tablas existan');
        console.log('3. Revisar las políticas RLS');
        return false;
      } else {
        console.log('✅ Conexión exitosa con service role');
        console.log('⚠️  Cliente anónimo bloqueado por RLS (normal)');
        return true;
      }
    } else {
      console.log('✅ Conexión exitosa con cliente anónimo');
      return true;
    }
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
    return false;
  }
}

async function verifyTables() {
  console.log('\n📋 Verificando tablas...');
  
  const tables = ['users', 'deposits', 'investments', 'withdrawals', 'notifications'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabaseAdmin.from(table).select('*').limit(1);
      
      if (error) {
        console.error(`❌ Tabla ${table}: ${error.message}`);
      } else {
        console.log(`✅ Tabla ${table}: OK`);
      }
    } catch (err) {
      console.error(`❌ Tabla ${table}: ${err.message}`);
    }
  }
}

async function verifyAuth() {
  console.log('\n🔐 Verificando autenticación...');
  
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error de auth:', error.message);
    } else {
      console.log('✅ Sistema de autenticación: OK');
    }
  } catch (err) {
    console.error('❌ Error de auth:', err.message);
  }
}

async function main() {
  const connectionOk = await verifyConnection();
  
  if (connectionOk) {
    await verifyTables();
    await verifyAuth();
    
    console.log('\n🎉 Verificación completada');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Si hay errores de tablas, ejecuta: 00-CREAR-TABLAS.sql');
    console.log('2. Para desarrollo: npm run dev');
    console.log('3. Para producción: npm run build');
  } else {
    console.log('\n❌ Verificación fallida');
    console.log('\n📝 Pasos para solucionar:');
    console.log('1. Verifica las variables de entorno en .env.local');
    console.log('2. Ejecuta 00-CREAR-TABLAS.sql en Supabase Console');
    console.log('3. Verifica que el proyecto Supabase esté activo');
  }
}

main().catch(console.error);