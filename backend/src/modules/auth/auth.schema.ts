import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .trim(),

  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long'),

  role: z.enum(['admin', 'crew'], {
    error: 'Role must be admin or crew'
  })
})

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, 'Password is required')
})