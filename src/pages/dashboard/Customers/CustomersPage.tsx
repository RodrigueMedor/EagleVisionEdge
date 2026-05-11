import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Plus, Eye, Edit, Phone, Mail, Calendar, MapPin, Car, User, Star, Users, TrendingUp, DollarSign } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { SearchFilterBar } from '@/components/ui/SearchFilterBar'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSkeleton'
import Button from '@/components/ui/Button'
import { customersService } from '@/services/customersService'
import { Customer } from '@/types/customer'

const customerStatuses = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
  { value: 'prospect', label: 'Prospect', color: 'blue' },
  { value: 'vip', label: 'VIP', color: 'purple' }
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'createdAt'
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    filterAndSortCustomers()
  }, [customers, filters])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const data = await customersService.getCustomers()
      setCustomers(data)
    } catch (err) {
      console.error('Failed to load customers', err)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortCustomers = () => {
    let filtered = customers

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(customer =>
        (customer.name || `${customer.firstName} ${customer.lastName}`).toLowerCase().includes(filters.search.toLowerCase()) ||
        customer.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        customer.phone.includes(filters.search) ||
        (customer.address || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (customer.city || '').toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(customer => customer.status === filters.status)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name-asc':
          return (a.name || `${a.firstName} ${a.lastName}`).localeCompare(b.name || `${b.firstName} ${b.lastName}`)
        case 'name-desc':
          return (b.name || `${b.firstName} ${b.lastName}`).localeCompare(a.name || `${a.firstName} ${a.lastName}`)
        case 'email':
          return a.email.localeCompare(b.email)
        case 'segment':
          return a.segment.localeCompare(b.segment)
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'date-desc':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredCustomers(filtered)
  }

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(dateObj)
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const getStatusVariant = (status: string) => {
    const statusConfig = customerStatuses.find(s => s.value === status)
    switch (statusConfig?.color) {
      case 'green': return 'success'
      case 'blue': return 'info'
      case 'purple': return 'info'
      case 'gray': return 'default'
      default: return 'default'
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-primary">Customers</h1>
            <p className="text-gray-600 mt-2">Manage and track your customer relationships</p>
          </div>
        </div>
        <TableSkeleton rows={8} columns={5} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-primary">Customers</h1>
          <p className="text-gray-600 mt-2">Manage and track your customer relationships</p>
        </div>
        <Button variant="primary" size="md">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-primary">{customers.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Customers</p>
              <p className="text-2xl font-bold text-green-600">
                {customers.filter(c => c.status === 'active').length}
              </p>
            </div>
            <StatusBadge status="Active" variant="active" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">New This Month</p>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">VIP Customers</p>
              <p className="text-2xl font-bold text-purple-600">
                {customers.filter(c => c.segment === 'vip').length}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
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
        placeholder="Search by name, email, phone, or location..."
      />

      {/* Customers Display */}
      {paginatedCustomers.length === 0 ? (
        <EmptyState
          type="general"
          title="No customers found"
          description={filteredCustomers.length === 0 ? 
            "No customers match your current filters. Try adjusting your search criteria." :
            "No customers in your system yet."
          }
          action={filteredCustomers.length === 0 ? (
            <Button variant="secondary" onClick={() => setFilters({ search: '', status: '', sortBy: 'createdAt' })}>
              Clear Filters
            </Button>
          ) : (
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Customer
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Segment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">
                            {customer.segment === 'vip' && <Star className="w-3 h-3 inline text-yellow-500 mr-1" />}
                            {customer.status}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{customer.phone}</span>
                        </div>
                        {customer.city && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-600">{customer.city}, {customer.state}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge 
                        status={customer.status} 
                        variant={customer.status as any}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">{customer.segment}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {formatDate(customer.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Link to={`/dashboard/customers/${customer.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/dashboard/customers/${customer.id}/edit`}>
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
      {paginatedCustomers.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
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
