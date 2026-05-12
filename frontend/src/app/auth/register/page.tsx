'use client'

import { useState } from 'react'
import { Anchor, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { storeAuth } from '@/lib/auth'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/auth/register', {
        name: fullName,
        email,
        password,
        role
      })

      const loginResponse = await api.post('/auth/login', { email, password })
      const { user, token } = loginResponse.data.data
      storeAuth(user, token)
      toast.success('Account created successfully')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong')
      toast.error(err.response?.data?.error || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Anchor className="w-12 h-12 text-[#3b82f6]" />
          </div>
          <h1 className="text-4xl font-bold text-[#f1f5f9]">Fathom Marine</h1>
          <p className="text-[#94a3b8]">Maritime Operations System</p>
        </div>

        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold text-[#f1f5f9]">Create Account</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Davis"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-4 py-3 text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-4 py-3 text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-4 py-3 text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#f1f5f9] transition"
                >
                  {showPassword
                    ? <EyeOff className="w-5 h-5" />
                    : <Eye className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                Role
              </label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-[#0a0f1e] border border-[#1e2d4a] text-[#f1f5f9]">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1729] border border-[#1e2d4a]">
                  <SelectItem value="admin" className="text-[#f1f5f9]">Admin</SelectItem>
                  <SelectItem value="crew" className="text-[#f1f5f9]">Crew</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading || !role}
              className="w-full bg-[#3b82f6] hover:bg-[#1e3a8a] text-white font-medium py-3 rounded-lg transition"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-[#94a3b8]">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-[#3b82f6] hover:text-[#60a5fa] font-medium transition"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}