# 📤 PASO 1: Subir el Sitio a GitHub

## ✅ INSTRUCCIONES PASO A PASO

### Paso 1: Crear Repositorio en GitHub (5 minutos)

**1. Ir a GitHub.com**
```
https://www.github.com
```

**2. Si NO tienes cuenta:**
- Click en "Sign up"
- Email: Tu email (ej: tumail@gmail.com)
- Password: Segura (ej: MiPasswd2024!)
- Username: Tu nombre de usuario (ej: tu_usuario)
- Verificar email

**3. Si YA tienes cuenta:**
- Login en GitHub.com

**4. Crear nuevo repositorio:**
- Click en el "+" arriba a la derecha → "New repository"
- O ir a: https://github.com/new

**5. Configurar repositorio:**
```
Repository name:    financial-platform
Description:        Plataforma de inversiones con depósitos y chat
Public/Private:     ✅ Public (mejor para showcase)
Initialize:         ❌ NO marcar nada (ya tienes archivos locales)
Click:              "Create repository"
```

**Resultado esperado:**
```
Tu URL será algo como:
https://github.com/tu_usuario/financial-platform
```

---

### Paso 2: Configurar Git Localmente (Windows PowerShell)

**Abrir PowerShell en tu carpeta del proyecto:**

```powershell
# Ir a tu carpeta
cd C:\Users\exema\Downloads\financial-investment-platform

# Verificar que git está instalado
git --version

# Si ves versión (ej: git version 2.40.0.windows.1) ✅ BIEN
# Si NO ves versión, descargar: https://git-scm.com/download/win
```

---

### Paso 3: Inicializar Git Localmente

**Ejecutar en PowerShell:**

```powershell
# 1. Inicializar repositorio local
git init

# 2. Agregar configuración git (solo primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu_email@gmail.com"

# Ejemplo:
# git config --global user.name "Juan Pérez"
# git config --global user.email "juan@gmail.com"
```

---

### Paso 4: Agregar Archivos a Git

**Ejecutar en PowerShell:**

```powershell
# Ver estado actual
git status

# Agregar TODOS los archivos
git add .

# Ver que todos fueron agregados (deberían estar en verde)
git status
```

---

### Paso 5: Hacer Primer Commit

**Ejecutar en PowerShell:**

```powershell
git commit -m "Initial commit: Plataforma de inversiones completa"
```

**Deberías ver algo como:**
```
[main (root-commit) 3a4f2c1] Initial commit: Plataforma de inversiones completa
 245 files changed, 125000 insertions(+)
```

---

### Paso 6: Conectar con GitHub

**Ejecutar en PowerShell (reemplazar TU_USUARIO):**

```powershell
# Agregar conexión remota
git remote add origin https://github.com/TU_USUARIO/financial-platform.git

# Cambiar rama a main (importante para GitHub)
git branch -M main

# Verificar que se conectó bien
git remote -v
```

**Resultado esperado:**
```
origin  https://github.com/TU_USUARIO/financial-platform.git (fetch)
origin  https://github.com/TU_USUARIO/financial-platform.git (push)
```

---

### Paso 7: Subir Código a GitHub (Push)

**Ejecutar en PowerShell:**

```powershell
# Primera vez necesita autenticación
git push -u origin main

# Te pedirá credenciales (una de estas opciones):
```

#### Opción A: Token de GitHub (Recomendado)

**Si te pide usuario/contraseña:**

1. **Generar Token en GitHub:**
   - Ir a: https://github.com/settings/tokens
   - Click: "Generate new token" → "Generate new token (classic)"
   - Nombre: "Git CLI" 
   - Expiración: 90 días
   - Scopes: Marcar "repo" y "workflow"
   - Click: "Generate token"
   - **COPIAR el token (aparece solo una vez)**

2. **Usar token en PowerShell:**
   ```
   Usuario: TU_USUARIO (tu nombre de usuario)
   Contraseña: PEGA_EL_TOKEN_AQUI
   ```

#### Opción B: GitHub CLI (Más Fácil - RECOMENDADO)

