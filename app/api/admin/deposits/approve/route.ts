import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { depositId, notes } = body

    if (!depositId) {
      return NextResponse.json(
        { error: 'depositId es requerido' },
        { status: 400 }
      )
    }

    // Obtener el depósito del localStorage (para obtener datos del usuario)
    // Nota: En una arquitectura real, los depósitos estarían en la DB también
    if (typeof window === 'undefined') {
      // En servidor, leer de localStorage enviado por cliente
      const deposits = JSON.parse(body.deposits || '[]')
      const deposit = deposits.find((d: any) => d.id === depositId)

      if (!deposit) {
        return NextResponse.json(
          { error: 'Depósito no encontrado' },
          { status: 404 }
        )
      }

      // Actualizar el balance del usuario en Supabase
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, balance')
        .eq('id', deposit.userId)
        .single()

      if (userError) {
        console.error('Error al obtener usuario:', userError)
        return NextResponse.json(
          { error: 'No se pudo obtener los datos del usuario' },
          { status: 500 }
        )
      }

      // Calcular nuevo balance
      const newBalance = (userData.balance || 0) + deposit.amount

      // Actualizar balance en Supabase
      const { error: updateError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', deposit.userId)

      if (updateError) {
        console.error('Error al actualizar balance:', updateError)
        return NextResponse.json(
          { error: 'No se pudo actualizar el balance' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Depósito aprobado y balance actualizado',
        newBalance
      })
    }

    // Fallback: solo retornar éxito
    return NextResponse.json({
      success: true,
      message: 'Depósito aprobado'
    })
  } catch (error: any) {
    console.error('Error en /api/admin/deposits/approve:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
