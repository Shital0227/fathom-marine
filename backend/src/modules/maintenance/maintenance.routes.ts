import { Router } from 'express'
import {
  getTasks,
  getTask,
  createNewTask,
  updateStatus,
  addTaskComment,
  getComments
} from './maintenance.controller'
import { authenticate } from '../../middleware/auth.middleware'
import { validate } from '../../utils/validate'
import {
  createTaskSchema,
  updateStatusSchema,
  addCommentSchema
} from './maintenance.schema'

const router = Router()

router.use(authenticate)

router.get('/', getTasks)
router.get('/:id', getTask)
router.post('/', validate(createTaskSchema), createNewTask)
router.patch('/:id/status', validate(updateStatusSchema), updateStatus)
router.get('/:id/comments', getComments)
router.post('/:id/comments', validate(addCommentSchema), addTaskComment)

export default router