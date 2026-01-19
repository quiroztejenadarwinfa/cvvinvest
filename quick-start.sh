#!/bin/bash

# 🚀 CVVInvest - Script de Inicio Rápido
# Este script automatiza la preparación para deployment

echo "🚀 CVVInvest - Preparando para deployment..."
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "📥 Instala Node.js desde: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar pnpm
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm no encontrado, instalando..."
    npm install -g pnpm
fi

echo "✅ pnpm encontrado: $(pnpm --version)"

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
pnpm install

# Verificar archivos críticos
echo ""
echo "🔍 Verificando archivos críticos..."

if [ ! -f ".env.local" ]; then
    echo "❌ .env.local no encontrado"
    echo "📝 Crea .env.local con las variables de Supabase"
    exit 1
fi

echo "✅ .env.local encontrado"

if [ ! -f "00-CREAR-TABLAS.sql" ]; then
    echo "❌ 00-CREAR-TABLAS.sql no encontrado"
    exit 1
fi

echo "✅ Script SQL encontrado"

# Verificar conexión Supabase
echo ""
echo "🔗 Verificando conexión con Supabase..."
node scripts/verify-supabase.js

# Build de prueba
echo ""
echo "🏗️  Probando build..."
pnpm build

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ¡Todo listo para deployment!"
    echo ""
    echo "📝 Próximos pasos:"
    echo "1. Ejecuta 00-CREAR-TABLAS.sql en Supabase Console"
    echo "2. Sube el código a GitHub"
    echo "3. Conecta GitHub con Vercel"
    echo "4. Configura variables de entorno en Vercel"
    echo ""
    echo "📖 Guía completa: scripts/deploy-setup.md"
else
    echo ""
    echo "❌ Error en el build"
    echo "🔧 Revisa los errores arriba y corrígelos"
fi