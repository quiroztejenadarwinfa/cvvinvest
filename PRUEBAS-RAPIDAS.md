# ✅ CHECKLIST DE PRUEBA RÁPIDA - TODO FUNCIONAL

## ANTES DE EMPEZAR
- [ ] Ejecutaste el SQL en Supabase (00-CREAR-TABLAS.sql)
- [ ] Tu `.env.local` tiene NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Ejecutaste `pnpm dev` y no hay errores

---

## PRUEBA 1: VERIFICAR QUE LAS TABLAS EXISTEN EN SUPABASE

### En Supabase Console:
1. Ve a **SQL Editor**
2. Ejecuta esta query:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

**Esperado:** Ver estas tablas:
- [ ] users
- [ ] deposits
- [ ] investments
- [ ] withdrawals
- [ ] notifications

---

## PRUEBA 2: USUARIO ADMIN DEBE EXISTIR

### En Supabase Console:
1. Ve a **Table Editor**
2. Selecciona tabla **users**
3. Busca el usuario `exe.main.darwin@gmail.com`

**Esperado:**
- [ ] Email: exe.main.darwin@gmail.com
- [ ] Name: Admin User
- [ ] Role: admin
- [ ] Plan: elite
- [ ] Balance: 50000

---

## PRUEBA 3: LOGIN DE ADMIN FUNCIONA

1. Abre navegador: `http://localhost:3000`
2. Haz clic en **Admin** o ve a `/admin`
3. Login con:
   - Email: `exe.main.darwin@gmail.com`
   - Password: `admin12345`

**Esperado:**
- [ ] Redirige a `/admin/usuarios`
- [ ] No hay errores en consola
- [ ] Aparecen usuarios en la tabla

---

## PRUEBA 4: CREAR USUARIO NUEVO

1. Ve a `/registro`
2. Llena el formulario:
   - Email: `usuario1@test.com`
   - Nombre: Usuario Test
   - Contraseña: test123456

3. Haz clic en **Registrar**

**Esperado:**
- [ ] Se crea el usuario
- [ ] Aparece en Supabase (tabla users)
- [ ] Redirige a `/login` o `/dashboard`
- [ ] Plan inicial: gratuito
- [ ] Balance inicial: 0

---

## PRUEBA 5: CREAR DEPÓSITO

1. Login con el usuario creado
2. Ve a `/depositos`
3. Solicita un depósito de $1000 USD

**Esperado:**
- [ ] Se crea la solicitud
- [ ] Status: pendiente
- [ ] Aparece en Supabase (tabla deposits)
- [ ] El admin puede verlo en `/admin/depositos`

---

## PRUEBA 6: ADMIN APRUEBA DEPÓSITO

1. Login como admin en `/admin`
2. Ve a `/admin/depositos`
3. Busca el depósito del usuario test
4. Haz clic en **Aprobar**

**Esperado:**
- [ ] Status cambia a "aprobado"
- [ ] El balance del usuario aumenta
- [ ] En Supabase (users.balance) se ve el cambio
- [ ] El usuario recibe notificación (opcional)

---

## PRUEBA 7: SOLICITAR INVERSIÓN

1. Login con el usuario test
2. Ve a `/planes`
3. Solicita el plan **PRO** (mínimo $500)

**Esperado:**
- [ ] Se crea la solicitud
- [ ] Status: pendiente
- [ ] Aparece en Supabase (tabla investments)
- [ ] El admin puede verlo en `/admin/inversiones`

---

## PRUEBA 8: ADMIN APRUEBA INVERSIÓN

1. Login como admin en `/admin`
2. Ve a `/admin/inversiones`
3. Busca la inversión del usuario test
4. Haz clic en **Aprobar**

**Esperado:**
- [ ] Status cambia a "aprobado"
- [ ] El plan del usuario cambia a "pro"
- [ ] En Supabase (users.plan) se ve "pro"
- [ ] En `/dashboard` del usuario aparecen las nuevas funciones

