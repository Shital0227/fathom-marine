import { Response } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { AuthRequest } from '../../middleware/auth.middleware'
import { sendSuccess } from '../../utils/response'
import { getAllShips, getShipCrew } from './ships.service'

export const getShips = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ships = await getAllShips()
  sendSuccess(res, { ships })
})

export const getCrewByShip = asyncHandler(async (req: AuthRequest, res: Response) => {
  const shipId = req.params['id'] as string
  const crew = await getShipCrew(shipId)
  sendSuccess(res, { crew })
})