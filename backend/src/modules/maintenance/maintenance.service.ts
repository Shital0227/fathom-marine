import { pool } from '../../db/pool'
import { AppError } from '../../utils/errors'

export async function getAllTasks(filters: {
  shipId?: string
  status?: string
  startDate?: string
  endDate?: string
  userId?: string
  role?: string
}) {
  let query = `
    SELECT 
      mt.id,
      mt.title,
      mt.description,
      mt.status,
      mt.due_date,
      mt.completed_at,
      mt.created_at,
      s.name as ship_name,
      s.id as ship_id,
      u.name as assigned_to_name,
      u.id as assigned_to_id,
      c.name as created_by_name,
      CASE 
        WHEN mt.status != 'completed' AND mt.due_date < CURRENT_DATE 
        THEN true ELSE false 
      END as is_overdue
    FROM maintenance_tasks mt
    LEFT JOIN ships s ON s.id = mt.ship_id
    LEFT JOIN users u ON u.id = mt.assigned_to
    LEFT JOIN users c ON c.id = mt.created_by
    WHERE 1=1
  `

  const params: any[] = []
  let paramCount = 1

  // crew only sees their own tasks
  if (filters.role === 'crew') {
    query += ` AND mt.assigned_to = $${paramCount++}`
    params.push(filters.userId)
  }

  if (filters.shipId) {
    query += ` AND mt.ship_id = $${paramCount++}`
    params.push(filters.shipId)
  }

  if (filters.status && filters.status !== 'all') {
    if (filters.status === 'overdue') {
      query += ` AND mt.status != 'completed' AND mt.due_date < CURRENT_DATE`
    } else {
      query += ` AND mt.status = $${paramCount++}`
      params.push(filters.status)
    }
  }

  if (filters.startDate) {
    query += ` AND mt.due_date >= $${paramCount++}`
    params.push(filters.startDate)
  }

  if (filters.endDate) {
    query += ` AND mt.due_date <= $${paramCount++}`
    params.push(filters.endDate)
  }

  query += ` ORDER BY mt.due_date ASC`

  const result = await pool.query(query, params)
  return result.rows
}

export async function getTaskById(id: string) {
  const result = await pool.query(
    `SELECT 
      mt.id,
      mt.title,
      mt.description,
      mt.status,
      mt.due_date,
      mt.completed_at,
      mt.created_at,
      s.name as ship_name,
      s.id as ship_id,
      u.name as assigned_to_name,
      u.id as assigned_to_id,
      CASE 
        WHEN mt.status != 'completed' AND mt.due_date < CURRENT_DATE 
        THEN true ELSE false 
      END as is_overdue
    FROM maintenance_tasks mt
    LEFT JOIN ships s ON s.id = mt.ship_id
    LEFT JOIN users u ON u.id = mt.assigned_to
    WHERE mt.id = $1`,
    [id]
  )

  if (!result.rows[0]) throw new AppError('Task not found', 404)
  return result.rows[0]
}

export async function createTask(data: {
  title: string
  description?: string
  shipId: string
  assignedTo?: string
  dueDate: string
  createdBy: string
}) {
  const result = await pool.query(
    `INSERT INTO maintenance_tasks 
      (title, description, ship_id, assigned_to, due_date, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.title,
      data.description || null,
      data.shipId,
      data.assignedTo || null,
      data.dueDate,
      data.createdBy
    ]
  )
  return result.rows[0]
}

export async function updateTaskStatus(
  id: string,
  status: string,
  userId: string,
  role: string
) {
  // crew can only update their own tasks
  if (role === 'crew') {
    const task = await pool.query(
      'SELECT assigned_to FROM maintenance_tasks WHERE id = $1',
      [id]
    )
    if (!task.rows[0]) throw new AppError('Task not found', 404)
    if (task.rows[0].assigned_to !== userId) {
      throw new AppError('You can only update your own tasks', 403)
    }
  }

  const completedAt = status === 'completed' ? new Date().toISOString() : null

  const result = await pool.query(
    `UPDATE maintenance_tasks 
     SET status = $1, completed_at = $2
     WHERE id = $3
     RETURNING *`,
    [status, completedAt, id]
  )

  if (!result.rows[0]) throw new AppError('Task not found', 404)
  return result.rows[0]
}

export async function addComment(
  taskId: string,
  userId: string,
  comment: string
) {
  // verify task exists
  const task = await pool.query(
    'SELECT id FROM maintenance_tasks WHERE id = $1',
    [taskId]
  )
  if (!task.rows[0]) throw new AppError('Task not found', 404)

  const result = await pool.query(
    `INSERT INTO task_comments (task_id, user_id, comment)
     VALUES ($1, $2, $3)
     RETURNING 
       id,
       comment,
       created_at,
       (SELECT name FROM users WHERE id = $2) as author_name`,
    [taskId, userId, comment]
  )
  return result.rows[0]
}

export async function getTaskComments(taskId: string) {
  const result = await pool.query(
    `SELECT 
      tc.id,
      tc.comment,
      tc.created_at,
      u.name as author_name
     FROM task_comments tc
     JOIN users u ON u.id = tc.user_id
     WHERE tc.task_id = $1
     ORDER BY tc.created_at ASC`,
    [taskId]
  )
  return result.rows
}