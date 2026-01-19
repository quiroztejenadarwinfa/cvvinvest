# 🎯 GUÍA VISUAL: PASOS EXACTOS PARA RECREAR LA BD

## Opción A: Si quieres HACERLO AHORA (2 minutos)

### 1️⃣ Abre Supabase Dashboard

```
https://app.supabase.com
        ↓
Selecciona tu proyecto
        ↓
Ve a: SQL Editor (lado izquierdo)
```

### 2️⃣ Copia y Pega Script 1

```
SQL Editor > New Query
        ↓
Abre: 01-reset-db.sql (desde tu computadora)
        ↓
Copia TODO el contenido (Ctrl+A, Ctrl+C)
        ↓
Pégalo en Supabase (Ctrl+V)
        ↓
Haz clic en botón ▶ RUN (verde, arriba a la derecha)
        ↓
Espera... espera... ✅ LISTO
```

**Lo que debería salir:**
```
Query executed successfully ✓
```

### 3️⃣ Copia y Pega Script 2

```
SQL Editor > New Query (nuevo, no sobrescribas el anterior)
        ↓
Abre: 02-seed-data.sql
        ↓
Copia TODO (Ctrl+A, Ctrl+C)
        ↓
Pégalo en Supabase (Ctrl+V)
        ↓
Haz clic en botón ▶ RUN (verde)
        ↓
Espera... espera... ✅ LISTO
```

**Lo que debería salir:**
```
Query executed successfully ✓
(Y algunos números como: "total_usuarios: 5")
```

### 4️⃣ Verifica que Funcione

```
Ve a: Table Editor (lado izquierdo, debajo de SQL Editor)
        ↓
Haz clic en tabla: users
        ↓
Deberías ver:
   - 5 usuarios
   - Columnas: id, email, name, password_hash, plan, balance, etc.
        ↓
Haz clic en tabla: deposits
        ↓
Deberías ver:
   - 3 depósitos
   - Columnas: id, user_id, user_email, amount, status, etc.
        ↓
Haz clic en tabla: investments
        ↓
Deberías ver:
   - 3 inversiones
   - Columnas: id, user_id, user_email, amount, status, etc.
```

✅ ¡LISTO! La base de datos está recreada.

---

## Opción B: Si necesitas los archivos EXACTOS para copiar/pegar

### Script 1: RESET (ejecutar PRIMERO)

**Archivo:** `01-reset-db.sql`

Elimina todas las tablas y crea nuevas. Ver archivo para el SQL exacto.

### Script 2: DATOS (ejecutar SEGUNDO)

**Archivo:** `02-seed-data.sql`

Inserta 5 usuarios y datos de ejemplo. Ver archivo para el SQL exacto.

---

## 🧪 Usuarios para Probar

Después de ejecutar los scripts, usa estos para login:

```
1. exe.main.darwin@gmail.com / password123 (Admin - elite)
2. usuario.gratuito@ejemplo.com / password123 (Gratuito)
3. usuario.estandar@ejemplo.com / password123 (Estándar)
4. usuario.pro@ejemplo.com / password123 (Pro)
5. usuario.vip@ejemplo.com / password123 (VIP)
```

---

## ✅ Indicadores de Éxito

Cuando termines, verás esto en Table Editor:

```
┌─────────────────────────────────────────────┐
│ TABLA: users                                │
├─────────────────────────────────────────────┤
│ • 5 registros                               │
│ • email, name, plan, balance, created_at    │
│ • Admin: exe.main.darwin@gmail.com (elite)  │
│ • 4 usuarios de prueba (gratuito-vip)       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ TABLA: deposits                             │
├─────────────────────────────────────────────┤
│ • 3 registros                               │
│ • Estados: pendiente, aprobado, rechazado   │
│ • Montos: 500, 1000, 5000                   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ TABLA: investments                          │
├─────────────────────────────────────────────┤
│ • 3 registros                               │
│ • Estados: pendiente, aprobado, completado  │
│ • Montos: 1000, 2000, 10000                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ OTRAS TABLAS (vacías, pero existen)         │
├─────────────────────────────────────────────┤
│ • chat_sessions (0 registros)               │
│ • chat_messages (0 registros)               │
│ • notifications (0 registros)               │
└─────────────────────────────────────────────┘
```

---

## ❌ Si Falla Algo...

### Error: "Table already exists"
```
Solución: Ejecuta 01-reset-db.sql nuevamente
          (El script DROP TABLE debería haberlas eliminado)
```

### Error: "RLS policy for table users"
```
Solución: El script 01-reset-db.sql ya desactiva RLS
          Pero si falla, ejecuta:
          
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE deposits DISABLE ROW LEVEL SECURITY;
```

### No veo los datos en Table Editor
```
Solución: 
1. Recarga la página (F5)
2. Ve a Table Editor nuevamente
3. Selecciona tabla "users"
4. Deberías ver los 5 usuarios
```

### El código no se conecta a Supabase
```
Solución:
1. Verifica tu .env.local
2. Asegúrate que tengas:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
```

---

## 🎓 Explicación Rápida de Qué Pasó

### Antes (❌ Problemas)
```
- Tablas con estructura incorrecta
- RLS policies que bloqueaban todo
- Datos inconsistentes o vacíos
- Código no podía conectarse
```

### Ahora (✅ Funcionando)
```
- Tablas nuevas con estructura correcta
- RLS deshabilitado (desarrollo)
- Datos de ejemplo para probar
- Todo listo para usar
```

### Después (Cuando esté listo para producción)
```
- Ejecutar 03-production-rls.sql
- Habilitar RLS con políticas seguras
- Cambiar credenciales admin
- Usar variables de entorno seguras
```

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:
1. Abre [GUIA_RECREAR_BD.md](GUIA_RECREAR_BD.md) para más detalles
2. Lee la sección "SI ALGO FALLA"
3. Verifica que ejecutaste los scripts en orden

---

**¡Adelante! Tú puedes.** ✨
