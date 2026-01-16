'use client'

import { Suspense } from 'react'
import TransferenciaContent from './transferencia-content.tsx'

export default function TransferenciaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <TransferenciaContent />
    </Suspense>
  )
}

