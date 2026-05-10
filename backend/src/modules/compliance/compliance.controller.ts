import { Response } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { AuthRequest } from '../../middleware/auth.middleware'
import { sendSuccess } from '../../utils/response'
import {
  getAllShipsCompliance,
  getComplianceByShip,
  getComplianceHistory,
  saveComplianceSnapshot
} from './compliance.service'

export const getAllCompliance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await getAllShipsCompliance()
  sendSuccess(res, { compliance: data })
})

export const getShipCompliance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const shipId = req.params['id'] as string
  const data = await getComplianceByShip(shipId)
  sendSuccess(res, { compliance: data })
})

export const getHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const shipId = req.params['id'] as string
  const history = await getComplianceHistory(shipId)
  sendSuccess(res, { history })
})

export const takeSnapshot = asyncHandler(async (req: AuthRequest, res: Response) => {
  const shipId = req.params['id'] as string
  const data = await saveComplianceSnapshot(shipId)
  sendSuccess(res, { compliance: data }, 201)
})