'use client';

import { useState } from 'react';
import { Plus, Flame, Users, AlertTriangle, Heart, LogOut, Eye, Check, X, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Drill {
  id: string;
  title: string;
  type: 'fire' | 'evacuation' | 'man-overboard' | 'abandon-ship' | 'medical';
  ship: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'Scheduled' | 'Completed' | 'Missed';
  attendance: Attendance[];
}

interface Attendance {
  id: string;
  name: string;
  attended: boolean;
}

const DRILL_TYPES: Record<string, { label: string; icon: LucideIcon }> = {
  fire: { label: 'Fire Drill', icon: Flame },
  evacuation: { label: 'Evacuation', icon: AlertTriangle },
  'man-overboard': { label: 'Man Overboard', icon: Users },
  'abandon-ship': { label: 'Abandon Ship', icon: LogOut },
  medical: { label: 'Medical Emergency', icon: Heart },
};

const CREWS: Record<string, string[]> = {
  'MV-2301': ['John Davis', 'Sarah Chen', 'David Brown', 'Mike Wilson', 'Emma Lee'],
  'MV-2302': ['John Davis', 'Sarah Chen', 'David Brown', 'Mike Wilson', 'Emma Lee'],
  'MV-2303': ['John Davis', 'Sarah Chen', 'David Brown', 'Mike Wilson', 'Emma Lee'],
};

const MOCK_DRILLS: Drill[] = [
  {
    id: '1',
    title: 'Fire Safety Drill',
    type: 'fire',
    ship: 'MV-2301',
    scheduledDate: '2024-05-15',
    scheduledTime: '10:00',
    status: 'Completed',
    attendance: [
      { id: '1', name: 'John Davis', attended: true },
      { id: '2', name: 'Sarah Chen', attended: true },
      { id: '3', name: 'David Brown', attended: true },
      { id: '4', name: 'Mike Wilson', attended: true },
      { id: '5', name: 'Emma Lee', attended: false },
    ],
  },
  {
    id: '2',
    title: 'Emergency Evacuation',
    type: 'evacuation',
    ship: 'MV-2302',
    scheduledDate: '2024-05-18',
    scheduledTime: '14:00',
    status: 'Scheduled',
    attendance: [
      { id: '1', name: 'John Davis', attended: false },
      { id: '2', name: 'Sarah Chen', attended: false },
      { id: '3', name: 'David Brown', attended: false },
      { id: '4', name: 'Mike Wilson', attended: false },
      { id: '5', name: 'Emma Lee', attended: false },
    ],
  },
  {
    id: '3',
    title: 'Man Overboard Drill',
    type: 'man-overboard',
    ship: 'MV-2303',
    scheduledDate: '2024-05-10',
    scheduledTime: '09:30',
    status: 'Completed',
    attendance: [
      { id: '1', name: 'John Davis', attended: true },
      { id: '2', name: 'Sarah Chen', attended: true },
      { id: '3', name: 'David Brown', attended: false },
      { id: '4', name: 'Mike Wilson', attended: true },
      { id: '5', name: 'Emma Lee', attended: true },
    ],
  },
  {
    id: '4',
    title: 'Medical Emergency Response',
    type: 'medical',
    ship: 'MV-2301',
    scheduledDate: '2024-05-05',
    scheduledTime: '11:00',
    status: 'Missed',
    attendance: [
      { id: '1', name: 'John Davis', attended: false },
      { id: '2', name: 'Sarah Chen', attended: false },
      { id: '3', name: 'David Brown', attended: false },
      { id: '4', name: 'Mike Wilson', attended: false },
      { id: '5', name: 'Emma Lee', attended: false },
    ],
  },
  {
    id: '5',
    title: 'Abandon Ship Procedure',
    type: 'abandon-ship',
    ship: 'MV-2302',
    scheduledDate: '2024-05-20',
    scheduledTime: '15:00',
    status: 'Scheduled',
    attendance: [
      { id: '1', name: 'John Davis', attended: false },
      { id: '2', name: 'Sarah Chen', attended: false },
      { id: '3', name: 'David Brown', attended: false },
      { id: '4', name: 'Mike Wilson', attended: false },
      { id: '5', name: 'Emma Lee', attended: false },
    ],
  },
  {
    id: '6',
    title: 'Fire Safety Drill',
    type: 'fire',
    ship: 'MV-2303',
    scheduledDate: '2024-05-12',
    scheduledTime: '13:00',
    status: 'Completed',
    attendance: [
      { id: '1', name: 'John Davis', attended: true },
      { id: '2', name: 'Sarah Chen', attended: true },
      { id: '3', name: 'David Brown', attended: true },
      { id: '4', name: 'Mike Wilson', attended: false },
      { id: '5', name: 'Emma Lee', attended: true },
    ],
  },
];

function getStatusColor(status: string): string {
  switch (status) {
    case 'Scheduled':
      return 'bg-[#3b82f6] text-white';
    case 'Completed':
      return 'bg-[#10b981] text-white';
    case 'Missed':
      return 'bg-[#ef4444] text-white';
    default:
      return 'bg-[#1e2d4a] text-[#94a3b8]';
  }
}

function ScheduleDrillDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    ship: '',
    date: '',
    time: '',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f1729] border border-[#1e2d4a]">
        <DialogHeader>
          <DialogTitle className="text-[#f1f5f9]">Schedule Drill</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1">Title</label>
            <input
              type="text"
              placeholder="Drill title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-3 py-2 text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1">Drill Type</label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="bg-[#0a0f1e] border border-[#1e2d4a] text-[#f1f5f9]">
                <SelectValue placeholder="Select drill type" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1729] border border-[#1e2d4a]">
                {Object.entries(DRILL_TYPES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key} className="text-[#f1f5f9]">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1">Ship</label>
            <Select value={formData.ship} onValueChange={(value) => setFormData({ ...formData, ship: value })}>
              <SelectTrigger className="bg-[#0a0f1e] border border-[#1e2d4a] text-[#f1f5f9]">
                <SelectValue placeholder="Select ship" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1729] border border-[#1e2d4a]">
                {Object.keys(CREWS).map((ship) => (
                  <SelectItem key={ship} value={ship} className="text-[#f1f5f9]">
                    {ship}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-3 py-2 text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-1">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-3 py-2 text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              />
            </div>
          </div>

          <Button className="w-full bg-[#3b82f6] hover:bg-[#1e3a8a] text-white">Schedule Drill</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DrillDetailSheet({
  drill,
  open,
  onOpenChange,
}: {
  drill: Drill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [attendance, setAttendance] = useState<Attendance[]>(drill?.attendance || []);

  if (!drill) return null;

  const DrillIcon = DRILL_TYPES[drill.type]?.icon || Flame;
  const attendedCount = attendance.filter((a) => a.attended).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-96 bg-[#0f1729] border-l border-[#1e2d4a]">
        <SheetHeader className="border-b border-[#1e2d4a] pb-4">
          <SheetTitle className="text-[#f1f5f9]">{drill.title}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Drill Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#1e2d4a] p-3 rounded-lg">
                <DrillIcon className="w-5 h-5 text-[#3b82f6]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Drill Type</p>
                <p className="text-[#f1f5f9] mt-1">{DRILL_TYPES[drill.type]?.label}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Ship</p>
              <p className="text-[#f1f5f9] mt-1">{drill.ship}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Date</p>
                <p className="text-[#f1f5f9] mt-1">{drill.scheduledDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Time</p>
                <p className="text-[#f1f5f9] mt-1">{drill.scheduledTime}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Status</p>
              <div className="mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(drill.status)}`}>
                  {drill.status}
                </span>
              </div>
            </div>
          </div>

          {/* Attendance Section */}
          <div className="border-t border-[#1e2d4a] pt-4">
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-3">
              Attendance ({attendedCount}/{attendance.length})
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {attendance.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between bg-[#0a0f1e] rounded-lg p-3"
                >
                  <p className="text-sm text-[#f1f5f9]">{person.name}</p>
                  <button
                    onClick={() =>
                      setAttendance(
                        attendance.map((a) =>
                          a.id === person.id ? { ...a, attended: !a.attended } : a
                        )
                      )
                    }
                    className="focus:outline-none"
                  >
                    {person.attended ? (
                      <Check className="w-5 h-5 text-[#10b981]" />
                    ) : (
                      <X className="w-5 h-5 text-[#ef4444]" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function DrillsPage() {
  const [drills] = useState<Drill[]>(MOCK_DRILLS);
  const [scheduleDrillOpen, setScheduleDrillOpen] = useState(false);
  const [selectedDrillId, setSelectedDrillId] = useState<string | null>(null);

  const selectedDrill = drills.find((d) => d.id === selectedDrillId) || null;

  const totalDrills = drills.length;
  const upcomingDrills = drills.filter((d) => d.status === 'Scheduled').length;
  const completedDrills = drills.filter((d) => d.status === 'Completed').length;
  const completionRate = totalDrills > 0 ? Math.round((completedDrills / totalDrills) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#f1f5f9]">Safety Drills</h1>
        <Button
          onClick={() => setScheduleDrillOpen(true)}
          className="w-full sm:w-auto bg-[#3b82f6] hover:bg-[#1e3a8a] text-white flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Schedule Drill
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Total Drills This Month</p>
          <p className="text-4xl font-bold text-[#f1f5f9] mt-2">{totalDrills}</p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Upcoming Drills</p>
          <p className="text-4xl font-bold text-[#f1f5f9] mt-2">{upcomingDrills}</p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <p className="text-[#94a3b8] text-sm font-medium">Completion Rate</p>
          <p className="text-4xl font-bold text-[#f1f5f9] mt-2">{completionRate}%</p>
        </div>
      </div>

      {/* Drills List - Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drills.map((drill) => {
          const DrillIcon = DRILL_TYPES[drill.type]?.icon || Flame;
          const attendedCount = drill.attendance.filter((a) => a.attended).length;

          return (
            <div
              key={drill.id}
              className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-5 space-y-4 hover:border-[#3b82f6]/50 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-[#1e2d4a] p-2 rounded-lg">
                    <DrillIcon className="w-5 h-5 text-[#3b82f6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#f1f5f9] text-sm wrap-break-word">{drill.title}</h3>
                    <p className="text-xs text-[#94a3b8] mt-1">{drill.ship}</p>
                  </div>
                </div>
                <span className={`shrink-0 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${getStatusColor(drill.status)}`}>
                  {drill.status}
                </span>
              </div>

              <div className="border-t border-[#1e2d4a] pt-3">
                <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-3">
                  <span>{drill.scheduledDate} at {drill.scheduledTime}</span>
                </div>
                <div className="text-xs text-[#3b82f6] font-medium mb-3">
                  {attendedCount}/{drill.attendance.length} attended
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDrillId(drill.id)}
                  className="w-full text-[#3b82f6] hover:bg-[#1e2d4a] text-xs"
                >
                  <Eye className="w-3 h-3 mr-2" />
                  View
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drills List - Mobile */}
      <div className="md:hidden space-y-3">
        {drills.map((drill) => {
          const DrillIcon = DRILL_TYPES[drill.type]?.icon || Flame;
          const attendedCount = drill.attendance.filter((a) => a.attended).length;

          return (
            <div
              key={drill.id}
              className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="bg-[#1e2d4a] p-2 rounded-lg shrink-0">
                    <DrillIcon className="w-4 h-4 text-[#3b82f6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#f1f5f9] text-sm wrap-break-word">{drill.title}</h3>
                    <p className="text-xs text-[#94a3b8] mt-1">{drill.ship}</p>
                  </div>
                </div>
                <span className={`shrink-0 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(drill.status)}`}>
                  {drill.status}
                </span>
              </div>

              <div className="border-t border-[#1e2d4a] pt-3">
                <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-3">
                  <span>{drill.scheduledDate}</span>
                  <span>{drill.scheduledTime}</span>
                </div>
                <div className="text-xs text-[#3b82f6] font-medium mb-3">
                  {attendedCount}/{drill.attendance.length} attended
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDrillId(drill.id)}
                  className="w-full text-[#3b82f6] hover:bg-[#1e2d4a] text-xs"
                >
                  <Eye className="w-3 h-3 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <ScheduleDrillDialog open={scheduleDrillOpen} onOpenChange={setScheduleDrillOpen} />
      <DrillDetailSheet
        drill={selectedDrill}
        open={!!selectedDrillId}
        onOpenChange={(open) => !open && setSelectedDrillId(null)}
      />
    </div>
  );
}
