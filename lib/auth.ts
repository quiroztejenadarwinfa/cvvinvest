import { supabase } from "@/lib/supabase"

// Configuración del administrador
export const ADMIN_EMAIL = "exe.main.darwin@gmail.com"
export const ADMIN_PASSWORD = "admin12345"

// Tipos de usuario
export type UserRole = "user" | "admin"
export type DepositStatus = "pendiente" | "aprobado" | "rechazado" | "cancelado"

export interface User {
  id: string
  email: string
  name: string
  role?: UserRole
  plan: "gratuito" | "estandar" | "pro" | "vip" | "elite"
  balance: number
  createdAt: Date
  planChangedAt?: Date
  previousPlan?: "gratuito" | "estandar" | "pro" | "vip" | "elite"
}

export interface Deposit {
  id: string
  userId: string
  userEmail: string
  userName: string
  amount: number
  status: DepositStatus
  method: string
  createdAt: string
  approvedAt?: string
  notes?: string
}

// ==================== FUNCIONES SUPABASE ====================

// Obtener todos los usuarios desde Supabase
export async function getAllUsersSupabase(): Promise<User[]> {
  try {
    // Usar API endpoint que usa service_role key (no está bloqueado por RLS)
    const response = await fetch('/api/users-admin')
    
    if (!response.ok) {
      console.error('[Supabase] API error:', response.status)
      return []
    }
    
    const result = await response.json()
    const users = result.data || []
    
    console.log(`[Supabase] Usuarios obtenidos: ${users?.length || 0}`)
    return users || []
  } catch (error) {
    console.error('[Supabase] Exception al obtener usuarios:', error)
    return []
  }
}

// Obtener inversiones desde Supabase
export async function getAllInvestmentsSupabase(): Promise<any[]> {
  try {
    // Usar API endpoint que usa service_role key (no está bloqueado por RLS)
    const response = await fetch('/api/investments-admin')
    
    if (!response.ok) {
      console.error('[Supabase] API error:', response.status)
      return []
    }
    
    const result = await response.json()
    const investments = result.data || []
    
    console.log(`[Supabase] Inversiones obtenidas: ${investments?.length || 0}`)
    return investments || []
  } catch (error) {
    console.error('[Supabase] Exception al obtener inversiones:', error)
    return []
  }
}

// Aprobar inversión en Supabase
export async function approveInvestmentSupabase(investmentId: string, notes?: string): Promise<boolean> {
  try {
    console.log(`[Supabase] Aprobando inversión: ${investmentId}`)
    
    // Obtener la inversión
    const { data: investment, error: getError } = await supabase
      .from('investments')
      .select('*')
      .eq('id', investmentId)
      .single()
    
    if (getError || !investment) {
      console.error('[Supabase] Inversión no encontrada:', getError)
      return false
    }
    
    console.log('[Supabase] Inversión encontrada:', investment)
    
    // Obtener el usuario
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', investment.user_id)
      .single()
    
    if (userError || !user) {
      console.error('[Supabase] Usuario no encontrado:', userError)
      return false
    }
    
    console.log('[Supabase] Usuario encontrado:', user.email, 'Plan:', user.plan)
    
    // Normalizar el plan
    const normalizePlanName = (name: string): string => {
      const normalized = name
        .toLowerCase()
        .replace(/á/g, "a")
        .replace(/é/g, "e")
        .replace(/í/g, "i")
        .replace(/ó/g, "o")
        .replace(/ú/g, "u")
        .trim()
      
      const planMap: Record<string, string> = {
        gratuito: "gratuito",
        estandar: "estandar",
        pro: "pro",
        vip: "vip",
        elite: "elite",
      }
      
      return planMap[normalized] || user.plan
    }
    
    const newPlan = normalizePlanName(investment.plan_name)
    console.log(`[Supabase] Plan actualizado de ${user.plan} a ${newPlan}`)
    
    // Actualizar inversión como aprobada
    const { error: updateInvError } = await supabase
      .from('investments')
      .update({
        status: 'aprobado',
        approved_at: new Date().toISOString(),
        notes: notes
      })
      .eq('id', investmentId)
    
    if (updateInvError) {
      console.error('[Supabase] Error al actualizar inversión:', updateInvError)
      return false
    }
    
    // Actualizar usuario: solo cambiar plan (NO restar balance en inversión)
    const { error: updateUserError } = await supabase
      .from('users')
      .update({
        plan: newPlan
      })
      .eq('id', investment.user_id)
    
    if (updateUserError) {
      console.error('[Supabase] Error al actualizar usuario:', updateUserError)
      return false
    }
    
    console.log(`[Supabase] Inversión aprobada exitosamente`)
    return true
  } catch (error) {
    console.error('[Supabase] Exception al aprobar inversión:', error)
    return false
  }
}

