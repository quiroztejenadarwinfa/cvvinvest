import { connectDB } from '@/lib/db'
import { ChatSession } from '@/lib/models/chat-session'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const searchParams = request.nextUrl.searchParams
    const archived = searchParams.get('archived') === 'true'
    const status = searchParams.get('status')
    
    let query: any = { archived }
    if (status) query.status = status
    
    const sessions = await ChatSession.find(query)
      .sort({ updatedAt: -1 })
      .limit(50)
    
    return NextResponse.json({
      success: true,
      count: sessions.length,
      data: sessions,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Error obteniendo chats' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { userId, userName, userEmail } = await request.json()
    
    // Buscar sesión existente
    let session = await ChatSession.findOne({ userId })
    
    if (!session) {
      session = new ChatSession({
        userId,
        userName,
        userEmail,
        messages: [],
        status: 'open',
        archived: false,
      })
      await session.save()
    }
    
    return NextResponse.json({
      success: true,
      data: session,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Error creando sesión de chat' },
      { status: 500 }
    )
  }
}
