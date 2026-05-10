export default function CrewPage() {
  const crewMembers = [
    { name: 'Captain James Wilson', role: 'Master', vessel: 'MV-2301', status: 'On Duty' },
    { name: 'Officer Sarah Chen', role: 'Chief Officer', vessel: 'MV-2301', status: 'On Duty' },
    { name: 'Engineer David Brown', role: 'Chief Engineer', vessel: 'MV-2302', status: 'Off Duty' },
    { name: 'Seaman Michael Johnson', role: 'Deckhand', vessel: 'MV-2303', status: 'On Duty' },
    { name: 'Rating Emma Lee', role: 'Steward', vessel: 'MV-2301', status: 'On Duty' },
    { name: 'Officer Thomas Garcia', role: 'Second Officer', vessel: 'MV-2304', status: 'Off Duty' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Total Crew</p>
          <p className="text-4xl font-bold text-[#f1f5f9] mt-2">847</p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">On Duty</p>
          <p className="text-4xl font-bold text-green-400 mt-2">612</p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Off Duty</p>
          <p className="text-4xl font-bold text-yellow-400 mt-2">235</p>
        </div>
      </div>

      <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-[#1e2d4a] bg-[#0a0f1e]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Vessel</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Status</th>
            </tr>
          </thead>
          <tbody>
            {crewMembers.map((member, i) => (
              <tr key={i} className="border-b border-[#1e2d4a] last:border-b-0 hover:bg-[#0a0f1e]/50 transition">
                <td className="px-6 py-4 text-[#f1f5f9] font-medium">{member.name}</td>
                <td className="px-6 py-4 text-[#94a3b8]">{member.role}</td>
                <td className="px-6 py-4 text-[#94a3b8]">{member.vessel}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    member.status === 'On Duty'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
