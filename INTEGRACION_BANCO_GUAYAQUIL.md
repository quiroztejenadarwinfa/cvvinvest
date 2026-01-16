# Integración - Banco de Guayaquil

## Descripción General
Sistema de depósitos con transferencia bancaria para Ecuador (sin comisiones).

## Datos de la Cuenta

| Campo | Valor |
|-------|-------|
| **Banco** | Banco de Guayaquil |
| **Tipo de Cuenta** | Cuenta de Ahorros |
| **Número de Cuenta** | 0045454253 |
| **Titular** | Tejena Alonso Rosa Irene |
| **Cédula/RUC** | 1717378457 |
| **Código SWIFT** | GUAYECEG |
| **Email de Soporte** | soportecvvinvest@proton.me |

## Flujo de Depósito

### 1. Usuario hace depósito via transferencia
- Accede a `/depositos`
- Selecciona tab **"Transferencia Bancaria (EC)"**
- Ingresa monto
- Ve los detalles de la cuenta bancaria
- Copia los datos (buttons con copy-to-clipboard)
- Realiza transferencia desde su banco
- Usa su email como referencia

### 2. Admin aprueba depósito
- Admin ve en `/admin/depositos` la transferencia pendiente
- Verifica que la transferencia llegó a la cuenta
- Hace clic en **"Aprobar"**
- El sistema:
  - Actualiza estado a "completado" 
  - Suma el monto al balance del usuario
  - Envía notificación al usuario

### 3. Usuario recibe confirmación
- Notificación en dashboard
- Balance actualizado en tiempo real

## Archivos Modificados

### `lib/bank-config.ts` (NUEVO)
```typescript
export interface BankAccount {
  id: string
  bankName: string
  accountType: string
  accountNumber: string
  accountHolder: string
  ci: string
  swift: string
  email: string
  active: boolean
}

export const getActiveBankAccounts = (): BankAccount[] => [
  {
    id: "banco-guayaquil",
    bankName: "Banco de Guayaquil",
    accountType: "Cuenta de Ahorros",
    accountNumber: "0045454253",
    accountHolder: "Tejena Alonso Rosa Irene",
    ci: "1717378457",
    swift: "GUAYECEG",
    email: "soportecvvinvest@proton.me",
    active: true
  }
]
```

### `app/depositos/page.tsx` (MODIFICADO)

**Cambios principales:**
1. **Imports añadidos:**
   - `Copy`, `DollarSign` icons
   - `getActiveBankAccounts` desde bank-config
   - `Alert`, `AlertDescription` componentes

2. **Estado nuevo:**
   - `selectedMethod`: "paypal" | "transfer"
   - `bankAccounts`: Lista de cuentas activas
   - `copiedAccount`: Feedback visual para copy-to-clipboard

3. **Funciones nuevas:**
   - `handleBankTransfer()`: Crea depósito pendiente
   - `handleCopyAccount()`: Copia al portapapeles

4. **UI Actualizado:**
   - Tabs para seleccionar método de pago
   - Detalles de cuenta bancaria visible
   - Botones copy para cada campo
   - Instrucciones paso a paso
   - Botón para confirmar depósito

## Detalles del Flujo de Datos

### handleBankTransfer()
```typescript
const handleBankTransfer = () => {
  // 1. Validar monto
  // 2. Crear objeto depósito con:
  //    - id único (dep_timestamp_random)
  //    - userId
  //    - amount
  //    - method: "Transferencia Bancaria"
  //    - status: "pendiente"
  //    - createdAt: ISO timestamp
  // 3. Guardar en localStorage['cvvinvest_deposits']
  // 4. Enviar notificación admin con detalles
  // 5. Mostrar confirmación al usuario
}
```

### handleCopyAccount()
```typescript
const handleCopyAccount = (text: string, accountId: string) => {
  // 1. Copiar texto al portapapeles
  // 2. Mostrar feedback visual (accountId se marca como copied)
  // 3. Limpiar feedback después de 2 segundos
}
```

## Panel Admin

En `/admin/depositos`:
- Se muestran todos los depósitos (PayPal + Transferencias)
- Botón **Aprobar** actualiza balance del usuario
- Botón **Rechazar** se puede usar para transferencias fallidas
- Se filtra por estado: "pendiente", "completado", "rechazado"

## Ventajas

✅ **Sin comisiones** - 0% en transferencias internas Ecuador
✅ **Seguro** - Datos de cuenta con copy-to-clipboard
✅ **Transparente** - Usuario controla cuándo transfiere
✅ **Instantáneo (admin)** - Admin puede procesar inmediatamente al recibir
✅ **Integrado** - Funciona con PayPal sin cambiar estructura

## Próximos Pasos (Opcional)

1. **Agregar Banco Pichincha** - Cuando se proporcionen datos
2. **Notificación automática** - Verificar transferencia automáticamente
3. **Comprobante** - Permitir usuario adjuntar comprobante de transferencia
4. **Email notificación** - Avisar a soportecvvinvest@proton.me cuando hay transferencia

## Notas de Seguridad

⚠️ **Producción:**
- Los datos bancarios se muestran en el frontend (es intencional, usuarios necesitan verlos)
- El Banco de Guayaquil recibirá todas las transferencias
- Admin debe verificar que el dinero llegó antes de aprobar
- Se recomienda auditoría periódica de depósitos vs transferencias recibidas

## Testing

Para probar localmente:
1. Ir a `/depositos`
2. Cambiar a "Transferencia Bancaria (EC)"
3. Ingresar monto (ej: 50)
4. Copiar datos (verify copy buttons work)
5. Hacer clic "Confirmar Depósito"
6. Verificar que aparece en `/admin/depositos` con estado "pendiente"
7. Admin aprueba → Usuario ve balance actualizado

---
**Actualizado:** 16 enero 2026
**Commit:** 6937d29
**Status:** ✅ En producción
