'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { getStoredUser, type User } from '@/lib/auth'

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  initials: string
  isLoading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  initials: '',
  isLoading: true
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true
    const stored = getStoredUser()
    setUser(stored)
    setIsLoading(false)
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : ''

  return (
    <UserContext.Provider value={{ user, setUser, initials, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)