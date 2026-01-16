# 🚀 PASO 2: Deploy en Vercel

## ✅ INSTRUCCIONES PASO A PASO

### Paso 1: Importar Repositorio (2 minutos)

En la página de Vercel:

1. Click en: **"Add New..."** o **"New Project"**
2. Selecciona: **"Import Git Repository"**
3. En "Repository URL", pega: 
   ```
   https://github.com/quiroztejenadarwinfa/cvvinvest
   ```
4. Click: **"Continue"**

---

### Paso 2: Configurar Proyecto

Deberías ver un formulario con:

```
Project Name: cvvinvest (o el que quieras)
Framework: Next.js (debe detectarlo automáticamente)
Root Directory: ./ (por defecto)
```

**Mantén todo por defecto.** Click: **"Continue"**

---

### Paso 3: Variables de Entorno (IMPORTANTE)

Verás un campo: **"Environment Variables"**

Aquí debes agregar:

#### 1. MONGODB_URI
```
Name:  MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/cvvinvest?retryWrites=true&w=majority
```

⚠️ **IMPORTANTE:** Antes de completar esto, necesitas:

1. **Crear cuenta MongoDB Atlas** (2 minutos)
   - Ve a: https://www.mongodb.com/cloud/atlas
   - Sign Up / Login
   - Crear cluster GRATUITO (M0)
   - Obtener connection string
   - Reemplazar username/password

**De momento, puedes dejar esto EN BLANCO y agregarlo después.**

#### 2. Otros Variables (Opcionales por ahora)
```
NEXT_PUBLIC_API_URL = https://cvvinvest.vercel.app
NODE_ENV = production
```

---

### Paso 4: Deploy

Click: **"Deploy"**

Vercel empezará a:
```
✅ Clonar tu repositorio
✅ Instalar dependencias (pnpm)
✅ Hacer build
✅ Subir a producción
```

**Tiempo estimado: 3-5 minutos**

---

## 📊 VISTA EN VERCEL

Deberías ver algo como:

```
✅ Building...
✅ Installing dependencies
✅ Building project
✅ Ready for deployment
🎉 Deployment complete!

URL: https://cvvinvest.vercel.app
```

---

## 🔗 TU NUEVA URL

Una vez completado, tu aplicación estará en:

```
https://cvvinvest.vercel.app
```

---

## ⚠️ MONGODB - HAZLO AHORA (5 minutos)

Antes de que funcione la aplicación necesitas MongoDB:

### 1. Crear Cuenta MongoDB Atlas
- Ve a: https://www.mongodb.com/cloud/atlas
- Sign Up
- Completa el formulario

### 2. Crear Cluster GRATUITO
- Click: "Build a Database"
- Selecciona: "M0 (Shared)" - **GRATIS**
- Cloud: AWS
- Region: us-east-1
- Click: "Create Deployment"

### 3. Crear Usuario
- Username: `cvvinvest_user`
- Password: `Genera una contraseña fuerte`
- Click: "Create User"

### 4. Obtener Connection String
- Click: "Drivers" o "Connect"
- Selecciona: "Drivers" → "Node.js"
- Copia la connection string:

```
mongodb+srv://cvvinvest_user:PASSWORD@cluster0.xxxxx.mongodb.net/cvvinvest?retryWrites=true&w=majority
```

### 5. Reemplaza en Vercel
- Ve a tu proyecto en Vercel
- Settings → Environment Variables
- Agregar:
  ```
  Name: MONGODB_URI
  Value: [PEGA TU CONNECTION STRING]
  ```
- Click: "Save"
- **REDEPLOY** automáticamente

---

## 📋 CHECKLIST VERCEL

```
EN VERCEL:
☐ Proyecto creado
☐ GitHub conectado
☐ Variables de entorno agregadas
☐ Deploy completado
☐ URL funcionando

EN MONGODB:
☐ Cuenta creada
☐ Cluster M0 creado
☐ Usuario creado
☐ Connection string obtenida
☐ MONGODB_URI en Vercel

FINAL:
☐ https://cvvinvest.vercel.app accesible
☐ Login funcionando
☐ Datos guardándose en BD
```

---

## 🎯 COMANDOS RÁPIDOS

Si algo falla, puedes ver logs en Vercel:
- Click en tu deployment
- Click en "Deployment"
- Click en "Logs"

Para redeployar:
- Ve a Vercel
- Click "Redeploy" en el último deployment

Para cambiar variables:
- Settings → Environment Variables
- Editar/Agregar
- Redeployar

---

## ✅ VERIFICACIÓN FINAL

Una vez que todo esté listo:

1. Ve a: https://cvvinvest.vercel.app
2. Intenta hacer login
3. Los datos deben guardarse en MongoDB
4. ¡Listo para producción!

---

**¿Dime qué ves en Vercel para continuar guiándote paso a paso.** 🚀
