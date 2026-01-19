#!/usr/bin/env node

/**
 * Generar hash de contraseña para admin
 */

const bcrypt = require('bcrypt');

async function generateHash() {
  try {
    const password = 'admin12345';
    const saltRounds = 10;
    
    console.log('🔐 Generando hash para contraseña admin...');
    
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('\n✅ Hash generado:');
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    
    // Verificar que el hash funciona
    const isValid = await bcrypt.compare(password, hash);
    console.log(`\n🧪 Verificación: ${isValid ? '✅ Válido' : '❌ Inválido'}`);
    
    console.log('\n📝 Para usar en SQL:');
    console.log(`password_hash = '${hash}'`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

generateHash();