```powershell
# Descargar GitHub CLI desde:
# https://cli.github.com/

# Una vez instalado:
gh auth login

# Te hará preguntas:
# GitHub.com? → Yes
# HTTPS? → Yes
# Authenticate? → Yes
# Browser? → Yes (abrirá navegador para login)

# Después automaticamente:
# git push -u origin main
```

---

## 🎯 COMANDOS RÁPIDOS - COPIA Y PEGA

**Abre PowerShell y ejecuta estos comandos en orden:**

```powershell
# 1. Ir a la carpeta
cd C:\Users\exema\Downloads\financial-investment-platform

# 2. Inicializar git
git init

# 3. Configurar usuario (solo primera vez)
git config --global user.name "Tu Nombre Completo"
git config --global user.email "tu_email@gmail.com"

# 4. Agregar archivos
git add .

# 5. Crear commit
git commit -m "Initial commit: Plataforma de inversiones - MVP completo"

# 6. Conectar con GitHub (REEMPLAZAR tu_usuario y financial-platform si es distinto)
git remote add origin https://github.com/tu_usuario/financial-platform.git
git branch -M main

# 7. Subir a GitHub (por primera vez con -u)
git push -u origin main
```

---

## ✅ VERIFICACIÓN: ¿Funcionó?

**Después de `git push`, deberías ver:**

```
Counting objects: 245 done.
Delta compression using up to 8 threads.
Compressing objects: 100% (200/200), done.
Writing objects: 100% (245/245), 12.50 MiB | 2.50 MiB/s, done.
Total 245 (delta 50), reused 0 (delta 0), pack-reused 0
To https://github.com/tu_usuario/financial-platform.git
 * [new branch]      main -> main
branch 'main' set to track 'origin/main'.
```

**Luego:**
1. Abre en navegador: `https://github.com/tu_usuario/financial-platform`
2. Deberías ver todos tus archivos ✅

---

## 🆘 PROBLEMAS COMUNES

### Error: "fatal: destination path already exists and is not an empty directory"
```powershell
# Ya existe .git en la carpeta
# Solución:
rm -r .git
git init
# Luego repetir desde paso 4
```

### Error: "remote origin already exists"
```powershell
# Ya existe conexión
# Solución:
git remote remove origin
git remote add origin https://github.com/tu_usuario/financial-platform.git
git push -u origin main
```

### Error: "fatal: 'origin' does not appear to be a 'git' repository"
```powershell
# La URL está mal
# Solución:
git remote remove origin
# Verificar la URL en GitHub.com
git remote add origin https://github.com/USUARIO/REPO.git
git push -u origin main
```

### Error: "Please make sure you have the correct access rights"
```powershell
# Token expirado o incorrecto
# Solución:
# Generar nuevo token: https://github.com/settings/tokens
# Usar el nuevo token en lugar del anterior
```

### Error: "fatal: No commits yet"
```powershell
# No hiciste commit
# Solución:
git add .
git commit -m "Initial commit"
git push -u origin main
```

---

## 📋 CHECKLIST

```
ANTES DE PUSH:
☐ Crear repositorio en GitHub.com
☐ Copiar la URL: https://github.com/tu_usuario/financial-platform.git
☐ Verificar que git está instalado (git --version)

DURANTE PUSH:
☐ Estar en la carpeta correcta
☐ git init
☐ git add .
☐ git commit -m "mensaje"
☐ git remote add origin [URL]
☐ git branch -M main
☐ git push -u origin main

DESPUÉS DE PUSH:
☐ Ver repositorio en GitHub.com
☐ Verificar que todos los archivos están
☐ Revisar primeros commits
```

---

## 🎉 ¡LISTO!

Cuando veas todos tus archivos en GitHub.com → **PASO 1 COMPLETADO** ✅

**Próximo paso:** Conectar GitHub con Vercel para deploy automático 🚀

---

## ❓ ¿Preguntas?

Si algo falla, proporciona el MENSAJE DE ERROR completo y lo resolvemos.

Ejemplo de error que ayuda:
```
fatal: 'origin' does not appear to be a 'git' repository
```

Muy bien, ahora a configurar Vercel...