// Aprobar depósito en Supabase
export async function approveDepositSupabase(depositId: string, notes?: string): Promise<boolean> {
  try {
    console.log(`[Supabase] Aprobando depósito: ${depositId}`)
    
    // Obtener el depósito desde localStorage primero
    const localDeposits = getAllDeposits()
    let deposit = localDeposits.find((d) => d.id === depositId)
    
    if (!deposit) {
      // Si no está en localStorage, intentar desde Supabase
      const supabaseDeposits = await getAllDepositsSupabase()
      deposit = supabaseDeposits.find((d) => d.id === depositId)
    }

    if (!deposit) {
      console.error('[Supabase] Depósito no encontrado')
      return false
    }
    
    console.log('[Supabase] Depósito encontrado:', deposit)
    
    // Obtener el usuario
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', deposit.userId)
      .single()
    
    if (userError || !user) {
      console.error('[Supabase] Usuario no encontrado:', userError)
      return false
    }
    
    console.log('[Supabase] Usuario encontrado:', user.email)
    
    // Actualizar depósito como aprobado en Supabase
    const { error: updateDepError } = await supabase
      .from('deposits')
      .update({
        status: 'aprobado',
        approved_at: new Date().toISOString(),
        notes: notes
      })
      .eq('id', depositId)
    
    if (updateDepError) {
      console.error('[Supabase] Error al actualizar depósito:', updateDepError)
      return false
    }
    
    // Actualizar usuario: sumar balance
    const newBalance = user.balance + deposit.amount
    const { error: updateUserError } = await supabase
      .from('users')
      .update({
        balance: newBalance
      })
      .eq('id', deposit.userId)
    
    if (updateUserError) {
      console.error('[Supabase] Error al actualizar usuario:', updateUserError)
      return false
    }
    
    // Sincronizar con localStorage
    const updatedLocalDeposits = localDeposits.map((d) => 
      d.id === depositId 
        ? {
            ...d,
            status: 'aprobado',
            approvedAt: new Date().toISOString(),
            notes: notes
          }
        : d
    )
    localStorage.setItem('cvvinvest_deposits', JSON.stringify(updatedLocalDeposits))
    
    console.log(`[Supabase] Depósito aprobado exitosamente`)
    return true
  } catch (error) {
    console.error('[Supabase] Exception al aprobar depósito:', error)
    return false
  }
}

// ==================== FUNCIONES ORIGINALES (localStorage como fallback) ====================

// Función para verificar si es admin
export function isAdmin(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

// Función para obtener usuario de sesión (ahora intenta Supabase primero, luego localStorage)
export function getSessionUser(): User | null {
  if (typeof window === "undefined") return null
  
  // Intentar obtener de localStorage primero (para compatibilidad)
  const userData = localStorage.getItem("cvvinvest_user")
  if (userData) {
    return JSON.parse(userData)
  }
  
  // Si no está en localStorage, la sesión de Supabase debe estar manejada en componentes
  return null
}

// Función para guardar sesión en localStorage (para compatibilidad)
export function setSessionUser(user: User): void {
  localStorage.setItem("cvvinvest_user", JSON.stringify(user))
}

// Función para login con Supabase
export async function loginWithSupabase(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return { success: false, error: error.message, user: null }

    // Obtener datos del usuario via API (ignora RLS con service_role key)
    try {
      // Intentar obtener por email primero
      const response = await fetch(`/api/auth/user?email=${encodeURIComponent(data.user.email)}`)
      
      if (response.ok) {
        const userData = await response.json()
        
        const user: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name || "",
          plan: userData.plan || "gratuito",
          balance: userData.balance || 0,
          createdAt: new Date(userData.created_at),
        }

        setSessionUser(user)
        return { success: true, error: null, user }
      }

      // Si 404, crear usuario con el nuevo endpoint
      if (response.status === 404) {
        console.log("📝 Usuario no encontrado en BD, creando perfil...")
        
        const createResponse = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email.split("@")[0],
            plan: "gratuito",
            balance: 0,
          }),
        })

        if (createResponse.ok) {
          const newUser = await createResponse.json()
          
          const user: User = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name || "",
            plan: newUser.plan || "gratuito",
            balance: newUser.balance || 0,
            createdAt: new Date(newUser.created_at),
          }

          setSessionUser(user)
          return { success: true, error: null, user }
        } else {
          const errorData = await createResponse.json()
          console.error("❌ Error creando perfil:", errorData)
          return { success: false, error: errorData.error || "Could not create user", user: null }
        }
      }

      return { success: false, error: "Could not fetch user from API", user: null }
    } catch (apiError: any) {
      return { success: false, error: apiError.message, user: null }
    }
  } catch (error: any) {
    return { success: false, error: error.message, user: null }
  }
}

