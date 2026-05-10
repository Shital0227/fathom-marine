import { Response } from 'express'

export const sendSuccess = (
  res: Response,
  data: any,
  statusCode: number = 200,
  meta?: Record<string, any>  // for pagination later
) => {
  const response: Record<string, any> = {
    success: true,
    data
  }

  if (meta) response.meta = meta

  return res.status(statusCode).json(response)
}

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400
) => {
  return res.status(statusCode).json({
    success: false,
    error: message
  })
}