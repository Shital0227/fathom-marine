import { Router } from 'express'
import {
  getDrills,
  getDrill,
  createNewDrill,
  attendDrill,
  updateStatus
} from './drills.controller'
import { authenticate } from '../../middleware/auth.middleware'
import { validate } from '../../utils/validate'
import {
  createDrillSchema,
  markAttendanceSchema,
  updateDrillStatusSchema
} from './drills.schema'

const router = Router()

router.use(authenticate)

router.get('/', getDrills)
router.get('/:id', getDrill)
router.post('/', validate(createDrillSchema), createNewDrill)
router.post('/:id/attend', validate(markAttendanceSchema), attendDrill)
router.patch('/:id/status', validate(updateDrillStatusSchema), updateStatus)

export default router