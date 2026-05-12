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
        <p className="text-[#64748b]">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b]">Dashboard</h1>
        <p className="text-[#64748b] mt-2 text-sm">Overview of your maritime operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-e2e8f0 rounded-lg p-6 hover:border-[#3b82f6]/50 transition-colors">
          <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wide">Active Vessels</p>
          <p className="text-4xl font-bold text-[#1e293b] mt-4">{stats?.totalShips}</p>
        </div>
        <div className="bg-white border border-e2e8f0 rounded-lg p-6 hover:border-[#3b82f6]/50 transition-colors">
          <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wide">Crew Members</p>
          <p className="text-4xl font-bold text-[#1e293b] mt-4">{stats?.totalCrew}</p>
        </div>
        <div className="bg-white border border-e2e8f0 rounded-lg p-6 hover:border-red-500/50 transition-colors">
          <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wide">Overdue Tasks</p>
          <p className="text-4xl font-bold text-red-600 mt-4">{stats?.overdueTasks}</p>
        </div>
        <div className="bg-white border border-e2e8f0 rounded-lg p-6 hover:border-green-500/50 transition-colors">
          <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wide">Compliance Score</p>
          <p className="text-4xl font-bold text-green-600 mt-4">
            {stats?.compliancePct ?? 'N/A'}{stats?.compliancePct ? '%' : ''}
          </p>
        </div>
      </div>

      <div className="bg-white border border-e2e8f0 rounded-lg p-6">
        <h2 className="text-lg font-bold text-[#1e293b] mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {stats?.recentActivity.length === 0 && (
            <p className="text-[#64748b] text-sm py-6 text-center">No recent activity</p>
          )}
          {stats?.recentActivity.map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-6 pb-4 border-b border-e2e8f0 last:border-b-0 last:pb-0 hover:bg-[#f8fafc] px-2 py-2 rounded transition-colors"
            >
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${activity.type === 'task' ? 'bg-[#3b82f6]' : 'bg-green-600'}`} />
              <div className="flex-1">
                <p className="text-[#1e293b] text-sm font-medium">
                  {activity.title}
                  <span className="text-[#64748b] font-normal"> on {activity.ship_name}</span>
                </p>
              </div>
              <span className="text-xs text-[#64748b] flex-shrink-0 whitespace-nowrap">
                {new Date(activity.time).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
