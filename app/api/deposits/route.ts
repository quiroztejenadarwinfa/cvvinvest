import { connectDB } from '@/lib/db'
import { Deposit } from '@/lib/models/deposit'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')
    
    let query: any = {}
    if (status) query.status = status
    if (userId) query.userId = userId
    
    const deposits = await Deposit.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
    
    return NextResponse.json({
      success: true,
      count: deposits.length,
      data: deposits,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Error obteniendo depósitos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { userId, userEmail, userName, amount, method } = await request.json()
    
    const deposit = new Deposit({
      userId,
      userEmail,
      userName,
      amount,
      method: method || 'paypal',
      status: 'pendiente',
    })
    
    await deposit.save()
    
    return NextResponse.json(
      {
        success: true,
        message: 'Depósito registrado',
        data: deposit,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Error registrando depósito' },
      { status: 500 }
    )
  }
}
