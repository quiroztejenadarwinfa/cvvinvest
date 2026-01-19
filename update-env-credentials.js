#!/usr/bin/env node

/**
 * Script para actualizar credenciales de Supabase
 * Ejecutar después de crear el nuevo proyecto Supabase
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Actualizador de Credenciales Supabase - CVVInvest\n');

// Solicitar nuevas credenciales
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function updateCredentials() {
  try {
    console.log('📋 Ingresa las nuevas credenciales de tu proyecto Supabase:');
    console.log('   (Las puedes encontrar en: Settings > API)\n');

    const supabaseUrl = await askQuestion('🔗 Project URL (https://xxx.supabase.co): ');
    const anonKey = await askQuestion('🔑 anon public key: ');
    const serviceKey = await askQuestion('🔐 service_role key: ');

    if (!supabaseUrl || !anonKey || !serviceKey) {
      console.error('❌ Todas las credenciales son requeridas');
      process.exit(1);
    }

    // Validar formato de URL
    if (!supabaseUrl.includes('supabase.co')) {
      console.error('❌ URL de Supabase inválida');
      process.exit(1);
    }

    // Crear contenido del .env.local
    const envContent = `# Supabase Configuration - ACTUALIZADO
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_ROLE_KEY=${serviceKey}

# NextAuth Configuration - REQUERIDO
NEXTAUTH_SECRET=cvvinvest-super-secret-key-2025-production
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Opcional)
GOOGLE_CLIENT_ID=demo-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=demo-google-client-secret

# Microsoft OAuth (Opcional)
MICROSOFT_CLIENT_ID=demo-microsoft-client-id
MICROSOFT_CLIENT_SECRET=demo-microsoft-client-secret
MICROSOFT_TENANT_ID=common`;

    // Escribir archivo .env.local
    fs.writeFileSync('.env.local', envContent);
    console.log('\n✅ Archivo .env.local actualizado correctamente');

    // Crear archivo para Vercel
    const vercelEnvContent = `# Variables de Entorno para Vercel - CVVInvest
# Copia estas variables en tu dashboard de Vercel

NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_ROLE_KEY=${serviceKey}
NEXTAUTH_SECRET=cvvinvest-super-secret-key-2025-production
NEXTAUTH_URL=https://tu-dominio.vercel.app

# OAuth (Opcional)
GOOGLE_CLIENT_ID=demo-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=demo-google-client-secret
MICROSOFT_CLIENT_ID=demo-microsoft-client-id
MICROSOFT_CLIENT_SECRET=demo-microsoft-client-secret
MICROSOFT_TENANT_ID=common`;

    fs.writeFileSync('vercel-env-variables.txt', vercelEnvContent);
    console.log('✅ Archivo vercel-env-variables.txt creado para deployment');

    // Actualizar next.config.mjs con nueva URL
    const nextConfigPath = 'next.config.mjs';
    if (fs.existsSync(nextConfigPath)) {
      let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
      
      // Extraer el ID del proyecto de la URL
      const projectId = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
      
      // Actualizar CSP con nueva URL
      nextConfig = nextConfig.replace(
        /https:\/\/[a-z0-9]+\.supabase\.co/g,
        supabaseUrl
      );
      
      nextConfig = nextConfig.replace(
        /wss:\/\/[a-z0-9]+\.supabase\.co/g,
        `wss://${projectId}.supabase.co`
      );

      fs.writeFileSync(nextConfigPath, nextConfig);
      console.log('✅ next.config.mjs actualizado con nueva URL');
    }

    console.log('\n🎉 ¡Credenciales actualizadas exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('1. ✅ Ejecuta el SQL en Supabase Console (00-CREAR-TABLAS.sql)');
    console.log('2. 🧪 Prueba la conexión: node scripts/verify-supabase.js');
    console.log('3. 🚀 Inicia el proyecto: pnpm dev');
    console.log('4. ☁️ Para Vercel: usa las variables de vercel-env-variables.txt');

    console.log('\n📊 Resumen de archivos actualizados:');
    console.log('- ✅ .env.local (desarrollo local)');
    console.log('- ✅ vercel-env-variables.txt (para Vercel)');
    console.log('- ✅ next.config.mjs (CSP headers)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

updateCredentials();