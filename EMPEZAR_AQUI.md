# 🎉 ¡BASE DE DATOS LISTA PARA RECREAR!

## 📦 Lo Que Hice Para Ti

He preparado **TODOS los archivos necesarios** para:
1. ✅ Borrar la base de datos actual completamente
2. ✅ Crear nuevas tablas con estructura correcta
3. ✅ Insertar datos de ejemplo
4. ✅ Configurar seguridad para desarrollo
5. ✅ Documentación clara para cada paso

---

## 📂 Archivos Creados

### 🔴 SCRIPTS SQL (Ejecútalos en Supabase)

| Archivo | Propósito | Orden |
|---------|-----------|-------|
| **01-reset-db.sql** | Borra todo y crea tablas nuevas | 1️⃣ |
| **02-seed-data.sql** | Inserta 5 usuarios y datos de ejemplo | 2️⃣ |
| **03-production-rls.sql** | Habilita seguridad para producción | 3️⃣ (después) |

### 🟦 GUÍAS Y DOCUMENTACIÓN

| Archivo | Para Quién | Cuándo Leer |
|---------|-----------|------------|
| **COPY_PASTE_COMANDOS.md** | Impacientes | Si quieres hacerlo YA (5 min) |
| **PASOS_VISUALES_BD.md** | Visuales | Si prefieres diagramas |
| **GUIA_RECREAR_BD.md** | Detallistas | Para entender todo |
| **RESUMEN_RECREACION_BD.md** | Ejecutivos | Para ver resumen |
| **RESUMEN_FINAL_BD.md** | Referencia | Para consultar después |

---

## 🚀 OPCIÓN MÁS RÁPIDA (5 minutos)

### 1. Abre esto ahora:
👉 **[COPY_PASTE_COMANDOS.md](COPY_PASTE_COMANDOS.md)** ← Click aquí

### 2. Sigue exactamente 5 pasos:
- Abre Supabase
- Copia SQL del PASO 1
- Pégalo en SQL Editor
- Haz clic en RUN
- Repite con PASO 2

### 3. ¡Listo!
Tu base de datos está nueva y lista.

---

## 📋 Lo Que Pasará

### ANTES (❌ Problemas Actuales)
```
- Tablas con estructura incorrecta
- RLS policies que bloqueaban todo
- Datos inconsistentes
- El código no funciona bien
```

### DESPUÉS (✅ Que Funcionará)
```
- Tablas nuevas y bien estructuradas
- RLS deshabilitado para desarrollo (seguro después)
- 5 usuarios de prueba listos
- Todo integrado y funcionando
```

---

## 🧪 Usuarios de Prueba que Obtendrás

Después de ejecutar los scripts:

```
1. ADMIN
   Email: exe.main.darwin@gmail.com
   Password: password123
   Plan: ELITE
   Balance: $50,000

2. GRATUITO
   Email: usuario.gratuito@ejemplo.com
   Password: password123
   Plan: gratuito
   Balance: $100

3. ESTÁNDAR
   Email: usuario.estandar@ejemplo.com
   Password: password123
   Plan: estandar
   Balance: $5,000

4. PRO
   Email: usuario.pro@ejemplo.com
   Password: password123
   Plan: pro
   Balance: $15,000

5. VIP
   Email: usuario.vip@ejemplo.com
   Password: password123
   Plan: vip
   Balance: $30,000
```

---

## 📊 Tablas que se Crearán

### users (5 registros)
```
✅ id, email, name, password_hash
✅ plan (gratuito, estandar, pro, vip, elite)
✅ balance, is_active
✅ created_at, updated_at
```

### deposits (3 registros de ejemplo)
```
✅ user_id, user_email, user_name
✅ amount ($500, $1000, $5000)
✅ status (pendiente, aprobado, rechazado)
✅ created_at, updated_at
```

### investments (3 registros de ejemplo)
```
✅ user_id, user_email, user_name
✅ amount ($1000, $2000, $10000)
✅ plan_at_time (el plan al crear inversión)
✅ status (pendiente, aprobado, rechazado, completado)
✅ created_at, updated_at
```

### chat_sessions (vacía, se llena cuando chatean)
```
✅ user_id, user_name, user_email
✅ status, archived
✅ created_at
```

### chat_messages (vacía)
```
✅ session_id, message, sender
✅ created_at
```

### notifications (vacía)
```
✅ user_id, title, message
✅ read, created_at
```

---

## ⚙️ Configuración Necesaria

Tu `.env.local` debe tener (obtén de Supabase Dashboard):

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## ✅ Después de Ejecutar (Verifica)

1. **Abre Supabase Dashboard**
2. **Ve a Table Editor**
3. **Haz clic en tabla "users"**
4. **Deberías ver esto:**
   ```
   ✅ 5 usuarios
   ✅ Columnas: id, email, name, plan, balance, etc.
   ✅ Admin: exe.main.darwin@gmail.com (elite)
   ✅ 4 usuarios de prueba
   ```

