import { Router } from 'express'
import { getShips, getCrewByShip } from './ships.controller'
import { authenticate } from '../../middleware/auth.middleware'

const router = Router()

router.use(authenticate)
router.get('/', getShips)
router.get('/:id/crew', getCrewByShip)

export default router