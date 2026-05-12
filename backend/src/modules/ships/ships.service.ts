import { pool } from '../../db/pool'

export async function getAllShips() {
  const result = await pool.query(
    `SELECT id, name, registration_number FROM ships ORDER BY name ASC`
  )
  return result.rows
}

export async function getShipCrew(shipId: string) {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.role
     FROM users u
     JOIN ship_crew sc ON sc.user_id = u.id
     WHERE sc.ship_id = $1 AND sc.is_active = true
     ORDER BY u.name ASC`,
    [shipId]
  )
  return result.rows
}