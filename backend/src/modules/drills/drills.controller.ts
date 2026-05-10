import { Response } from 'express'
import { AuthRequest } from '../../middleware/auth.middleware'
import { sendSuccess } from '../../utils/response'
import {
  getAllDrills,
  getDrillById,
  createDrill,
  markAttendance,
  updateDrillStatus
} from './drills.service'
import { asyncHandler } from '../../utils/asyncHandler'



export const getDrills = asyncHandler(async (req: AuthRequest, res: Response) => {
  const drills = await getAllDrills({
    shipId: req.query.shipId as string | undefined,
    status: req.query.status as string | undefined
  })
  sendSuccess(res, { drills })
})

export const getDrill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params['id'] as string
  const drill = await getDrillById(id)
  sendSuccess(res, { drill })
})

export const createNewDrill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const drill = await createDrill({
    ...req.body,
    createdBy: req.user!.userId
  })
  sendSuccess(res, { drill }, 201)
})

export const attendDrill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params['id'] as string
  const attendance = await markAttendance(
    id,
    req.user!.userId,
    req.body.attended
  )
  sendSuccess(res, { attendance })
})

export const updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params['id'] as string
  const drill = await updateDrillStatus(id, req.body.status)
  sendSuccess(res, { drill })
})