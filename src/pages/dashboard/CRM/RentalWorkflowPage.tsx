import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Car,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  MapPin,
  CreditCard,
  FileText,
  User,
  DollarSign,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Phone,
  Mail,
  MessageSquare,
  MoreVertical
} from 'lucide-react'
import { crmService } from '@/services/crmService'
import { RentalInquiry, Customer, RentalStatus, RentalType } from '@/types/crm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const RentalWorkflowPage: React.FC = () => {
  const navigate = useNavigate()
  const [inquiries, setInquiries] = useState<RentalInquiry[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterAssignedTo, setFilterAssignedTo] = useState<string>('all')
  const [selectedInquiry, setSelectedInquiry] = useState<RentalInquiry | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Form state for creating inquiries
  const [formData, setFormData] = useState({
    customerId: '',
    rentalType: 'Uber' as RentalType,
    startDate: '',
    endDate: '',
    preferredVehicle: '',
    pickupLocation: '',
    estimatedCost: '',
    deposit: '',
    driverLicense: '',
    insurance: false
  })

  useEffect(() => {
    loadRentalData()
  }, [searchQuery, filterStatus, filterType, filterAssignedTo, currentPage])

  const loadRentalData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Generate mock rental inquiries
      const mockInquiries: RentalInquiry[] = [
        {
          id: 'rental_1',
          customerId: 'customer_1',
          rentalType: 'Uber',
          status: 'Active',
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          preferredVehicle: '2023 Toyota Camry',
          pickupLocation: 'Miami Airport',
          estimatedCost: 450,
          deposit: 200,
          driverLicense: 'DL123456789',
          insurance: true,
          notes: ['Customer has valid insurance', 'Uber driver verification completed'],
          assignedTo: 'rental_1',
          confirmedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'rental_2',
          customerId: 'customer_2',
          rentalType: 'Cargo Van',
          status: 'Reserved',
          startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
          preferredVehicle: '2022 Ford Transit',
          pickupLocation: 'Downtown Miami',
          estimatedCost: 800,
          deposit: 300,
          driverLicense: 'DL987654321',
          insurance: false,
          notes: ['Customer needs cargo van for moving', 'Insurance package required'],
          assignedTo: 'rental_2',
          confirmedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'rental_3',
          customerId: 'customer_3',
          rentalType: 'Personal',
          status: 'Inquiry',
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
          preferredVehicle: '2023 Honda Civic',
          pickupLocation: 'Fort Lauderdale',
          estimatedCost: 350,
          deposit: 150,
          driverLicense: '',
          insurance: true,
          notes: ['Weekend rental requested', 'Waiting for driver license verification'],
          assignedTo: 'rental_1',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
        }
      ]

      const customersResponse = await crmService.getCustomers()
      
      if (customersResponse.success) {
        setCustomers(customersResponse.data)
      }

      // Apply filters
      let filteredInquiries = mockInquiries

      if (filterStatus !== 'all') {
        filteredInquiries = filteredInquiries.filter(inquiry => inquiry.status === filterStatus)
      }

      if (filterType !== 'all') {
        filteredInquiries = filteredInquiries.filter(inquiry => inquiry.rentalType === filterType)
      }

      if (filterAssignedTo !== 'all') {
        filteredInquiries = filteredInquiries.filter(inquiry => inquiry.assignedTo === filterAssignedTo)
      }

      if (searchQuery) {
        filteredInquiries = filteredInquiries.filter(inquiry =>
          inquiry.preferredVehicle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inquiry.pickupLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inquiry.customerId.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      setInquiries(filteredInquiries)
      setTotalPages(Math.ceil(filteredInquiries.length / 20))
    } catch (err) {
      setError('Failed to load rental data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInquiry = async () => {
    try {
      const newInquiry: RentalInquiry = {
        id: `rental_${Date.now()}`,
        customerId: formData.customerId,
        rentalType: formData.rentalType,
        status: 'Inquiry',
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        preferredVehicle: formData.preferredVehicle,
        pickupLocation: formData.pickupLocation,
        estimatedCost: parseFloat(formData.estimatedCost),
        deposit: parseFloat(formData.deposit),
        driverLicense: formData.driverLicense,
        insurance: formData.insurance,
        notes: [],
        assignedTo: 'rental_1',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setInquiries([...inquiries, newInquiry])
      setShowCreateModal(false)
      setFormData({
        customerId: '',
        rentalType: 'Uber',
        startDate: '',
        endDate: '',
        preferredVehicle: '',
        pickupLocation: '',
        estimatedCost: '',
        deposit: '',
        driverLicense: '',
        insurance: false
      })
    } catch (err) {
      setError('Failed to create rental inquiry')
    }
  }

  const handleStatusUpdate = async (inquiryId: string, newStatus: RentalStatus) => {
    try {
      setInquiries(inquiries.map(inquiry =>
        inquiry.id === inquiryId
          ? { 
              ...inquiry, 
              status: newStatus,
              updatedAt: new Date(),
              ...(newStatus === 'Reserved' && { confirmedAt: new Date() }),
              ...(newStatus === 'Active' && { confirmedAt: new Date() }),
              ...(newStatus === 'Completed' && { completedAt: new Date() })
            }
          : inquiry
      ))
    } catch (err) {
      setError('Failed to update inquiry status')
    }
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    return customer?.name || 'Unknown Customer'
  }

  const getStatusColor = (status: RentalStatus) => {
    const colors: Record<RentalStatus, string> = {
      'Inquiry': 'bg-blue-100 text-blue-800',
      'Reserved': 'bg-yellow-100 text-yellow-800',
      'Active': 'bg-green-100 text-green-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getTypeColor = (type: RentalType) => {
    const colors: Record<RentalType, string> = {
      'Uber': 'bg-purple-100 text-purple-800',
      'Cargo Van': 'bg-orange-100 text-orange-800',
      'Personal': 'bg-blue-100 text-blue-800',
      'Commercial': 'bg-green-100 text-green-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getRentalDuration = (startDate: Date, endDate?: Date) => {
    if (!endDate) return 'Ongoing'
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} days`
  }

  const isOverdue = (inquiry: RentalInquiry) => {
    return inquiry.status === 'Reserved' && 
           inquiry.startDate < new Date() && 
           !inquiry.confirmedAt
  }

  const paginatedInquiries = inquiries.slice((currentPage - 1) * 20, currentPage * 20)

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
            <h1 className="text-3xl font-bold text-gray-900">Rental Workflow</h1>
            <p className="text-gray-600 mt-1">Manage rental inquiries and reservations</p>
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
              <span>New Inquiry</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{inquiries.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Car className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Rentals</p>
                <p className="text-2xl font-bold text-green-600">
                  {inquiries.filter(i => i.status === 'Active').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reserved</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {inquiries.filter(i => i.status === 'Reserved').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Calendar className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${inquiries
                    .filter(i => i.status === 'Active' || i.status === 'Completed')
                    .reduce((sum, i) => sum + (i.estimatedCost || 0), 0)
                    .toLocaleString()}
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
                placeholder="Search inquiries by vehicle, location, or customer..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Inquiry">Inquiry</option>
              <option value="Reserved">Reserved</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="Uber">Uber</option>
              <option value="Cargo Van">Cargo Van</option>
              <option value="Personal">Personal</option>
              <option value="Commercial">Commercial</option>
            </select>
            <select
              value={filterAssignedTo}
              onChange={(e) => setFilterAssignedTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Assigned</option>
              <option value="rental_1">Tom Wilson</option>
              <option value="rental_2">Sarah Davis</option>
              <option value="rental_3">Mike Chen</option>
            </select>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rental Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {paginatedInquiries.map((inquiry) => (
                  <tr 
                    key={inquiry.id} 
                    className={`hover:bg-gray-50 ${isOverdue(inquiry) ? 'bg-red-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getCustomerName(inquiry.customerId)}
                        </div>
                        <div className="text-sm text-gray-500">
                          License: {inquiry.driverLicense || 'Not provided'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(inquiry.rentalType)}`}>
                            {inquiry.rentalType}
                          </span>
                          <span className="text-sm text-gray-900">
                            {inquiry.preferredVehicle}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          {inquiry.pickupLocation}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <CreditCard className="w-4 h-4 mr-1" />
                          Insurance: {inquiry.insurance ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {inquiry.startDate.toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {inquiry.endDate ? `to ${inquiry.endDate.toLocaleDateString()}` : 'Ongoing'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getRentalDuration(inquiry.startDate, inquiry.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${inquiry.estimatedCost?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Deposit: ${inquiry.deposit?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                      {isOverdue(inquiry) && (
                        <div className="text-xs text-red-600 font-medium mt-1">
                          Overdue
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-900">
                          {inquiry.assignedTo === 'rental_1' ? 'Tom Wilson' :
                           inquiry.assignedTo === 'rental_2' ? 'Sarah Davis' :
                           inquiry.assignedTo === 'rental_3' ? 'Mike Chen' :
                           inquiry.assignedTo}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedInquiry(inquiry)
                            setShowDetailModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
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
                  Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, inquiries.length)} of {inquiries.length} results
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

      {/* Inquiry Detail Modal */}
      {showDetailModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Rental Inquiry - {getCustomerName(selectedInquiry.customerId)}
                </h2>
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
                {/* Rental Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Rental Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Rental Type:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(selectedInquiry.rentalType)}`}>
                        {selectedInquiry.rentalType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Preferred Vehicle:</span>
                      <span className="text-sm font-medium">{selectedInquiry.preferredVehicle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Pickup Location:</span>
                      <span className="text-sm font-medium">{selectedInquiry.pickupLocation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Driver License:</span>
                      <span className="text-sm font-medium">{selectedInquiry.driverLicense || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Insurance:</span>
                      <span className="text-sm font-medium">
                        {selectedInquiry.insurance ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedInquiry.status)}`}>
                        {selectedInquiry.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timing and Cost */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Timing & Cost</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Start Date:</span>
                      <span className="text-sm font-medium">{selectedInquiry.startDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">End Date:</span>
                      <span className="text-sm font-medium">
                        {selectedInquiry.endDate ? selectedInquiry.endDate.toLocaleDateString() : 'Ongoing'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Duration:</span>
                      <span className="text-sm font-medium">
                        {getRentalDuration(selectedInquiry.startDate, selectedInquiry.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Estimated Cost:</span>
                      <span className="text-sm font-medium">${selectedInquiry.estimatedCost?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Deposit:</span>
                      <span className="text-sm font-medium">${selectedInquiry.deposit?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Assigned To:</span>
                      <span className="text-sm font-medium">
                        {selectedInquiry.assignedTo === 'rental_1' ? 'Tom Wilson' :
                         selectedInquiry.assignedTo === 'rental_2' ? 'Sarah Davis' :
                         selectedInquiry.assignedTo === 'rental_3' ? 'Mike Chen' :
                         selectedInquiry.assignedTo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedInquiry.notes.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Notes</h3>
                  <div className="space-y-2">
                    {selectedInquiry.notes.map((note, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {selectedInquiry.status === 'Inquiry' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedInquiry.id, 'Reserved')}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      Reserve Vehicle
                    </button>
                  )}
                  {selectedInquiry.status === 'Reserved' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedInquiry.id, 'Active')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Start Rental
                    </button>
                  )}
                  {selectedInquiry.status === 'Active' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedInquiry.id, 'Completed')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Complete Rental
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                    <Mail size={16} />
                    <span>Email Customer</span>
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                    <Phone size={16} />
                    <span>Call Customer</span>
                  </button>
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
        </div>
      )}

      {/* Create Inquiry Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">New Rental Inquiry</h2>
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
                    Rental Type
                  </label>
                  <select
                    value={formData.rentalType}
                    onChange={(e) => setFormData({ ...formData, rentalType: e.target.value as RentalType })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Uber">Uber</option>
                    <option value="Cargo Van">Cargo Van</option>
                    <option value="Personal">Personal</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Vehicle
                  </label>
                  <input
                    type="text"
                    value={formData.preferredVehicle}
                    onChange={(e) => setFormData({ ...formData, preferredVehicle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2023 Toyota Camry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Miami Airport"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Cost
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedCost}
                      onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="450"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deposit
                    </label>
                    <input
                      type="number"
                      value={formData.deposit}
                      onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver License
                  </label>
                  <input
                    type="text"
                    value={formData.driverLicense}
                    onChange={(e) => setFormData({ ...formData, driverLicense: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="DL123456789"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="insurance"
                    checked={formData.insurance}
                    onChange={(e) => setFormData({ ...formData, insurance: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="insurance" className="ml-2 block text-sm text-gray-900">
                    Customer has insurance
                  </label>
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
                  onClick={handleCreateInquiry}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RentalWorkflowPage
