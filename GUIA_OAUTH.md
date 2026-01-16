# Guía de Configuración OAuth para Administrador

## Resumen
El sistema está configurado con NextAuth.js para permitir que los administradores se autentiquen usando Google o Microsoft OAuth. También mantiene fallback con email/password.

## Credenciales de Prueba

### Fallback (Email/Password) - Funcional Ahora Mismo ✅
- **Email**: admin@cvvinvest.com
- **Password**: admin123
- **Nota**: NO requiere credeniales reales de OAuth

## Configuración de Google OAuth

### Pasos para Habilitar en Producción:

1. **Ir a Google Cloud Console**
   - https://console.cloud.google.com
   
2. **Crear/Seleccionar Proyecto**
   - Si no tienes uno, crear proyecto nuevo
   
3. **Habilitar API**
   - Google+ API
   - Google Identity Service

4. **Crear Credenciales OAuth 2.0**
   - Tipo: Web application
   - URIs autorizados de JavaScript:
     - http://localhost:3000 (desarrollo)
     - tu-dominio.com (producción)
   - URIs de redireccionamiento:
     - http://localhost:3000/api/auth/callback/google (desarrollo)
     - https://tu-dominio.com/api/auth/callback/google (producción)

5. **Copiar Credenciales a .env.local**
   ```
   GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=tu-client-secret
   ```

6. **Reiniciar servidor**
   ```bash
   pnpm dev
   ```

## Configuración de Microsoft OAuth

### Pasos para Habilitar en Producción:

1. **Ir a Azure Portal**
   - https://portal.azure.com

2. **Registrar Aplicación (Entra ID / Azure AD)**
   - Home > App registrations > New registration
   - Name: "CVV Invest Admin"
   - Supported account types: "Accounts in this organizational directory only"

3. **Configurar Redirect URIs**
   - Ir a "Authentication" en el registro de la aplicación
   - Web Redirect URIs:
     - http://localhost:3000/api/auth/callback/azure-ad (desarrollo)
     - https://tu-dominio.com/api/auth/callback/azure-ad (producción)

4. **Crear Client Secret**
   - Certificates & secrets > New client secret
   - Copiar el valor del secret (solo aparece una vez)

5. **Obtener IDs Necesarios**
   - Ir a "Overview"
   - Client ID: copiar "Application (client) ID"
   - Tenant ID: copiar "Directory (tenant) ID"

6. **Actualizar .env.local**
   ```
   MICROSOFT_CLIENT_ID=tu-client-id
   MICROSOFT_CLIENT_SECRET=tu-client-secret
   MICROSOFT_TENANT_ID=tu-tenant-id
   ```

7. **Reiniciar servidor**
   ```bash
   pnpm dev
   ```

## Flujo de Autenticación Actual

### Código Implementado:

**1. auth-options.ts** - Configuración de NextAuth
- GoogleProvider ✅
- MicrosoftProvider (Azure AD) ✅
- CredentialsProvider (fallback email/password) ✅
- JWT callbacks para manejo de tokens
- Session callbacks para incluir rol

**2. /api/auth/[...nextauth]/route.ts** - Handler de API
- Maneja GET y POST para OAuth flow
- Compatible con Google y Microsoft

**3. oauth-buttons.tsx** - Componente UI
- Botón "Sign in with Google"
- Botón "Sign in with Microsoft"
- Estados de loading
- Manejo de errores

**4. /app/login/page.tsx** - Integración
- Muestra OAuth buttons después del formulario
- Oculta OAuth durante pantalla 2FA
- Mantiene 2FA PIN funcional

## Pruebas Locales

### Con Credenciales Fallback (AHORA):
```
1. Ir a http://localhost:3000/login
2. Ingresa:
   - Email: admin@cvvinvest.com
   - Password: admin123
3. Ingresa PIN (6 dígitos) si está habilitado
4. Debes llegar a /admin
```

### Con OAuth (UNA VEZ CONFIGURADO):
```
1. Ir a http://localhost:3000/login
2. Haz clic en "Sign in with Google" o "Sign in with Microsoft"
3. Completa el flujo de OAuth en su sitio
4. Debes regresar a /admin automáticamente
```

## Integración 2FA PIN

- **Estado**: PIN está integrado con OAuth
- **Comportamiento**: Después de OAuth, si el admin tiene 2FA habilitado, se pedirá el PIN
- **Configuración**: Admin > Seguridad > Autenticación de Dos Factores

## Estructura de Archivos

```
/lib/auth-options.ts                    - NextAuth config
/app/api/auth/[...nextauth]/route.ts    - API route
/components/oauth-buttons.tsx           - UI component
/app/login/page.tsx                     - Login page (integración)
.env.local                              - Credenciales (NO en Git)
```

## Notas de Seguridad

⚠️ **IMPORTANTE**:
- NEXTAUTH_SECRET nunca debe estar en el repositorio
- Las credenciales OAuth tampoco deben estar en Git
- En producción, usar variables de entorno seguras
- .env.local está en .gitignore

## Troubleshooting

### Error: "Cannot find module 'next-auth'"
**Solución**: `pnpm install && pnpm dev`

### OAuth buttons no aparecen
**Solución**: Revisar que oauth-buttons.tsx esté importado en login.tsx

### Error: "Invalid redirect_uri"
**Solución**: Verificar que las URIs en Google/Microsoft coincidan exactamente con .env.local

### 2FA PIN no funciona después de OAuth
**Solución**: 
1. Verificar que admin_2fa_enabled esté en localStorage
2. Comprobar que twoFAPin tiene 6 dígitos
3. Revisar /admin/seguridad para confirmar PIN guardado

## Próximos Pasos

1. ✅ OAuth infrastructure lista
2. ⏳ Obtener credenciales reales de Google Cloud
3. ⏳ Obtener credenciales reales de Azure Portal
4. ⏳ Actualizar .env.local
5. ⏳ Probar OAuth con credenciales reales
6. ⏳ Deploy a producción con URLs finales
