import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../utils/errors'

export interface AuthRequest extends Request {
  user?: { userId: string; role: string }
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      throw new AppError('Unauthorized', 401)
    }

    const token = header.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      role: string
    }

    req.user = payload
    next()
  } catch (err) {
    next(new AppError('Invalid or expired token', 401))
  }
}