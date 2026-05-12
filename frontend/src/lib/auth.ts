export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'crew'
  created_at: string
}

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export const storeAuth = (user: User, token: string) => {
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('token', token)
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
}

export const clearAuth = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
    document.cookie = 'token=; path=/; max-age=0; SameSite=Lax'

}

export const isAuthenticated = (): boolean => {
  return !!getStoredToken()
}

export function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}