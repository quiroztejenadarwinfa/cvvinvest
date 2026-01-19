# 📡 API ENDPOINTS - DOCUMENTACIÓN COMPLETA

## BASE URL
```
http://localhost:3000/api
```

---

## AUTENTICACIÓN

### 1. Login
**POST** `/auth/login`

**Request:**
```json
{
  "email": "exe.main.darwin@gmail.com",
  "password": "admin12345"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "exe.main.darwin@gmail.com",
    "app_metadata": {
      "role": "admin"
    }
  },
  "session": {
    "access_token": "eyJ...",
    "refresh_token": "...",
    "expires_at": 1234567890
  }
}
```

**Response (Error):**
```json
{
  "error": "Invalid email or password"
}
```

---

### 2. Register / Signup
**POST** `/auth/register`

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123456",
  "name": "John Doe"
}
```

**Response (Success):**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "newuser@example.com",
    "user_metadata": {
      "full_name": "John Doe"
    }
  },
  "error": null
}
```

---

### 3. Logout
**POST** `/auth/logout`

**Request:** (sin cuerpo)

**Response:**
```json
{
  "success": true
}
```

---

### 4. Get Current User
**GET** `/auth/user`

**Response (Success):**
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "name": "User Name",
  "plan": "pro",
  "balance": 1000.50,
  "is_active": true
}
```

---

## USUARIOS

### 1. Get All Users (Admin Only)
**GET** `/users-admin`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (Success):**
```json
{
  "users": [
    {
      "id": "uuid-1",
      "email": "user1@example.com",
      "name": "User 1",
      "plan": "gratuito",
      "balance": 0,
      "is_active": true,
      "created_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": "uuid-2",
      "email": "user2@example.com",
      "name": "User 2",
      "plan": "pro",
      "balance": 5000,
      "is_active": true,
      "created_at": "2024-01-16T10:00:00Z"
    }
  ]
}
```

---

### 2. Refresh User Session
**POST** `/user/refresh`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (Success):**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "plan": "pro",
    "balance": 1500.75
  }
}
```

---

## DEPÓSITOS

### 1. Create Deposit
**POST** `/deposits`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "amount": 1000,
  "method": "stripe",
  "notes": "Deposito inicial"
}
```

**Response (Success):**
```json
{
  "id": "uuid-here",
  "user_id": "uuid-user",
  "email": "user@example.com",
  "amount": 1000,
  "status": "pendiente",
  "method": "stripe",
  "created_at": "2024-01-19T15:30:00Z"
}
```

---

### 2. Approve Deposit (Admin Only)
**POST** `/admin/deposits/approve`

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Request:**
```json
{
  "depositId": "uuid-deposit",
  "notes": "Depositio aprobado - sin problemas"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Depósito aprobado",
  "deposit": {
    "id": "uuid-deposit",
    "status": "aprobado",
    "user_id": "uuid-user",
    "amount": 1000,
    "approved_at": "2024-01-19T15:35:00Z"
  },
  "user": {
    "id": "uuid-user",
    "email": "user@example.com",
    "balance": 1000
  }
}
```

---

## INVERSIONES

### 1. Create Investment
**POST** `/investments` (endpoint no mostrado, se hace desde UI)

Internamente en `app/inversiones/page.tsx`:
```javascript
const investment = {
  user_id: currentUser.id,
  email: currentUser.email,
  name: currentUser.name,
  plan_name: "pro",
  amount: 500,
  status: "pendiente",
  min_amount: 500,
  max_amount: 5000
}
```

---

### 2. Approve Investment (Admin Only)
**POST** `/admin/investments/approve` (custom en admin panel)

Internamente usa `approveInvestmentSupabase()`:
```javascript
{
  "investmentId": "uuid-investment",
  "notes": "Aprobado"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inversión aprobada",
  "investment": {
    "id": "uuid-investment",
    "status": "aprobado",
    "plan_name": "pro",
    "user_id": "uuid-user"
  },
  "user": {
    "id": "uuid-user",
    "email": "user@example.com",
    "plan": "pro",
    "balance": 5000
  }
}
```

---

## NOTIFICACIONES

### 1. Get User Notifications
**GET** `/notifications?user_id={userId}`

**Response (Success):**
```json
{
  "notifications": [
    {
      "id": "uuid-1",
      "user_id": "uuid-user",
      "type": "investment_approved",
      "title": "Inversión Aprobada",
      "message": "Tu inversión al plan PRO ha sido aprobada",
      "read": false,
      "created_at": "2024-01-19T15:35:00Z"
    },
    {
      "id": "uuid-2",
      "user_id": "uuid-user",
      "type": "deposit_approved",
      "title": "Depósito Confirmado",
      "message": "Tu depósito de $1000 ha sido confirmado",
      "read": true,
      "created_at": "2024-01-19T10:00:00Z"
    }
  ]
}
```

---

## FUNCIONES DE UTILIDAD (lib/auth.ts)

### 1. getAllUsersSupabase()
```typescript
import { getAllUsersSupabase } from '@/lib/auth'

