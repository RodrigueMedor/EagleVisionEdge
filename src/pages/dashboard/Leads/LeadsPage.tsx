import { useEffect, useState } from 'react'
import { Search, Filter, Plus, Eye, Edit, Phone, Mail, Calendar, User } from 'lucide-react'
import Card, { StatusBadge } from '@/components/ui/Card'
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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')

  useEffect(() => {
    loadLeads()
  }, [])

  useEffect(() => {
    filterAndSortLeads()
  }, [leads, searchTerm, statusFilter, sortBy])

  const loadLeads = async () => {
    setLoading(true)
    try {
      const data = await leadsService.getLeads()
      setLeads(data)
    } catch (err) {
      console.error('Failed to load leads', err)
      setLeads(mockLeads)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortLeads = () => {
    let filtered = leads

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        (lead.customerName || `${lead.firstName} ${lead.lastName}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        (lead.vehicleInterest || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'customerName':
          return (a.customerName || `${a.firstName} ${a.lastName}`).localeCompare(b.customerName || `${b.firstName} ${b.lastName}`)
        case 'status':
          return a.status.localeCompare(b.status)
        case 'budget':
          return (b.budget || 0) - (a.budget || 0)
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredLeads(filtered)
  }

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await leadsService.updateLeadStatus(leadId, newStatus)
      setLeads(leads.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: newStatus as LeadStatus, updatedAt: new Date() }
          : lead
      ))
    } catch (err) {
      console.error('Failed to update lead status', err)
    }
  }

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date'
      }
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(dateObj)
    } catch (error) {
      return 'Invalid date'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  
  if (loading) {
    return <div className="text-center py-12">Loading leads...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-primary">Leads Management</h1>
          <p className="text-gray-600 mt-2">Manage and track your sales leads</p>
        </div>
        <Button variant="primary" size="md">
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Leads</p>
              <p className="text-2xl font-bold text-primary">{leads.length}</p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">New Leads</p>
              <p className="text-2xl font-bold text-blue-600">
                {leads.filter(l => l.status === 'new').length}
              </p>
            </div>
            <StatusBadge status="New" variant="info" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active</p>
              <p className="text-2xl font-bold text-orange-600">
                {leads.filter(l => ['contacted', 'appointment_scheduled', 'financing_pending', 'negotiation'].includes(l.status)).length}
              </p>
            </div>
            <StatusBadge status="Active" variant="warning" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Converted</p>
              <p className="text-2xl font-bold text-green-600">
                {leads.filter(l => l.status === 'sold').length}
              </p>
            </div>
            <StatusBadge status="Sold" variant="success" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            {leadStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Date Created</option>
            <option value="customerName">Customer Name</option>
            <option value="status">Status</option>
            <option value="budget">Budget</option>
          </Select>

          <Button variant="secondary" size="md">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Leads Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Vehicle Interest</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Budget</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{lead.customerName || `${lead.firstName} ${lead.lastName}`}</p>
                      <p className="text-sm text-gray-500">ID: {lead.id}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{lead.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-900">{lead.vehicleInterest}</p>
                  </td>
                  <td className="py-3 px-4">
                    {lead.budget ? (
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(lead.budget)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Not specified</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                      className="text-sm"
                    >
                      {leadStatuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatDate(lead.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No leads found matching your criteria</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
