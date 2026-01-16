# 🔑 AUTORIZACIÓN NECESARIA

Para subir código a GitHub necesitas uno de estos:

## Opción 1: GitHub Personal Access Token (RECOMENDADO)

1. Ve a: https://github.com/settings/tokens/new
2. Nombre: `git-cli`
3. Expiración: 90 días
4. Scopes a marcar:
   - ✅ repo (todo)
   - ✅ workflow
5. Click: "Generate token"
6. **COPIAR el token** (aparece solo una vez)

Ejemplo de token: `ghp_aBcD1234eFgh5678iJkL9mNoPqRs...`

7. Ejecuta en PowerShell:
```powershell
# Reemplaza TOKEN_AQUI con tu token
git push -u origin main
# Cuando pida contraseña: pega el token
```

## Opción 2: GitHub CLI (MÁS FÁCIL)

1. Descarga: https://cli.github.com/
2. Instala
3. Ejecuta en PowerShell:
```powershell
gh auth login
# Selecciona: GitHub.com
# Selecciona: HTTPS
# Selecciona: Y (authenticate)
# Abre navegador y autoriza
```

4. Luego:
```powershell
cd C:\Users\exema\Downloads\financial-investment-platform
git push -u origin main
```

## Opción 3: Credenciales de Windows (Si las tienes guardadas)

Si ya tienes credenciales en Windows, simplemente:
```powershell
cd C:\Users\exema\Downloads\financial-investment-platform
git push -u origin main
```

---

**¿Cuál prefieres? Dime qué vas a hacer y te ayudo.**
