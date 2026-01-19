import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/user/refresh
 * Obtiene los datos actualizados del usuario desde Supabase
 * Parámetros: userId (requerido)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    // Obtener usuario desde Supabase con datos actualizados
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error al obtener usuario:', error)
      return NextResponse.json(
        { error: 'No se pudo obtener los datos del usuario' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      user: data,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Error en /api/user/refresh:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
