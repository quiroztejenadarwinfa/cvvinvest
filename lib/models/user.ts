import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  name: string
  password: string
  plan: 'gratuito' | 'estandar' | 'pro' | 'vip' | 'elite'
  balance: number
  twoFactorEnabled: boolean
  twoFactorPin?: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // No incluir por defecto en queries
    },
    plan: {
      type: String,
      enum: ['gratuito', 'estandar', 'pro', 'vip', 'elite'],
      default: 'gratuito',
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorPin: {
      type: String,
      select: false, // No incluir por defecto
    },
  },
  {
    timestamps: true,
  }
)

// Prevenir crear múltiples modelos
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
