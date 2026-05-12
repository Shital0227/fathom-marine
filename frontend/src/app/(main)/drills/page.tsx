'use client'

import { useState, useEffect } from 'react'
import { Plus, Flame, AlertTriangle, Users, LogOut, Heart, Eye, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import api from '@/lib/api'
import { toast } from 'sonner'

interface Drill {
  id: string
  title: string
  drill_type: string
  scheduled_date: string
  status: 'scheduled' | 'completed' | 'missed'
  ship_name: string
  ship_id: string
  total_crew: number
  attended_count: number
}

interface AttendanceMember {
  id: string
  user_id: string
  crew_name: string
  attended: boolean
}

interface Ship {
  id: string
  name: string
  registration_number: string
}

const DRILL_TYPES: Record<string, { label: string; icon: any }> = {
  fire: { label: 'Fire Drill', icon: Flame },
  evacuation: { label: 'Evacuation', icon: AlertTriangle },
  man_overboard: { label: 'Man Overboard', icon: Users },
  abandon_ship: { label: 'Abandon Ship', icon: LogOut },
  medical: { label: 'Medical Emergency', icon: Heart },
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'scheduled': return 'bg-[#3b82f6] text-white'
    case 'completed': return 'bg-[#10b981] text-white'
    case 'missed': return 'bg-[#ef4444] text-white'
    default: return 'bg-[#1e2d4a] text-[#94a3b8]'
  }
}

