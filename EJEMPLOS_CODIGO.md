# 💻 Ejemplos de Código - Guía de Desarrollo

## 📌 Ejemplos Prácticos del Sistema de Planes

### 1. Cambiar Plan de un Usuario (desde Admin)

**Ubicación:** [app/admin/usuarios/page.tsx](app/admin/usuarios/page.tsx)

```typescript
// Función para cambiar plan
const changePlan = () => {
  if (!selectedUser || !newPlan) {
    setMessage('Selecciona un plan válido')
    setMessageType('error')
    return
  }

  if (newPlan === selectedUser.plan) {
    setMessage('El usuario ya tiene este plan')
    setMessageType('error')
    return
  }

  // Actualizar plan del usuario
  const updatedUsers = users.map((u) =>
    u.id === selectedUser.id ? { ...u, plan: newPlan as PlanType } : u
  )

  // Guardar en localStorage
  setAllUsers(updatedUsers)
  setUsers(updatedUsers)
  filterUsers(updatedUsers, searchTerm, planFilter)

  // Actualizar sesión si es el usuario actual
  const sessionUser = getSessionUser()
  if (sessionUser && sessionUser.id === selectedUser.id) {
    const updatedSessionUser = { ...sessionUser, plan: newPlan }
    localStorage.setItem('cvvinvest_user', JSON.stringify(updatedSessionUser))
  }

  setMessage(`✓ Plan actualizado a ${newPlan.toUpperCase()}`)
  setMessageType('success')
  setShowPlanModal(false)

  setTimeout(() => {
    setMessage('')
  }, 3000)
}
```

---

### 2. Aprobar Inversión + Cambiar Plan Automáticamente

**Ubicación:** [app/admin/inversiones/page.tsx](app/admin/inversiones/page.tsx)

```typescript
// Obtener planes sugeridos según monto
const getSuggestedPlansForInvestment = (amount: number): PlanType[] => {
  if (amount >= 1500) return ['vip', 'elite']
  if (amount >= 600) return ['vip', 'elite']
  if (amount >= 200) return ['pro', 'vip', 'elite']
  if (amount >= 60) return ['estandar', 'pro', 'vip']
  return []
}

// Manejar aprobación de inversión
const handleAction = async () => {
  if (!selectedInvestment || !actionType) return

  try {
    if (actionType === 'approve') {
      approveInvestment(selectedInvestment.id, actionNotes)
      
      // Si se debe cambiar el plan
      if (changePlanOnApprove && selectedPlanForChange) {
        const allUsers = getAllUsers()
        const updatedUsers = allUsers.map((u) =>
          u.email === selectedInvestment.userEmail
            ? { ...u, plan: selectedPlanForChange }
            : u
        )
        setAllUsers(updatedUsers)
        setMessage(
          `✓ Inversión aprobada. Plan actualizado a ${selectedPlanForChange.toUpperCase()}`
        )
      } else {
        setMessage('✓ Inversión aprobada exitosamente.')
      }
    } else {
      rejectInvestment(selectedInvestment.id, actionNotes)
      setMessage('✓ Inversión rechazada.')
    }

    setShowActionModal(false)
    loadInvestments()
  } catch (error) {
    setMessage('✗ Error al procesar la acción.')
  }
}
```

---

### 3. Validar Acceso a Funcionalidad por Plan

**Ubicación:** [lib/plan-features.ts](lib/plan-features.ts)

```typescript
export function canAccessFeature(plan: PlanType, feature: keyof PlanFeatures): boolean {
  const features = getPlanFeatures(plan)
  const value = features[feature]

  // Manejo según tipo de valor
  if (typeof value === 'boolean') {
    return value
  } else if (typeof value === 'number') {
    return value > 0
  } else if (Array.isArray(value)) {
    return value.length > 0
  } else if (typeof value === 'string') {
    return value !== 'none'
  }

  return false
}

// Uso en componentes
if (canAccessFeature(userPlan, 'canViewAnalytics')) {
  // Mostrar Analytics
} else {
  // Mostrar mensaje de acceso denegado
}
```

---

### 4. Componente de Protección de Funcionalidades

**Ubicación:** [components/feature-guard.tsx](components/feature-guard.tsx)

