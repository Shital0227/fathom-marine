import { z } from 'zod'

export const createDrillSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title too long'),

  drillType: z.enum(
    ['fire', 'evacuation', 'man_overboard', 'abandon_ship', 'medical'],
    { error: 'Invalid drill type' }
  ),

  shipId: z
    .string()
    .uuid('Invalid ship ID'),

  scheduledDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/,
      'Date must be ISO format e.g 2024-05-20T10:00'
    )
})

export const markAttendanceSchema = z.object({
  attended: z.boolean()
})

export const updateDrillStatusSchema = z.object({
  status: z.enum(['scheduled', 'completed', 'missed'], {
    error: 'Status must be scheduled, completed or missed'
  })
})