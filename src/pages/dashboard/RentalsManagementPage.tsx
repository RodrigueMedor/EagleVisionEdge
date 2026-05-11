import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Plus, Eye, Edit, Calendar, Car, DollarSign, Users, Clock, TrendingUp, Activity } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { SearchFilterBar } from '@/components/ui/SearchFilterBar'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSkeleton'
import { DashboardCard } from '@/components/ui/DashboardCard'
import Button from '@/components/ui/Button'
import { rentalsService } from '@/services/rentalsService'
import { Rental, RentalStatus } from '@/types/rental'

const rentalStatuses = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'active', label: 'Active', color: 'blue' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' }
]

export default function RentalsManagementPage() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [filteredRentals, setFilteredRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'createdAt'
  })

  useEffect(() => {
    loadRentals()
  }, [])

  useEffect(() => {
    filterAndSortRentals()
  }, [rentals, filters])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const loadRentals = async () => {
    setLoading(true)
    try {
      const data = await rentalsService.getRentals()
      setRentals(data)
    } catch (err) {
      console.error('Failed to load rentals', err)
      setRentals([])
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortRentals = () => {
    let filtered = rentals

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(rental =>
        (rental.customerName || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (rental.vehicleMake || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (rental.vehicleModel || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        rental.id.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(rental => rental.status === filters.status)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'startDate':
          return new Date(b.startDate || new Date()).getTime() - new Date(a.startDate || new Date()).getTime()
        case 'endDate':
          return new Date(b.endDate || new Date()).getTime() - new Date(a.endDate || new Date()).getTime()
        case 'customer':
          return (a.customerName || '').localeCompare(b.customerName || '')
        case 'amount':
          return (b.totalAmount || 0) - (a.totalAmount || 0)
        case 'date-asc':
        default:
          return new Date(a.createdAt || new Date()).getTime() - new Date(b.createdAt || new Date()).getTime()
      }
    })

    setFilteredRentals(filtered)
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

  // Pagination logic
  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage)
  const paginatedRentals = filteredRentals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Calculate stats
  const totalRevenue = rentals.reduce((sum, rental) => sum + (rental.totalAmount || 0), 0)
  const activeRentals = rentals.filter(r => r.status === 'active').length
  const pendingRentals = rentals.filter(r => r.status === 'pending').length
  const completedRentals = rentals.filter(r => r.status === 'completed').length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-primary">Rentals Management</h1>
            <p className="text-gray-600 mt-2">Manage your vehicle rental operations</p>
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
        <TableSkeleton rows={8} columns={6} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-primary">Rentals Management</h1>
          <p className="text-gray-600 mt-2">Manage your vehicle rental operations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={loadRentals}>
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Link to="/dashboard/rentals/add">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              New Rental
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
        />

        <DashboardCard
          title="Active Rentals"
          value={activeRentals}
          icon={<Car className="w-6 h-6" />}
          color="blue"
        />

        <DashboardCard
          title="Pending"
          value={pendingRentals}
          icon={<Clock className="w-6 h-6" />}
          color="orange"
        />

        <DashboardCard
          title="Completed"
          value={completedRentals}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
        />
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
        placeholder="Search by customer, vehicle, or rental ID..."
      />

      {/* Rentals Display */}
      {paginatedRentals.length === 0 ? (
        <EmptyState
          type="general"
          title="No rentals found"
          description={filteredRentals.length === 0 ? 
            "No rentals match your current filters. Try adjusting your search criteria." :
            "No rentals in your system yet."
          }
          action={filteredRentals.length === 0 ? (
            <Button variant="secondary" onClick={() => setFilters({ search: '', status: '', sortBy: 'createdAt' })}>
              Clear Filters
            </Button>
          ) : (
            <Link to="/dashboard/rentals/add">
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Rental
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
                    Rental ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rental Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
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
                {paginatedRentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">#{rental.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{rental.customerName}</p>
                        <p className="text-sm text-gray-500">{rental.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {rental.vehicleYear} {rental.vehicleMake} {rental.vehicleModel}
                        </p>
                        <p className="text-sm text-gray-500">{rental.vehicleVin}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {formatDate(rental.startDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {formatDate(rental.endDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(rental.totalAmount || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge 
                        status={rental.status || ''} 
                        variant={(rental.status || '') as any}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Link to={`/dashboard/rentals/${rental.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/dashboard/rentals/${rental.id}/edit`}>
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
      {paginatedRentals.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRentals.length)} of {filteredRentals.length} rentals
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
