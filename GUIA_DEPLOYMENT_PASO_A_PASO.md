# 📚 GUÍA COMPLETA: Paso a Paso para Deployment

## PASO 1: Preparar el Proyecto Localmente

### 1.1 Instalar nuevas dependencias
```bash
pnpm install
```

### 1.2 Crear archivo `.env.local`
```bash
cp .env.example .env.local
```

### 1.3 Editar `.env.local` con tus credenciales
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cvvinvest?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 1.4 Probar que compile sin errores
```bash
pnpm build
```

---

## PASO 2: Configurar MongoDB Atlas (Base de Datos Gratuita)

### 2.1 Ir a https://www.mongodb.com/cloud/atlas

### 2.2 Crear cuenta
- Usar email
- Crear password segura
- Aceptar términos

### 2.3 Crear Cluster
- Seleccionar "Build a Database"
- Elegir "Shared" (Gratuito)
- Seleccionar región más cercana
- Crear cluster

### 2.4 Crear Usuario de Base de Datos
- Ir a "Database Access"
- Crear usuario: `dbuser`
- Crear password compleja
- Permisos: "Atlas Admin"

### 2.5 Permitir conexiones
- Ir a "Network Access"
- Agregar IP: `0.0.0.0/0` (Permite cualquier IP)
- Confirmar

### 2.6 Obtener Connection String
- Ir a "Databases"
- Click "Connect"
- Copiar "Connection string"
- Reemplazar `<username>` y `<password>`
- Ejemplo:
```
mongodb+srv://dbuser:password123@cluster.mongodb.net/cvvinvest?retryWrites=true&w=majority
```

### 2.7 Pegar en `.env.local`
```env
MONGODB_URI=mongodb+srv://dbuser:password123@cluster.mongodb.net/cvvinvest?retryWrites=true&w=majority
```

---

## PASO 3: Crear Repositorio en GitHub

### 3.1 Crear cuenta en https://github.com

### 3.2 Crear nuevo repositorio
- Click "+" arriba a la derecha
- "New repository"
- Nombre: `financial-investment-platform`
- Descripción: "Plataforma de inversiones"
- Público o Privado (tu elección)
- NO inicializar con README
- Crear

### 3.3 Subir proyecto
```bash
cd financial-investment-platform
git init
git add .
git commit -m "Initial commit: Financial Investment Platform"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/financial-investment-platform.git
git push -u origin main
```

---

## PASO 4: Configurar Vercel (Hosting)

### 4.1 Ir a https://vercel.com

### 4.2 Sign up with GitHub
- Conectarse con GitHub
- Autorizar Vercel

### 4.3 Importar proyecto
- Click "Add New..." → "Project"
- Seleccionar repositorio
- Click "Import"

### 4.4 Configurar variables de entorno
En la sección "Environment Variables":

```
Nombre: MONGODB_URI
Valor: mongodb+srv://dbuser:password123@cluster.mongodb.net/cvvinvest?retryWrites=true&w=majority
```

### 4.5 Deploy
- Click "Deploy"
- Esperar a que compile (2-5 minutos)
- Ver URL: https://tu-proyecto.vercel.app

---

## PASO 5: Pruebas en Producción

### 5.1 Probar APIs
```bash
# Obtener usuarios
curl https://tu-proyecto.vercel.app/api/users

# Crear usuario (POST)
curl -X POST https://tu-proyecto.vercel.app/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123",
    "plan": "gratuito"
  }'
```

### 5.2 Probar login
- Ir a: https://tu-proyecto.vercel.app/login
- Probar login con usuario test

### 5.3 Probar chat
- Ir a: https://tu-proyecto.vercel.app/chat
- Enviar mensaje

---

## PASO 6: Actualizar Conexión en la App

### 6.1 Migrar Login a API (Opcional pero Recomendado)

Cambiar en `app/login/page.tsx`:

```typescript
// ANTES: localStorage
const users = JSON.parse(localStorage.getItem('cvvinvest_users') || '[]')

// DESPUÉS: API
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
```

### 6.2 Migrar Depósitos a API

Cambiar en `app/depositos/page.tsx`:

```typescript
// ANTES: localStorage
const deposits = JSON.parse(localStorage.getItem('depositos') || '[]')

// DESPUÉS: API
const response = await fetch('/api/deposits', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId, amount, method: 'paypal' })
})
```

---

## PASO 7: Dominio Personalizado (Opcional)

### 7.1 Comprar dominio
- https://namecheap.com (barato)
- https://godaddy.com
- https://domains.google.com

### 7.2 Conectar a Vercel
- En Vercel: Project Settings → Domains
- Agregar tu dominio
- Seguir instrucciones para DNS

---

## CHECKLIST FINAL

- [ ] Proyecto local compilando sin errores
- [ ] `.env.local` configurado
- [ ] MongoDB Atlas creado
- [ ] Connection string obtenida
- [ ] Repositorio GitHub creado
- [ ] Código subido a GitHub
- [ ] Vercel proyecto creado
- [ ] Variables de entorno en Vercel
- [ ] Deploy completado
- [ ] URL funcionando
- [ ] Login probado
- [ ] Chat probado
- [ ] Depósitos probados

---

## COSTOS

| Servicio | Costo | Limit |
|----------|-------|-------|
| MongoDB Atlas | $0 | 512 MB almacenamiento |
| Vercel | $0 | 100 GB bandwidth/mes |
| Dominio (opcional) | $10-15/año | Ilimitado |
| **TOTAL** | **$0-15/año** | - |

---

## SOPORTE

Si necesitas ayuda:
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Next.js API: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

## SIGUIENTE: Migración de Datos

Una vez en producción, puedes:
1. Exportar datos de localStorage como JSON
2. Importarlos a MongoDB
3. Dejar localStorage como respaldo local
4. Sincronizar frecuentemente