function DrillDetailModal({
  drillId, open, onOpenChange, onAttendanceUpdate
}: {
  drillId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAttendanceUpdate: () => void
}) {
  const [drill, setDrill] = useState<any>(null)
  const [attendance, setAttendance] = useState<AttendanceMember[]>([])
  const [loading, setLoading] = useState(false)
  const [attendanceOpen, setAttendanceOpen] = useState(true)

  useEffect(() => {
    if (!drillId || !open) return
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/drills/${drillId}`)
        setDrill(res.data.data.drill)
        setAttendance(res.data.data.drill.attendance || [])
      } catch { } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [drillId, open])

const handleToggleAttendance = async (userId: string, currentAttended: boolean) => {
  try {
    await api.post(`/drills/${drillId}/attend`, { attended: !currentAttended })
    setAttendance(attendance.map(a =>
      a.user_id === userId ? { ...a, attended: !currentAttended } : a
    ))
    toast.success(currentAttended ? 'Marked as absent' : 'Marked as attended')
    onAttendanceUpdate()
  } catch {
    toast.error('Failed to update attendance')
  }
}

  const DrillIcon = drill ? (DRILL_TYPES[drill.drill_type]?.icon || Flame) : Flame
  const attendedCount = attendance.filter(a => a.attended).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f1729] border border-[#1e2d4a] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#f1f5f9]">
            {loading ? 'Loading...' : drill?.title}
          </DialogTitle>
        </DialogHeader>

        {!loading && drill && (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#1e2d4a] p-3 rounded-lg">
                  <DrillIcon className="w-5 h-5 text-[#3b82f6]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Drill Type</p>
                  <p className="text-[#f1f5f9] font-medium mt-0.5">{DRILL_TYPES[drill.drill_type]?.label}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Ship</p>
                  <p className="text-[#f1f5f9] mt-1">{drill.ship_name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Scheduled</p>
                  <p className="text-[#f1f5f9] mt-1">{new Date(drill.scheduled_date).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Status</p>
                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(drill.status)}`}>
                  {drill.status}
                </span>
              </div>
            </div>

            <div className="border-t border-[#1e2d4a]">
              <button
                onClick={() => setAttendanceOpen(!attendanceOpen)}
                className="w-full flex items-center justify-between py-4 hover:bg-[#0a0f1e]/50 transition rounded-lg px-2"
              >
                <h3 className="text-sm font-semibold text-[#f1f5f9]">
                  Attendance ({attendedCount}/{attendance.length})
                </h3>
                <span className="text-[#94a3b8] text-xs">{attendanceOpen ? '▼' : '▶'}</span>
              </button>

              {attendanceOpen && (
                <div className="space-y-2 pl-2 pb-2">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {attendance.map((person) => (
                      <div key={person.id} className="flex items-center justify-between bg-[#0a0f1e] rounded-lg p-3 hover:border-[#1e2d4a] border border-transparent transition">
                        <p className="text-sm text-[#f1f5f9]">{person.crew_name}</p>
                        <button onClick={() => handleToggleAttendance(person.user_id, person.attended)} className="transition-colors hover:text-[#3b82f6]">
                          {person.attended
                            ? <Check className="w-5 h-5 text-[#10b981]" />
                            : <X className="w-5 h-5 text-[#ef4444]" />
                          }
                        </button>
                      </div>
                    ))}
                    {attendance.length === 0 && (
                      <p className="text-sm text-[#94a3b8] text-center py-4">No crew assigned</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function ScheduleDrillDialog({
  open, onOpenChange, ships, onDrillCreated
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  ships: Ship[]
  onDrillCreated: () => void
}) {
  const [formData, setFormData] = useState({
    title: '', drillType: '', shipId: '', date: '', time: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

 const handleSubmit = async () => {
  if (!formData.title) return toast.error('Title is required')
  if (!formData.drillType) return toast.error('Please select drill type')
  if (!formData.shipId) return toast.error('Please select a ship')
  if (!formData.date) return toast.error('Please select a date')
  if (!formData.time) return toast.error('Please select a time')

  setLoading(true)
  try {
    const scheduledDate = `${formData.date}T${formData.time}:00`
    await api.post('/drills', {
      title: formData.title,
      drillType: formData.drillType,
      shipId: formData.shipId,
      scheduledDate
    })
    toast.success('Drill scheduled successfully')
    onDrillCreated()
    onOpenChange(false)
    setFormData({ title: '', drillType: '', shipId: '', date: '', time: '' })
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Failed to schedule drill')
  } finally {
    setLoading(false)
  }
}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f1729] border border-[#1e2d4a]">
        <DialogHeader>
          <DialogTitle className="text-[#f1f5f9]">Schedule Drill</DialogTitle>
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
              placeholder="Drill title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-3 py-2 text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1">Drill Type</label>
            <Select value={formData.drillType} onValueChange={(v) => setFormData({ ...formData, drillType: v })}>
              <SelectTrigger className="bg-[#0a0f1e] border border-[#1e2d4a] text-[#f1f5f9]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1729] border border-[#1e2d4a]">
                {Object.entries(DRILL_TYPES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key} className="text-[#f1f5f9]">{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1">Ship</label>
            <Select value={formData.shipId} onValueChange={(v) => setFormData({ ...formData, shipId: v })}>
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

          <Button
            className="w-full bg-[#3b82f6] hover:bg-[#1e3a8a] text-white"
            onClick={handleSubmit}
            disabled={loading || !formData.title || !formData.drillType || !formData.shipId || !formData.date || !formData.time}
          >
            {loading ? 'Scheduling...' : 'Schedule Drill'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function DrillsPage() {
  const [drills, setDrills] = useState<Drill[]>([])
  const [ships, setShips] = useState<Ship[]>([])
  const [loading, setLoading] = useState(true)
  const [scheduleDrillOpen, setScheduleDrillOpen] = useState(false)
  const [selectedDrillId, setSelectedDrillId] = useState<string | null>(null)

 const fetchDrills = async () => {
  try {
    const res = await api.get('/drills')
    setDrills(res.data.data.drills)
  } catch {
    toast.error('Failed to load drills')
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchDrills()
    api.get('/ships').then(res => setShips(res.data.data.ships)).catch(() => {})
  }, [])

  const totalDrills = drills.length
  const upcomingDrills = drills.filter(d => d.status === 'scheduled').length
  const completedDrills = drills.filter(d => d.status === 'completed').length
  const completionRate = totalDrills > 0 ? Math.round((completedDrills / totalDrills) * 100) : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#f1f5f9]">Safety Drills</h1>
          <p className="text-[#94a3b8] mt-2 text-sm">Schedule and track emergency response drills across your fleet</p>
        </div>
        <Button
          onClick={() => setScheduleDrillOpen(true)}
          className="bg-[#3b82f6] hover:bg-[#1e3a8a] text-white flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Schedule Drill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6 hover:border-[#3b82f6]/50 transition-colors">
          <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-wide">Total Drills</p>
          <p className="text-4xl font-bold text-[#f1f5f9] mt-4">{totalDrills}</p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6 hover:border-[#3b82f6]/50 transition-colors">
          <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-wide">Upcoming</p>
          <p className="text-4xl font-bold text-[#3b82f6] mt-4">{upcomingDrills}</p>
        </div>
        <div className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6 hover:border-[#10b981]/50 transition-colors">
          <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-wide">Completion Rate</p>
          <p className="text-4xl font-bold text-[#10b981] mt-4">{completionRate}%</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-[#94a3b8]">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drills.map((drill) => {
            const DrillIcon = DRILL_TYPES[drill.drill_type]?.icon || Flame
            return (
              <div key={drill.id} className="bg-[#0f1729] border border-[#1e2d4a] rounded-lg p-6 space-y-4 hover:border-[#3b82f6]/50 transition-all duration-200 cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-[#1e2d4a] group-hover:bg-[#3b82f6]/20 p-2.5 rounded-lg transition-colors">
                      <DrillIcon className="w-5 h-5 text-[#3b82f6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#f1f5f9] text-sm">{drill.title}</h3>
                      <p className="text-xs text-[#94a3b8] mt-1">{drill.ship_name}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ml-2 flex-shrink-0 ${getStatusColor(drill.status)}`}>
                    {drill.status}
                  </span>
                </div>

                <div className="border-t border-[#1e2d4a] pt-4 space-y-3">
                  <p className="text-xs text-[#94a3b8]">
                    {new Date(drill.scheduled_date).toLocaleString()}
                  </p>
                  <p className="text-xs text-[#3b82f6] font-medium">
                    {drill.attended_count}/{drill.total_crew} attended
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setSelectedDrillId(drill.id)}
                    className="w-full bg-[#3b82f6] hover:bg-[#1e3a8a] text-white text-xs transition-colors"
                  >
                    <Eye className="w-3 h-3 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            )
          })}
          {drills.length === 0 && (
            <div className="col-span-3 text-center py-8 text-[#94a3b8]">
              No drills found
            </div>
          )}
        </div>
      )}

      <ScheduleDrillDialog
        open={scheduleDrillOpen}
        onOpenChange={setScheduleDrillOpen}
        ships={ships}
        onDrillCreated={fetchDrills}
      />
      <DrillDetailModal
        drillId={selectedDrillId}
        open={!!selectedDrillId}
        onOpenChange={(open) => !open && setSelectedDrillId(null)}
        onAttendanceUpdate={fetchDrills}
      />
    </div>
  )
}
