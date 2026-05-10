

'use client';

import { useState } from 'react';
import { Anchor, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Anchor className="w-12 h-12 text-[#3b82f6]" />
          </div>
          <h1 className="text-4xl font-bold text-[#f1f5f9]">Fathom Marine</h1>
          <p className="text-[#94a3b8]">Maritime Operations System</p>
        </div>

        {/* Card */}
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#f1f5f9]">Create Account</h2>
          </div>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[#94a3b8] mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Davis"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-4 py-3 text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#94a3b8] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-4 py-3 text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#94a3b8] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-4 py-3 text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#f1f5f9] transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Role Select */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-[#94a3b8] mb-2">
                Role
              </label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-[#0a0f1e] border border-[#1e2d4a] text-[#f1f5f9]">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1729] border border-[#1e2d4a]">
                  <SelectItem value="admin" className="text-[#f1f5f9]">
                    Admin
                  </SelectItem>
                  <SelectItem value="crew" className="text-[#f1f5f9]">
                    Crew
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Create Account Button */}
            <Button
              type="submit"
              className="w-full bg-[#3b82f6] hover:bg-[#1e3a8a] text-white font-medium py-3 rounded-lg transition"
            >
              Create Account
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-[#94a3b8]">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#3b82f6] hover:text-[#60a5fa] font-medium transition">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