---

## 🔐 Seguridad

### Ahora (Desarrollo)
- RLS: DESHABILITADO
- Más fácil para probar
- NO es seguro para producción

### Después (Producción)
- Ejecutar: `03-production-rls.sql`
- RLS: HABILITADO
- Cada usuario solo ve sus datos
- Admin ve todo

---

## 📖 Guías Disponibles

Elige una según tu estilo:

### ⚡ Impaciente (5 min)
👉 [COPY_PASTE_COMANDOS.md](COPY_PASTE_COMANDOS.md)
- SQL listo para copiar/pegar
- Sin explicaciones largas
- Hazlo ya

### 🎨 Visual
👉 [PASOS_VISUALES_BD.md](PASOS_VISUALES_BD.md)
- Con diagramas
- Paso a paso visual
- Fácil de seguir

### 📚 Detallado
👉 [GUIA_RECREAR_BD.md](GUIA_RECREAR_BD.md)
- Explicación completa
- Soluciones para errores
- Entender todo

### 📋 Resumen
👉 [RESUMEN_RECREACION_BD.md](RESUMEN_RECREACION_BD.md)
- Plan ejecutivo
- Checklist
- Próximos pasos

---

## 🎯 OPCIÓN A: HAZLO AHORA (Recomendado)

1. Abre [COPY_PASTE_COMANDOS.md](COPY_PASTE_COMANDOS.md)
2. Sigue los 5 pasos
3. Termina en 5 minutos
4. ¡Listo!

---

## 🎯 OPCIÓN B: HAZLO CON CUIDADO

1. Lee [GUIA_RECREAR_BD.md](GUIA_RECREAR_BD.md)
2. Entiende cada paso
3. Sigue con cuidado
4. Resuelve cualquier error
5. ¡Listo!

---

## ❌ Si Algo Falla

### "Table already exists"
→ Ejecuta `01-reset-db.sql` nuevamente

### "RLS policy error"
→ El script ya lo maneja, pero si falla:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE deposits DISABLE ROW LEVEL SECURITY;
```

### No veo los datos
→ Ejecuta `02-seed-data.sql` nuevamente

### El código no conecta
→ Verifica `.env.local` tiene URLs y Keys correctas

### Ver más soluciones:
👉 [GUIA_RECREAR_BD.md](GUIA_RECREAR_BD.md#-si-algo-falla)

---

## 🎓 Plan de Ejecución

```
PASO 1: Abre Supabase Dashboard
        ↓
PASO 2: Ejecuta 01-reset-db.sql
        ↓ (espera a que termine)
        ↓
PASO 3: Ejecuta 02-seed-data.sql
        ↓ (espera a que termine)
        ↓
PASO 4: Verifica en Table Editor
        ↓
PASO 5: Prueba con npm run dev
        ↓
✅ ¡LISTO! Base de datos nueva y funcionando
```

---

## 📞 ¿Necesitas Ayuda?

### Si la ejecución falla:
1. Abre [GUIA_RECREAR_BD.md](GUIA_RECREAR_BD.md)
2. Ve a sección "SI ALGO FALLA"
3. Busca el error que tuviste
4. Aplica la solución

### Si no entiendes un paso:
1. Lee [PASOS_VISUALES_BD.md](PASOS_VISUALES_BD.md)
2. Hay diagramas y explicaciones visuales

### Si quieres detalles técnicos:
1. Lee [RESUMEN_FINAL_BD.md](RESUMEN_FINAL_BD.md)
2. Tiene toda la estructura técnica

---

## ✨ Resumen Final

**Tienes TODO lo necesario para:**
- ✅ Borrar la BD actual completamente
- ✅ Crear tablas nuevas y correctas
- ✅ Insertar datos de prueba
- ✅ Tener usuarios listos
- ✅ Continuar desarrollando sin problemas

**Archivos:**
- 3 Scripts SQL listos
- 4 Guías de documentación
- Datos de ejemplo
- Soluciones para errores

**Tiempo:**
- 5 minutos ejecutar
- 10 minutos verificar
- ¡Listo para trabajar!

---

## 🚀 ¿LISTO PARA EMPEZAR?

### OPCIÓN 1: Hacerlo YA (Recomendado)
👉 Abre [COPY_PASTE_COMANDOS.md](COPY_PASTE_COMANDOS.md) y sigue 5 pasos

### OPCIÓN 2: Entender primero
👉 Lee [GUIA_RECREAR_BD.md](GUIA_RECREAR_BD.md) para todo

### OPCIÓN 3: Ver visualmente
👉 Abre [PASOS_VISUALES_BD.md](PASOS_VISUALES_BD.md)

---

**¡Adelante! Tú puedes.** 🎉

La base de datos nueva está esperándote.
