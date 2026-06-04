import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Filter,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  MoreVertical,
  User,
  Phone,
  Mail,
  BarChart3,
  Settings,
  Eye
} from 'lucide-react'
import { crmService } from '@/services/crmService'
import { Lead, Pipeline, PipelineStage, CustomerStatus, LeadScore } from '@/types/crm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const SalesPipelinePage: React.FC = () => {
  const navigate = useNavigate()
  const [pipeline, setPipeline] = useState<Pipeline | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [filterStage, setFilterStage] = useState<string>('all')

  const pipelineStages: PipelineStage[] = [
    'New Lead',
    'Contacted', 
    'Test Drive Scheduled',
    'Financing',
    'Negotiation',
    'Sold'
  ]

  useEffect(() => {
    loadPipelineData()
  }, [])

  const loadPipelineData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await crmService.getPipelineData()
      
      if (response.success) {
        setPipeline(response.data)
        setLeads(response.data.leads)
      } else {
        setError(response.message || 'Failed to load pipeline data')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault()
    
    if (!draggedLead) return

    try {
      // Update lead status based on target stage
      const statusMap: Record<PipelineStage, CustomerStatus> = {
        'New Lead': 'New Lead',
        'Contacted': 'Contacted',
        'Test Drive Scheduled': 'Appointment Scheduled',
        'Financing': 'Financing Pending',
        'Negotiation': 'Negotiation',
        'Sold': 'Sold'
      }

      const response = await crmService.updateLeadStatus(draggedLead.id, {
        status: statusMap[targetStage],
        pipelineStage: targetStage
      })

      if (response.success) {
        // Update local state
        setLeads(leads.map(lead => 
          lead.id === draggedLead.id 
            ? { ...lead, pipelineStage: targetStage, status: statusMap[targetStage] }
            : lead
        ))
      }
    } catch (err) {
      setError('Failed to update lead stage')
    }

    setDraggedLead(null)
  }

  const getLeadsByStage = (stage: PipelineStage) => {
    return leads.filter(lead => lead.pipelineStage === stage)
  }

  const getStageColor = (stage: PipelineStage) => {
    const colors: Record<PipelineStage, string> = {
      'New Lead': 'bg-blue-50 border-blue-200',
      'Contacted': 'bg-yellow-50 border-yellow-200',
      'Test Drive Scheduled': 'bg-purple-50 border-purple-200',
      'Financing': 'bg-orange-50 border-orange-200',
      'Negotiation': 'bg-pink-50 border-pink-200',
      'Sold': 'bg-green-50 border-green-200'
    }
    return colors[stage] || 'bg-gray-50 border-gray-200'
  }

  const getStageHeaderColor = (stage: PipelineStage) => {
    const colors: Record<PipelineStage, string> = {
      'New Lead': 'bg-blue-500',
      'Contacted': 'bg-yellow-500',
      'Test Drive Scheduled': 'bg-purple-500',
      'Financing': 'bg-orange-500',
      'Negotiation': 'bg-pink-500',
      'Sold': 'bg-green-500'
    }
    return colors[stage] || 'bg-gray-500'
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

  const getStageMetrics = (stage: PipelineStage) => {
    const stageLeads = getLeadsByStage(stage)
    const totalValue = stageLeads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0)
    const avgProbability = stageLeads.length > 0 
      ? stageLeads.reduce((sum, lead) => sum + lead.probability, 0) / stageLeads.length 
      : 0

    return {
      count: stageLeads.length,
      value: totalValue,
      avgProbability: Math.round(avgProbability)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !pipeline) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || 'Failed to load pipeline data'}</div>
        <button
          onClick={loadPipelineData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  const filteredStages = filterStage === 'all' 
    ? pipelineStages 
    : pipelineStages.filter(stage => stage === filterStage)

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
            <p className="text-gray-600 mt-1">Track and manage your sales pipeline</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard/crm/leads')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
            >
              <Users size={20} />
              <span>List View</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/crm/leads/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${pipeline.totalValue.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-600">{pipeline.conversionRate}%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Deal Size</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${pipeline.averageDealSize.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <BarChart3 className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sales Cycle</p>
                <p className="text-2xl font-bold text-orange-600">{pipeline.salesCycleLength} days</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Stages</option>
                {pipelineStages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={20} />
                <span>More Filters</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg ${viewMode === 'kanban' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <BarChart3 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Users size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto">
        <div className="flex space-x-4 min-w-max pb-4">
          {filteredStages.map(stage => {
            const stageLeads = getLeadsByStage(stage)
            const metrics = getStageMetrics(stage)
            
            return (
              <div key={stage} className="flex-shrink-0 w-80">
                <div className={`rounded-lg border-2 ${getStageColor(stage)}`}>
                  {/* Stage Header */}
                  <div className={`${getStageHeaderColor(stage)} text-white p-4 rounded-t-lg`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{stage}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">
                          {metrics.count}
                        </span>
                        <button className="hover:bg-white hover:bg-opacity-20 p-1 rounded">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm opacity-90">
                      ${metrics.value.toLocaleString()} • {metrics.avgProbability}% avg
                    </div>
                  </div>

                  {/* Leads in Stage */}
                  <div 
                    className="p-4 min-h-[400px] space-y-3"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage)}
                  >
                    {stageLeads.map(lead => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={() => handleDragStart(lead)}
                        onClick={() => {
                          setSelectedLead(lead)
                          setShowLeadModal(true)
                        }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow"
                      >
                        {/* Lead Header */}
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{lead.customerName}</h4>
                          <div className="flex items-center space-x-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${getScoreColor(lead.score)}`}>
                              {lead.score}
                            </span>
                            {lead.urgency === 'high' && (
                              <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                Urgent
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Lead Details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{lead.phone}</span>
                          </div>
                          {lead.budget && (
                            <div className="flex items-center text-gray-600">
                              <DollarSign className="w-4 h-4 mr-2" />
                              <span>Budget: ${lead.budget.toLocaleString()}</span>
                            </div>
                          )}
                          {lead.assignedTo && (
                            <div className="flex items-center text-gray-600">
                              <User className="w-4 h-4 mr-2" />
                              <span>{lead.assignedTo}</span>
                            </div>
                          )}
                        </div>

                        {/* Lead Footer */}
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {lead.probability}% probability
                            </span>
                            {lead.estimatedValue && (
                              <span className="text-xs font-medium text-gray-700">
                                ${lead.estimatedValue.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/dashboard/crm/customers/${lead.id}`)
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                // Handle quick action
                              }}
                              className="p-1 text-gray-400 hover:bg-gray-50 rounded"
                            >
                              <MoreVertical size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Lead Button */}
                    <button
                      onClick={() => navigate('/dashboard/crm/leads/new')}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center space-x-2"
                    >
                      <Plus size={20} />
                      <span>Add Lead</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {showLeadModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedLead.customerName}</h2>
                <button
                  onClick={() => setShowLeadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
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
                        <User className="text-gray-400" size={20} />
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
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {selectedLead.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Lead Score:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getScoreColor(selectedLead.score)}`}>
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
                  onClick={() => setShowLeadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesPipelinePage
