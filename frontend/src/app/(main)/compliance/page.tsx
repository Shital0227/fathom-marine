'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import api from '@/lib/api'

interface ShipCompliance {
  shipId: string
  shipName: string
  registrationNumber: string
  maintenance: { total: number; completed: number; overdue: number; compliancePct: number }
  drills: { total: number; missed: number; compliancePct: number }
  overall: { compliancePct: number; riskLevel: string }
}

function getRiskColor(risk: string): string {
  switch (risk) {
    case 'low': return 'bg-[#10b981] text-white'
    case 'medium': return 'bg-[#f59e0b] text-white'
    case 'high': return 'bg-[#ef4444] text-white'
    default: return 'bg-[#1e2d4a] text-[#94a3b8]'
  }
}

function getPctColor(pct: number): string {
  if (pct >= 80) return '#10b981'
  if (pct >= 60) return '#f59e0b'
  return '#ef4444'
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-[#1e2d4a] rounded-full h-2">
        <div
          className="h-2 rounded-full"
          style={{ width: `${value}%`, backgroundColor: getPctColor(value) }}
        />
      </div>
      <span className="text-sm font-medium w-10 text-right" style={{ color: getPctColor(value) }}>
        {value}%
      </span>
    </div>
  )
}

export default function CompliancePage() {
  const [compliance, setCompliance] = useState<ShipCompliance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/compliance')
      .then(res => setCompliance(res.data.data.compliance))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const overallAvg = compliance.length > 0
    ? Math.round(compliance.reduce((sum, s) => sum + s.overall.compliancePct, 0) / compliance.length)
    : 0

  const totalOverdue = compliance.reduce((sum, s) => sum + s.maintenance.overdue, 0)
  const totalMissed = compliance.reduce((sum, s) => sum + s.drills.missed, 0)

  const chartData = compliance.map(s => ({
    ship: s.shipName,
    Maintenance: s.maintenance.compliancePct,
    Drills: s.drills.compliancePct,
    Overall: s.overall.compliancePct,
  }))

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-[#94a3b8]">Loading compliance data...</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#f1f5f9]">Compliance Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Overall Compliance</p>
          <p className="text-5xl font-bold mt-3" style={{ color: getPctColor(overallAvg) }}>
            {overallAvg}%
          </p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Overdue Maintenance</p>
          <p className="text-5xl font-bold text-[#ef4444] mt-3">{totalOverdue}</p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Missed Drills</p>
          <p className="text-5xl font-bold text-[#ef4444] mt-3">{totalMissed}</p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[#f1f5f9] mb-6">Fleet Compliance Breakdown</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
              <XAxis dataKey="ship" stroke="#94a3b8" />
              <YAxis domain={[0, 100]} stroke="#94a3b8" tickFormatter={v => `${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f1729', border: '1px solid #1e2d4a', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
                formatter={(value) => [`${value}%`]}
              />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              <Bar dataKey="Maintenance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Drills" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Overall" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-[#1e2d4a] bg-[#0a0f1e]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Ship</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Maintenance</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Drills</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Overall</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Risk</th>
            </tr>
          </thead>
          <tbody>
            {compliance.map((ship) => (
              <tr key={ship.shipId} className="border-b border-[#1e2d4a] last:border-b-0">
                <td className="px-6 py-4">
                  <p className="text-[#f1f5f9] font-medium">{ship.shipName}</p>
                  <p className="text-xs text-[#94a3b8]">{ship.registrationNumber}</p>
                </td>
                <td className="px-6 py-4 w-40"><ProgressBar value={ship.maintenance.compliancePct} /></td>
                <td className="px-6 py-4 w-40"><ProgressBar value={ship.drills.compliancePct} /></td>
                <td className="px-6 py-4 w-40"><ProgressBar value={ship.overall.compliancePct} /></td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRiskColor(ship.overall.riskLevel)}`}>
                    {ship.overall.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
            {compliance.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#94a3b8]">
                  No compliance data yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}