// Función para registro con Supabase
export async function registerWithSupabase(
  email: string,
  password: string,
  name: string
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })

    if (error) return { success: false, error: error.message, user: null }

    if (!data.user) return { success: false, error: "User creation failed", user: null }

    // Confirmar email automáticamente via API (para que el usuario pueda iniciar sesión inmediatamente)
    try {
      const confirmResponse = await fetch("/api/auth/confirm-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: data.user.id,
        }),
      })

      if (!confirmResponse.ok) {
        console.warn("⚠️ Could not auto-confirm email, but user registration continues")
      } else {
        console.log("✅ Email auto-confirmed for user:", data.user.id)
      }
    } catch (confirmError: any) {
      console.warn("⚠️ Email confirmation error:", confirmError.message)
      // No fallar el registro si la confirmación automática falla
    }

    // Crear registro en tabla users via API route NUEVO
    try {
      console.log("🔐 Registrando en tabla users:", {
        userId: data.user.id,
        email: data.user.email,
        name: name
      })
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: data.user.id,
          email: data.user.email,
          name: name,
          plan: "gratuito",
          balance: 0,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error("❌ API register error:", responseData)
        return { success: false, error: responseData.error || "Failed to create user profile", user: null }
      }

      console.log("✅ User profile created successfully")
      
      const user: User = {
        id: responseData.id,
        email: responseData.email,
        name: responseData.name || "",
        plan: responseData.plan || "gratuito",
        balance: responseData.balance || 0,
        createdAt: new Date(responseData.created_at),
      }

      setSessionUser(user)
      return { success: true, error: null, user }
    } catch (apiError: any) {
      console.error("❌ Profile creation error:", apiError.message)
      return { success: false, error: apiError.message, user: null }
    }
  } catch (error: any) {
    console.error("❌ Registration error:", error.message)
    return { success: false, error: error.message, user: null }
  }
}

