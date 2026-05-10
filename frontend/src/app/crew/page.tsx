'use client';

import { useState } from 'react';
import { CheckCircle, Clock, Flame, AlertTriangle, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  ship: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

interface Drill {
  id: string;
  title: string;
  type: 'fire' | 'evacuation' | 'man-overboard' | 'abandon-ship' | 'medical';
  ship: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'Scheduled' | 'Completed' | 'Missed';
}

const myTasks: Task[] = [
  {
    id: '1',
    title: 'Engine bearing inspection',
    ship: 'MV-2301',
    dueDate: '2024-05-20',
    status: 'In Progress',
  },
  {
    id: '2',
    title: 'Electrical system upgrade',
    ship: 'MV-2301',
    dueDate: '2024-05-12',
    status: 'Completed',
  },
  {
    id: '3',
    title: 'Safety valve testing',
    ship: 'MV-2301',
    dueDate: '2024-05-22',
    status: 'Pending',
  },
  {
    id: '4',
    title: 'Propeller maintenance',
    ship: 'MV-2301',
    dueDate: '2024-05-28',
    status: 'Pending',
  },
];

const upcomingDrills: Drill[] = [
  {
    id: '1',
    title: 'Fire Safety Drill',
    type: 'fire',
    ship: 'MV-2301',
    scheduledDate: '2024-05-20',
    scheduledTime: '10:00',
    status: 'Scheduled',
  },
  {
    id: '2',
    title: 'Emergency Evacuation',
    type: 'evacuation',
    ship: 'MV-2301',
    scheduledDate: '2024-05-25',
    scheduledTime: '14:00',
    status: 'Scheduled',
  },
  {
    id: '3',
    title: 'Safety valve testing',
    type: 'man-overboard',
    ship: 'MV-2301',
    scheduledDate: '2024-05-28',
    scheduledTime: '11:00',
    status: 'Scheduled',
  },
];

const DRILL_ICONS: Record<string, LucideIcon> = {
  fire: Flame,
  evacuation: AlertTriangle,
  'man-overboard': Users,
  'abandon-ship': LogOut,
  medical: AlertTriangle,
};

function getStatusColor(status: string): string {
  switch (status) {
    case 'Pending':
      return 'bg-[#f59e0b] text-white';
    case 'In Progress':
      return 'bg-[#3b82f6] text-white';
    case 'Completed':
      return 'bg-[#10b981] text-white';
    case 'Scheduled':
      return 'bg-[#3b82f6] text-white';
    case 'Missed':
      return 'bg-[#ef4444] text-white';
    default:
      return 'bg-[#1e2d4a] text-[#94a3b8]';
  }
}

function getComplianceScore(): number {
  const completedTasks = myTasks.filter((t) => t.status === 'Completed').length;
  const completedDrills = upcomingDrills.filter((d) => d.status === 'Completed').length;
  const totalItems = myTasks.length + upcomingDrills.length;
  return Math.round(((completedTasks + completedDrills) / totalItems) * 100);
}

export default function CrewPage() {
  const [tasks, setTasks] = useState<Task[]>(myTasks);
  const [drills, setDrills] = useState<Drill[]>(upcomingDrills);
  const complianceScore = getComplianceScore();

  const handleMarkInProgress = (taskId: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'In Progress' as const } : t
      )
    );
  };

  const handleMarkComplete = (taskId: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'Completed' as const } : t
      )
    );
  };

  const handleMarkAttended = (drillId: string) => {
    setDrills(
      drills.map((d) =>
        d.id === drillId ? { ...d, status: 'Completed' as const } : d
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#f1f5f9]">Welcome, John Davis</h1>
          <p className="text-[#94a3b8] mt-1">Chief Officer</p>
        </div>
        <div className="bg-[#3b82f6] text-white px-4 py-2 rounded-full text-sm font-semibold">
          Admin
        </div>
      </div>

      {/* Personal Compliance Score */}
      <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6 sm:p-8">
        <p className="text-[#94a3b8] text-sm font-medium">Personal Compliance Score</p>
        <div className="flex items-center gap-4 mt-4">
          <div className="text-6xl sm:text-7xl font-bold" style={{
            color: complianceScore >= 80 ? '#10b981' : complianceScore >= 60 ? '#f59e0b' : '#ef4444'
          }}>
            {complianceScore}%
          </div>
          <div className="text-[#94a3b8]">
            <p className="text-sm">{tasks.filter(t => t.status === 'Completed').length}/{tasks.length} Tasks Completed</p>
            <p className="text-sm">{drills.filter(d => d.status === 'Completed').length}/{drills.length} Drills Attended</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">My Tasks</h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="border border-[#1e2d4a] rounded-lg p-4 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-[#f1f5f9]">{task.title}</h3>
                  <p className="text-xs text-[#94a3b8] mt-1">{task.ship}</p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#94a3b8]">{task.dueDate}</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  {task.status === 'Pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkInProgress(task.id)}
                      className="flex-1 bg-[#3b82f6] hover:bg-[#1e3a8a] text-white text-xs h-8"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      In Progress
                    </Button>
                  )}
                  {task.status === 'In Progress' && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkComplete(task.id)}
                      className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white text-xs h-8"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Drills */}
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">Upcoming Drills</h2>
          <div className="space-y-3">
            {drills.map((drill) => {
              const DrillIcon = DRILL_ICONS[drill.type] || Flame;
              return (
                <div key={drill.id} className="border border-[#1e2d4a] rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#1e2d4a] p-2 rounded shrink-0">
                      <DrillIcon className="w-4 h-4 text-[#3b82f6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#f1f5f9] wrap-break-word">{drill.title}</h3>
                      <p className="text-xs text-[#94a3b8] mt-1">{drill.ship}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#94a3b8]">{drill.scheduledDate} at {drill.scheduledTime}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(drill.status)}`}>
                      {drill.status}
                    </span>
                  </div>

                  {drill.status === 'Scheduled' && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkAttended(drill.id)}
                      className="w-full bg-[#10b981] hover:bg-[#059669] text-white text-xs h-8"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Mark Attended
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
