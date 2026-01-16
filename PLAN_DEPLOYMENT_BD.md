# 🚀 PLAN DE DEPLOYMENT CON BASE DE DATOS

## FASE 1: CONFIGURAR BASE DE DATOS GRATUITA

### Opción Recomendada: MongoDB + Vercel (100% GRATUITO)

#### A. MongoDB Atlas (Base de Datos Gratuita)
1. Ir a: https://www.mongodb.com/cloud/atlas
2. Crear cuenta gratuita
3. Crear cluster M0 (Sandbox - Gratuito)
4. Obtener connection string
5. Guardar credenciales

#### B. Vercel (Hosting Gratuito para Next.js)
1. Ir a: https://vercel.com
2. Conectar repositorio GitHub
3. Deploy automático
4. Variables de entorno desde .env

---

## FASE 2: INSTALAR DEPENDENCIAS

```bash
pnpm add mongoose dotenv
pnpm add -D @types/node
```

---

## FASE 3: ESTRUCTURA DE BASE DE DATOS

### 1. Crear archivo `.env.local`
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

### 2. Modelos de datos

#### User
```typescript
{
  _id: ObjectId
  email: string (unique)
  name: string
  password: string (hash)
  plan: "gratuito" | "estandar" | "pro" | "vip" | "elite"
  balance: number
  twoFactorEnabled: boolean
  twoFactorPin: string (encrypted)
  createdAt: Date
  updatedAt: Date
}
```

#### Deposit
```typescript
{
  _id: ObjectId
  userId: ObjectId
  userEmail: string
  userName: string
  amount: number
  status: "pendiente" | "aprobado" | "rechazado"
  method: "paypal" | "bank" | "crypto"
  createdAt: Date
  approvedAt?: Date
  notes?: string
}
```

#### Chat Session
```typescript
{
  _id: ObjectId
  userId: ObjectId
  userName: string
  userEmail: string
  messages: [
    {
      id: string
      message: string
      sender: "user" | "admin"
      timestamp: Date
      read: boolean
    }
  ]
  status: "open" | "pending" | "resolved"
  archived: boolean
  createdAt: Date
  updatedAt: Date
}
```

---

## FASE 4: CREAR API ROUTES

### Archivos a crear:

```
app/api/
├── auth/
│   ├── login/route.ts
│   ├── register/route.ts
│   └── verify-2fa/route.ts
├── deposits/
│   ├── route.ts
│   ├── [id]/route.ts
│   └── approve/route.ts
├── chat/
│   ├── route.ts
│   ├── [id]/route.ts
│   └── archive/route.ts
└── users/
    ├── route.ts
    └── [id]/route.ts
```

### Ejemplo: Login API
```typescript
// app/api/auth/login/route.ts
import { connectDB } from '@/lib/db'
import { hashPassword, comparePassword } from '@/lib/crypto'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    await connectDB()
    
    const user = await User.findOne({ email })
    if (!user) {
      return Response.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    const valid = await comparePassword(password, user.password)
    if (!valid) {
      return Response.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }
    
    return Response.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        balance: user.balance
      }
    })
  } catch (error) {
    return Response.json(
      { error: 'Error en servidor' },
      { status: 500 }
    )
  }
}
```

---

## FASE 5: CREAR CONEXIÓN A DB

### Archivo: `lib/db.ts`
```typescript
import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  if (isConnected) return
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!)
    isConnected = true
    console.log('✅ MongoDB conectado')
    return conn
  } catch (error) {
    console.error('❌ Error conectando MongoDB:', error)
    throw error
  }
}

export async function disconnectDB() {
  if (!isConnected) return
  
  try {
    await mongoose.disconnect()
    isConnected = false
    console.log('✅ MongoDB desconectado')
  } catch (error) {
    console.error('❌ Error desconectando MongoDB:', error)
    throw error
  }
}
```

---

## FASE 6: DEPLOYMENT EN VERCEL

### Paso 1: Subir a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tuusuario/financial-platform.git
git push -u origin main
```

### Paso 2: Conectar a Vercel
1. Ir a https://vercel.com/new
2. Importar proyecto de GitHub
3. Seleccionar repositorio
4. Configurar variables de entorno:
   - `MONGODB_URI`
   - Otras claves necesarias
5. Deploy

### Resultado:
- **URL**: https://tuproyecto.vercel.app
- **Base de datos**: MongoDB Atlas (gratuita)
- **Dominio**: Gratis con `.vercel.app` o agregar dominio propio

---

## FASE 7: CHECKLIST FINAL

- [ ] MongoDB Atlas configurado
- [ ] .env.local con credenciales
- [ ] Modelos Mongoose creados
- [ ] API routes implementadas
- [ ] Conexión a DB probada
- [ ] Tests locales (npm run dev)
- [ ] GitHub repositorio creado
- [ ] Vercel proyecto linkeado
- [ ] Variables de entorno en Vercel
- [ ] Deploy exitoso
- [ ] Tests en producción

---

## ALTERNATIVAS (También gratuitas)

### Base de Datos:
- **Supabase** (PostgreSQL): https://supabase.com
- **Firebase**: https://firebase.google.com
- **PlanetScale** (MySQL): https://planetscale.com

### Hosting:
- **Netlify**: https://netlify.com
- **Railway**: https://railway.app (primeros créditos gratis)
- **Render**: https://render.com

---

## COSTO TOTAL
🎉 **$0.00 USD/mes** - Totalmente gratis
- MongoDB Atlas: Gratuito (hasta 512MB)
- Vercel: Gratuito (hasta cierto tráfico)
- Desarrollo: Open source

---

## PRÓXIMOS PASOS
1. Implementar fase 1-3 (BD)
2. Crear API routes (fase 4)
3. Migrar lógica de localStorage a BD
4. Testing local
5. Deploy en Vercel
