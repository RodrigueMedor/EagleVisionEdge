import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Phone, Mail, Calendar, MapPin, DollarSign, Car, MessageSquare, Clock, User, CheckCircle } from 'lucide-react'
import { Card, StatusBadge } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { leadsService } from '@/services/leadsService'
import { mockLeads } from '@/data/mockLeads'
import { Lead, LeadStatus } from '@/types/lead'

const leadStatuses = [
  { value: 'new', label: 'New', color: 'blue' },
  { value: 'contacted', label: 'Contacted', color: 'yellow' },
  { value: 'appointment_scheduled', label: 'Appointment Scheduled', color: 'orange' },
  { value: 'financing_pending', label: 'Financing Pending', color: 'purple' },
  { value: 'negotiation', label: 'Negotiation', color: 'indigo' },
  { value: 'sold', label: 'Sold', color: 'green' },
  { value: 'closed', label: 'Closed', color: 'gray' }
]

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState('')
  const [editingStatus, setEditingStatus] = useState(false)

  useEffect(() => {
    loadLead()
  }, [id])

  const loadLead = async () => {
    if (!id) return

    try {
      const data = await leadsService.getLeadById(id)
      setLead(data)
    } catch (err) {
      console.error('Failed to load lead', err)
      const fallbackLead = mockLeads.find(l => l.id === id)
      if (fallbackLead) {
        setLead(fallbackLead)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return

    try {
      await leadsService.updateLeadStatus(lead.id, newStatus)
      setLead({
        ...lead,
        status: newStatus as LeadStatus,
        updatedAt: new Date()
      })
      setEditingStatus(false)
    } catch (err) {
      console.error('Failed to update lead status', err)
    }
  }

  const handleAddNote = () => {
    if (!newNote.trim() || !lead) return

    const updatedLead = {
      ...lead,
      notes: [
        ...(lead.notes || []),
        {
          id: Date.now().toString(),
          content: newNote.trim(),
          createdAt: new Date(),
          createdBy: 'Current User'
        }
      ],
      updatedAt: new Date()
    }

    setLead(updatedLead)
    setNewNote('')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj)
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const getStatusVariant = (status: string) => {
    const statusConfig = leadStatuses.find(s => s.value === status)
    switch (statusConfig?.color) {
      case 'blue': return 'info'
      case 'yellow': return 'warning'
      case 'orange': return 'warning'
      case 'purple': return 'info'
      case 'indigo': return 'info'
      case 'green': return 'success'
      case 'gray': return 'default'
      default: return 'default'
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading lead details...</div>
  }

  if (!lead) {
    return <div className="text-center py-12">Lead not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/dashboard/leads')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leads
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-primary">{lead.customerName}</h1>
            <p className="text-gray-600 mt-2">Lead ID: {lead.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="md"
            onClick={() => setEditingStatus(!editingStatus)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Update Status
          </Button>
        </div>
      </div>

      {/* Status Update */}
      {editingStatus && (
        <Card>
          <div className="flex items-center gap-4">
            <label className="font-medium text-gray-700">Update Status:</label>
            <Select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
              className="flex-1 max-w-xs"
            >
              {leadStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </Select>
            <Button variant="secondary" onClick={() => setEditingStatus(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{lead.customerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{lead.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{lead.phone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{lead.location || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-medium">
                      {lead.budget ? formatCurrency(lead.budget) : 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={lead.status} variant={getStatusVariant(lead.status)} />
                  <div>
                    <p className="text-sm text-gray-600">Current Status</p>
                    <p className="font-medium capitalize">{lead.status.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Vehicle Interest */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Vehicle Interest</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Interested Vehicle</p>
                  <p className="font-medium">{lead.vehicleInterest}</p>
                </div>
              </div>

              {lead.preferredContactMethod && (
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Preferred Contact</p>
                    <p className="font-medium capitalize">{lead.preferredContactMethod}</p>
                  </div>
                </div>
              )}

              {lead.message && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Initial Message</p>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{lead.message}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Notes */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Notes & Communication</h3>
            <div className="space-y-4">
              {/* Add Note */}
              <div className="flex gap-2">
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this lead..."
                  className="flex-1"
                />
                <Button onClick={handleAddNote}>
                  Add Note
                </Button>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                {lead.notes && lead.notes.length > 0 ? (
                  lead.notes.map((note) => (
                    <div key={note.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{note.createdBy}</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(note.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No notes yet</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="primary" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call Customer
              </Button>
              <Button variant="secondary" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button variant="secondary" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>
          </Card>

          {/* Lead Timeline */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Lead Created</p>
                  <p className="text-xs text-gray-500">{formatDate(lead.createdAt)}</p>
                </div>
              </div>

              {lead.updatedAt && lead.updatedAt.getTime() !== lead.createdAt.getTime() && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Status Updated</p>
                    <p className="text-xs text-gray-500">{formatDate(lead.updatedAt)}</p>
                  </div>
                </div>
              )}

              {lead.status === 'appointment_scheduled' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Appointment Scheduled</p>
                    <p className="text-xs text-gray-500">Pending confirmation</p>
                  </div>
                </div>
              )}

              {lead.status === 'sold' && (
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-600">Lead Converted</p>
                    <p className="text-xs text-gray-500">Successfully sold vehicle</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Lead Details */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Lead Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Lead Source</span>
                <span className="text-sm font-medium">{lead.source || 'Website'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created Date</span>
                <span className="text-sm font-medium">{formatDate(lead.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium">{formatDate(lead.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Priority</span>
                <span className="text-sm font-medium text-orange-600">High</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
