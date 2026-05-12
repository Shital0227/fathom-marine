'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/shared/Sidebar'
import { Navbar } from '@/components/shared/Navbar'
import { LayoutContent } from '@/components/shared/LayoutContent'
import { isAuthenticated } from '@/lib/auth'
import { UserProvider } from '@/contexts/userContext'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/auth/login')
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) return null

  return (
    <UserProvider>
      <Sidebar />
      <Navbar />
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  )
}