// Función para logout
export async function logoutSupabase() {
  try {
    await supabase.auth.signOut()
    localStorage.removeItem("cvvinvest_user")
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Función para cerrar sesión - Limpia TODOS los datos de la sesión anterior
export function clearSession(): void {
  // Limpiar datos del usuario
  localStorage.removeItem("cvvinvest_user")
  
  // Limpiar chatbot y mensajes
  localStorage.removeItem("cvvinvest_chat_sessions")
  localStorage.removeItem("cvvinvest_user_current_session")
  localStorage.removeItem("messages")
  
  // Limpiar notificaciones
  localStorage.removeItem("notifications")
  localStorage.removeItem("user_notifications")
  localStorage.removeItem("admin_notifications")
  
  // Limpiar datos de sesión de dispositivos
  localStorage.removeItem("sessions")
  
  // Limpiar depósitos y retiros temporales
  localStorage.removeItem("deposits")
  localStorage.removeItem("withdrawals")
  
  // Limpiar inversiones temporales
  localStorage.removeItem("investments")
  
  // Limpiar otros datos de sesión
  localStorage.removeItem("balance")
  localStorage.removeItem("plan")
  localStorage.removeItem("email")
  localStorage.removeItem("name")
  localStorage.removeItem("role")
}

// Generar ID único
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// ========== SISTEMA DE CÁLCULO DE GANANCIAS PROGRESIVAS ==========

// Retorno diario por plan para generar CASI EL DOBLE en 15 días
// Consistente y claro: inversión de 15 días multiplica significativamente el capital
const DAILY_RETURNS: Record<string, number> = {
  gratuito: 3.8,      // 3.8% diario = ~80% ganancia en 15 días (~$180 por $100)
  estandar: 4.7,     // 4.7% diario = ~100% ganancia en 15 días (~$200 por $100)
  pro: 5.3,          // 5.3% diario = ~120% ganancia en 15 días (~$220 por $100)
  vip: 5.9,          // 5.9% diario = ~140% ganancia en 15 días (~$240 por $100)
  elite: 6.5,        // 6.5% diario = ~160% ganancia en 15 días (~$260 por $100)
}

// Obtener retorno diario según plan
export function getDailyReturnPercent(planName: string): number {
  const plan = planName.toLowerCase()
  return DAILY_RETURNS[plan] || 0.06
}

// Calcular ganancias actuales de una inversión
export function calculateInvestmentEarnings(investment: Investment): number {
  if (investment.status !== "aprobado") return 0
  
  const createdDate = new Date(investment.approvedAt || investment.createdAt)
  const now = new Date()
  const daysActive = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
  
  // Máximo 15 días de ganancias
  const activeDays = Math.min(daysActive, 15)
  const dailyReturn = getDailyReturnPercent(investment.planName)
  
  // Cálculo de interés compuesto diario
  const earnings = investment.amount * (Math.pow(1 + dailyReturn / 100, activeDays) - 1)
  
  return Math.max(0, earnings)
}

// Calcular ganancias proyectadas para 15 días completos
export function getProjectedEarnings(investment: Investment): number {
  const dailyReturn = getDailyReturnPercent(investment.planName)
  const projectedEarnings = investment.amount * (Math.pow(1 + dailyReturn / 100, 15) - 1)
  return projectedEarnings
}

// Obtener valor total actual (capital + ganancias)
export function getInvestmentTotalValue(investment: Investment): number {
  const earnings = calculateInvestmentEarnings(investment)
  return investment.amount + earnings
}

// Obtener progreso de días en el plan (0-100%)
export function getInvestmentProgress(investment: Investment): number {
  const createdDate = new Date(investment.approvedAt || investment.createdAt)
  const now = new Date()
  const daysActive = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
  const progress = Math.min(100, (daysActive / 15) * 100)
  return Math.max(0, progress)
}

// Obtener días restantes en el plan
export function getRemainingDays(investment: Investment): number {
  const createdDate = new Date(investment.approvedAt || investment.createdAt)
  const now = new Date()
  const daysActive = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.max(0, 15 - daysActive)
  return daysRemaining
}

// ========== FUNCIONES DE DEPÓSITOS ==========

// Crear depósito
export function createDeposit(amount: number, method: string = "PayPal"): Deposit | null {
  const user = getSessionUser()
  if (!user) return null

  const deposit: Deposit = {
    id: generateId(),
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    amount,
    status: "pendiente",
    method,
    createdAt: new Date().toISOString(),
  }

  // Obtener depósitos actuales
  const deposits = getAllDeposits()
  deposits.push(deposit)

  // Guardar en localStorage
  localStorage.setItem("cvvinvest_deposits", JSON.stringify(deposits))

  return deposit
}

// Obtener todos los depósitos desde localStorage
export function getAllDeposits(): Deposit[] {
  if (typeof window === "undefined") return []
  const depositsData = localStorage.getItem("cvvinvest_deposits")
  if (!depositsData) return []
  return JSON.parse(depositsData)
}

// Obtener todos los depósitos desde Supabase (para admin)
export async function getAllDepositsSupabase(): Promise<Deposit[]> {
  try {
    const response = await fetch('/api/deposits-admin')
    
    if (!response.ok) {
      console.error('[Supabase] API error al obtener depósitos:', response.status)
      return []
    }
    
    const result = await response.json()
    const deposits = result.data || []
    
    console.log(`[Supabase] Depósitos obtenidos: ${deposits?.length || 0}`)
    return deposits || []
  } catch (error) {
    console.error('[Supabase] Exception al obtener depósitos:', error)
    return []
  }
}

// Sincronizar un depósito a Supabase
export async function syncDepositToSupabase(deposit: Deposit): Promise<boolean> {
  try {
    console.log(`[Sync] Sincronizando depósito: ${deposit.id}`)
    
    const response = await fetch('/api/deposits/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deposit }),
    })

    if (!response.ok) {
      console.error('[Sync] Error sincronizando depósito:', response.statusText)
      return false
    }

    const result = await response.json()
    console.log('[Sync] ✅ Depósito sincronizado:', result)
    return true
  } catch (error) {
    console.error('[Sync] Exception:', error)
    return false
  }
}

// Obtener depósitos del usuario actual
export function getUserDeposits(): Deposit[] {
  const user = getSessionUser()
  if (!user) return []
  const allDeposits = getAllDeposits()
  return allDeposits.filter((d) => d.userId === user.id)
}

// Aprobar depósito
export async function approveDeposit(depositId: string, notes?: string): Promise<boolean> {
  const deposits = getAllDeposits()
  const deposit = deposits.find((d) => d.id === depositId)

  if (!deposit) return false

  deposit.status = "aprobado"
  deposit.approvedAt = new Date().toISOString()
  deposit.notes = notes

  // Actualizar balance del usuario EN SUPABASE
  try {
    const response = await fetch('/api/admin/deposits/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        depositId,
        userId: deposit.userId,
        amount: deposit.amount,
        notes,
        deposits: JSON.stringify(deposits), // Enviar datos para servidor
      }),
    })

    if (!response.ok) {
      console.error('Error al actualizar balance en Supabase:', response.statusText)
      // Continuamos igual para actualizar localStorage
    }

    const result = await response.json()
    console.log('✅ Balance actualizado en Supabase:', result)
  } catch (error) {
    console.error('Error al llamar API de aprobación:', error)
    // Continuamos con localStorage
  }

  // Actualizar balance del usuario EN LOCALSTORAGE (respaldo)
  const users = getAllUsers()
  console.log(`[approveDeposit] Buscando usuario por ID: ${deposit.userId} o email: ${deposit.userEmail}`)
  const user = users.find((u) => u.id === deposit.userId || u.email === deposit.userEmail)
  
  if (user) {
    console.log(`[approveDeposit] Usuario encontrado: ${user.email}`)
    user.balance += deposit.amount
    localStorage.setItem("cvvinvest_users", JSON.stringify(users))
    console.log(`[approveDeposit] Balance actualizado a: ${user.balance}`)

    // Actualizar la sesión del usuario si está logueado
    const sessionUser = getSessionUser()
    if (sessionUser && (sessionUser.id === user.id || sessionUser.email === user.email)) {
      console.log(`[approveDeposit] Actualizando sesión del usuario`)
      setSessionUser(user)
    }
  } else {
    console.error(`[approveDeposit] Usuario no encontrado`)
  }

  localStorage.setItem("cvvinvest_deposits", JSON.stringify(deposits))
  return true
}

