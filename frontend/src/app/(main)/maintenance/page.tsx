'use client'

import { useState, useEffect } from 'react'
import { Plus, Eye, MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import api from '@/lib/api'
import { toast } from 'sonner'

interface Task {
  id: string
  title: string
  description: string
  ship_name: string
  ship_id: string
  assigned_to_name: string
  assigned_to_id: string
  due_date: string
  status: 'pending' | 'in_progress' | 'completed'
  is_overdue: boolean
}

interface Comment {
  id: string
  comment: string
  author_name: string
  created_at: string
}

interface Ship {
  id: string
  name: string
  registration_number: string
}

interface CrewMember {
  id: string
  name: string
}

function getStatusColor(status: string, isOverdue: boolean): string {
  if (isOverdue) return 'bg-[#ef4444] text-white'
  switch (status) {
    case 'pending': return 'bg-[#f59e0b] text-white'
    case 'in_progress': return 'bg-[#3b82f6] text-white'
    case 'completed': return 'bg-[#10b981] text-white'
    default: return 'bg-[#1e2d4a] text-[#94a3b8]'
  }
}

function getStatusLabel(status: string, isOverdue: boolean): string {
  if (isOverdue) return 'Overdue'
  switch (status) {
    case 'pending': return 'Pending'
    case 'in_progress': return 'In Progress'
    case 'completed': return 'Completed'
    default: return status
  }
}

function TaskDetailModal({
  taskId,
  open,
  onOpenChange,
}: {
  taskId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [task, setTask] = useState<Task | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)

  useEffect(() => {
    if (!taskId || !open) return
    const fetchTask = async () => {
      setLoading(true)
      try {
        const [taskRes, commentsRes] = await Promise.all([
          api.get(`/maintenance/${taskId}`),
          api.get(`/maintenance/${taskId}/comments`)
        ])
        setTask(taskRes.data.data.task)
        setComments(commentsRes.data.data.comments)
      } catch (err) {
        console.error('Failed to fetch task details')
      } finally {
        setLoading(false)
      }
    }
    fetchTask()
  }, [taskId, open])

const handleAddComment = async () => {
  if (!newComment.trim() || !taskId) return
  setSubmitting(true)
  try {
    const res = await api.post(`/maintenance/${taskId}/comments`, {
      comment: newComment
    })
    setComments([...comments, res.data.data.comment])
    setNewComment('')
    toast.success('Comment added')
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Failed to add comment')
  } finally {
    setSubmitting(false)
  }
}

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#0f1729] border border-[#1e2d4a] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#f1f5f9]">
              {loading ? 'Loading...' : task?.title}
            </DialogTitle>
          </DialogHeader>

          {!loading && task && (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Description</p>
                  <p className="text-[#f1f5f9] mt-1">{task.description || 'No description'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Ship</p>
                    <p className="text-[#f1f5f9] mt-1">{task.ship_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Assigned To</p>
                    <p className="text-[#f1f5f9] mt-1">{task.assigned_to_name || 'Unassigned'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Due Date</p>
                    <p className="text-[#f1f5f9] mt-1">
                      {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Status</p>
                    <span className={`mt-1 inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(task.status, task.is_overdue)}`}>
                      {getStatusLabel(task.status, task.is_overdue)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#1e2d4a]">
                <button
                  onClick={() => setCommentsOpen(!commentsOpen)}
                  className="w-full flex items-center justify-between py-4 hover:bg-[#0a0f1e]/50 transition rounded-lg px-2"
                >
                  <h3 className="text-sm font-semibold text-[#f1f5f9] flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Comments ({comments.length})
                  </h3>
                  <span className="text-[#94a3b8] text-xs">{commentsOpen ? '▼' : '▶'}</span>
                </button>

                {commentsOpen && (
                  <div className="space-y-3 mt-3 pl-2">
                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                      {comments.map((comment) => (
                        <div key={comment.id} className="bg-[#0a0f1e] rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-[#f1f5f9]">{comment.author_name}</p>
                            <p className="text-xs text-[#94a3b8]">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-sm text-[#94a3b8]">{comment.comment}</p>
                        </div>
                      ))}
                      {comments.length === 0 && (
                        <p className="text-sm text-[#94a3b8] text-center py-4">No comments yet</p>
                      )}
                    </div>
                    <div className="space-y-2 border-t border-[#1e2d4a] pt-3">
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
                        disabled={!newComment.trim() || submitting}
                        onClick={handleAddComment}
                      >
                        {submitting ? 'Submitting...' : 'Submit Comment'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function AddTaskDialog({
  open,
  onOpenChange,
  ships,
  onTaskCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  ships: Ship[]
  onTaskCreated: () => void
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shipId: '',
    assignedTo: '',
    dueDate: '',
  })
  const [crew, setCrew] = useState<CrewMember[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

const handleShipChange = async (shipId: string) => {
  setFormData({ ...formData, shipId, assignedTo: '' })
  try {
    const res = await api.get(`/ships/${shipId}/crew`)
    const crewData = res.data.data.crew
    setCrew(crewData)
    if (crewData.length === 0) {
      toast.warning('No crew assigned to this ship')
    }
  } catch {
    toast.error('Failed to load crew members')
    setCrew([])
  }
}

 const handleSubmit = async () => {
  if (!formData.title) return toast.error('Title is required')
  if (!formData.shipId) return toast.error('Please select a ship')
  if (!formData.dueDate) return toast.error('Due date is required')

  setLoading(true)
  try {
    await api.post('/maintenance', formData)
    toast.success('Task created successfully')
    onTaskCreated()
    onOpenChange(false)
    setFormData({ title: '', description: '', shipId: '', assignedTo: '', dueDate: '' })
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Failed to create task')
  } finally {
    setLoading(false)
  }
}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f1729] border border-[#1e2d4a]">
        <DialogHeader>
          <DialogTitle className="text-[#f1f5f9]">Add Maintenance Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

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
            <Select value={formData.shipId} onValueChange={handleShipChange}>
              <SelectTrigger className="bg-[#0a0f1e] border border-[#1e2d4a] text-[#f1f5f9]">
                <SelectValue placeholder="Select ship" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1729] border border-[#1e2d4a]">
                {ships.map((ship) => (
                  <SelectItem key={ship.id} value={ship.id} className="text-[#f1f5f9]">
                    {ship.name} ({ship.registration_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1">Assign To</label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
              disabled={!formData.shipId}
            >
              <SelectTrigger className="bg-[#0a0f1e] border border-[#1e2d4a] text-[#f1f5f9]">
                <SelectValue placeholder={formData.shipId ? 'Select crew member' : 'Select ship first'} />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1729] border border-[#1e2d4a]">
                {crew.map((member) => (
                  <SelectItem key={member.id} value={member.id} className="text-[#f1f5f9]">
                    {member.name}
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

          <Button
            className="w-full bg-[#3b82f6] hover:bg-[#1e3a8a] text-white"
            onClick={handleSubmit}
            disabled={loading || !formData.title || !formData.shipId || !formData.dueDate}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function MaintenancePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [ships, setShips] = useState<Ship[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedShip, setSelectedShip] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [addTaskOpen, setAddTaskOpen] = useState(false)
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const fetchTasks = async () => {
  try {
    const params = new URLSearchParams()
    if (selectedShip !== 'all') params.append('shipId', selectedShip)
    if (selectedStatus !== 'all') params.append('status', selectedStatus)
    if (dateRange.start) params.append('startDate', dateRange.start)
    if (dateRange.end) params.append('endDate', dateRange.end)

    const res = await api.get(`/maintenance?${params.toString()}`)
    setTasks(res.data.data.tasks)
  } catch (err: any) {
    toast.error('Failed to load tasks')
  } finally {
    setLoading(false)
  }
}

const fetchShips = async () => {
  try {
    const res = await api.get('/ships')
    setShips(res.data.data.ships)
  } catch (err) {
    toast.error('Failed to load ships')
  }
}

  useEffect(() => {
    fetchShips()
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [selectedShip, selectedStatus, dateRange])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#f1f5f9]">Maintenance Tasks</h1>
          <p className="text-[#94a3b8] mt-2 text-sm">Manage vessel maintenance schedules and track task progress</p>
        </div>
        <Button
          onClick={() => setAddTaskOpen(true)}
          className="bg-[#3b82f6] hover:bg-[#1e3a8a] text-white flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-4">
        <Select value={selectedShip} onValueChange={setSelectedShip}>
          <SelectTrigger className="bg-[#0f1729] border border-[#1e2d4a] text-[#f1f5f9]">
            <SelectValue placeholder="All Ships" />
          </SelectTrigger>
          <SelectContent className="bg-[#0f1729] border border-[#1e2d4a]">
            <SelectItem value="all" className="text-[#f1f5f9]">All Ships</SelectItem>
            {ships.map((ship) => (
              <SelectItem key={ship.id} value={ship.id} className="text-[#f1f5f9]">
                {ship.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="bg-[#0f1729] border border-[#1e2d4a] text-[#f1f5f9]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-[#0f1729] border border-[#1e2d4a]">
            <SelectItem value="all" className="text-[#f1f5f9]">All</SelectItem>
            <SelectItem value="pending" className="text-[#f1f5f9]">Pending</SelectItem>
            <SelectItem value="in_progress" className="text-[#f1f5f9]">In Progress</SelectItem>
            <SelectItem value="completed" className="text-[#f1f5f9]">Completed</SelectItem>
            <SelectItem value="overdue" className="text-[#f1f5f9]">Overdue</SelectItem>
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

      {/* Table */}
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
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-[#94a3b8]">
                  Loading...
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-[#94a3b8]">
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-[#1e2d4a] last:border-b-0 hover:bg-[#0a0f1e] transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4 text-[#f1f5f9] font-medium">{task.title}</td>
                  <td className="px-6 py-4 text-[#94a3b8]">{task.ship_name}</td>
                  <td className="px-6 py-4 text-[#94a3b8]">{task.assigned_to_name || '—'}</td>
                  <td className="px-6 py-4 text-[#94a3b8]">
                    {new Date(task.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status, task.is_overdue)}`}>
                      {getStatusLabel(task.status, task.is_overdue)}
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
            )}
          </tbody>
        </table>
      </div>

      <AddTaskDialog
        open={addTaskOpen}
        onOpenChange={setAddTaskOpen}
        ships={ships}
        onTaskCreated={fetchTasks}
      />
      <TaskDetailModal
        taskId={detailTaskId}
        open={!!detailTaskId}
        onOpenChange={(open) => !open && setDetailTaskId(null)}
      />
    </div>
  )
}
