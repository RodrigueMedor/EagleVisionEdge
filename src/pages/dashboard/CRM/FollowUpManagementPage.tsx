import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Calendar,
  Clock,
  Bell,
  CheckCircle,
  AlertCircle,
  User,
  Filter,
  Search,
  MoreVertical,
  Phone,
  Mail,
  MessageSquare,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw
} from 'lucide-react'
import { crmService } from '@/services/crmService'
import { FollowUp, Customer, FollowUpPriority, FollowUpStatus } from '@/types/crm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const FollowUpManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterAssignedTo, setFilterAssignedTo] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Form state for creating follow-ups
  const [formData, setFormData] = useState({
    customerId: '',
    assignedTo: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as FollowUpPriority,
    type: 'call' as 'call' | 'email' | 'meeting' | 'task' | 'reminder'
  })

  useEffect(() => {
    loadData()
  }, [searchQuery, filterStatus, filterPriority, filterAssignedTo, currentPage])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [followUpsResponse, customersResponse] = await Promise.all([
        crmService.getFollowUps(),
        crmService.getCustomers()
      ])

      if (followUpsResponse.success) {
        let filteredFollowUps = followUpsResponse.data

        // Apply filters
        if (filterStatus !== 'all') {
          filteredFollowUps = filteredFollowUps.filter(f => f.status === filterStatus)
        }
        if (filterPriority !== 'all') {
          filteredFollowUps = filteredFollowUps.filter(f => f.priority === filterPriority)
        }
        if (filterAssignedTo !== 'all') {
          filteredFollowUps = filteredFollowUps.filter(f => f.assignedTo === filterAssignedTo)
        }

        // Apply search
        if (searchQuery) {
          filteredFollowUps = filteredFollowUps.filter(f =>
            f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }

        setFollowUps(filteredFollowUps)
        setTotalPages(Math.ceil(filteredFollowUps.length / 20))
      }

      if (customersResponse.success) {
        setCustomers(customersResponse.data)
      }
    } catch (err) {
      setError('Failed to load follow-ups')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFollowUp = async () => {
    try {
      const response = await crmService.scheduleFollowUp({
        customerId: formData.customerId,
        title: formData.title,
        description: formData.description,
        scheduledDate: new Date(formData.dueDate),
        priority: formData.priority,
        type: formData.type,
        assignedTo: formData.assignedTo
      })

      if (response.success) {
        setShowCreateModal(false)
        setFormData({
          customerId: '',
          assignedTo: '',
          title: '',
          description: '',
          dueDate: '',
          priority: 'medium',
          type: 'call'
        })
        loadData()
      }
    } catch (err) {
      setError('Failed to create follow-up')
    }
  }

  const handleCompleteFollowUp = async (followUpId: string) => {
    try {
      // In a real app, you would call a service method to complete the follow-up
      setFollowUps(followUps.map(f =>
        f.id === followUpId
          ? { ...f, status: 'completed', completedAt: new Date() }
          : f
      ))
    } catch (err) {
      setError('Failed to complete follow-up')
    }
  }

  const handleDeleteFollowUp = async (followUpId: string) => {
    if (!confirm('Are you sure you want to delete this follow-up?')) return

    try {
      // In a real app, you would call a service method to delete the follow-up
      setFollowUps(followUps.filter(f => f.id !== followUpId))
    } catch (err) {
      setError('Failed to delete follow-up')
    }
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    return customer?.name || 'Unknown Customer'
  }

  const getStatusColor = (status: FollowUpStatus) => {
    const colors: Record<FollowUpStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: FollowUpPriority) => {
    const colors: Record<FollowUpPriority, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      call: <Phone size={16} />,
      email: <Mail size={16} />,
      meeting: <User size={16} />,
      task: <CheckCircle size={16} />,
      reminder: <Bell size={16} />
    }
    return icons[type] || <Clock size={16} />
  }

  const isOverdue = (dueDate: Date, status: FollowUpStatus) => {
    return status === 'pending' && new Date(dueDate) < new Date()
  }

  const paginatedFollowUps = followUps.slice((currentPage - 1) * 20, currentPage * 20)

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
            <h1 className="text-3xl font-bold text-gray-900">Follow-Up Management</h1>
            <p className="text-gray-600 mt-1">Manage customer follow-ups and reminders</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard/crm')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to CRM
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Schedule Follow-Up</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Follow-Ups</p>
                <p className="text-2xl font-bold text-gray-900">{followUps.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {followUps.filter(f => f.status === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {followUps.filter(f => isOverdue(f.dueDate, f.status)).length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {followUps.filter(f => f.status === 'completed').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="text-green-600" size={24} />
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
                placeholder="Search follow-ups..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterAssignedTo}
              onChange={(e) => setFilterAssignedTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Assigned</option>
              <option value="sales_1">John Smith</option>
              <option value="sales_2">Jane Doe</option>
              <option value="sales_3">Mike Johnson</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download size={20} />
              <span>Export</span>
            </button>
            <button
              onClick={loadData}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Follow-Ups Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Follow-Up
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedFollowUps.map((followUp) => (
                  <tr 
                    key={followUp.id} 
                    className={`hover:bg-gray-50 ${isOverdue(followUp.dueDate, followUp.status) ? 'bg-red-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-400">
                          {getTypeIcon(followUp.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {followUp.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {followUp.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getCustomerName(followUp.customerId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-900">{followUp.assignedTo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {followUp.dueDate.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {followUp.dueDate.toLocaleTimeString()}
                      </div>
                      {isOverdue(followUp.dueDate, followUp.status) && (
                        <div className="text-xs text-red-600 font-medium">
                          Overdue
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(followUp.priority)}`}>
                        {followUp.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(followUp.status)}`}>
                        {followUp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {followUp.status === 'pending' && (
                          <button
                            onClick={() => handleCompleteFollowUp(followUp.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Complete"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedFollowUp(followUp)
                            setShowDetailModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={16} />
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
                  Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, followUps.length)} of {followUps.length} results
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

      {/* Create Follow-Up Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Schedule Follow-Up</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned To
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a salesperson</option>
                    <option value="sales_1">John Smith</option>
                    <option value="sales_2">Jane Doe</option>
                    <option value="sales_3">Mike Johnson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Follow-up title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Follow-up description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as FollowUpPriority })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="call">Call</option>
                      <option value="email">Email</option>
                      <option value="meeting">Meeting</option>
                      <option value="task">Task</option>
                      <option value="reminder">Reminder</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFollowUp}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Schedule Follow-Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Follow-Up Detail Modal */}
      {showDetailModal && selectedFollowUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedFollowUp.title}</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Follow-Up Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Customer:</span>
                      <span className="ml-2 text-sm">{getCustomerName(selectedFollowUp.customerId)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Assigned To:</span>
                      <span className="ml-2 text-sm">{selectedFollowUp.assignedTo}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Type:</span>
                      <span className="ml-2 text-sm">{selectedFollowUp.type}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Priority:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedFollowUp.priority)}`}>
                        {selectedFollowUp.priority}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedFollowUp.status)}`}>
                        {selectedFollowUp.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Timing</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Due Date:</span>
                      <span className="ml-2 text-sm">{selectedFollowUp.dueDate.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Created:</span>
                      <span className="ml-2 text-sm">{selectedFollowUp.createdAt.toLocaleString()}</span>
                    </div>
                    {selectedFollowUp.completedAt && (
                      <div>
                        <span className="text-sm text-gray-500">Completed:</span>
                        <span className="ml-2 text-sm">{selectedFollowUp.completedAt.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedFollowUp.reminderSent && (
                      <div>
                        <span className="text-sm text-gray-500">Reminder:</span>
                        <span className="ml-2 text-sm text-green-600">Sent</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {selectedFollowUp.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Description</h3>
                  <p className="text-gray-600">{selectedFollowUp.description}</p>
                </div>
              )}
              {selectedFollowUp.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Notes</h3>
                  <p className="text-gray-600">{selectedFollowUp.notes}</p>
                </div>
              )}
              <div className="mt-6 flex items-center justify-end space-x-3">
                {selectedFollowUp.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleCompleteFollowUp(selectedFollowUp.id)
                      setShowDetailModal(false)
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Mark Complete
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
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

export default FollowUpManagementPage