// Rechazar depósito
export function rejectDeposit(depositId: string, notes?: string): boolean {
  const deposits = getAllDeposits()
  const deposit = deposits.find((d) => d.id === depositId)

  if (!deposit) return false

  deposit.status = "rechazado"
  deposit.notes = notes

  localStorage.setItem("cvvinvest_deposits", JSON.stringify(deposits))
  return true
}

// Obtener todos los usuarios (para admin)
// Obtener todos los usuarios (intentar Supabase primero, luego localStorage)
export async function getAllUsersWithFallback(): Promise<User[]> {
  // Primero intentar desde Supabase
  const supabaseUsers = await getAllUsersSupabase()
  if (supabaseUsers.length > 0) {
    console.log(`[getAllUsersWithFallback] ${supabaseUsers.length} usuarios desde Supabase`)
    return supabaseUsers
  }
  
  // Si no hay en Supabase, usar localStorage como fallback
  const localUsers = getAllUsers()
  if (localUsers.length > 0) {
    console.log(`[getAllUsersWithFallback] ${localUsers.length} usuarios desde localStorage (fallback)`)
    return localUsers
  }
  
  return []
}

export function getAllUsers(): User[] {
  // ⚠️ DEPRECATED: Esta función ahora lee de Supabase automáticamente
  // Se mantiene por compatibilidad, pero siempre usa Supabase como fuente
  if (typeof window === "undefined") return []
  
  // Intentar leer de localStorage como fallback, pero preferir Supabase
  const usersData = localStorage.getItem("cvvinvest_users")
  if (!usersData) {
    console.warn(`[getAllUsers] No hay usuarios en localStorage, usando Supabase`)
    return []
  }
  const users = JSON.parse(usersData)
  console.log(`[getAllUsers] ⚠️ Usando localStorage (fallback). Prefiere getAllUsersSupabase()`)
  return users
}

// Guardar todos los usuarios (DEPRECATED - usa updateUserProfile en su lugar)
export function setAllUsers(users: User[]): void {
  // Solo guardar en localStorage como cache, Supabase es la fuente de verdad
  localStorage.setItem("cvvinvest_users", JSON.stringify(users))
  console.log(`[setAllUsers] Datos cacheados en localStorage. Usa updateUserProfile para actualizar Supabase.`)
}

// ========== FUNCIONES DE RETIROS ==========

export interface Withdrawal {
  id: string
  userId: string
  userEmail: string
  userName: string
  amount: number
  status: DepositStatus
  method: string
  accountDetails?: string
  createdAt: string
  approvedAt?: string
  notes?: string
}

// Crear retiro
export function createWithdrawal(amount: number, method: string, accountDetails?: string): Withdrawal | null {
  const user = getSessionUser()
  if (!user) return null

  // Validar que tenga suficiente balance
  if (user.balance < amount) return null

  const withdrawal: Withdrawal = {
    id: generateId(),
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    amount,
    status: "pendiente",
    method,
    accountDetails,
    createdAt: new Date().toISOString(),
  }

  const withdrawals = getAllWithdrawals()
  withdrawals.push(withdrawal)
  localStorage.setItem("cvvinvest_withdrawals", JSON.stringify(withdrawals))

  return withdrawal
}

// Obtener todos los retiros
export function getAllWithdrawals(): Withdrawal[] {
  if (typeof window === "undefined") return []
  const withdrawalsData = localStorage.getItem("cvvinvest_withdrawals")
  if (!withdrawalsData) return []
  return JSON.parse(withdrawalsData)
}

// Obtener retiros del usuario actual
export function getUserWithdrawals(): Withdrawal[] {
  const user = getSessionUser()
  if (!user) return []
  const allWithdrawals = getAllWithdrawals()
  return allWithdrawals.filter((w) => w.userId === user.id)
}

// Aprobar retiro
export function approveWithdrawal(withdrawalId: string, notes?: string): boolean {
  const withdrawals = getAllWithdrawals()
  const withdrawal = withdrawals.find((w) => w.id === withdrawalId)

  if (!withdrawal) return false

  withdrawal.status = "aprobado"
  withdrawal.approvedAt = new Date().toISOString()
  withdrawal.notes = notes

  // Restar del balance del usuario
  const users = getAllUsers()
  const user = users.find((u) => u.id === withdrawal.userId)
  if (user) {
    user.balance -= withdrawal.amount
    localStorage.setItem("cvvinvest_users", JSON.stringify(users))

    // NO actualizar la sesión del admin - solo actualizar si es el usuario normal el que está logueado
    const sessionUser = getSessionUser()
    if (sessionUser && sessionUser.id === user.id && sessionUser.email !== ADMIN_EMAIL) {
      setSessionUser(user)
    }
  }

  localStorage.setItem("cvvinvest_withdrawals", JSON.stringify(withdrawals))
  return true
}

