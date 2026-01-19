/**
 * Script de diagnóstico: Verificar balance del usuario en Supabase vs localStorage
 * Uso: node diagnostico-balance.js
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
  console.log('📊 DIAGNÓSTICO DE BALANCE');
  console.log('=' .repeat(50));

  try {
    // Obtener todos los usuarios
    console.log('\n1️⃣ Obteniendo usuarios de Supabase...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, balance, plan')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('❌ Error al obtener usuarios:', usersError.message);
      return;
    }

    console.log(`✅ Se encontraron ${users.length} usuario(s):`);
    users.forEach((user, idx) => {
      console.log(`\n   [${idx + 1}] ${user.email}`);
      console.log(`       - ID: ${user.id}`);
      console.log(`       - Balance: $${user.balance}`);
      console.log(`       - Plan: ${user.plan}`);
    });

    // Obtener depósitos
    console.log('\n\n2️⃣ Obteniendo depósitos...');
    const { data: deposits, error: depositsError } = await supabase
      .from('deposits')
      .select('id, user_id, user_email, amount, status')
      .order('created_at', { ascending: false });

    if (depositsError) {
      console.error('⚠️ Error al obtener depósitos (tabla podría no existir):', depositsError.message);
    } else {
      console.log(`✅ Se encontraron ${deposits.length} depósito(s):`);
      
      // Agrupar por usuario
      const depositsByUser = {};
      deposits.forEach(dep => {
        if (!depositsByUser[dep.user_email]) {
          depositsByUser[dep.user_email] = [];
        }
        depositsByUser[dep.user_email].push(dep);
      });

      Object.entries(depositsByUser).forEach(([email, depsOfUser]) => {
        const approved = depsOfUser.filter(d => d.status === 'aprobado');
        const approvedTotal = approved.reduce((sum, d) => sum + d.amount, 0);
        
        console.log(`\n   ${email}:`);
        console.log(`   - Total depósitos: ${depsOfUser.length}`);
        console.log(`   - Depósitos aprobados: ${approved.length}`);
        console.log(`   - Monto total aprobado: $${approvedTotal}`);
        
        const user = users.find(u => u.email === email);
        if (user) {
          console.log(`   - Balance actual en BD: $${user.balance}`);
          if (user.balance < approvedTotal) {
            console.log(`   ⚠️  INCONSISTENCIA: Balance ($${user.balance}) < Depósitos aprobados ($${approvedTotal})`);
          }
        }
      });
    }

    // Resumen
    console.log('\n\n' + '='.repeat(50));
    console.log('📋 RESUMEN');
    console.log('='.repeat(50));
    
    let totalBalance = 0;
    users.forEach(u => {
      totalBalance += u.balance;
    });
    
    console.log(`Total de usuarios: ${users.length}`);
    console.log(`Balance total en sistema: $${totalBalance}`);
    console.log('\n✅ Diagnóstico completado');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
