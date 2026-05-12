'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'

interface DashboardStats {
  totalShips: number
  totalCrew: number
  overdueTasks: number
  compliancePct: number
  recentActivity: {
    type: string
    title: string
    status: string
    time: string
    ship_name: string
  }[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard')
        setStats(response.data.data.stats)
      } catch (err: Error | any) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#94a3b8]">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Active Vessels</p>
          <p className="text-4xl font-bold text-[#f1f5f9] mt-2">{stats?.totalShips}</p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Crew Members</p>
          <p className="text-4xl font-bold text-[#f1f5f9] mt-2">{stats?.totalCrew}</p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Overdue Tasks</p>
          <p className="text-4xl font-bold text-[#ef4444] mt-2">{stats?.overdueTasks}</p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Compliance Score</p>
          <p className="text-4xl font-bold text-[#10b981] mt-2">
            {stats?.compliancePct ?? 'N/A'}{stats?.compliancePct ? '%' : ''}
          </p>
        </div>
      </div>

      <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
        <h2 className="text-xl font-bold text-[#f1f5f9] mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {stats?.recentActivity.length === 0 && (
            <p className="text-[#94a3b8] text-sm">No recent activity</p>
          )}
          {stats?.recentActivity.map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-3 pb-3 border-b border-[#1e2d4a] last:border-b-0"
            >
              <div className="w-2 h-2 rounded-full bg-[#3b82f6] flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[#f1f5f9] text-sm">
                  {activity.type === 'task' ? '🔧' : '🛡️'} {activity.title}
                  <span className="text-[#94a3b8]"> on {activity.ship_name}</span>
                </p>
              </div>
              <span className="text-xs text-[#94a3b8] flex-shrink-0">
                {new Date(activity.time).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}