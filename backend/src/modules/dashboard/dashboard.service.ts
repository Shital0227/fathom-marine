import { pool } from '../../db/pool'

export async function getDashboardStats() {
  const [ships, crew, overdueTasks, recentActivity, complianceAvg] =
    await Promise.all([
      pool.query(`SELECT COUNT(*) as total FROM ships`),

      pool.query(`SELECT COUNT(*) as total FROM users WHERE role = 'crew'`),

      pool.query(`
        SELECT COUNT(*) as total 
        FROM maintenance_tasks 
        WHERE status != 'completed' 
        AND due_date < CURRENT_DATE
      `),

      pool.query(`
        SELECT * FROM (
          SELECT
            'task' as type,
            mt.title,
            mt.status,
            mt.updated_at as time,
            s.name as ship_name
          FROM maintenance_tasks mt
          JOIN ships s ON s.id = mt.ship_id
          UNION ALL
          SELECT
            'drill' as type,
            sd.title,
            sd.status,
            sd.updated_at as time,
            s.name as ship_name
          FROM safety_drills sd
          JOIN ships s ON s.id = sd.ship_id
        ) activity
        ORDER BY time DESC
        LIMIT 5
      `),

      pool.query(`
        SELECT
          ROUND(AVG(overall_compliance_pct)) as avg_compliance
        FROM compliance_snapshots
        WHERE snapshot_date = CURRENT_DATE
      `)
    ])

  return {
    totalShips: parseInt(ships.rows[0].total),
    totalCrew: parseInt(crew.rows[0].total),
    overdueTasks: parseInt(overdueTasks.rows[0].total),
    compliancePct: complianceAvg.rows[0]?.avg_compliance || 0,
    recentActivity: recentActivity.rows
  }
}