---

## PRUEBA 9: VERIFICAR PLAN EN TIEMPO REAL

1. Abre dos pestañas del navegador
2. En pestaña 1: Login como usuario test y ve a `/dashboard`
3. En pestaña 2: Login como admin y aprueba la inversión
4. Vuelve a pestaña 1 y recarga sin perder datos

**Esperado:**
- [ ] En pestaña 1 aparece el plan actualizado a "pro"
- [ ] Las funciones PRO están habilitadas
- [ ] No necesita recargar manualmente (o recarga cada 1 segundo)

---

## PRUEBA 10: RETIROS FUNCIONA

1. Login como usuario con plan PRO (balance > 0)
2. Ve a `/retiros`
3. Solicita un retiro de $100

**Esperado:**
- [ ] Se crea la solicitud
- [ ] Status: pendiente
- [ ] Aparece en Supabase (tabla withdrawals)
- [ ] El balance no cambia hasta que admin apruebe

---

## PRUEBA 11: ADMIN APRUEBA RETIRO

1. Login como admin
2. Ve a `/admin/retiros` (si existe) o busca en `/admin`
3. Aprueba el retiro

**Esperado:**
- [ ] Status cambia a "aprobado"
- [ ] El balance del usuario disminuye
- [ ] Se envía notificación (opcional)

---

## PRUEBA 12: VERIFICAR ESTADÍSTICAS EN TIEMPO REAL

1. Abre `/admin/usuarios`
2. Debe mostrar:
   - [ ] Total de usuarios
   - [ ] Usuarios por plan (gratuito, estandar, pro, vip, elite)
   - [ ] Balance total del sistema
   - [ ] Usuarios activos

**Esperado:**
- [ ] Los números cambian en tiempo real
- [ ] Se actualiza cada 1 segundo
- [ ] Los números coinciden con los datos en Supabase

---

## SI ALGO NO FUNCIONA

### Paso 1: Revisar Errores en Consola
```bash
# En la terminal donde ejecutas pnpm dev
# Busca errores SQL o de Supabase
```

### Paso 2: Abrir DevTools (F12)
- Ve a pestaña **Console**
- Busca mensajes como:
  - `[Supabase]` - Info de Supabase
  - `[approveInvestment]` - Info de aprobación
  - Errores en rojo

### Paso 3: Verificar Supabase
1. Ve a Supabase Console
2. Tabla **users** - ¿Aparecen los usuarios?
3. Tabla **deposits** - ¿Aparecen los depósitos?
4. Tabla **investments** - ¿Aparecen las inversiones?

### Paso 4: Verificar Variables de Entorno
```bash
# Abre .env.local y verifica:
# NEXT_PUBLIC_SUPABASE_URL - No debe estar vacío
# NEXT_PUBLIC_SUPABASE_ANON_KEY - No debe estar vacío
```

### Paso 5: Reiniciar Servidor
```bash
# Para en terminal (Ctrl+C)
# Ejecuta: pnpm dev
# Limpia cache: pnpm dev --no-cache
```

---

## RESUMEN: ¿QUÉ SIGNIFICA "TODO FUNCIONAL"?

✅ **TODO FUNCIONAL** cuando:
- [ ] Los usuarios pueden registrarse
- [ ] El admin puede ver todos los usuarios
- [ ] El admin puede aprobar depósitos (balance sube)
- [ ] El admin puede aprobar inversiones (plan cambia)
- [ ] El usuario ve los cambios en tiempo real
- [ ] Las retiros funcionan (balance baja)
- [ ] Las notificaciones se envían
- [ ] Los datos están en Supabase (no en localStorage)

---

**¿PREGUNTAS?**

1. Revisa los logs en consola (F12)
2. Verifica que el SQL fue ejecutado
3. Verifica tu `.env.local`
4. Reinicia el servidor `pnpm dev`

**Última actualización:** 19 de enero de 2026
