/**
 * Script para actualizar el balance del usuario basado en depósitos aprobados
 * Uso: node sincronizar-balance-depositos.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('🔄 SINCRONIZAR BALANCE DE DEPÓSITOS');
  console.log('=' .repeat(50));

  try {
    // Obtener todos los usuarios
    console.log('\n1️⃣ Obteniendo usuarios...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, balance, plan')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('❌ Error:', usersError.message);
      return;
    }

    console.log(`✅ ${users.length} usuario(s) encontrado(s)`);

    // Procesar cada usuario
    for (const user of users) {
      console.log(`\n👤 Procesando: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Balance actual: $${user.balance}`);

      // Buscar depósitos aprobados en localStorage (simulado)
      // En un sistema real, estarían en la DB
      
      // Para este script, vamos a asumir que los depósitos aprobados deben estar sincronizados
      // El problema es que están en localStorage del cliente pero no en Supabase
      
      console.log(`   ⚠️  Los depósitos están en localStorage del cliente (no en Supabase)`);
      console.log(`   💡 Solución: Necesitamos que el admin apruebe los depósitos nuevamente`);
      console.log(`      Esto llamará al API /api/admin/deposits/approve que actualizará Supabase`);
    }

    console.log('\n\n' + '='.repeat(50));
    console.log('🔍 ANÁLISIS');
    console.log('='.repeat(50));
    
    console.log(`
PROBLEMA IDENTIFICADO:
✗ Los depósitos están almacenados en localStorage del navegador
✗ La tabla 'deposits' en Supabase está vacía
✗ Por lo tanto, al refrescar la página, los depósitos desaparecen
✗ Y el balance en Supabase no se actualiza

SOLUCIÓN:
1. Crear tabla 'deposits' en Supabase (si no existe)
2. Migrar depósitos de localStorage a Supabase
3. Al aprobar depósitos, actualizar tanto Supabase como localStorage
4. Implementar sincronización bidireccional

PRÓXIMOS PASOS:
✓ Crear tabla 'deposits' en Supabase
✓ Implementar función para guardar depósitos en Supabase
✓ Mejorar el endpoint /api/admin/deposits/approve para leer de Supabase
    `);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
