'use client'

import { useEffect, useState } from 'react'
import { ChatWidget } from '@/components/chatbot/chat-widget'
import { getSessionUser, ADMIN_EMAIL } from '@/lib/auth'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const currentUser = getSessionUser()
    setUser(currentUser)
    setIsAdmin(currentUser?.email === ADMIN_EMAIL)
  }, [])

  if (!mounted) return <>{children}</>

  return (
    <>
      {children}
      {user && !isAdmin && <ChatWidget userId={user.id} userName={user.name} userEmail={user.email} isAdmin={isAdmin} />}
    </>
  )
}
