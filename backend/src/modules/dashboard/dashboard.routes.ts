import { Router } from 'express'
import { getStats } from './dashboard.controller'
import { authenticate } from '../../middleware/auth.middleware'

const router = Router()

router.use(authenticate)
router.get('/', getStats)

export default router