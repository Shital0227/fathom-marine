import { pool } from '../../db/pool'
import { AppError } from '../../utils/errors'

export async function getAllDrills(filters: {
  shipId?: string | undefined
  status?: string | undefined
}) {
  let query = `
    SELECT
      sd.id,
      sd.title,
      sd.drill_type,
      sd.scheduled_date,
      sd.status,
      sd.created_at,
      s.name as ship_name,
      s.id as ship_id,
      COUNT(da.id) as total_crew,
      COUNT(da.id) FILTER (WHERE da.attended = true) as attended_count
    FROM safety_drills sd
    LEFT JOIN ships s ON s.id = sd.ship_id
    LEFT JOIN drill_attendance da ON da.drill_id = sd.id
    WHERE 1=1
  `

  const params: any[] = []
  let paramCount = 1

  if (filters.shipId) {
    query += ` AND sd.ship_id = $${paramCount++}`
    params.push(filters.shipId)
  }

  if (filters.status && filters.status !== 'all') {
    query += ` AND sd.status = $${paramCount++}`
    params.push(filters.status)
  }

  query += ` GROUP BY sd.id, s.name, s.id ORDER BY sd.scheduled_date DESC`

  const result = await pool.query(query, params)
  return result.rows
}

export async function getDrillById(id: string) {
  const drill = await pool.query(
    `SELECT
      sd.id,
      sd.title,
      sd.drill_type,
      sd.scheduled_date,
      sd.status,
      sd.created_at,
      s.name as ship_name,
      s.id as ship_id
    FROM safety_drills sd
    LEFT JOIN ships s ON s.id = sd.ship_id
    WHERE sd.id = $1`,
    [id]
  )

  if (!drill.rows[0]) throw new AppError('Drill not found', 404)

  const attendance = await pool.query(
    `SELECT
      da.id,
      da.attended,
      da.submitted_at,
      da.notes,
      u.name as crew_name,
      u.id as user_id
    FROM drill_attendance da
    JOIN users u ON u.id = da.user_id
    WHERE da.drill_id = $1
    ORDER BY u.name ASC`,
    [id]
  )

  return {
    ...drill.rows[0],
    attendance: attendance.rows
  }
}

export async function createDrill(data: {
  title: string
  drillType: string
  shipId: string
  scheduledDate: string
  createdBy: string
}) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const drill = await client.query(
      `INSERT INTO safety_drills
        (title, drill_type, ship_id, scheduled_date, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.title, data.drillType, data.shipId, data.scheduledDate, data.createdBy]
    )
    const crew = await client.query(
      `SELECT user_id FROM ship_crew 
       WHERE ship_id = $1 AND is_active = true`,
      [data.shipId]
    )

    if (crew.rows.length > 0) {
      const attendanceValues = crew.rows
        .map((_: any, i: number) => `($1, $${i + 2})`)
        .join(', ')

      const attendanceParams = [
        drill.rows[0].id,
        ...crew.rows.map((c: any) => c.user_id)
      ]

      await client.query(
        `INSERT INTO drill_attendance (drill_id, user_id)
         VALUES ${attendanceValues}`,
        attendanceParams
      )
    }

    await client.query('COMMIT')
    return drill.rows[0]

  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export async function markAttendance(
  drillId: string,
  userId: string,
  attended: boolean
) {
  const result = await pool.query(
    `UPDATE drill_attendance
     SET attended = $1, submitted_at = $2
     WHERE drill_id = $3 AND user_id = $4
     RETURNING *`,
    [attended, attended ? new Date().toISOString() : null, drillId, userId]
  )

  if (!result.rows[0]) throw new AppError('Attendance record not found', 404)
  return result.rows[0]
}

export async function updateDrillStatus(id: string, status: string) {
  const result = await pool.query(
    `UPDATE safety_drills
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, id]
  )

  if (!result.rows[0]) throw new AppError('Drill not found', 404)
  return result.rows[0]
}

export async function markMissedDrills() {
  const result = await pool.query(
    `UPDATE safety_drills
     SET status = 'missed'
     WHERE status = 'scheduled'
     AND scheduled_date < NOW()
     RETURNING id, title`
  )
  return result.rows
}