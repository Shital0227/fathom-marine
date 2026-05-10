import { pool } from '../../db/pool'

export async function getComplianceByShip(shipId: string) {
  const maintenanceResult = await pool.query(
    `SELECT
      COUNT(*) FILTER (WHERE due_date <= CURRENT_DATE OR status = 'completed') as total,
      COUNT(*) FILTER (WHERE status = 'completed') as completed,
      COUNT(*) FILTER (WHERE status != 'completed' AND due_date < CURRENT_DATE) as overdue
     FROM maintenance_tasks
     WHERE ship_id = $1`,
    [shipId]
  )

  const drillResult = await pool.query(
    `SELECT
      COUNT(DISTINCT sd.id) as total_drills,
      COUNT(DISTINCT sd.id) FILTER (WHERE sd.status = 'completed') as completed_drills,
      COUNT(DISTINCT sd.id) FILTER (WHERE sd.status = 'missed') as missed_drills,
      COUNT(da.id) as total_attendance_expected,
      COUNT(da.id) FILTER (WHERE da.attended = true) as total_attended
     FROM safety_drills sd
     LEFT JOIN drill_attendance da ON da.drill_id = sd.id
     WHERE sd.ship_id = $1
     AND sd.scheduled_date <= NOW()`,
    [shipId]
  )

  const m = maintenanceResult.rows[0]
  const d = drillResult.rows[0]

  const maintenanceTotal = parseInt(m.total) || 0
  const maintenanceCompleted = parseInt(m.completed) || 0
  const maintenanceOverdue = parseInt(m.overdue) || 0

  const totalAttendanceExpected = parseInt(d.total_attendance_expected) || 0
  const totalAttended = parseInt(d.total_attended) || 0
  const missedDrills = parseInt(d.missed_drills) || 0
  const totalDrills = parseInt(d.total_drills) || 0
  const completedDrills = parseInt(d.completed_drills) || 0

  const maintenancePct = maintenanceTotal === 0
    ? 100
    : Math.round((maintenanceCompleted / maintenanceTotal) * 100)

  const drillPct = totalAttendanceExpected === 0
    ? 100
    : Math.round((totalAttended / totalAttendanceExpected) * 100)

  const overallPct = Math.round((maintenancePct + drillPct) / 2)

  const riskLevel = overallPct >= 80
    ? 'low'
    : overallPct >= 60
    ? 'medium'
    : 'high'

  return {
    maintenance: {
      total: maintenanceTotal,
      completed: maintenanceCompleted,
      overdue: maintenanceOverdue,
      pending: maintenanceTotal - maintenanceCompleted - maintenanceOverdue,
      compliancePct: maintenancePct
    },
    drills: {
      total: totalDrills,
      completed: completedDrills,
      missed: missedDrills,
      upcoming: totalDrills - completedDrills - missedDrills,
      attendanceExpected: totalAttendanceExpected,
      attended: totalAttended,
      compliancePct: drillPct
    },
    overall: {
      compliancePct: overallPct,
      riskLevel
    }
  }
}

export async function getAllShipsCompliance() {
  const ships = await pool.query(
    `SELECT id, name, registration_number FROM ships ORDER BY name ASC`
  )

  const results = await Promise.all(
    ships.rows.map(async (ship: any) => {
      const compliance = await getComplianceByShip(ship.id)
      return {
        shipId: ship.id,
        shipName: ship.name,
        registrationNumber: ship.registration_number,
        ...compliance
      }
    })
  )

  return results
}

export async function saveComplianceSnapshot(shipId: string) {
  const compliance = await getComplianceByShip(shipId)

  await pool.query(
    `INSERT INTO compliance_snapshots
      (ship_id, maintenance_compliance_pct, drill_compliance_pct, overall_compliance_pct)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (ship_id, snapshot_date)
     DO UPDATE SET
       maintenance_compliance_pct = EXCLUDED.maintenance_compliance_pct,
       drill_compliance_pct = EXCLUDED.drill_compliance_pct,
       overall_compliance_pct = EXCLUDED.overall_compliance_pct`,
    [
      shipId,
      compliance.maintenance.compliancePct,
      compliance.drills.compliancePct,
      compliance.overall.compliancePct
    ]
  )

  return compliance
}

export async function getComplianceHistory(shipId: string) {
  const result = await pool.query(
    `SELECT
      snapshot_date,
      maintenance_compliance_pct,
      drill_compliance_pct,
      overall_compliance_pct
     FROM compliance_snapshots
     WHERE ship_id = $1
     ORDER BY snapshot_date DESC
     LIMIT 30`,
    [shipId]
  )
  return result.rows
}