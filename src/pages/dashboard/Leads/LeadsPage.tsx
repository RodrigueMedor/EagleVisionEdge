import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Eye, Edit, Phone, Mail, Calendar, Users } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { SearchFilterBar } from '@/components/ui/SearchFilterBar'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSkeleton'
import Button from '@/components/ui/Button'
import { leadsService } from '@/services/leadsService'
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
  const navigate = useNavigate()
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'createdAt'
  })

  useEffect(() => {
    loadLeads()
  }, [])

  useEffect(() => {
    filterAndSortLeads()
  }, [leads, filters])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const loadLeads = async () => {
    setLoading(true)
    try {
      const data = await leadsService.getLeads()
      setLeads(data)
    } catch (err) {
      console.error('Failed to load leads', err)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortLeads = () => {
    let filtered = leads

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(lead =>
        (lead.customerName || `${lead.firstName} ${lead.lastName}`).toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.phone.includes(filters.search) ||
        (lead.vehicleInterest || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (lead.source || '').toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(lead => lead.status === filters.status)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name-asc':
          return (a.customerName || `${a.firstName} ${a.lastName}`).localeCompare(b.customerName || `${b.firstName} ${b.lastName}`)
        case 'name-desc':
          return (b.customerName || `${b.firstName} ${b.lastName}`).localeCompare(a.customerName || `${a.firstName} ${a.lastName}`)
        case 'status':
          return a.status.localeCompare(b.status)
        case 'budget-desc':
          return (b.budget || 0) - (a.budget || 0)
        case 'budget-asc':
          return (a.budget || 0) - (b.budget || 0)
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'date-desc':
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

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-primary">Leads Management</h1>
            <p className="text-gray-600 mt-2">Manage and track your sales leads</p>
          </div>
        </div>
        <TableSkeleton rows={8} columns={6} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-primary">Leads Management</h1>
          <p className="text-gray-600 mt-2">Manage and track your sales leads</p>
        </div>
        <Button variant="primary" size="md" onClick={() => navigate('/dashboard/crm/leads')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Leads</p>
              <p className="text-2xl font-bold text-primary">{leads.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">New Leads</p>
              <p className="text-2xl font-bold text-blue-600">
                {leads.filter(l => l.status === 'new').length}
              </p>
            </div>
            <StatusBadge status="New" variant="new" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active</p>
              <p className="text-2xl font-bold text-orange-600">
                {leads.filter(l => ['contacted', 'appointment_scheduled', 'financing_pending', 'negotiation'].includes(l.status)).length}
              </p>
            </div>
            <StatusBadge status="Active" variant="active" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Converted</p>
              <p className="text-2xl font-bold text-green-600">
                {leads.filter(l => l.status === 'sold').length}
              </p>
            </div>
            <StatusBadge status="Sold" variant="sold" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <SearchFilterBar
        searchValue={filters.search}
        onSearchChange={(value) => setFilters({ ...filters, search: value })}
        filters={{
          status: filters.status,
          sortBy: filters.sortBy
        }}
        onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
        placeholder="Search by name, email, phone, or source..."
      />

      {/* Leads Display */}
      {paginatedLeads.length === 0 ? (
        <EmptyState
          type="leads"
          title="No leads found"
          description={filteredLeads.length === 0 ? 
            "No leads match your current filters. Try adjusting your search criteria." :
            "No leads in your system yet."
          }
          action={filteredLeads.length === 0 ? (
            <Button variant="secondary" onClick={() => setFilters({ search: '', status: '', sortBy: 'createdAt' })}>
              Clear Filters
            </Button>
          ) : (
            <Button variant="primary" onClick={() => navigate('/dashboard/crm/leads')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Lead
            </Button>
          )}
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">
                          {lead.customerName || `${lead.firstName} ${lead.lastName}`}
                        </p>
                        <p className="text-sm text-gray-500">ID: {lead.id}</p>
                        {lead.source && (
                          <p className="text-xs text-gray-400">Source: {lead.source}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{lead.vehicleInterest}</p>
                      {lead.score && (
                        <p className="text-xs text-gray-500">Score: {lead.score}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.budget ? (
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(lead.budget)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Not specified</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className="text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        {leadStatuses.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(lead.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Link to={`/dashboard/leads/${lead.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/dashboard/leads/${lead.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {paginatedLeads.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}