// Rechazar retiro
export function rejectWithdrawal(withdrawalId: string, notes?: string): boolean {
  const withdrawals = getAllWithdrawals()
  const withdrawal = withdrawals.find((w) => w.id === withdrawalId)

  if (!withdrawal) return false

  withdrawal.status = "rechazado"
  withdrawal.notes = notes

  localStorage.setItem("cvvinvest_withdrawals", JSON.stringify(withdrawals))
  return true
}

// ========== FUNCIONES DE INVERSIONES ==========

export interface Investment {
  id: string
  userId: string
  userEmail: string
  userName: string
  planName: string
  amount: number
  minAmount: number
  maxAmount: number
  status: DepositStatus
  createdAt: string
  approvedAt?: string
  notes?: string
  daysActive?: number
  dailyReturnPercent?: number
  currentEarnings?: number
  projectedEarnings?: number
}

// Crear inversión
export function createInvestment(
  planName: string,
  amount: number,
  minAmount: number,
  maxAmount: number
): Investment | null {
  const user = getSessionUser()
  if (!user) return null

  // Validar que esté dentro del rango
  if (amount < minAmount || amount > maxAmount) return null

  // Validar que tenga suficiente balance
  if (user.balance < amount) return null

  const dailyReturn = getDailyReturnPercent(planName)
  const projectedEarnings = amount * (Math.pow(1 + dailyReturn / 100, 15) - 1)

  const investment: Investment = {
    id: generateId(),
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    planName,
    amount,
    minAmount,
    maxAmount,
    status: "pendiente",
    createdAt: new Date().toISOString(),
    daysActive: 0,
    dailyReturnPercent: dailyReturn,
    currentEarnings: 0,
    projectedEarnings: projectedEarnings,
  }

  const investments = getAllInvestments()
  investments.push(investment)
  localStorage.setItem("cvvinvest_investments", JSON.stringify(investments))

  return investment
}

// Obtener todos las inversiones
export function getAllInvestments(): Investment[] {
  if (typeof window === "undefined") return []
  const investmentsData = localStorage.getItem("cvvinvest_investments")
  if (!investmentsData) return []
  return JSON.parse(investmentsData)
}

// Obtener inversiones del usuario actual
export function getUserInvestments(): Investment[] {
  const user = getSessionUser()
  if (!user) return []
  const allInvestments = getAllInvestments()
  return allInvestments.filter((i) => i.userId === user.id)
}

// Aprobar inversión
export function approveInvestment(investmentId: string, notes?: string): boolean {
  console.log(`[approveInvestment] Usando versión localStorage (fallback)`)
  
  const investments = getAllInvestments()
  const investment = investments.find((i) => i.id === investmentId)

  if (!investment) {
    console.error(`[approveInvestment] Inversión no encontrada: ${investmentId}`)
    return false
  }

  console.log(`[approveInvestment] Inversión encontrada:`, investment)
  
  investment.status = "aprobado"
  investment.approvedAt = new Date().toISOString()
  investment.notes = notes

  // Restar del balance del usuario
  const users = getAllUsers()
  console.log(`[approveInvestment] Buscando usuario por ID: ${investment.userId} o email: ${investment.userEmail}`)
  
  const user = users.find((u) => u.id === investment.userId || u.email === investment.userEmail)
  
  if (!user) {
    console.error(`[approveInvestment] Usuario no encontrado para inversión`)
    localStorage.setItem("cvvinvest_investments", JSON.stringify(investments))
    return false
  }

  console.log(`[approveInvestment] Usuario encontrado:`, user.email, user.plan)
  
  user.balance -= investment.amount
  
  // Actualizar plan del usuario al plan de la inversión
  const normalizePlanName = (name: string): User["plan"] => {
    const normalized = name
      .toLowerCase()
      .replace(/á/g, "a")
      .replace(/é/g, "e")
      .replace(/í/g, "i")
      .replace(/ó/g, "o")
      .replace(/ú/g, "u")
      .trim()
    
    const planMap: Record<string, User["plan"]> = {
      gratuito: "gratuito",
      estandar: "estandar",
      pro: "pro",
      vip: "vip",
      elite: "elite",
    }
    
    return planMap[normalized] || user.plan
  }
  
  const newPlan = normalizePlanName(investment.planName)
  console.log(`[approveInvestment] Plan actualizado de ${user.plan} a ${newPlan}`)
  user.plan = newPlan
  
  localStorage.setItem("cvvinvest_users", JSON.stringify(users))
  console.log(`[approveInvestment] Usuarios guardados en localStorage`)

  // Actualizar la sesión del usuario si está logueado
  const sessionUser = getSessionUser()
  console.log(`[approveInvestment] Session user:`, sessionUser?.email)
  
  if (sessionUser && (sessionUser.id === user.id || sessionUser.email === user.email)) {
    console.log(`[approveInvestment] Actualizando sesión del usuario`)
    setSessionUser(user)
  } else {
    console.log(`[approveInvestment] No se actualiza sesión - session user no coincide o no existe`)
  }

  localStorage.setItem("cvvinvest_investments", JSON.stringify(investments))
  console.log(`[approveInvestment] Inversión aprobada exitosamente`)
  return true
}

