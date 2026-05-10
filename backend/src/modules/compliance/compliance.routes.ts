import { Router } from 'express'
import {
  getAllCompliance,
  getShipCompliance,
  getHistory,
  takeSnapshot
} from './compliance.controller'
import { authenticate } from '../../middleware/auth.middleware'

const router = Router()

router.use(authenticate)

router.get('/', getAllCompliance)

router.get('/:id', getShipCompliance)

router.get('/:id/history', getHistory)

router.post('/:id/snapshot', takeSnapshot)

export default router