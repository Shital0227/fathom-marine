import { Response } from 'express'
import { registerUser, loginUser, getUserById } from './auth.service'
import { sendSuccess } from '../../utils/response'
import { AuthRequest } from '../../middleware/auth.middleware'
import { asyncHandler } from '../../utils/asyncHandler'

export const register = asyncHandler(async (req, res: Response) => {
  const { name, email, password, role } = req.body
  const user = await registerUser(name, email, password, role)
  sendSuccess(res, { user }, 201)
})

export const login = asyncHandler(async (req, res: Response) => {
  const { email, password } = req.body
  const data = await loginUser(email, password)
  sendSuccess(res, data)
})

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await getUserById(req.user!.userId)
  sendSuccess(res, { user })
})