// Rechazar inversión
export function rejectInvestment(investmentId: string, notes?: string): boolean {
  const investments = getAllInvestments()
  const investment = investments.find((i) => i.id === investmentId)

  if (!investment) return false

  investment.status = "rechazado"
  investment.notes = notes

  localStorage.setItem("cvvinvest_investments", JSON.stringify(investments))
  return true
}

// ==================== 2FA (Autenticación de Dos Factores) ====================

export interface TwoFactorSecret {
  userId: string
  secret: string
  enabled: boolean
  backupCodes: string[]
  createdAt: string
}

// Base32 encoding para TOTP
function base32Encode(buffer: Uint8Array): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = 0
  let value = 0
  let output = ''

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i]
    bits += 8

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31]
  }

  return output
}

// Generar secreto aleatorio
function generateRandomSecret(length: number = 32): string {
  const buffer = new Uint8Array(length)
  crypto.getRandomValues(buffer)
  return base32Encode(buffer)
}

// Generar secreto TOTP para Google Authenticator
export function generateTwoFactorSecret(userId: string): { secret: string; qrCode: string } {
  const secret = generateRandomSecret(32)
  const userEmail = getSessionUser()?.email || 'user@cvvinvest.com'

  // Generar códigos de respaldo (10 códigos)
  const backupCodes = Array.from({ length: 10 }, () =>
    Array.from(crypto.getRandomValues(new Uint8Array(4)))
      .map(x => x.toString(16).padStart(2, '0'))
      .join('-')
      .toUpperCase()
  )

  // OTPAuth URL para escanear
  const otpauthUrl = `otpauth://totp/CVVINVEST:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=CVVINVEST&algorithm=SHA1&digits=6&period=30`

  // Guardar en localStorage
  const twoFactorData: TwoFactorSecret = {
    userId,
    secret,
    enabled: false,
    backupCodes,
    createdAt: new Date().toISOString()
  }

  localStorage.setItem(`cvvinvest_2fa_${userId}`, JSON.stringify(twoFactorData))

  return {
    secret,
    qrCode: otpauthUrl
  }
}

// Generar código QR como URL usando service externo
export async function generateQRCode(secret: string): Promise<string> {
  try {
    // Usar servicio externo para generar QR
    const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(secret)}`)
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch {
    // Si falla, retornar la URL otpauth directamente como texto
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(secret)}`
  }
}

// Base32 Decode
function base32Decode(encoded: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = 0
  let value = 0
  const output: number[] = []

  for (let i = 0; i < encoded.length; i++) {
    const index = alphabet.indexOf(encoded[i].toUpperCase())
    if (index < 0) throw new Error(`Invalid base32 character: ${encoded[i]}`)
    
    value = (value << 5) | index
    bits += 5

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }

  return new Uint8Array(output)
}

// HMAC-SHA1 para verificación TOTP usando Web Crypto API
async function hmacSha1(key: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
  const keyBuffer = key.buffer.slice(key.byteOffset, key.byteOffset + key.byteLength) as ArrayBuffer
  const messageBuffer = message.buffer.slice(message.byteOffset, message.byteOffset + message.byteLength) as ArrayBuffer
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    messageBuffer
  )
  return new Uint8Array(signature)
}

// Calcular TOTP 
async function calculateTOTP(secret: string, timestamp?: number): Promise<string> {
  try {
    let time = Math.floor((timestamp || Date.now()) / 1000 / 30)
    const timeBytes = new Uint8Array(8)
    
    for (let i = 7; i >= 0; i--) {
      timeBytes[i] = time & 0xff
      time = time >> 8
    }

    const secretBytes = base32Decode(secret)
    const hmac = await hmacSha1(secretBytes, timeBytes)
    
    const offset = hmac[hmac.length - 1] & 0x0f
    const p = (
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)
    )

    return ((p % 1000000) + '').padStart(6, '0')
  } catch {
    return '000000'
  }
}

// Verificar código TOTP
export async function verifyTwoFactorCode(userId: string, code: string): Promise<boolean> {
  const twoFactorData = localStorage.getItem(`cvvinvest_2fa_${userId}`)
  
  if (!twoFactorData) return false

  try {
    const { secret, enabled } = JSON.parse(twoFactorData)

    if (!enabled) return false

    // Verificar código con ventana de 1 minuto (+-30 segundos)
    const now = Date.now()
    for (let i = -1; i <= 1; i++) {
      const testTime = now + (i * 30 * 1000)
      const expectedCode = await calculateTOTP(secret, testTime)
      if (code === expectedCode) {
        return true
      }
    }

    return false
  } catch {
    return false
  }
}

