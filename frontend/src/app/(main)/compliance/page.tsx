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
    default: return 'bg-[#e2e8f0] text-[#64748b]'
  }
}

function getPctColor(pct: number): string {
  if (pct >= 80) return '#10b981'
  if (pct >= 60) return '#f59e0b'
  return '#ef4444'
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-[#e2e8f0] rounded-full h-2">
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
      <p className="text-[#64748b]">Loading compliance data...</p>
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b]">Compliance Overview</h1>
        <p className="text-[#64748b] mt-2 text-sm">Monitor fleet compliance status across all ships</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-lg p-6 hover:border-[#3b82f6]/50 transition-colors">
          <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wide">Overall Compliance</p>
          <p className="text-5xl font-bold mt-4" style={{ color: getPctColor(overallAvg) }}>
            {overallAvg}%
          </p>
        </div>
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-lg p-6 hover:border-[#ef4444]/50 transition-colors">
          <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wide">Overdue Maintenance</p>
          <p className="text-5xl font-bold text-[#ef4444] mt-4">{totalOverdue}</p>
        </div>
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-lg p-6 hover:border-[#ef4444]/50 transition-colors">
          <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wide">Missed Drills</p>
          <p className="text-5xl font-bold text-[#ef4444] mt-4">{totalMissed}</p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-lg p-6 hover:border-[#e2e8f0] transition-colors">
          <h2 className="text-lg font-bold text-[#1e293b] mb-6">Fleet Compliance Breakdown</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="ship" stroke="#94a3b8" />
              <YAxis domain={[0, 100]} stroke="#94a3b8" tickFormatter={v => `${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
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

      <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-[#e2e8f0] bg-[#f8fafc]">
            <tr>
              <th className="px-6 py-6 text-left text-sm font-semibold text-[#64748b]">Ship</th>
              <th className="px-6 py-6 text-left text-sm font-semibold text-[#64748b]">Maintenance</th>
              <th className="px-6 py-6 text-left text-sm font-semibold text-[#64748b]">Drills</th>
              <th className="px-6 py-6 text-left text-sm font-semibold text-[#64748b]">Overall</th>
              <th className="px-6 py-6 text-left text-sm font-semibold text-[#64748b]">Risk</th>
            </tr>
          </thead>
          <tbody>
            {compliance.map((ship) => (
              <tr key={ship.shipId} className="border-b border-[#e2e8f0] last:border-b-0">
                <td className="px-6 py-6">
                  <p className="text-[#1e293b] font-medium">{ship.shipName}</p>
                  <p className="text-xs text-[#64748b]">{ship.registrationNumber}</p>
                </td>
                <td className="px-6 py-6 w-40"><ProgressBar value={ship.maintenance.compliancePct} /></td>
                <td className="px-6 py-6 w-40"><ProgressBar value={ship.drills.compliancePct} /></td>
                <td className="px-6 py-6 w-40"><ProgressBar value={ship.overall.compliancePct} /></td>
                <td className="px-6 py-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRiskColor(ship.overall.riskLevel)}`}>
                    {ship.overall.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
            {compliance.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#64748b]">
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