```typescript
// Componente FeatureGuard
<FeatureGuard
  plan={userPlan}
  feature="canViewAnalytics"
  fallback={<div>Necesitas plan Pro para acceder a Analytics</div>}
>
  <AnalyticsComponent />
</FeatureGuard>

// Componente FeatureButton
<FeatureButton
  plan={userPlan}
  feature="canWithdraw"
  onClick={() => handleWithdraw()}
>
  Retirar Dinero
</FeatureButton>
```

---

### 5. Obtener Características de un Plan

**Ubicación:** [lib/plan-features.ts](lib/plan-features.ts)

```typescript
const features = getPlanFeatures('pro')

// Resultado:
{
  canDeposit: true,
  canWithdraw: true,
  canInvest: true,
  canViewReports: true,
  canViewAnalytics: true,
  canAccessAdvancedTools: true,
  canHavePersonalAdvisor: false,
  withdrawalDays: 7,
  paymentMethods: ['bank_transfer', 'paypal', 'credit_card'],
  supportLevel: 'priority'
}
```

---

### 6. Cargar y Actualizar Usuarios

**Ubicación:** [lib/auth.ts](lib/auth.ts)

```typescript
// Obtener todos los usuarios
const allUsers = getAllUsers()

// Actualizar usuarios
const updatedUsers = allUsers.map((user) => {
  if (user.id === targetUserId) {
    return {
      ...user,
      plan: 'elite' as PlanType,
      balance: user.balance + 100
    }
  }
  return user
})

// Guardar cambios
setAllUsers(updatedUsers)

// Verificar cambios inmediatamente
const updatedList = getAllUsers()
console.log(updatedList) // Array actualizado
```

---

### 7. Crear Mensaje de Características Faltantes

**Ubicación:** [lib/plan-features.ts](lib/plan-features.ts)

```typescript
const message = getMissingFeatureMessage('gratuito', 'Analytics')

// Resultado:
"Esta funcionalidad no está disponible en tu plan actual (Gratuito). 
Actualiza a Pro o superior para acceder a Analytics."
```

---

### 8. Filtrar Usuarios por Plan

**Ubicación:** [app/admin/usuarios/page.tsx](app/admin/usuarios/page.tsx)

```typescript
// Filtrar usuarios
const filterUsers = (data: UserExtended[], search: string, plan: string) => {
  let filtered = data.filter((u) => u.role === 'user')

  // Por búsqueda
  if (search) {
    filtered = filtered.filter(
      (u) =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  // Por plan
  if (plan !== 'all') {
    filtered = filtered.filter((u) => u.plan === plan)
  }

  // Ordenar por fecha
  filtered.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  setFilteredUsers(filtered)
}
```

---

### 9. Mostrar Estadísticas de Planes

**Ubicación:** [app/admin/usuarios/page.tsx](app/admin/usuarios/page.tsx)

```typescript
const getPlanStats = () => {
  return {
    total: users.filter((u) => u.role === 'user').length,
    gratuito: users.filter((u) => u.plan === 'gratuito').length,
    estandar: users.filter((u) => u.plan === 'estandar').length,
    pro: users.filter((u) => u.plan === 'pro').length,
    vip: users.filter((u) => u.plan === 'vip').length,
    elite: users.filter((u) => u.plan === 'elite').length,
  }
}

// Uso en JSX
const stats = getPlanStats()
<Card className="p-4">
  <p className="text-xs text-muted-foreground mb-1">Total</p>
  <p className="text-2xl font-bold">{stats.total}</p>
</Card>
```

---

### 10. Sincronizar Sesión de Usuario

**Ubicación:** [lib/auth.ts](lib/auth.ts)

```typescript
// Obtener usuario actual
const sessionUser = getSessionUser()

// Si es el usuario actual quien cambió plan, actualizar sesión
if (sessionUser && sessionUser.id === selectedUser.id) {
  const updatedSessionUser = { 
    ...sessionUser, 
    plan: newPlan 
  }
  localStorage.setItem(
    'cvvinvest_user', 
    JSON.stringify(updatedSessionUser)
  )
}

// Verificar cambios
const updatedSession = getSessionUser()
console.log(updatedSession.plan) // Nuevo plan
```

---

## 🎯 Casos de Uso Completos

### Caso 1: Usuario invierte dinero → Auto-upgrade de plan

