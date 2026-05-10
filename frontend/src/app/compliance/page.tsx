'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ComplianceData {
  ship: string;
  maintenance: number;
  drill: number;
  overall: number;
}

interface OverdueTask {
  id: string;
  title: string;
  ship: string;
  daysOverdue: number;
}

interface MissedDrill {
  id: string;
  title: string;
  ship: string;
  dateMissed: string;
}

const complianceData: ComplianceData[] = [
  { ship: 'MV Alpha', maintenance: 85, drill: 90, overall: 87 },
  { ship: 'MV Beta', maintenance: 60, drill: 55, overall: 57 },
  { ship: 'MV Gamma', maintenance: 75, drill: 80, overall: 77 },
];

const shipComplianceDetails = [
  { name: 'MV Alpha (MV-2301)', maintenance: 85, drill: 90, overall: 87, risk: 'Low' as const },
  { name: 'MV Beta (MV-2302)', maintenance: 60, drill: 55, overall: 57, risk: 'High' as const },
  { name: 'MV Gamma (MV-2303)', maintenance: 75, drill: 80, overall: 77, risk: 'Medium' as const },
];

const overdueTasks: OverdueTask[] = [
  { id: '1', title: 'Engine bearing inspection', ship: 'MV Beta', daysOverdue: 5 },
  { id: '2', title: 'Hull integrity check', ship: 'MV Beta', daysOverdue: 3 },
  { id: '3', title: 'Ballast tank cleaning', ship: 'MV Beta', daysOverdue: 2 },
];

const missedDrills: MissedDrill[] = [
  { id: '1', title: 'Medical Emergency Response', ship: 'MV-2301', dateMissed: '2024-05-05' },
  { id: '2', title: 'Fire Safety Drill', ship: 'MV-2302', dateMissed: '2024-05-08' },
];

function getRiskColor(risk: string): string {
  switch (risk) {
    case 'Low':
      return 'bg-[#10b981] text-white';
    case 'Medium':
      return 'bg-[#f59e0b] text-white';
    case 'High':
      return 'bg-[#ef4444] text-white';
    default:
      return 'bg-[#1e2d4a] text-[#94a3b8]';
  }
}

function getComplianceColor(percentage: number): string {
  if (percentage >= 85) return '#10b981';
  if (percentage >= 70) return '#f59e0b';
  return '#ef4444';
}

function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-[#1e2d4a] rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percentage}%`, backgroundColor: getComplianceColor(percentage) }}
        />
      </div>
      <span className="text-sm font-medium text-[#f1f5f9] min-w-[45px]">{percentage}%</span>
    </div>
  );
}

export default function CompliancePage() {
  const overallCompliance = Math.round(
    (87 + 57 + 77) / 3
  );

  return (
    <div className="space-y-6">
      {/* Top Heading */}
      <h1 className="text-3xl font-bold text-[#f1f5f9]">Compliance Overview</h1>

      {/* Overall Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Overall Compliance %</p>
          <p className="text-5xl font-bold mt-3" style={{ color: getComplianceColor(overallCompliance) }}>
            {overallCompliance}%
          </p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Overdue Maintenance Tasks</p>
          <p className="text-5xl font-bold text-[#ef4444] mt-3">{overdueTasks.length}</p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Missed Drills</p>
          <p className="text-5xl font-bold text-[#ef4444] mt-3">{missedDrills.length}</p>
        </div>
      </div>

      {/* Compliance Chart */}
      <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[#f1f5f9] mb-6">Fleet Compliance Breakdown</h2>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={complianceData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
              <XAxis dataKey="ship" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f1729',
                  border: '1px solid #1e2d4a',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
              <Bar dataKey="maintenance" fill="#3b82f6" name="Maintenance %" />
              <Bar dataKey="drill" fill="#10b981" name="Drill %" />
              <Bar dataKey="overall" fill="#f59e0b" name="Overall %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compliance Table */}
      <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[#1e2d4a] bg-[#0a0f1e]">
            <tr>
              <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#94a3b8]">
                Ship Name
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#94a3b8]">
                Maintenance %
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#94a3b8]">
                Drill Attendance %
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#94a3b8]">
                Overall %
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#94a3b8]">
                Risk Level
              </th>
            </tr>
          </thead>
          <tbody>
            {shipComplianceDetails.map((ship, idx) => (
              <tr key={idx} className="border-b border-[#1e2d4a] last:border-b-0">
                <td className="px-4 sm:px-6 py-4 text-[#f1f5f9] font-medium text-sm">{ship.name}</td>
                <td className="px-4 sm:px-6 py-4">
                  <ProgressBar percentage={ship.maintenance} />
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <ProgressBar percentage={ship.drill} />
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <ProgressBar percentage={ship.overall} />
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(ship.risk)}`}>
                    {ship.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Overdue Tasks */}
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#f1f5f9] mb-4">Overdue Maintenance Tasks</h3>
          <div className="space-y-3">
            {overdueTasks.map((task) => (
              <div key={task.id} className="flex items-start justify-between pb-3 border-b border-[#1e2d4a] last:border-b-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#f1f5f9] wrap-break-word">{task.title}</p>
                  <p className="text-xs text-[#94a3b8] mt-1">{task.ship}</p>
                </div>
                <p className="text-sm font-bold text-[#ef4444] ml-3 shrink-0">{task.daysOverdue}d overdue</p>
              </div>
            ))}
          </div>
        </div>

        {/* Missed Drills */}
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#f1f5f9] mb-4">Missed Drills</h3>
          <div className="space-y-3">
            {missedDrills.map((drill) => (
              <div key={drill.id} className="flex items-start justify-between pb-3 border-b border-[#1e2d4a] last:border-b-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#f1f5f9] wrap-break-word">{drill.title}</p>
                  <p className="text-xs text-[#94a3b8] mt-1">{drill.ship}</p>
                </div>
                <p className="text-xs text-[#94a3b8] ml-3 shrink-0">{drill.dateMissed}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
