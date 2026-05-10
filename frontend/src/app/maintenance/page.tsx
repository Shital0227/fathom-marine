'use client';

import { useState } from 'react';
import { Plus, Eye, MessageCircle, Calendar, ChevronDown } from 'lucide-react';
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

interface Task {
  id: string;
  title: string;
  description: string;
  ship: string;
  assignedTo: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Engine bearing inspection',
    description: 'Routine inspection of engine bearings for wear and proper lubrication',
    ship: 'MV-2301',
    assignedTo: 'John Davis',
    dueDate: '2024-05-20',
    status: 'In Progress',
    comments: [
      { id: '1', author: 'John Davis', text: 'Started inspection today', timestamp: '2024-05-15' },
    ],
  },
  {
    id: '2',
    title: 'Hull integrity check',
    description: 'Visual and instrumental inspection of hull for corrosion and structural damage',
    ship: 'MV-2302',
    assignedTo: 'Sarah Chen',
    dueDate: '2024-05-25',
    status: 'Pending',
    comments: [],
  },
  {
    id: '3',
    title: 'Propeller maintenance',
    description: 'Propeller cleaning and blade balance verification',
    ship: 'MV-2303',
    assignedTo: 'David Brown',
    dueDate: '2024-05-18',
    status: 'Overdue',
    comments: [
      { id: '1', author: 'David Brown', text: 'Waiting for parts delivery', timestamp: '2024-05-14' },
    ],
  },
  {
    id: '4',
    title: 'Electrical system upgrade',
    description: 'Replace outdated wiring in engine room',
    ship: 'MV-2301',
    assignedTo: 'John Davis',
    dueDate: '2024-05-12',
    status: 'Completed',
    comments: [
      { id: '1', author: 'John Davis', text: 'Completed successfully', timestamp: '2024-05-12' },
    ],
  },
  {
    id: '5',
    title: 'Ballast tank cleaning',
    description: 'Deep clean and inspection of ballast tanks',
    ship: 'MV-2302',
    assignedTo: 'Sarah Chen',
    dueDate: '2024-05-16',
    status: 'Overdue',
    comments: [],
  },
  {
    id: '6',
    title: 'Navigation equipment calibration',
    description: 'Calibrate GPS, radar, and sonar systems',
    ship: 'MV-2303',
    assignedTo: 'David Brown',
    dueDate: '2024-05-28',
    status: 'Pending',
    comments: [
      { id: '1', author: 'David Brown', text: 'Scheduled for next week', timestamp: '2024-05-13' },
    ],
  },
  {
    id: '7',
    title: 'Safety valve testing',
    description: 'Pressure relief valve testing and recalibration',
    ship: 'MV-2301',
    assignedTo: 'John Davis',
    dueDate: '2024-05-22',
    status: 'In Progress',
    comments: [],
  },
  {
    id: '8',
    title: 'Lifeboat equipment inspection',
    description: 'Inspect and service lifeboats and rescue equipment',
    ship: 'MV-2302',
    assignedTo: 'Sarah Chen',
    dueDate: '2024-05-30',
    status: 'Pending',
    comments: [],
  },
];

const SHIPS = ['All Ships', 'MV-2301', 'MV-2302', 'MV-2303'];
const CREW = ['John Davis', 'Sarah Chen', 'David Brown'];
const STATUSES = ['All', 'Pending', 'In Progress', 'Completed', 'Overdue'];

function getStatusColor(status: string): string {
  switch (status) {
    case 'Pending':
      return 'bg-[#f59e0b] text-white';
    case 'In Progress':
      return 'bg-[#3b82f6] text-white';
    case 'Completed':
      return 'bg-[#10b981] text-white';
    case 'Overdue':
      return 'bg-[#ef4444] text-white';
    default:
      return 'bg-[#1e2d4a] text-[#94a3b8]';
  }
}