```typescript
// 1. Admin ve inversión de $500
const investment = {
  id: 'inv-123',
  userEmail: 'user@example.com',
  amount: 500,
  status: 'pendiente'
}

// 2. Sistema sugiere planes automáticamente
const suggested = getSuggestedPlansForInvestment(500)
// Resultado: ['pro', 'vip', 'elite']

// 3. Admin selecciona Pro
const selectedPlan = 'pro'

// 4. Admin aprueba inversión
handleAction()
// ├─ approveInvestment('inv-123')
// └─ setAllUsers() con usuario.plan = 'pro'

// 5. Usuario obtiene acceso a:
// ├─ Analytics
// ├─ Reportes
// └─ Retiros normales
```

---

### Caso 2: Promocionar usuario manual desde admin

```typescript
// 1. Admin busca usuario
handleSearch('juan@example.com')

// 2. Admin abre modal de cambio de plan
openPlanModal(userObject)

// 3. Selecciona nuevo plan (VIP)
setSelectedPlanForChange('vip')

// 4. Ve características del plan VIP
// ├─ ✓ Asesor Personal
// ├─ ✓ Analytics
// └─ ✓ Retiros 7 días

// 5. Confirma cambio
changePlan()

// 6. Usuario ahora es VIP
```

---

### Caso 3: Verificar acceso a página

```typescript
// En /dashboard/analytics

// 1. Obtener plan del usuario
const userPlan = getSessionUser()?.plan // 'pro'

// 2. Verificar si tiene acceso
const hasAccess = canAccessFeature(userPlan, 'canViewAnalytics')

// 3. Si tiene acceso → Mostrar
if (hasAccess) {
  return <AnalyticsPage />
} else {
  // Si no tiene acceso → Mostrar mensaje
  return <NeedsPlanModal plan="Pro" />
}
```

---

## 🔧 Utilidades Comunes

### Obtener color del plan

```typescript
const planColors: Record<PlanType, string> = {
  gratuito: 'bg-slate-500',
  estandar: 'bg-blue-500',
  pro: 'bg-purple-500',
  vip: 'bg-amber-500',
  elite: 'bg-emerald-500',
}

const color = planColors['pro'] // 'bg-purple-500'
```

### Obtener descripción del plan

```typescript
const planDescriptions: Record<string, string> = {
  gratuito: 'Acceso limitado al panel',
  estandar: 'Inversiones, depósitos, retiros e informes',
  pro: 'Estándar + Analytics avanzado',
  vip: 'Pro + Asesor personal dedicado',
  elite: 'Todo VIP + Retiros inmediatos 24/7',
}

const desc = planDescriptions['vip']
// 'Pro + Asesor personal dedicado'
```

### Formatear moneda

```typescript
const balance = 1234.56
const formatted = `$${balance.toFixed(2)}`
// '$1234.56'

const withLocale = balance.toLocaleString()
// '1,234.56'
```

---

## 📊 Tipos TypeScript Principales

```typescript
// Usuario
type User = {
  id: string
  name: string
  email: string
  plan: PlanType
  balance: number
  role: 'user' | 'admin'
  createdAt: Date
}

// Tipos de Plan
type PlanType = 'gratuito' | 'estandar' | 'pro' | 'vip' | 'elite'

// Características de Plan
interface PlanFeatures {
  canDeposit: boolean
  canWithdraw: boolean
  canInvest: boolean
  canViewReports: boolean
  canViewAnalytics: boolean
  canAccessAdvancedTools: boolean
  canHavePersonalAdvisor: boolean
  withdrawalDays: number
  paymentMethods: string[]
  supportLevel: 'standard' | 'priority' | '24/7'
}

// Inversión
interface Investment {
  id: string
  userEmail: string
  amount: number
  status: 'pendiente' | 'aprobado' | 'rechazado'
  createdAt: string
}
```

---

## 🚀 Mejores Prácticas Implementadas

✅ **Tipos TypeScript:** Todo está bien tipado
✅ **Funciones puras:** Sin efectos secundarios
✅ **Reutilización:** Componentes y funciones reutilizables
✅ **Validación:** Entrada siempre validada
✅ **Manejo de errores:** Try-catch donde es necesario
✅ **Mensajes claros:** User feedback inmediato
✅ **Rendimiento:** Memoization y lazy loading
✅ **Accesibilidad:** Labels, ARIA, navegación por teclado

---

## 📚 Recursos para Desarrolladores

- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

**Versión:** 2.0  
**Última actualización:** 2024