// Habilitar 2FA
export function enableTwoFactor(userId: string): boolean {
  const twoFactorData = localStorage.getItem(`cvvinvest_2fa_${userId}`)
  
  if (!twoFactorData) return false

  const data: TwoFactorSecret = JSON.parse(twoFactorData)
  data.enabled = true

  localStorage.setItem(`cvvinvest_2fa_${userId}`, JSON.stringify(data))
  return true
}

// Desabilitar 2FA
export function disableTwoFactor(userId: string): boolean {
  const twoFactorData = localStorage.getItem(`cvvinvest_2fa_${userId}`)
  
  if (!twoFactorData) return false

  const data: TwoFactorSecret = JSON.parse(twoFactorData)
  data.enabled = false

  localStorage.setItem(`cvvinvest_2fa_${userId}`, JSON.stringify(data))
  return true
}

// Obtener estado 2FA
export function getTwoFactorStatus(userId: string): TwoFactorSecret | null {
  const twoFactorData = localStorage.getItem(`cvvinvest_2fa_${userId}`)
  
  if (!twoFactorData) return null
  
  return JSON.parse(twoFactorData)
}

// Obtener códigos de respaldo
export function getBackupCodes(userId: string): string[] {
  const twoFactorData = localStorage.getItem(`cvvinvest_2fa_${userId}`)
  
  if (!twoFactorData) return []

  const { backupCodes } = JSON.parse(twoFactorData)
  return backupCodes
}

// Usar código de respaldo (consume el código)
export function useBackupCode(userId: string, code: string): boolean {
  const twoFactorData = localStorage.getItem(`cvvinvest_2fa_${userId}`)
  
  if (!twoFactorData) return false

  const data: TwoFactorSecret = JSON.parse(twoFactorData)
  const index = data.backupCodes.indexOf(code.toUpperCase())

  if (index === -1) return false

  // Remover el código usado
  data.backupCodes.splice(index, 1)
  localStorage.setItem(`cvvinvest_2fa_${userId}`, JSON.stringify(data))

  return true
}

// ========== FUNCIÓN DE RESET COMPLETO ==========

// Resetear todos los datos del sistema
export function resetAllData(): void {
  if (typeof window === "undefined") return
  
  // Limpiar datos de usuarios
  localStorage.removeItem("cvvinvest_users")
  localStorage.removeItem("cvvinvest_passwords")
  
  // Limpiar sesión
  localStorage.removeItem("cvvinvest_user")
  
  // Limpiar estadísticas y datos del dashboard
  localStorage.removeItem("user_statistics")
  localStorage.removeItem("user_stats")
  localStorage.removeItem("dashboard_data")
  localStorage.removeItem("inversiones_data")
  localStorage.removeItem("carteira")
  localStorage.removeItem("portfolio")
  
  // Limpiar datos de depósitos
  localStorage.removeItem("cvvinvest_deposits")
  localStorage.removeItem("depositos")
  localStorage.removeItem("depositos_history")
  
  // Limpiar datos de retiros
  localStorage.removeItem("retiros")
  localStorage.removeItem("retiros_history")
  
  // Limpiar datos de notificaciones
  localStorage.removeItem("notifications")
  localStorage.removeItem("notificaciones")
  
  // Limpiar datos de mensajes
  localStorage.removeItem("messages")
  localStorage.removeItem("mensajes")
  
  // Limpiar datos de 2FA
  localStorage.removeItem("admin_2fa_enabled")
  localStorage.removeItem("admin_2fa_pin")
  
  // Limpiar datos de admin
  localStorage.removeItem("admin_config")
  localStorage.removeItem("admin_maintenance")
  
  console.log("✅ Sistema reseteado completamente")
}
// ========== FUNCIONES DE SEGURIDAD - CONTRASEÑA ==========

// Validar contraseña
export function validatePassword(email: string, password: string): boolean {
  const passwordsData = localStorage.getItem("cvvinvest_passwords")
  if (!passwordsData) return false
  
  const passwords: Record<string, string> = JSON.parse(passwordsData)
  return passwords[email] === password
}

// Actualizar contraseña
export function updateUserPassword(email: string, newPassword: string): void {
  const passwordsData = localStorage.getItem("cvvinvest_passwords")
  if (!passwordsData) {
    localStorage.setItem("cvvinvest_passwords", JSON.stringify({ [email]: newPassword }))
    return
  }
  
  const passwords: Record<string, string> = JSON.parse(passwordsData)
  passwords[email] = newPassword
  localStorage.setItem("cvvinvest_passwords", JSON.stringify(passwords))
  
  // Actualizar sesión del usuario actual si es el mismo
  const currentUser = getSessionUser()
  if (currentUser && currentUser.email === email) {
    setSessionUser(currentUser) // Refrescar sesión
  }
}

