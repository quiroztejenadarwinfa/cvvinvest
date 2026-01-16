import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const users = await User.find({})
      .select('-password -twoFactorPin')
      .limit(10)
    
    return NextResponse.json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Error obteniendo usuarios' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { email, name, password, plan } = await request.json()
    
    // Validar que no exista
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email ya registrado' },
        { status: 409 }
      )
    }
    
    // TODO: Hash password antes de guardar
    const user = new User({
      email,
      name,
      password,
      plan: plan || 'gratuito',
      balance: 0,
    })
    
    await user.save()
    
    return NextResponse.json(
      {
        success: true,
        message: 'Usuario creado',
        data: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Error creando usuario' },
      { status: 500 }
    )
  }
}
