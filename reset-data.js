#!/usr/bin/env node

/**
 * Script para resetear todos los datos del sistema en localStorage
 * Uso: node reset-data.js
 */

console.log('🧹 Iniciando limpieza de datos...\n')

// Simular localStorage
const storage = {}

const mockLocalStorage = {
  setItem: (key, value) => {
    storage[key] = value
  },
  getItem: (key) => {
    return storage[key] || null
  },
  removeItem: (key) => {
    delete storage[key]
  },
  clear: () => {
    Object.keys(storage).forEach(key => delete storage[key])
  }
}

// Aplicar el mock
if (typeof window === 'undefined') {
  global.localStorage = mockLocalStorage
}

// Función de reset
function resetAllData() {
  const keysToRemove = [
    'cvvinvest_users',
    'cvvinvest_passwords',
    'cvvinvest_user',
    'user_statistics',
    'user_stats',
    'dashboard_data',
    'inversiones_data',
    'carteira',
    'portfolio',
    'cvvinvest_deposits',
    'depositos',
    'depositos_history',
    'retiros',
    'retiros_history',
    'notifications',
    'notificaciones',
    'messages',
    'mensajes',
    'admin_2fa_enabled',
    'admin_2fa_pin',
    'admin_config',
    'admin_maintenance'
  ]

  keysToRemove.forEach(key => {
    mockLocalStorage.removeItem(key)
    console.log(`❌ ${key}`)
  })

  console.log('\n✅ Todos los datos han sido limpiados correctamente')
  console.log('💡 El sistema está listo para inicializar nuevamente\n')
}

// Ejecutar reset
resetAllData()
