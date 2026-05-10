export default function CompliancePage() {
  const complianceItems = [
    { regulation: 'SOLAS', status: 'Compliant', score: '100%', lastReview: 'May 2024' },
    { regulation: 'MARPOL', status: 'Compliant', score: '98%', lastReview: 'May 2024' },
    { regulation: 'ISM Code', status: 'Compliant', score: '95%', lastReview: 'April 2024' },
    { regulation: 'STCW', status: 'Needs Review', score: '85%', lastReview: 'March 2024' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant':
        return 'bg-green-500/20 text-green-400';
      case 'Needs Review':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Non-Compliant':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-[#1e2d4a] text-[#94a3b8]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Overall Compliance Score</p>
          <p className="text-4xl font-bold text-[#f1f5f9] mt-2">94.5%</p>
          <p className="text-[#3b82f6] text-sm mt-2">↑ 2.1% from last quarter</p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Regulations Tracked</p>
          <p className="text-4xl font-bold text-[#f1f5f9] mt-2">24</p>
          <p className="text-green-400 text-sm mt-2">✓ All current</p>
        </div>
      </div>

      <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-[#1e2d4a] bg-[#0a0f1e]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Regulation</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Score</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Last Review</th>
            </tr>
          </thead>
          <tbody>
            {complianceItems.map((item, i) => (
              <tr key={i} className="border-b border-[#1e2d4a] last:border-b-0">
                <td className="px-6 py-4 text-[#f1f5f9] font-medium">{item.regulation}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#f1f5f9] font-medium">{item.score}</td>
                <td className="px-6 py-4 text-[#94a3b8]">{item.lastReview}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
