/**
 * Script para actualizar rápidamente el balance de un usuario
 * Uso: node actualizar-balance-directo.js <email> <monto>
 */

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
  const email = process.argv[2];
  const monto = process.argv[3];

  if (!email || !monto) {
    console.error('❌ Uso: node actualizar-balance-directo.js <email> <monto>');
    console.error('   Ejemplo: node actualizar-balance-directo.js quiroztejenadarwinfabian@gmail.com 29999.99');
    process.exit(1);
  }

  try {
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      console.error('❌ Monto debe ser un número positivo');
      process.exit(1);
    }

    // Obtener usuario
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, balance')
      .eq('email', email)
      .single();

    if (userError) {
      console.error('❌ Usuario no encontrado:', email);
      process.exit(1);
    }

    console.log(`👤 Usuario encontrado: ${user.email}`);
    console.log(`   Balance actual: $${user.balance}`);
    console.log(`   Nuevo balance:  $${montoNum}`);

    // Actualizar balance
    const { data: updated, error: updateError } = await supabase
      .from('users')
      .update({ balance: montoNum })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error al actualizar:', updateError.message);
      process.exit(1);
    }

    console.log(`\n✅ Balance actualizado`);
    console.log(`   ${updated.email}: $${updated.balance}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
