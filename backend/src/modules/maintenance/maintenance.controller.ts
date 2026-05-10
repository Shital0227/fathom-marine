
import { Response } from 'express'
import { AuthRequest } from '../../middleware/auth.middleware'
import { sendSuccess } from '../../utils/response'
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTaskStatus,
  addComment,
  getTaskComments
} from './maintenance.service'
import { asyncHandler } from '../../utils/asyncHandler'


export const getTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tasks = await getAllTasks({
    shipId: req.query.shipId as string | undefined,
    status: req.query.status as string | undefined,
    startDate: req.query.startDate as string | undefined,
    endDate: req.query.endDate as string | undefined,
    userId: req.user!.userId,
    role: req.user!.role
  })

  sendSuccess(res, { tasks })
})

export const getTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params['id'] as string
  const task = await getTaskById(id)
  sendSuccess(res, { task })
})

export const updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params['id'] as string
  const task = await updateTaskStatus(
    id,
    req.body.status,
    req.user!.userId,
    req.user!.role
  )
  sendSuccess(res, { task })
})

export const addTaskComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params['id'] as string
  const comment = await addComment(
    id,
    req.user!.userId,
    req.body.comment
  )
  sendSuccess(res, { comment }, 201)
})

export const getComments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params['id'] as string
  const comments = await getTaskComments(id)
  sendSuccess(res, { comments })
})

export const createNewTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await createTask({
    ...req.body,
    createdBy: req.user!.userId
  })
  sendSuccess(res, { task }, 201)
})


