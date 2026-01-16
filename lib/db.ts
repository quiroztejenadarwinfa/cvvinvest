import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  if (isConnected) {
    console.log('✅ Ya conectado a MongoDB')
    return
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('❌ MONGODB_URI no está definido en variables de entorno')
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    isConnected = true
    console.log('✅ MongoDB conectado exitosamente')
    return conn
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error)
    isConnected = false
    throw error
  }
}

export async function disconnectDB() {
  if (!isConnected) {
    console.log('ℹ️ No hay conexión activa')
    return
  }

  try {
    await mongoose.disconnect()
    isConnected = false
    console.log('✅ MongoDB desconectado')
  } catch (error) {
    console.error('❌ Error desconectando MongoDB:', error)
    throw error
  }
}

export function getConnection() {
  if (!isConnected) {
    throw new Error('MongoDB no está conectado. Llama connectDB() primero.')
  }
  return mongoose.connection
}
