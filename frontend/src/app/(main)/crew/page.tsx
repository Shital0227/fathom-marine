'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Flame, AlertTriangle, Users, LogOut, Heart, LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { useUser } from '@/contexts/userContext'

interface Task {
  id: string
  title: string
  ship_name: string
  due_date: string
  status: 'pending' | 'in_progress' | 'completed'
  is_overdue: boolean
}

interface Drill {
  id: string
  title: string
  drill_type: string
  ship_name: string
  scheduled_date: string
  status: 'scheduled' | 'completed' | 'missed'
}

const DRILL_ICONS: Record<string, LucideIcon> = {
  fire: Flame,
  evacuation: AlertTriangle,
  man_overboard: Users,
  abandon_ship: LogOut,
  medical: Heart,
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-[#f59e0b] text-white'
    case 'in_progress': return 'bg-[#3b82f6] text-white'
    case 'completed': return 'bg-[#10b981] text-white'
    case 'scheduled': return 'bg-[#3b82f6] text-white'
    case 'missed': return 'bg-[#ef4444] text-white'
    default: return 'bg-[#e2e8f0] text-[#64748b]'
  }
}

export default function CrewPage() {
  const { user } = useUser()
  const [tasks, setTasks] = useState<Task[]>([])
  const [drills, setDrills] = useState<Drill[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [tasksRes, drillsRes] = await Promise.all([
        api.get('/maintenance'),
        api.get('/drills')
      ])
      setTasks(tasksRes.data.data.tasks)
      setDrills(drillsRes.data.data.drills)
    } catch { } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleUpdateStatus = async (taskId: string, status: string) => {
    try {
      await api.patch(`/maintenance/${taskId}/status`, { status })
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: status as any } : t))
    } catch { }
  }

  const handleMarkAttended = async (drillId: string) => {
    try {
      await api.post(`/drills/${drillId}/attend`, { attended: true })
      setDrills(drills.map(d => d.id === drillId ? { ...d, status: 'completed' as const } : d))
    } catch { }
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const attendedDrills = drills.filter(d => d.status === 'completed').length
  const totalItems = tasks.length + drills.length
  const complianceScore = totalItems > 0
    ? Math.round(((completedTasks + attendedDrills) / totalItems) * 100)
    : 0

  const scoreColor = complianceScore >= 80
    ? '#10b981' : complianceScore >= 60
    ? '#f59e0b' : '#ef4444'

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-[#64748b]">Loading...</p>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">
            Welcome, {user?.name || 'Crew Member'}
          </h1>
          <p className="text-[#64748b] mt-2 text-sm capitalize">Track your assigned tasks and drills</p>
        </div>
        <span className="bg-[#3b82f6] text-white px-6 py-2 rounded-lg text-sm font-semibold capitalize">
          {user?.role}
        </span>
      </div>

      <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-lg p-8">
        <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wide">Personal Compliance Score</p>
        <div className="flex items-center gap-6 mt-4">
          <p className="text-7xl font-bold" style={{ color: scoreColor }}>
            {complianceScore}%
          </p>
          <div className="text-[#64748b] space-y-1">
            <p className="text-sm">{completedTasks}/{tasks.length} Tasks Completed</p>
            <p className="text-sm">{attendedDrills}/{drills.length} Drills Attended</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-lg p-6">
          <h2 className="text-lg font-bold text-[#1e293b] mb-6">My Tasks</h2>
          <div className="space-y-3">
            {tasks.length === 0 && (
              <p className="text-[#64748b] text-sm text-center py-6">No tasks assigned</p>
            )}
            {tasks.map((task) => (
              <div key={task.id} className="border border-[#e2e8f0] rounded-lg p-6 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-[#1e293b]">{task.title}</h3>
                  <p className="text-xs text-[#64748b] mt-1">{task.ship_name}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748b]">
                    {new Date(task.due_date).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(task.status)}`}>
                    {task.is_overdue ? 'Overdue' : task.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex gap-3">
                  {task.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(task.id, 'in_progress')}
                      className="flex-1 bg-[#3b82f6] hover:bg-[#1e3a8a] text-white text-xs h-8"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      In Progress
                    </Button>
                  )}
                  {task.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(task.id, 'completed')}
                      className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white text-xs h-8"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Upcoming Drills</h2>
          <div className="space-y-3">
            {drills.length === 0 && (
              <p className="text-[#64748b] text-sm text-center py-6">No drills assigned</p>
            )}
            {drills.map((drill) => {
              const DrillIcon = DRILL_ICONS[drill.drill_type] || Flame
              return (
                <div key={drill.id} className="border border-[#e2e8f0] rounded-lg p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#e2e8f0] p-2 rounded flex-shrink-0">
                      <DrillIcon className="w-4 h-4 text-[#3b82f6]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-[#1e293b]">{drill.title}</h3>
                      <p className="text-xs text-[#64748b] mt-1">{drill.ship_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#64748b]">
                      {new Date(drill.scheduled_date).toLocaleString()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(drill.status)}`}>
                      {drill.status}
                    </span>
                  </div>
                  {drill.status === 'scheduled' && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkAttended(drill.id)}
                      className="w-full bg-[#10b981] hover:bg-[#059669] text-white text-xs h-8"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Mark Attended
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
