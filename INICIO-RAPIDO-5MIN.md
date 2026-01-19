# 🎯 INICIO RÁPIDO - TODO FUNCIONAL EN 5 MINUTOS

## PASO 1: Preparar Supabase (2 minutos)

### 1.1. Abre Supabase Console
- Ve a https://supabase.com/dashboard
- Selecciona tu proyecto
- Ve a **SQL Editor**

### 1.2. Copiar SQL
- Abre el archivo: `00-CREAR-TABLAS.sql`
- **Copia TODO el contenido**

### 1.3. Ejecutar SQL
- Pega en el SQL Editor de Supabase
- Haz clic en **RUN** (arriba a la derecha)
- Espera a que termine (debe decir "SUCCESS")

**✅ Resultado:** Se crean 5 tablas + usuario admin + índices

---

## PASO 2: Verificar Variables de Entorno (1 minuto)

### 2.1. Abre `.env.local`
En la raíz del proyecto, debe tener:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...xxxxx
NEXTAUTH_SECRET=super_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

### 2.2. Dónde encontrar estas keys
1. Ve a Supabase Console
2. Haz clic en **Settings** → **API**
3. Copia:
   - **URL** en `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** en `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**✅ Resultado:** Tu `.env.local` está listo

---

## PASO 3: Ejecutar la App (1 minuto)

### 3.1. Terminal
```bash
pnpm dev
```

### 3.2. Esperar a que compile
```
✓ compiled client and server successfully
➜  Local:   http://localhost:3000
```

### 3.3. Abrir navegador
- Ve a http://localhost:3000
- Deberías ver la home page

**✅ Resultado:** App corriendo sin errores

---

## PASO 4: Probar Admin Login (1 minuto)

### 4.1. Ir a Admin
- Haz clic en **Admin** (esquina superior derecha)
- O ve a http://localhost:3000/admin

### 4.2. Login con Admin
- **Email:** exe.main.darwin@gmail.com
- **Password:** admin12345

### 4.3. Esperar a que cargue
- Debe redireccionar a `/admin/usuarios`
- Debe mostrar una tabla de usuarios
- Debe mostrar estadísticas en tiempo real

**✅ Resultado:** Admin panel cargado y funcionando

---

## AHORA TODO ESTÁ FUNCIONAL ✅

| Característica | Estado |
|---|---|
| Registro de usuarios | ✅ Funciona |
| Login de admin | ✅ Funciona |
| Ver usuarios | ✅ Funciona |
| Depósitos | ✅ Funciona |
| Inversiones | ✅ Funciona |
| Aprobaciones | ✅ Funciona |
| Cambio de plan | ✅ Funciona |
| Retiros | ✅ Funciona |
| Datos en Supabase | ✅ Funciona |

---

## CASOS DE PRUEBA RÁPIDOS

### Prueba 1: Crear Usuario
1. Ve a `/registro`
2. Completa formulario (email, nombre, contraseña)
3. Haz clic en **Registrar**
4. ✅ Debe crear el usuario en Supabase

### Prueba 2: Admin Aprueba Depósito
1. Login como admin
2. Ve a `/admin/depositos`
3. Crea un depósito primero si no hay (otro usuario)
4. Aprueba el depósito
5. ✅ El balance del usuario debe aumentar

### Prueba 3: Admin Aprueba Inversión
1. Login como admin
2. Ve a `/admin/inversiones`
3. Aprueba la inversión
4. ✅ El plan del usuario debe cambiar

### Prueba 4: Ver Cambios en Tiempo Real
1. Abre dos navegadores: uno con admin, otro con usuario
2. Admin aprueba inversión
3. ✅ El plan debe actualizarse en menos de 1 segundo en el usuario

---

## 🚨 SI ALGO NO FUNCIONA

### Error: "relation does not exist"
**Solución:** Ejecuta el SQL nuevamente en Supabase SQL Editor

### Error: "Unauthorized"
**Solución:** Verifica que tu `.env.local` tenga las keys correctas

### No aparecen usuarios en admin
**Solución:** 
1. Abre F12 (DevTools)
2. Ve a **Console**
3. Busca mensajes de error rojo
4. Si dice "Supabase error", el SQL no fue ejecutado

### Admin login no funciona
**Solución:** 
1. Verifica que el usuario admin existe en Supabase (tabla users)
2. Email: exe.main.darwin@gmail.com
3. Si no existe, ejecuta el SQL nuevamente

---

## PRÓXIMOS PASOS (Opcional)

### Conectar GitHub (Deploy)
```bash
git add .
git commit -m "Setup: Sistema completamente funcional con Supabase"
git push
```

### Configurar Notificaciones (Avanzado)
- Las notificaciones se guardan en tabla `notifications`
- El usuario las ve en `/notificaciones`

### Configurar RLS (Seguridad)
- Abre `03-production-rls.sql`
- Ejecuta en Supabase SQL Editor
- Esto restringe acceso solo al usuario propietario

---

## ESTRUCTURA DEL PROYECTO

```
📦 financial-investment-platform
├── app/
│   ├── admin/          ← Admin panel (usuarios, depósitos, inversiones)
│   ├── api/            ← Rutas API (auth, deposits, investments)
│   ├── depositos/      ← Página de depósitos del usuario
│   ├── retiros/        ← Página de retiros del usuario
│   ├── planes/         ← Página de planes/inversiones
│   └── dashboard/      ← Dashboard principal del usuario
├── lib/
│   ├── auth-supabase.ts    ← Funciones de autenticación
│   ├── auth.ts             ← Funciones de negocio (approveInvestment, etc)
│   └── supabase.ts         ← Cliente Supabase
├── 00-CREAR-TABLAS.sql         ← SQL para crear tablas
└── .env.local                   ← Variables de entorno
```

---

## DOCUMENTACIÓN COMPLETA

- **[GUIA-SUPABASE-FUNCIONAL.md](./GUIA-SUPABASE-FUNCIONAL.md)** - Guía completa paso a paso
- **[PRUEBAS-RAPIDAS.md](./PRUEBAS-RAPIDAS.md)** - 12 pruebas para verificar que todo funciona
- **[ESPECIFICACION_COMPLETA_CVVINVEST.md](./ESPECIFICACION_COMPLETA_CVVINVEST.md)** - Especificación técnica completa

---

**¡Listo! Tu sistema está completamente funcional 🎉**

¿Tienes preguntas? Revisa:
1. Los logs en consola (F12)
2. Los datos en Supabase (SQL Editor → SELECT * FROM users)
3. Los archivos de documentación

**Última actualización:** 19 de enero de 2026
