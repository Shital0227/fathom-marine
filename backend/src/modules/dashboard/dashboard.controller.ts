import { Response } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { AuthRequest } from '../../middleware/auth.middleware'
import { sendSuccess } from '../../utils/response'
import { getDashboardStats } from './dashboard.service'

export const getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await getDashboardStats()
  sendSuccess(res, { stats })
})