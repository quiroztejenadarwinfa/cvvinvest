# 🖱️ GUÍA CLICK-BY-CLICK: Dónde Hacer Clic en Supabase

## PASO 1: Abre Supabase Dashboard

### Haz clic aquí:
```
https://app.supabase.com
```

Deberías ver tu proyecto listado.

---

## PASO 2: Selecciona Tu Proyecto

1. **Haz clic en tu proyecto**
   - Verás el nombre del proyecto
   - Ejemplo: "financial-investment-platform"
   
2. **Espera a que cargue** (segundos)
   - Verás el dashboard

---

## PASO 3: Abre SQL Editor

En la barra lateral izquierda, busca:

```
┌─────────────────────────────────┐
│  Sidebar (izquierda)            │
├─────────────────────────────────┤
│  📊 Database                    │
│     └─ Tables                   │
│     └─ Backups                  │
│                                 │
│  🔌 SQL Editor    ← AQUÍ        │
│     └─ New Query                │
│                                 │
│  ⚙️ Project Settings            │
│     └─ API                      │
│     └─ Secrets                  │
│                                 │
│  👤 Authentication              │
│     └─ Users                    │
└─────────────────────────────────┘
```

**Haz clic en: SQL Editor**

---

## PASO 4: Nueva Query

En SQL Editor, verás un botón azul:

```
┌─────────────────────────────────────────────┐
│ SQL Editor                                  │
├─────────────────────────────────────────────┤
│                                             │
│  [+ New Query] ← AQUÍ (botón azul)          │
│                                             │
│  Recientes:                                 │
│  • Query 1                                  │
│  • Query 2                                  │
│                                             │
│  ────────────────────────────────────────  │
│  [ Tu Query Anterior (si existe) ]          │
│                                             │
└─────────────────────────────────────────────┘
```

**Haz clic en: [+ New Query]**

---

## PASO 5: Pega el Script 1

Ahora tienes un editor SQL vacío.

1. **Copia TODO el contenido de: `01-reset-db.sql`**
   - Abre el archivo
   - Selecciona todo (Ctrl+A)
   - Copia (Ctrl+C)

2. **En Supabase, haz clic en el editor vacío**
   - Debería estar en blanco
   
3. **Pega el código (Ctrl+V)**
   - Verás que se llena con SQL

4. **Haz clic en el botón VERDE: ▶ Run**
   - Está arriba a la derecha
   - Dice "Run" cuando lo ves

```
┌─────────────────────────────────────────────┐
│ 01-reset-db.sql                             │
├─────────────────────────────────────────────┤
│                                             │
│  -- ✅ SCRIPT COMPLETO...                  │
│  -- ============================================ │
│  DROP TABLE IF EXISTS public.chat_messages...  │
│  DROP TABLE IF EXISTS public.chat_sessions...  │
│  ...más código...                           │
│                                             │
│                           ┌───────────────┐ │
│                           │ ▶ Run (VERDE) │ │
│                           └───────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

---

## PASO 6: Espera a que Termine

Verás un spinner (círculo girando):

```
⏳ Ejecutando Query...
```

Espera hasta que veas:

```
✅ Query executed successfully
```

O:

```
✅ Successfully executed 1 command
```

---

## PASO 7: Nueva Query para Segundo Script

1. **Haz clic nuevamente en [+ New Query]**
   - Esto abre un NUEVO editor
   - (No sobrescribas el anterior)

2. **Copia TODO de: `02-seed-data.sql`**
   - Abre el archivo
   - Selecciona todo (Ctrl+A)
   - Copia (Ctrl+C)

3. **Pega en el nuevo editor (Ctrl+V)**
   - Verás el código SQL nuevo

4. **Haz clic en ▶ Run (botón verde)**

---

## PASO 8: Espera a que Termine

Igual que antes:

```
✅ Query executed successfully
```

Cuando veas eso, ¡significa que los datos se insertaron!

---

## PASO 9: Verifica los Resultados

En la barra lateral izquierda:

1. **Haz clic en: Database** (lado izquierdo)

```
┌─────────────────────────────────┐
│  📊 Database    ← AQUÍ          │
├─────────────────────────────────┤
│  └─ Tables                      │
│  └─ Backups                     │
│                                 │
│  🔌 SQL Editor                  │
│  ...                            │
└─────────────────────────────────┘
```

2. **Haz clic en: Tables**

3. **Busca y haz clic en: users**

```
┌─────────────────────────────────┐
│  Tables                         │
├─────────────────────────────────┤
│  • chat_messages                │
│  • chat_sessions                │
│  • deposits                     │
│  • investments                  │
│  • notifications                │
│  • users              ← AQUÍ    │
└─────────────────────────────────┘
```

---

## PASO 10: Verifica Datos

En la tabla `users` deberías ver:

```
┌────────────────────────────────────────────────────────┐
│ users                                                  │
├────────────────────────────────────────────────────────┤
│ ID | Email                          | Plan    | Balance│
├────────────────────────────────────────────────────────┤
│ 1  │ exe.main.darwin@gmail.com      │ elite   │ 50000 │
│ 2  │ usuario.gratuito@ejemplo.com   │ gratis  │ 100   │
│ 3  │ usuario.estandar@ejemplo.com   │ std     │ 5000  │
│ 4  │ usuario.pro@ejemplo.com        │ pro     │ 15000 │
│ 5  │ usuario.vip@ejemplo.com        │ vip     │ 30000 │
└────────────────────────────────────────────────────────┘
```

✅ **¡Si ves esto, está LISTO!**

---

## VERIFICACIÓN FINAL

### En Table Editor, deberías ver:

1. **Tabla: users**
   - ✅ 5 registros
   - ✅ Columnas visibles

2. **Tabla: deposits**
   - ✅ 3 registros
   - ✅ Columnas: amount, status, user_email

3. **Tabla: investments**
   - ✅ 3 registros
   - ✅ Columnas: amount, status, user_email

4. **Tabla: chat_sessions**
   - ✅ 0 registros (vacía, OK)
   - ✅ Columnas existen

5. **Tabla: chat_messages**
   - ✅ 0 registros (vacía, OK)
   - ✅ Columnas existen

6. **Tabla: notifications**
   - ✅ 0 registros (vacía, OK)
   - ✅ Columnas existen

---

## ❌ Si Algo Falla

### No veo el botón "New Query"
→ Haz clic en "SQL Editor" primero

### El script no ejecuta
→ Verifica que pegaste TODO el código
→ No pegues solo una parte

### No veo 5 usuarios en tabla users
→ Ejecuta `02-seed-data.sql` nuevamente

### Dice "Table already exists"
→ Ejecuta `01-reset-db.sql` nuevamente

### Dice "RLS policy error"
→ Ejecuta esto como nueva query:
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
```

---

## 🎉 ¡Listo!

Ahora:
1. Ve a tu proyecto Node.js
2. Verifica `.env.local` tenga variables Supabase
3. Ejecuta: `npm run dev`
4. Intenta iniciar sesión
5. ¡Usa uno de los 5 usuarios de prueba!

---

## 🧪 Usuarios de Prueba

```
Email: exe.main.darwin@gmail.com
Password: password123

Email: usuario.estandar@ejemplo.com
Password: password123

Email: usuario.pro@ejemplo.com
Password: password123
```

---

**¡Éxito! Tu base de datos está lista.** 🎉
