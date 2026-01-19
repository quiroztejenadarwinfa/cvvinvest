#!/bin/bash

# 🐙 CVVInvest - Preparar para GitHub y Deployment
# Este script prepara el proyecto para subirlo a GitHub

echo "🐙 Preparando CVVInvest para GitHub..."
echo ""

# Verificar Git
if ! command -v git &> /dev/null; then
    echo "❌ Git no está instalado"
    echo "📥 Instala Git desde: https://git-scm.com/"
    exit 1
fi

echo "✅ Git encontrado: $(git --version)"

# Inicializar repositorio si no existe
if [ ! -d ".git" ]; then
    echo "📁 Inicializando repositorio Git..."
    git init
    echo "✅ Repositorio inicializado"
else
    echo "✅ Repositorio Git ya existe"
fi

# Verificar .gitignore
if [ ! -f ".gitignore" ]; then
    echo "❌ .gitignore no encontrado"
    exit 1
fi

echo "✅ .gitignore configurado"

# Verificar que archivos sensibles estén ignorados
if grep -q ".env*" .gitignore; then
    echo "✅ Archivos .env protegidos"
else
    echo "⚠️  Agregando protección para archivos .env"
    echo "" >> .gitignore
    echo "# Environment files" >> .gitignore
    echo ".env*" >> .gitignore
    echo "!.env.example" >> .gitignore
fi

# Limpiar archivos temporales
echo ""
echo "🧹 Limpiando archivos temporales..."
rm -rf .next/
rm -rf node_modules/.cache/
rm -rf .vercel/

# Verificar archivos críticos
echo ""
echo "🔍 Verificando archivos críticos..."

critical_files=(
    "package.json"
    "next.config.mjs"
    "tsconfig.json"
    "tailwind.config.ts"
    "00-CREAR-TABLAS.sql"
    "scripts/deploy-setup.md"
    "README.md"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file no encontrado"
        exit 1
    fi
done

# Verificar estructura de carpetas
echo ""
echo "📁 Verificando estructura..."

critical_dirs=(
    "app"
    "components"
    "lib"
    "scripts"
)

for dir in "${critical_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir/"
    else
        echo "❌ $dir/ no encontrado"
        exit 1
    fi
done

# Agregar todos los archivos
echo ""
echo "📦 Preparando archivos para commit..."
git add .

# Mostrar estado
echo ""
echo "📊 Estado del repositorio:"
git status --short

# Verificar si hay cambios para commit
if git diff --staged --quiet; then
    echo ""
    echo "ℹ️  No hay cambios nuevos para commit"
else
    echo ""
    echo "📝 Archivos listos para commit:"
    git diff --staged --name-only
fi

echo ""
echo "🎉 ¡Proyecto preparado para GitHub!"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "1. 📋 Crear repositorio en GitHub:"
echo "   - Ve a: https://github.com/new"
echo "   - Nombre: cvvinvest-platform"
echo "   - Descripción: Investment platform with Supabase and Next.js"
echo "   - Público o Privado (tu elección)"
echo "   - NO inicializar con README"
echo ""
echo "2. 🔗 Conectar repositorio local:"
echo "   git remote add origin https://github.com/TU_USUARIO/cvvinvest-platform.git"
echo ""
echo "3. 📤 Hacer primer commit y push:"
echo "   git commit -m \"Initial commit - CVVInvest platform ready for production\""
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. ☁️ Deploy en Vercel:"
echo "   - Ve a: https://vercel.com/new"
echo "   - Importa tu repositorio"
echo "   - Configura variables de entorno"
echo ""
echo "📖 Guía completa: scripts/deploy-setup.md"
echo ""
echo "⚠️  IMPORTANTE:"
echo "- NO subas archivos .env al repositorio"
echo "- Configura las variables de entorno en Vercel Dashboard"
echo "- Ejecuta 00-CREAR-TABLAS.sql en Supabase antes del deploy"