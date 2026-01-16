import mongoose, { Schema, Document } from 'mongoose'

export interface IDeposit extends Document {
  userId: mongoose.Types.ObjectId
  userEmail: string
  userName: string
  amount: number
  status: 'pendiente' | 'aprobado' | 'rechazado'
  method: string
  createdAt: Date
  approvedAt?: Date
  notes?: string
}

const depositSchema = new Schema<IDeposit>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pendiente', 'aprobado', 'rechazado'],
      default: 'pendiente',
    },
    method: {
      type: String,
      default: 'paypal',
    },
    approvedAt: {
      type: Date,
      optional: true,
    },
    notes: {
      type: String,
      optional: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Deposit = mongoose.models.Deposit || mongoose.model<IDeposit>('Deposit', depositSchema)
