# 🎯 GUÍA RÁPIDA: Solucionar Problema de Usuarios No Cargando

## ⚡ TL;DR (5 minutos)

Si los usuarios no aparecen en el panel admin:

1. **Verificar variables de entorno**:
   ```bash
   # En .env.local debe existir:
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

2. **Reiniciar servidor**:
   ```bash
   # Ctrl+C en la terminal
   npm run dev
   ```

3. **Limpiar caché**:
   ```
   F12 → Consola → Ctrl+Shift+R (o Cmd+Shift+R en Mac)
   ```

4. **Verificar si hay usuarios**:
   ```bash
   node crear-usuario-test.js
   ```

5. **Recargar panel admin**:
   ```
   Ir a http://localhost:3000/admin
   ```

---

## 📊 Diagnóstico Paso a Paso

### Paso 1: ¿Hay usuarios en Supabase?

```bash
node diagnostico-completo.js
```

**Busca en la salida:**
```
PASO 1️⃣ : Verificar tabla "users"
✅ Usuarios encontrados: 3
```

- ✅ Si dice `Usuarios encontrados: >0` → Ve al Paso 4
- ❌ Si dice `Usuarios encontrados: 0` → Ve al Paso 2

### Paso 2: Crear usuario de prueba

```bash
node crear-usuario-test.js
```

**Salida esperada:**
```
🆕 Creando usuario de prueba...
✅ Usuario creado exitosamente:
   📧 Email: usuario.prueba@ejemplo.com
```

- ✅ Si sale "Usuario creado" → Ve al Paso 4
- ❌ Si sale error con "service_role_key" → Ve al Paso 3

### Paso 3: Configurar SUPABASE_SERVICE_ROLE_KEY

1. **Ve a Supabase Dashboard**:
   - URL: https://app.supabase.com/projects
   - Selecciona tu proyecto

2. **Obtener Service Role Key**:
   - Sidebar izquierdo → Settings
   - Pestaña "API"
   - Busca "service_role" (tiene "Secret" en rojo)
   - Click en el ícono copiar

3. **Agregar a `.env.local`**:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Reiniciar servidor**:
   ```bash
   # En la terminal:
   # Ctrl+C
   npm run dev
   ```

5. **Repetir Paso 2**:
   ```bash
   node crear-usuario-test.js
   ```

### Paso 4: Verificar Panel Admin

1. **Abre el navegador**:
   ```
   http://localhost:3000/admin
   ```

2. **Abre Consola del Navegador**:
   ```
   F12 → Pestaña "Console"
   ```

3. **Busca estos logs**:
   ```
   🔐 Initiating login with email: exe.main.darwin@gmail.com
   ✅ Admin detected
   🔄 Loading users from Supabase...
   [Supabase] Usuarios obtenidos: 1    ← DEBE SER > 0
   ✅ Users loaded from Supabase
   ```

4. **Resultados**:
   - ✅ Si ves usuarios en el dashboard → ¡PROBLEMA RESUELTO! 🎉
   - ❌ Si aún dice "Usuarios obtenidos: 0" → Ve al Paso 5

### Paso 5: Debugging Avanzado

Si aún no funciona:

1. **Verificar endpoint API**:
   ```bash
   curl http://localhost:3000/api/users-admin
   ```
   
   Debe retornar:
   ```json
   {
     "success": true,
     "count": 1,
     "data": [{"email": "...", "name": "..."}]
   }
   ```

2. **Verificar variables de entorno en servidor**:
   - Mira los logs del servidor (donde corre `npm run dev`)
   - Debería mostrar logs cuando accedes a `/api/users-admin`

3. **Verificar tabla en Supabase**:
   - Dashboard → Table Editor
   - ¿Existe tabla "users"?
   - ¿Tiene datos?

4. **Ejecutar diagnóstico nuevamente**:
   ```bash
   node diagnostico-completo.js
   ```

---

## 🔍 Síntomas y Soluciones

### Síntoma: "0 usuarios" en panel pero no en Supabase

**Causa**: RLS bloqueando reads

**Solución**:
1. Verifica `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`
2. Reinicia servidor
3. Limpia caché navegador (Ctrl+Shift+R)

### Síntoma: Error 500 en registro

**Causa**: RLS bloqueando inserts

**Solución**:
1. Verifica `SUPABASE_SERVICE_ROLE_KEY`
2. Reinicia servidor
3. Ve al Paso 2 (crear usuario test)

### Síntoma: Error "SUPABASE_SERVICE_ROLE_KEY not found"

**Causa**: Variable de entorno falta

**Solución**:
1. Ve a Paso 3 (obtener y configurar key)
2. Reinicia servidor

### Síntoma: Panel admin carga pero vacío

**Causa**: Probablemente tabla vacía

**Solución**:
1. Ejecuta `node crear-usuario-test.js`
2. Refresca página (F5)

---

## 🧪 Checklists

### ✅ Para que funcione debe cumplir:

- [ ] `.env.local` tiene `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Servidor Next.js está corriendo (`npm run dev`)
- [ ] Tabla `users` existe en Supabase
- [ ] Tabla `users` tiene al menos 1 usuario
- [ ] `/api/users-admin` retorna datos (curl test)
- [ ] Panel admin `/admin` carga sin errores
- [ ] Consola muestra logs de carga

### 📋 Quick Validation:

```bash
# 1. Verifica variable
echo $SUPABASE_SERVICE_ROLE_KEY

# 2. Prueba endpoint
curl http://localhost:3000/api/users-admin | jq

# 3. Crea usuario test
node crear-usuario-test.js

# 4. Ejecuta diagnóstico
node diagnostico-completo.js
```

---

## 💡 Notas Importantes

1. **No necesitas deshabilitar RLS**:
   - El endpoint usa `service_role_key` que lo ignora
   - RLS sigue activo y seguro

2. **Service Role Key es secreto**:
   - Nunca la compartas públicamente
   - Nunca la pongas en código del cliente
   - Solo en `.env.local` (servidor)

3. **Si ves este error**:
   ```
   Policy violation: POLICY_ERROR
   ```
   → Probablemente `SUPABASE_SERVICE_ROLE_KEY` está mal

4. **Si el usuario se registra pero no aparece**:
   → Probablemente la tabla `users` tiene RLS muy restrictivo
   → El endpoint `/api/auth/register` ya usa service_role, debería funcionar

---

## 🆘 Si todo falla

Última opción: **Desabilitar RLS en Supabase Dashboard**

⚠️ **SOLO para testing, NO para producción**

1. Ve a Supabase Dashboard
2. Table Editor → users → botón "..." → Disable RLS
3. Haz lo mismo para `investments` y `deposits` si es necesario

Luego debería funcionar sin `SUPABASE_SERVICE_ROLE_KEY`.

---

## 📞 Próximos Pasos

1. Sigue el TL;DR (5 minutos)
2. Si no funciona, sigue diagnóstico paso a paso
3. Si aún no funciona, ejecuta `node diagnostico-completo.js` y comparte salida