const users = await getAllUsersSupabase()
// Retorna: User[]
```

### 2. approveInvestmentSupabase(investmentId, notes?)
```typescript
import { approveInvestmentSupabase } from '@/lib/auth'

const success = await approveInvestmentSupabase('investment-uuid', 'Approved')
// Retorna: boolean
// Efectos: Cambia plan del usuario, crea notificación, actualiza investment status
```

### 3. approveDepositSupabase(depositId, notes?)
```typescript
import { approveDepositSupabase } from '@/lib/auth'

const success = await approveDepositSupabase('deposit-uuid', 'Confirmed')
// Retorna: boolean
// Efectos: Suma amount al balance, crea notificación, actualiza deposit status
```

### 4. getAllInvestmentsSupabase()
```typescript
import { getAllInvestmentsSupabase } from '@/lib/auth'

const investments = await getAllInvestmentsSupabase()
// Retorna: Investment[]
```

---

## CÓDIGOS DE ERROR

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid authentication token"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error: [details]"
}
```

---

## AUTENTICACIÓN CON TOKENS

### Obtener Token
1. Login con `/auth/login`
2. Recibirás `session.access_token`

### Usar Token
En **todos** los endpoints que requieren auth, incluye:
```
Authorization: Bearer {access_token}
```

### Tipos de Usuarios
- **user**: Usuario normal (puede depositar, invertir, retirar)
- **admin**: Admin (puede ver todos los usuarios y aprobar solicitudes)

---

## FLOWS DE NEGOCIO

### Flow 1: Depósito
```
1. Usuario POST /deposits → crea depósito con status "pendiente"
2. Admin ve depósito en /admin/depositos
3. Admin POST /admin/deposits/approve
4. Sistema suma amount al balance del usuario
5. Se crea notificación para usuario
6. Usuario ve balance actualizado
```

### Flow 2: Inversión (cambio de plan)
```
1. Usuario solicita inversión (PRO) en /planes
2. Admin ve inversión en /admin/inversiones
3. Admin aprueba inversión
4. Sistema cambia plan a "pro"
5. Se crea notificación para usuario
6. Usuario ve plan actualizado en /dashboard
7. Nuevas funciones se habilitan (retiros, etc)
```

### Flow 3: Retiro
```
1. Usuario POST /withdrawals → crea retiro con status "pendiente"
2. Admin aprueba retiro
3. Sistema resta amount del balance
4. Se crea notificación
5. Usuario ve balance reducido
```

---

## EJEMPLOS CON CURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "exe.main.darwin@gmail.com",
    "password": "admin12345"
  }'
```

### Get All Users (con token)
```bash
curl -X GET http://localhost:3000/api/users-admin \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Deposit
```bash
curl -X POST http://localhost:3000/api/deposits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "amount": 1000,
    "method": "stripe",
    "notes": "Deposito inicial"
  }'
```

### Approve Deposit
```bash
curl -X POST http://localhost:3000/api/admin/deposits/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -d '{
    "depositId": "uuid-deposit-id",
    "notes": "Aprobado"
  }'
```

---

## TESTING CON POSTMAN

1. Descarga [Postman](https://www.postman.com/downloads/)
2. Crea un **New Workspace**
3. Crea requests con esta documentación
4. Para guardar tokens, usa **Variables**:
   ```
   {{access_token}}
   {{admin_token}}
   ```

---

## DEBUGGING

### Ver logs de API
```bash
# En terminal donde ejecutas pnpm dev
# Mira los logs en tiempo real
```

### Ver requests en DevTools
1. F12 → Network
2. Haz una acción (login, depósito, etc)
3. Ves el request/response

### Ver datos en Supabase
1. Supabase Console → Table Editor
2. Selecciona tabla (users, deposits, etc)
3. Ves los datos en tiempo real

---

**Última actualización:** 19 de enero de 2026
