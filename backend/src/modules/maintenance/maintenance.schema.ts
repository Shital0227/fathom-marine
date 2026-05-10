import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title too long'),

  description: z
    .string()
    .max(1000, 'Description too long')
    .optional(),

  shipId: z
    .string()
    .uuid('Invalid ship ID'),

  assignedTo: z
    .string()
    .uuid('Invalid user ID')
    .optional(),

  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format')
})

export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed'], {
    error: 'Status must be pending, in_progress or completed'
  })
})

export const addCommentSchema = z.object({
  comment: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment too long')
})