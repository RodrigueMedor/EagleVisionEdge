import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Search,
  Plus,
  Eye,
  Edit,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Mail,
  Phone,
  MoreVertical
} from 'lucide-react'
import { crmService } from '@/services/crmService'
import { FinancingApplication, Customer, FinancingStatus } from '@/types/crm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const FinancingWorkflowPage: React.FC = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState<FinancingApplication[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterAssignedTo, setFilterAssignedTo] = useState<string>('all')
  const [selectedApplication, setSelectedApplication] = useState<FinancingApplication | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Form state for creating applications
  const [formData, setFormData] = useState({
    customerId: '',
    loanAmount: '',
    downPayment: '',
    termMonths: '60',
    creditScore: '',
    income: '',
    employmentStatus: 'Full-time'
  })

  useEffect(() => {
    loadFinancingData()
  }, [searchQuery, filterStatus, filterAssignedTo, currentPage])

  const loadFinancingData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Generate mock financing applications
      const mockApplications: FinancingApplication[] = [
        {
          id: 'fin_1',
          customerId: 'customer_1',
          status: 'Under Review',
          applicationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          loanAmount: 25000,
          downPayment: 5000,
          termMonths: 60,
          interestRate: 4.5,
          monthlyPayment: 352,
          creditScore: 720,
          income: 75000,
          employmentStatus: 'Full-time',
          debtToIncomeRatio: 0.35,
          requestedVehicle: '2023 Toyota Camry',
          documents: [
            {
              id: 'doc_1',
              name: 'Driver License',
              type: 'id_proof',
              uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              uploadedBy: 'customer_1',
              status: 'approved',
              url: '/documents/dl.pdf'
            },
            {
              id: 'doc_2',
              name: 'Pay Stub',
              type: 'income_proof',
              uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              uploadedBy: 'customer_1',
              status: 'pending',
              url: '/documents/paystub.pdf'
            }
          ],
          notes: ['Customer has excellent credit history', 'Pre-approved for premium rates'],
          assignedTo: 'finance_1',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'fin_2',
          customerId: 'customer_2',
          status: 'Approved',
          applicationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          loanAmount: 18000,
          downPayment: 3000,
          termMonths: 48,
          interestRate: 3.9,
          monthlyPayment: 325,
          creditScore: 680,
          income: 55000,
          employmentStatus: 'Full-time',
          debtToIncomeRatio: 0.42,
          requestedVehicle: '2022 Honda Civic',
          documents: [
            {
              id: 'doc_3',
              name: 'Bank Statement',
              type: 'bank_statement',
              uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
              uploadedBy: 'customer_2',
              status: 'approved',
              url: '/documents/bank.pdf'
            }
          ],
          notes: ['Good credit score', 'Reasonable debt-to-income ratio'],
          assignedTo: 'finance_2',
          approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'fin_3',
          customerId: 'customer_3',
          status: 'Pending Documents',
          applicationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          loanAmount: 32000,
          downPayment: 8000,
          termMonths: 72,
          creditScore: 650,
          income: 45000,
          employmentStatus: 'Part-time',
          requestedVehicle: '2023 Ford F-150',
          documents: [],
          notes: ['Waiting for income verification', 'Credit score needs improvement'],
          assignedTo: 'finance_1',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
        }
      ]

      const customersResponse = await crmService.getCustomers()
      
      if (customersResponse.success) {
        setCustomers(customersResponse.data)
      }

      // Apply filters
      let filteredApplications = mockApplications

      if (filterStatus !== 'all') {
        filteredApplications = filteredApplications.filter(app => app.status === filterStatus)
      }

      if (filterAssignedTo !== 'all') {
        filteredApplications = filteredApplications.filter(app => app.assignedTo === filterAssignedTo)
      }

      if (searchQuery) {
        filteredApplications = filteredApplications.filter(app =>
          app.requestedVehicle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.customerId.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      setApplications(filteredApplications)
      setTotalPages(Math.ceil(filteredApplications.length / 20))
    } catch (err) {
      setError('Failed to load financing data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateApplication = async () => {
    try {
      const newApplication: FinancingApplication = {
        id: `fin_${Date.now()}`,
        customerId: formData.customerId,
        status: 'Application Submitted',
        applicationDate: new Date(),
        loanAmount: parseFloat(formData.loanAmount),
        downPayment: parseFloat(formData.downPayment),
        termMonths: parseInt(formData.termMonths),
        creditScore: parseInt(formData.creditScore),
        income: parseFloat(formData.income),
        employmentStatus: formData.employmentStatus,
        requestedVehicle: 'TBD',
        documents: [],
        notes: [],
        assignedTo: 'finance_1',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setApplications([...applications, newApplication])
      setShowCreateModal(false)
      setFormData({
        customerId: '',
        loanAmount: '',
        downPayment: '',
        termMonths: '60',
        creditScore: '',
        income: '',
        employmentStatus: 'Full-time'
      })
    } catch (err) {
      setError('Failed to create application')
    }
  }

  const handleStatusUpdate = async (applicationId: string, newStatus: FinancingStatus) => {
    try {
      setApplications(applications.map(app =>
        app.id === applicationId
          ? { 
              ...app, 
              status: newStatus,
              updatedAt: new Date(),
              ...(newStatus === 'Approved' && { approvedAt: new Date() }),
              ...(newStatus === 'Funded' && { fundedAt: new Date() })
            }
          : app
      ))
    } catch (err) {
      setError('Failed to update application status')
    }
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    return customer?.name || 'Unknown Customer'
  }

  const getStatusColor = (status: FinancingStatus) => {
    const colors: Record<FinancingStatus, string> = {
      'Application Submitted': 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Pending Documents': 'bg-orange-100 text-orange-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Funded': 'bg-purple-100 text-purple-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getDocumentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const calculateMonthlyPayment = (loanAmount: number, downPayment: number, termMonths: number, interestRate: number) => {
    const principal = loanAmount - downPayment
    const monthlyRate = interestRate / 100 / 12
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
    return Math.round(payment)
  }

  const paginatedApplications = applications.slice((currentPage - 1) * 20, currentPage * 20)

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
            <h1 className="text-3xl font-bold text-gray-900">Financing Workflow</h1>
            <p className="text-gray-600 mt-1">Manage customer financing applications and approvals</p>
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
              <span>New Application</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {applications.filter(app => app.status === 'Under Review').length}
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
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {applications.filter(app => app.status === 'Approved').length}
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
                <p className="text-sm text-gray-600">Pending Documents</p>
                <p className="text-2xl font-bold text-orange-600">
                  {applications.filter(app => app.status === 'Pending Documents').length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertCircle className="text-orange-600" size={24} />
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
                placeholder="Search applications by vehicle or customer..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Application Submitted">Application Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Pending Documents">Pending Documents</option>
              <option value="Rejected">Rejected</option>
              <option value="Funded">Funded</option>
            </select>
            <select
              value={filterAssignedTo}
              onChange={(e) => setFilterAssignedTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Assigned</option>
              <option value="finance_1">Sarah Wilson</option>
              <option value="finance_2">Mike Chen</option>
              <option value="finance_3">Lisa Anderson</option>
            </select>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit Score
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
                {paginatedApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getCustomerName(application.customerId)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Applied: {application.applicationDate.toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.requestedVehicle || 'TBD'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          ${application.loanAmount.toLocaleString()} loan
                        </div>
                        <div className="text-sm text-gray-500">
                          ${application.downPayment.toLocaleString()} down • {application.termMonths}mo
                        </div>
                        {application.monthlyPayment && (
                          <div className="text-sm font-medium text-gray-900">
                            ${application.monthlyPayment}/mo
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {application.creditScore}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        DTI: {application.debtToIncomeRatio ? `${(application.debtToIncomeRatio * 100).toFixed(1)}%` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-900">
                          {application.assignedTo === 'finance_1' ? 'Sarah Wilson' :
                           application.assignedTo === 'finance_2' ? 'Mike Chen' :
                           application.assignedTo === 'finance_3' ? 'Lisa Anderson' :
                           application.assignedTo}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedApplication(application)
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
                  Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, applications.length)} of {applications.length} results
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

      {/* Application Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Financing Application - {getCustomerName(selectedApplication.customerId)}
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
                {/* Application Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Application Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Application Date:</span>
                      <span className="text-sm font-medium">{selectedApplication.applicationDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedApplication.status)}`}>
                        {selectedApplication.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Requested Vehicle:</span>
                      <span className="text-sm font-medium">{selectedApplication.requestedVehicle || 'TBD'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Assigned To:</span>
                      <span className="text-sm font-medium">
                        {selectedApplication.assignedTo === 'finance_1' ? 'Sarah Wilson' :
                         selectedApplication.assignedTo === 'finance_2' ? 'Mike Chen' :
                         selectedApplication.assignedTo === 'finance_3' ? 'Lisa Anderson' :
                         selectedApplication.assignedTo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Financial Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Loan Amount:</span>
                      <span className="text-sm font-medium">${selectedApplication.loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Down Payment:</span>
                      <span className="text-sm font-medium">${selectedApplication.downPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Term:</span>
                      <span className="text-sm font-medium">{selectedApplication.termMonths} months</span>
                    </div>
                    {selectedApplication.interestRate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Interest Rate:</span>
                        <span className="text-sm font-medium">{selectedApplication.interestRate}%</span>
                      </div>
                    )}
                    {selectedApplication.monthlyPayment && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Monthly Payment:</span>
                        <span className="text-sm font-medium">${selectedApplication.monthlyPayment}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Applicant Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Applicant Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Credit Score:</span>
                      <span className="text-sm font-medium">{selectedApplication.creditScore}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Annual Income:</span>
                      <span className="text-sm font-medium">${selectedApplication.income.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Employment:</span>
                      <span className="text-sm font-medium">{selectedApplication.employmentStatus}</span>
                    </div>
                    {selectedApplication.debtToIncomeRatio && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Debt-to-Income:</span>
                        <span className="text-sm font-medium">{(selectedApplication.debtToIncomeRatio * 100).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Documents</h3>
                  <div className="space-y-2">
                    {selectedApplication.documents.length > 0 ? (
                      selectedApplication.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText size={16} className="text-gray-400" />
                            <div>
                              <div className="text-sm font-medium">{doc.name}</div>
                              <div className="text-xs text-gray-500">
                                Uploaded {doc.uploadedAt.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${getDocumentStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Download size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No documents uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedApplication.notes.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Notes</h3>
                  <div className="space-y-2">
                    {selectedApplication.notes.map((note, index) => (
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
                  {selectedApplication.status === 'Application Submitted' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'Under Review')}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      Start Review
                    </button>
                  )}
                  {selectedApplication.status === 'Under Review' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'Approved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Approve Application
                    </button>
                  )}
                  {selectedApplication.status === 'Approved' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'Funded')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Mark as Funded
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

      {/* Create Application Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">New Financing Application</h2>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Amount
                    </label>
                    <input
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="25000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Down Payment
                    </label>
                    <input
                      type="number"
                      value={formData.downPayment}
                      onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Term (months)
                    </label>
                    <select
                      value={formData.termMonths}
                      onChange={(e) => setFormData({ ...formData, termMonths: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="36">36 months</option>
                      <option value="48">48 months</option>
                      <option value="60">60 months</option>
                      <option value="72">72 months</option>
                      <option value="84">84 months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credit Score
                    </label>
                    <input
                      type="number"
                      value={formData.creditScore}
                      onChange={(e) => setFormData({ ...formData, creditScore: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="720"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Income
                  </label>
                  <input
                    type="number"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="75000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Status
                  </label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Self-employed">Self-employed</option>
                    <option value="Retired">Retired</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
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
                  onClick={handleCreateApplication}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinancingWorkflowPage
