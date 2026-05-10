export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Active Vessels', value: '12', change: '+2' },
          { title: 'Crew Members', value: '847', change: '+15' },
          { title: 'Maintenance Issues', value: '8', change: '-3' },
          { title: 'Compliance Score', value: '98%', change: '+2%' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
            <p className="text-[#94a3b8] text-sm font-medium">{stat.title}</p>
            <p className="text-4xl font-bold text-[#f1f5f9] mt-2">{stat.value}</p>
            <p className="text-[#3b82f6] text-sm mt-2">{stat.change} this month</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
        <h2 className="text-xl font-bold text-[#f1f5f9] mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            'Vessel MV-2301 completed routine maintenance',
            'Safety drill conducted on platform Alpha',
            'Crew rotation scheduled for next week',
            'Compliance report filed for Q2',
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-3 pb-3 border-b border-[#1e2d4a] last:border-b-0">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
              <p className="text-[#f1f5f9]">{activity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
