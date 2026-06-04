import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Edit, DollarSign, Clock, TrendingUp, Activity, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { SearchFilterBar } from '@/components/ui/SearchFilterBar'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSkeleton'
import { DashboardCard } from '@/components/ui/DashboardCard'
import Button from '@/components/ui/Button'
import { FinancingService } from '@/services/financingService'
import { FinancingApplication } from '@/types/financing'

const financingStatuses = [
  { value: 'pending', label: 'Pending Review', color: 'yellow' },
  { value: 'under_review', label: 'Under Review', color: 'blue' },
  { value: 'approved', label: 'Approved', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'funded', label: 'Funded', color: 'purple' }
]

export default function FinancingDashboard() {
  const [applications, setApplications] = useState<FinancingApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<FinancingApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'createdAt'
  })

  useEffect(() => {
    loadApplications()
  }, [])

  useEffect(() => {
    filterAndSortApplications()
  }, [applications, filters])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const loadApplications = async () => {
    setLoading(true)
    try {
      const data = await FinancingService.getApplications()
      setApplications(data)
    } catch (err) {
      console.error('Failed to load financing applications', err)
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortApplications = () => {
    let filtered = applications

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(app =>
        (app.customerName || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (app.customerEmail || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (app.id || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (app.vehicleMake || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (app.vehicleModel || '').toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(app => app.status === filters.status)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'amount':
          return (b.loanAmount || 0) - (a.loanAmount || 0)
        case 'creditScore':
          return (Number(b.creditScore) || 0) - (Number(a.creditScore) || 0)
        case 'customer':
          return (a.customerName || '').localeCompare(b.customerName || '')
        case 'date-asc':
          return new Date(a.createdAt || new Date()).getTime() - new Date(b.createdAt || new Date()).getTime()
        case 'date-desc':
        default:
          return new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime()
      }
    })

    setFilteredApplications(filtered)
  }

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(dateObj)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'under_review':
        return <AlertCircle className="w-4 h-4" />
      case 'approved':
        return <CheckCircle className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      case 'funded':
        return <DollarSign className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Calculate stats
  const totalApplications = applications.length
  const pendingApplications = applications.filter(a => a.status === 'pending').length
  const approvedApplications = applications.filter(a => a.status === 'approved').length
  const totalAmount = applications.reduce((sum, app) => sum + (app.loanAmount || 0), 0)
  const averageCreditScore = applications.length > 0 
    ? Math.round(applications.reduce((sum, app) => sum + (typeof app.creditScore === 'number' ? app.creditScore : 0), 0) / applications.length)
    : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-primary">Financing Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage financing applications and approvals</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <TableSkeleton rows={8} columns={7} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-primary">Financing Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage financing applications and approvals</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={loadApplications}>
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Link to="/dashboard/financing/add">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Applications"
          value={totalApplications}
          icon={<FileText className="w-6 h-6" />}
          color="blue"
        />

        <DashboardCard
          title="Pending Review"
          value={pendingApplications}
          icon={<Clock className="w-6 h-6" />}
          color="orange"
        />

        <DashboardCard
          title="Approved"
          value={approvedApplications}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />

        <DashboardCard
          title="Total Amount"
          value={formatCurrency(totalAmount)}
          icon={<DollarSign className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Credit Score</p>
              <p className="text-2xl font-bold text-primary">{averageCreditScore}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Approval Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Loan Amount</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(totalApplications > 0 ? totalAmount / totalApplications : 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
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
        placeholder="Search by customer, vehicle, or application ID..."
      />

      {/* Applications Display */}
      {paginatedApplications.length === 0 ? (
        <EmptyState
          type="general"
          title="No financing applications found"
          description={filteredApplications.length === 0 ? 
            "No applications match your current filters. Try adjusting your search criteria." :
            "No financing applications in your system yet."
          }
          action={filteredApplications.length === 0 ? (
            <Button variant="secondary" onClick={() => setFilters({ search: '', status: '', sortBy: 'createdAt' })}>
              Clear Filters
            </Button>
          ) : (
            <Link to="/dashboard/financing/add">
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Create First Application
              </Button>
            </Link>
          )}
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit Score
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
                {paginatedApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">#{application.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{application.customerName}</p>
                        <p className="text-sm text-gray-500">{application.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {application.vehicleYear} {application.vehicleMake} {application.vehicleModel}
                        </p>
                        <p className="text-sm text-gray-500">{application.vehicleVin}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(application.loanAmount || 0)}
                      </span>
                      {application.downPayment && (
                        <p className="text-xs text-gray-500">Down: {formatCurrency(Number(application.downPayment) || 0)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {application.creditScore || 'N/A'}
                        </span>
                        {application.creditScore && (
                          <div className={`w-2 h-2 rounded-full ${
                            (typeof application.creditScore === 'number' && application.creditScore >= 750) ? 'bg-green-500' :
                            (typeof application.creditScore === 'number' && application.creditScore >= 700) ? 'bg-yellow-500' :
                            (typeof application.creditScore === 'number' && application.creditScore >= 600) ? 'bg-orange-500' : 'bg-red-500'
                          }`} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge 
                        status={application.status || ''} 
                        variant={(application.status === 'pending' ? 'warning' : application.status === 'approved' ? 'success' : application.status === 'rejected' ? 'error' : 'info') as any}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Link to={`/dashboard/financing/${application.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/dashboard/financing/${application.id}/edit`}>
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
      {paginatedApplications.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of {filteredApplications.length} applications
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