function TaskDetailSheet({
  task,
  open,
  onOpenChange,
}: {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [newComment, setNewComment] = useState('');

  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-96 bg-[#0f1729] border-l border-[#1e2d4a]">
        <SheetHeader className="border-b border-[#1e2d4a] pb-4">
          <SheetTitle className="text-[#f1f5f9]">{task.title}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Task Details */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Description</p>
              <p className="text-[#f1f5f9] mt-1">{task.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Ship</p>
                <p className="text-[#f1f5f9] mt-1">{task.ship}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Assigned To</p>
                <p className="text-[#f1f5f9] mt-1">{task.assignedTo}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Due Date</p>
                <p className="text-[#f1f5f9] mt-1">{task.dueDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Status</p>
                <div className="mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-[#1e2d4a] pt-4">
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Comments
            </h3>

            {/* Comments List */}
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {task.comments.map((comment) => (
                <div key={comment.id} className="bg-[#0a0f1e] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-[#f1f5f9]">{comment.author}</p>
                    <p className="text-xs text-[#94a3b8]">{comment.timestamp}</p>
                  </div>
                  <p className="text-sm text-[#94a3b8]">{comment.text}</p>
                </div>
              ))}
              {task.comments.length === 0 && (
                <p className="text-sm text-[#94a3b8] text-center py-4">No comments yet</p>
              )}
            </div>

            {/* Add Comment */}
            <div className="space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg p-2 text-sm text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                rows={2}
              />
              <Button
                size="sm"
                className="w-full bg-[#3b82f6] hover:bg-[#1e3a8a] text-white"
                disabled={!newComment.trim()}
              >
                Submit Comment
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function AddTaskDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ship: '',
    assignTo: '',
    dueDate: '',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f1729] border border-[#1e2d4a]">
        <DialogHeader>
          <DialogTitle className="text-[#f1f5f9]">Add Maintenance Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1">Title</label>
            <input
              type="text"
              placeholder="Task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-3 py-2 text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1">Description</label>
            <textarea
              placeholder="Task description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-3 py-2 text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1">Ship</label>
            <Select value={formData.ship} onValueChange={(value) => setFormData({ ...formData, ship: value })}>
              <SelectTrigger className="bg-[#0a0f1e] border border-[#1e2d4a] text-[#f1f5f9]">
                <SelectValue placeholder="Select ship" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1729] border border-[#1e2d4a]">
                {SHIPS.filter((s) => s !== 'All Ships').map((ship) => (
                  <SelectItem key={ship} value={ship} className="text-[#f1f5f9]">
                    {ship}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1">Assign To</label>
            <Select value={formData.assignTo} onValueChange={(value) => setFormData({ ...formData, assignTo: value })}>
              <SelectTrigger className="bg-[#0a0f1e] border border-[#1e2d4a] text-[#f1f5f9]">
                <SelectValue placeholder="Select crew member" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1729] border border-[#1e2d4a]">
                {CREW.map((member) => (
                  <SelectItem key={member} value={member} className="text-[#f1f5f9]">
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-3 py-2 text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>

          <Button className="w-full bg-[#3b82f6] hover:bg-[#1e3a8a] text-white">Create Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MaintenancePage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedShip, setSelectedShip] = useState('All Ships');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const selectedTask = tasks.find((t) => t.id === detailTaskId) || null;

  const filteredTasks = tasks.filter((task) => {
    const shipMatch = selectedShip === 'All Ships' || task.ship === selectedShip;
    const statusMatch = selectedStatus === 'All' || task.status === selectedStatus;
    return shipMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#f1f5f9]">Maintenance Tasks</h1>
        <Button
          onClick={() => setAddTaskOpen(true)}
          className="bg-[#3b82f6] hover:bg-[#1e3a8a] text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={selectedShip} onValueChange={setSelectedShip}>
          <SelectTrigger className="bg-[#0f1729] border border-[#1e2d4a] text-[#f1f5f9]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#0f1729] border border-[#1e2d4a]">
            {SHIPS.map((ship) => (
              <SelectItem key={ship} value={ship} className="text-[#f1f5f9]">
                {ship}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="bg-[#0f1729] border border-[#1e2d4a] text-[#f1f5f9]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#0f1729] border border-[#1e2d4a]">
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status} className="text-[#f1f5f9]">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="flex-1 bg-[#0f1729] border border-[#1e2d4a] rounded-lg px-3 py-2 text-[#f1f5f9] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="flex-1 bg-[#0f1729] border border-[#1e2d4a] rounded-lg px-3 py-2 text-[#f1f5f9] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          />
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-[#1e2d4a] bg-[#0a0f1e]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Task Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Ship</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Assigned To</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Due Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#94a3b8]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task.id} className="border-b border-[#1e2d4a] last:border-b-0 hover:bg-[#0f1729]/50 transition">
                  <td className="px-6 py-4 text-[#f1f5f9] font-medium">{task.title}</td>
                  <td className="px-6 py-4 text-[#94a3b8]">{task.ship}</td>
                  <td className="px-6 py-4 text-[#94a3b8]">{task.assignedTo}</td>
                  <td className="px-6 py-4 text-[#94a3b8]">{task.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDetailTaskId(task.id)}
                      className="text-[#3b82f6] hover:bg-[#1e2d4a]"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-[#94a3b8]">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialogs */}
      <AddTaskDialog open={addTaskOpen} onOpenChange={setAddTaskOpen} />
      <TaskDetailSheet task={selectedTask} open={!!detailTaskId} onOpenChange={(open) => !open && setDetailTaskId(null)} />
    </div>
  );
}
