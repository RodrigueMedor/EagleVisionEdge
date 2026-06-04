import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  TrendingUp,
  Star,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Edit,
  UserPlus,
  X
} from 'lucide-react'
import { crmService } from '@/services/crmService'
import { Lead, CustomerStatus, LeadScore, LeadSource, CRMFilter, CRMSearch } from '@/types/crm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { showSuccess, showError } from '@/lib/errorHandler'

const LeadManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<CRMFilter>({})
  const [showFilters, setShowFilters] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [newLead, setNewLead] = useState({ firstName: '', lastName: '', email: '', phone: '', budget: '', source: 'Website' })

  const resetNewLead = () => setNewLead({ firstName: '', lastName: '', email: '', phone: '', budget: '', source: 'Website' })

  const handleSaveLead = async () => {
    if (!newLead.firstName || !newLead.lastName || !newLead.email) {
      showError('Please fill in all required fields (First Name, Last Name, Email)')
      return
    }
    try {
      const result = await crmService.createLead({
        firstName: newLead.firstName,
        lastName: newLead.lastName,
        email: newLead.email,
        phone: newLead.phone,
        source: newLead.source as LeadSource,
        budget: newLead.budget ? parseInt(newLead.budget) : undefined,
      })
      if (result.success) {
        showSuccess(`Lead ${newLead.firstName} ${newLead.lastName} created successfully!`)
        setShowLeadModal(false)
        resetNewLead()
        loadLeads()
      } else {
        showError(result.message || 'Failed to create lead')
      }
    } catch {
      showError('An unexpected error occurred')
    }
  }

  useEffect(() => {
    loadLeads()
  }, [searchQuery, filters, currentPage])

  const loadLeads = async () => {
    try {
      setLoading(true)
      setError(null)

      const search: CRMSearch | undefined = searchQuery ? { query: searchQuery } : undefined
      const response = await crmService.getCustomers(filters, search)

      if (response.success) {
        // Convert customers to leads format
        const leadData: Lead[] = response.data.map(customer => ({
          id: customer.id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          status: customer.status,
          score: customer.leadScore,
          source: customer.leadSource,
          interestedVehicles: customer.interestedVehicles,
          budget: customer.budget,
          location: customer.city ? `${customer.city}, ${customer.state}` : undefined,
          preferredContactMethod: customer.preferredContactMethod,
          notes: customer.customerNotes,
          communicationHistory: customer.communicationHistory,
          lastContact: customer.lastContacted || new Date(),
          nextFollowUp: customer.nextFollowUp,
          assignedTo: customer.assignedSalesperson,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
          pipelineStage: getPipelineStageFromStatus(customer.status),
          estimatedValue: customer.leadValue,
          probability: getProbabilityFromScore(customer.leadScore),
          urgency: getUrgencyFromScore(customer.leadScore),
          tags: [],
          customerName: customer.name
        }))

        setLeads(leadData)
        setTotalPages(Math.ceil(leadData.length / 20))
      } else {
        setError(response.message || 'Failed to load leads')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getPipelineStageFromStatus = (status: CustomerStatus): any => {
    const stageMap: Record<CustomerStatus, any> = {
      'New Lead': 'New Lead',
      'Contacted': 'Contacted',
      'Appointment Scheduled': 'Test Drive Scheduled',
      'Financing Pending': 'Financing',
      'Negotiation': 'Negotiation',
      'Sold': 'Sold',
      'Rental Inquiry': 'New Lead',
      'Closed': 'Closed'
    }
    return stageMap[status] || 'New Lead'
  }

  const getProbabilityFromScore = (score: LeadScore): number => {
    const probabilityMap: Record<LeadScore, number> = {
      hot: 75,
      warm: 50,
      cold: 25
    }
    return probabilityMap[score] || 25
  }

  const getUrgencyFromScore = (score: LeadScore): any => {
    const urgencyMap: Record<LeadScore, any> = {
      hot: 'high',
      warm: 'medium',
      cold: 'low'
    }
    return urgencyMap[score] || 'low'
  }

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead)
    setShowLeadModal(true)
  }

  const handleStatusChange = async (leadId: string, newStatus: CustomerStatus) => {
    try {
      const response = await crmService.updateLeadStatus(leadId, {
        status: newStatus,
        pipelineStage: getPipelineStageFromStatus(newStatus)
      })

      if (response.success) {
        loadLeads()
      }
    } catch (err) {
      setError('Failed to update lead status')
    }
  }

  const handleAssignSalesperson = async (leadId: string, salespersonId: string) => {
    try {
      const response = await crmService.assignSalesperson({
        customerId: leadId,
        salespersonId
      })

      if (response.success) {
        loadLeads()
      }
    } catch (err) {
      setError('Failed to assign salesperson')
    }
  }

  const getStatusColor = (status: CustomerStatus) => {
    const colors: Record<CustomerStatus, string> = {
      'New Lead': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-yellow-100 text-yellow-800',
      'Appointment Scheduled': 'bg-purple-100 text-purple-800',
      'Financing Pending': 'bg-orange-100 text-orange-800',
      'Negotiation': 'bg-pink-100 text-pink-800',
      'Rental Inquiry': 'bg-indigo-100 text-indigo-800',
      'Sold': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getScoreColor = (score: LeadScore) => {
    const colors: Record<LeadScore, string> = {
      hot: 'bg-red-100 text-red-800',
      warm: 'bg-yellow-100 text-yellow-800',
      cold: 'bg-blue-100 text-blue-800'
    }
    return colors[score] || 'bg-gray-100 text-gray-800'
  }

  const getUrgencyColor = (urgency: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return colors[urgency] || 'bg-gray-100 text-gray-800'
  }

  const paginatedLeads = leads.slice((currentPage - 1) * 20, currentPage * 20)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-gray-600 mt-1">Manage and track your sales leads</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard/crm/pipeline')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <TrendingUp size={20} />
              <span>Pipeline View</span>
            </button>
            <button
              onClick={() => setShowLeadModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <UserPlus className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hot Leads</p>
                <p className="text-2xl font-bold text-red-600">
                  {leads.filter(l => l.score === 'hot').length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Star className="text-red-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-600">15.5%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pipeline Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${leads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
            <button
              onClick={() => {
                const header = ['Name','Email','Phone','Status','Score','Source'].join(',')
                const rows = leads.map(l => [`${l.firstName} ${l.lastName}`,l.email,l.phone,l.status,l.score,l.source].map(v => `"${v}"`).join(','))
                const csv = [header, ...rows].join('\n')
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url; a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`; a.click()
                URL.revokeObjectURL(url)
                showSuccess('Leads exported successfully!')
              }}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download size={20} />
              <span>Export</span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value as CustomerStatus)
                      setFilters({ ...filters, status: selected })
                    }}
                  >
                    <option value="New Lead">New Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Appointment Scheduled">Appointment Scheduled</option>
                    <option value="Financing Pending">Financing Pending</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lead Score</label>
                  <select
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value as LeadScore)
                      setFilters({ ...filters, leadScore: selected })
                    }}
                  >
                    <option value="hot">Hot</option>
                    <option value="warm">Warm</option>
                    <option value="cold">Cold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lead Source</label>
                  <select
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value as LeadSource)
                      setFilters({ ...filters, leadSource: selected })
                    }}
                  >
                    <option value="Website">Website</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setFilters({ ...filters, assignedTo: e.target.value ? [e.target.value] : undefined })
                    }}
                  >
                    <option value="">All Salespeople</option>
                    <option value="sales_1">John Smith</option>
                    <option value="sales_2">Jane Doe</option>
                    <option value="sales_3">Mike Johnson</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end mt-4 space-x-2">
                <button
                  onClick={() => setFilters({})}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeads(paginatedLeads.map(l => l.id))
                        } else {
                          setSelectedLeads([])
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleLeadClick(lead)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={(e) => {
                          e.stopPropagation()
                          if (e.target.checked) {
                            setSelectedLeads([...selectedLeads, lead.id])
                          } else {
                            setSelectedLeads(selectedLeads.filter(id => id !== lead.id))
                          }
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.customerName}</div>
                        <div className="text-sm text-gray-500">ID: {lead.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="w-4 h-4 mr-1 text-gray-400" />
                          {lead.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="w-4 h-4 mr-1 text-gray-400" />
                          {lead.phone}
                        </div>
                        {lead.location && (
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {lead.location}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreColor(lead.score)}`}>
                          {lead.score}
                        </span>
                        <div className="text-xs text-gray-500">
                          {lead.probability}% probability
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${lead.estimatedValue?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Budget: ${lead.budget?.toLocaleString() || 'Not set'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.assignedTo ? (
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-900">{lead.assignedTo}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleLeadClick(lead)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/dashboard/crm/customers/${lead.id}`)
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, leads.length)} of {leads.length} results
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Detail / Add Lead Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {selectedLead ? (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedLead.customerName}</h2>
                    <button
                      onClick={() => { setShowLeadModal(false); setSelectedLead(null) }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="text-gray-400" size={20} />
                          <span>{selectedLead.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="text-gray-400" size={20} />
                          <span>{selectedLead.phone}</span>
                        </div>
                        {selectedLead.location && (
                          <div className="flex items-center space-x-3">
                            <MapPin className="text-gray-400" size={20} />
                            <span>{selectedLead.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Lead Details</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-500">Status:</span>
                          <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedLead.status)}`}>
                            {selectedLead.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Lead Score:</span>
                          <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreColor(selectedLead.score)}`}>
                            {selectedLead.score}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Source:</span>
                          <span className="ml-2 text-sm">{selectedLead.source}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Budget:</span>
                          <span className="ml-2 text-sm">${selectedLead.budget?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-end space-x-3">
                    <button
                      onClick={() => navigate(`/dashboard/crm/customers/${selectedLead.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      View Full Profile
                    </button>
                    <button
                      onClick={() => { setShowLeadModal(false); setSelectedLead(null) }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Lead</h2>
                    <button
                      onClick={() => setShowLeadModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                      <input
                        value={newLead.firstName}
                        onChange={(e) => setNewLead(p => ({ ...p, firstName: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                      <input
                        value={newLead.lastName}
                        onChange={(e) => setNewLead(p => ({ ...p, lastName: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={newLead.email}
                        onChange={(e) => setNewLead(p => ({ ...p, email: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={newLead.phone}
                        onChange={(e) => setNewLead(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Budget</label>
                      <input
                        type="number" placeholder="$"
                        value={newLead.budget}
                        onChange={(e) => setNewLead(p => ({ ...p, budget: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Source</label>
                      <select
                        value={newLead.source}
                        onChange={(e) => setNewLead(p => ({ ...p, source: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="Phone">Phone</option>
                        <option value="Walk-in">Walk-in</option>
                        <option value="Social Media">Social Media</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-end space-x-3">
                    <button
                      onClick={handleSaveLead}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      Save Lead
                    </button>
                    <button
                      onClick={() => { setShowLeadModal(false); resetNewLead() }}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default LeadManagementPage
