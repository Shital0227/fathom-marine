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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#f1f5f9]">Dashboard</h1>
        <p className="text-[#94a3b8] mt-2 text-sm">Overview of your maritime operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6 hover:border-[#3b82f6]/50 transition-colors">
          <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-wide">Active Vessels</p>
          <p className="text-4xl font-bold text-[#f1f5f9] mt-4">{stats?.totalShips}</p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6 hover:border-[#3b82f6]/50 transition-colors">
          <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-wide">Crew Members</p>
          <p className="text-4xl font-bold text-[#f1f5f9] mt-4">{stats?.totalCrew}</p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6 hover:border-[#ef4444]/50 transition-colors">
          <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-wide">Overdue Tasks</p>
          <p className="text-4xl font-bold text-[#ef4444] mt-4">{stats?.overdueTasks}</p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6 hover:border-[#10b981]/50 transition-colors">
          <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-wide">Compliance Score</p>
          <p className="text-4xl font-bold text-[#10b981] mt-4">
            {stats?.compliancePct ?? 'N/A'}{stats?.compliancePct ? '%' : ''}
          </p>
        </div>
      </div>

      <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {stats?.recentActivity.length === 0 && (
            <p className="text-[#94a3b8] text-sm py-4 text-center">No recent activity</p>
          )}
          {stats?.recentActivity.map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-4 pb-4 border-b border-[#1e2d4a] last:border-b-0 last:pb-0 hover:bg-[#0a0f1e] px-2 py-2 rounded transition-colors"
            >
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${activity.type === 'task' ? 'bg-[#3b82f6]' : 'bg-[#10b981]'}`} />
              <div className="flex-1">
                <p className="text-[#f1f5f9] text-sm font-medium">
                  {activity.title}
                  <span className="text-[#94a3b8] font-normal"> on {activity.ship_name}</span>
                </p>
              </div>
              <span className="text-xs text-[#94a3b8] flex-shrink-0 whitespace-nowrap">
                {new Date(activity.time).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
