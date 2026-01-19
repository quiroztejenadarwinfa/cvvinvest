/**
 * Script para actualizar el balance del usuario en Supabase
 * Entrada manual: ingresa el email del usuario y el monto a sumar
 * Uso: node actualizar-balance-manual.js
 */

const readline = require('readline');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('💰 ACTUALIZAR BALANCE DEL USUARIO');
  console.log('=' .repeat(50));

  try {
    // Obtener usuarios disponibles
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, balance')
      .order('email');

    if (usersError) {
      console.error('❌ Error al obtener usuarios:', usersError.message);
      rl.close();
      return;
    }

    console.log('\n📋 Usuarios disponibles:');
    users.forEach((u, idx) => {
      console.log(`${idx + 1}. ${u.email} (Balance: $${u.balance})`);
    });

    const emailInput = await question('\n📧 Email del usuario: ');
    const user = users.find(u => u.email === emailInput);

    if (!user) {
      console.error('❌ Usuario no encontrado');
      rl.close();
      return;
    }

    console.log(`\n✅ Usuario encontrado: ${user.email}`);
    console.log(`   Balance actual: $${user.balance}`);

    const amount = await question('\n💵 Monto a sumar al balance: $');
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      console.error('❌ Monto inválido');
      rl.close();
      return;
    }

    const newBalance = user.balance + amountNum;

    console.log(`\n📊 Operación:`);
    console.log(`   Balance actual:  $${user.balance}`);
    console.log(`   + Depósitos:     $${amountNum}`);
    console.log(`   = Nuevo balance: $${newBalance}`);

    const confirm = await question('\n¿Confirmar actualización? (s/n): ');
    
    if (confirm.toLowerCase() !== 's') {
      console.log('❌ Cancelado');
      rl.close();
      return;
    }

    // Actualizar balance
    const { data, error } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error al actualizar:', error.message);
      rl.close();
      return;
    }

    console.log(`\n✅ Balance actualizado correctamente`);
    console.log(`   ${user.email}: $${data.balance}`);

    rl.close();

  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
  }
}

main();
