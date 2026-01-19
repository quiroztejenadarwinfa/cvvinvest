import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { depositId, userId, amount, notes, deposits } = body

    if (!depositId || !userId || !amount) {
      return NextResponse.json(
        { error: 'depositId, userId, y amount son requeridos' },
        { status: 400 }
      )
    }

    console.log(`[Aprobando depósito] depositId: ${depositId}, userId: ${userId}, amount: $${amount}`)

    // Obtener usuario actual desde Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, balance')
      .eq('id', userId)
      .single()

    if (userError) {
      console.error('❌ Error al obtener usuario:', userError)
      return NextResponse.json(
        { error: 'No se pudo obtener los datos del usuario' },
        { status: 500 }
      )
    }

    if (!userData) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Calcular nuevo balance
    const currentBalance = userData.balance || 0
    const newBalance = currentBalance + amount

    console.log(`[Actualizando balance] ${userId}: $${currentBalance} + $${amount} = $${newBalance}`)

    // Actualizar balance en Supabase
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Error al actualizar balance:', updateError)
      return NextResponse.json(
        { error: 'No se pudo actualizar el balance', details: updateError.message },
        { status: 500 }
      )
    }

    console.log(`✅ Balance actualizado exitosamente. Nuevo balance: $${newBalance}`)

    return NextResponse.json({
      success: true,
      message: 'Depósito aprobado y balance actualizado',
      oldBalance: currentBalance,
      newBalance: newBalance,
      user: updateData
    })
  } catch (error: any) {
    console.error('❌ Error en /api/admin/deposits/approve:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

