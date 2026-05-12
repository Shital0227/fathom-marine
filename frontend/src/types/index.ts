export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'crew'
  created_at: string
}

export interface Ship {
  id: string
  name: string
  registration_number: string
}

export interface MaintenanceTask {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  due_date: string
  completed_at: string | null
  ship_name: string
  ship_id: string
  assigned_to_name: string
  assigned_to_id: string
  is_overdue: boolean
  created_at: string
}

export interface TaskComment {
  id: string
  comment: string
  created_at: string
  author_name: string
}

export interface Drill {
  id: string
  title: string
  drill_type: string
  scheduled_date: string
  status: 'scheduled' | 'completed' | 'missed'
  ship_name: string
  ship_id: string
  total_crew: number
  attended_count: number
}

export interface DrillAttendance {
  id: string
  attended: boolean
  submitted_at: string | null
  crew_name: string
  user_id: string
}

export interface ComplianceData {
  shipId: string
  shipName: string
  registrationNumber: string
  maintenance: {
    total: number
    completed: number
    overdue: number
    pending: number
    compliancePct: number
  }
  drills: {
    total: number
    completed: number
    missed: number
    upcoming: number
    attendanceExpected: number
    attended: number
    compliancePct: number
  }
  overall: {
    compliancePct: number
    riskLevel: 'low' | 'medium' | 'high'
  }
}