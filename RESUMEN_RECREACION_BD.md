# 📋 RESUMEN: RECREACIÓN COMPLETA DE LA BASE DE DATOS

## 📂 ARCHIVOS CREADOS

He creado 4 archivos SQL que debes ejecutar en orden:

| # | Archivo | Propósito | Cuando Ejecutar |
|---|---------|-----------|-----------------|
| 1 | `01-reset-db.sql` | Elimina todas las tablas y crea nuevas | **PRIMERO** |
| 2 | `02-seed-data.sql` | Inserta usuarios y datos de ejemplo | **SEGUNDO** |
| 3 | `03-production-rls.sql` | Habilita seguridad (RLS) para producción | Después que funcione |
| 4 | `GUIA_RECREAR_BD.md` | Guía detallada con pasos | Referencias |

---

## 🎯 PLAN DE EJECUCIÓN

### PASO 1️⃣: Preparación (5 minutos)

```bash
# Verifica que tengas acceso a Supabase
# Ve a: https://app.supabase.com
# Abre tu proyecto
```

### PASO 2️⃣: Ejecutar Script de Reset (2 minutos)

```
1. Ve a SQL Editor > New Query
2. Abre: 01-reset-db.sql
3. Copia TODO el contenido
4. Pégalo en Supabase
5. Haz clic en ▶ Run
6. Espera que termine ✅
```

**Lo que hace:**
- ❌ Elimina todas las tablas antiguas
- ✅ Crea tablas nuevas y correctas
- ✅ Deshabilita RLS para desarrollo

### PASO 3️⃣: Insertar Datos de Ejemplo (2 minutos)

```
1. Ve a SQL Editor > New Query
2. Abre: 02-seed-data.sql
3. Copia TODO el contenido
4. Pégalo en Supabase
5. Haz clic en ▶ Run
6. Espera que termine ✅
```

**Lo que hace:**
- ✅ Crea 5 usuarios de prueba
- ✅ Crea 3 depósitos de ejemplo
- ✅ Crea 3 inversiones de ejemplo

### PASO 4️⃣: Verificar que Funciona (2 minutos)

En Supabase Table Editor:

```
✅ users → 5 registros
✅ deposits → 3 registros
✅ investments → 3 registros
✅ chat_sessions → 0 registros (vacío, OK)
✅ chat_messages → 0 registros (vacío, OK)
✅ notifications → 0 registros (vacío, OK)
```

---

## 🧪 USUARIOS DE PRUEBA

Después de ejecutar los scripts, puedes usar:

### 1. Admin (Full Access)
```
Email: exe.main.darwin@gmail.com
Password: password123
Plan: elite
Balance: $50,000
```

### 2. Gratuito
```
Email: usuario.gratuito@ejemplo.com
Password: password123
Plan: gratuito
Balance: $100
```

### 3. Estándar
```
Email: usuario.estandar@ejemplo.com
Password: password123
Plan: estandar
Balance: $5,000
```

### 4. Pro
```
Email: usuario.pro@ejemplo.com
Password: password123
Plan: pro
Balance: $15,000
```

### 5. VIP
```
Email: usuario.vip@ejemplo.com
Password: password123
Plan: vip
Balance: $30,000
```

---

## ⚙️ CONFIGURACIÓN DEL CÓDIGO

Asegúrate que tu `.env.local` tenga:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

Si no sabes dónde conseguirlo:
1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Proyecto > Configuración > API
3. Copia las claves

---

## ✅ CHECKLIST FINAL

- [ ] Los 3 archivos SQL están creados
- [ ] Ejecuté `01-reset-db.sql` sin errores
- [ ] Ejecuté `02-seed-data.sql` sin errores
- [ ] Veo 5 usuarios en la tabla `users`
- [ ] Veo 3 depósitos en la tabla `deposits`
- [ ] Veo 3 inversiones en la tabla `investments`
- [ ] Mi `.env.local` tiene las variables correctas
- [ ] Puedo ejecutar `npm run dev` sin errores
- [ ] La página de login carga sin problemas

---

## 🚀 PRÓXIMOS PASOS (Después que funcione)

1. **Prueba el sistema:**
   - Inicia sesión con un usuario de prueba
   - Crea un nuevo depósito
   - Crea una nueva inversión
   - Verifica que aparezcan en el panel admin

2. **Para producción (después):**
   - Ejecuta `03-production-rls.sql`
   - Cambia las credenciales admin
   - Configura variables de entorno seguras

3. **Troubleshooting:**
   - Ver [GUIA_RECREAR_BD.md](GUIA_RECREAR_BD.md) para errores comunes

---

## 🐛 SI ALGO NO FUNCIONA

### La tabla users está vacía
```
→ Ejecuta 02-seed-data.sql nuevamente
```

### Error "Table already exists"
```
→ Ejecuta 01-reset-db.sql nuevamente (limpia todo primero)
```

### El código no se conecta
```
→ Verifica tu .env.local
→ Verifica NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### El panel admin no carga usuarios
```
→ Verifica que RLS esté DESHABILITADO en tabla users
→ El script 01-reset-db.sql ya lo hace, pero confirma
```

---

## 📚 MÁS INFORMACIÓN

- [GUIA_RECREAR_BD.md](GUIA_RECREAR_BD.md) - Guía detallada
- [03-production-rls.sql](03-production-rls.sql) - Para producción (después)
- [01-reset-db.sql](01-reset-db.sql) - Script de reset
- [02-seed-data.sql](02-seed-data.sql) - Script de datos

---

**✅ ¡La base de datos está lista para usar!**
