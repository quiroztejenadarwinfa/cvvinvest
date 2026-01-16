import mongoose, { Schema, Document } from 'mongoose'

export interface IChatMessage {
  id: string
  message: string
  sender: 'user' | 'admin'
  timestamp: Date
  read: boolean
}

export interface IChatSession extends Document {
  userId: mongoose.Types.ObjectId
  userName: string
  userEmail: string
  messages: IChatMessage[]
  status: 'open' | 'pending' | 'resolved'
  archived: boolean
  createdAt: Date
  updatedAt: Date
}

const chatSessionSchema = new Schema<IChatSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    messages: [
      {
        id: String,
        message: String,
        sender: {
          type: String,
          enum: ['user', 'admin'],
          default: 'user',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
    status: {
      type: String,
      enum: ['open', 'pending', 'resolved'],
      default: 'open',
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export const ChatSession = 
  mongoose.models.ChatSession || 
  mongoose.model<IChatSession>('ChatSession', chatSessionSchema)
