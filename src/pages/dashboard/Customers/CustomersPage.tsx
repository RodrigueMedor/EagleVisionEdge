import { useState, useEffect } from 'react'
import { Search, Filter, Plus, Eye, Edit, Phone, Mail, Calendar, MapPin, Car, User, Star } from 'lucide-react'
import Card, { StatusBadge } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { mockCustomers } from '@/data/mockCustomers'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    filterAndSortCustomers()
  }, [customers, searchTerm, statusFilter, sortBy])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setCustomers(mockCustomers)
    } catch (err) {
      console.error('Failed to load customers', err)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortCustomers = () => {
    let filtered = customers

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        (customer.name || `${customer.firstName} ${customer.lastName}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || `${a.firstName} ${a.lastName}`).localeCompare(b.name || `${b.firstName} ${b.lastName}`)
        case 'email':
          return a.email.localeCompare(b.email)
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredCustomers(filtered)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
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

  if (loading) {
    return <div className="text-center py-12">Loading customers...</div>
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
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-primary">{customers.length}</p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Customers</p>
              <p className="text-2xl font-bold text-green-600">
                {customers.filter(c => c.status === 'active').length}
              </p>
            </div>
            <StatusBadge status="Active" variant="success" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">New This Month</p>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">VIP Customers</p>
              <p className="text-2xl font-bold text-purple-600">
                {customers.filter(c => c.segment === 'vip').length}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="pl-10"
            />
          </div>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48"
          >
            <option value="all">All Status</option>
            {customerStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-48"
          >
            <option value="createdAt">Date Added</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
          </Select>

          <Button 
            variant="secondary" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Customers Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-600">
                          {customer.segment === 'vip' && <Star className="w-3 h-3 inline text-yellow-500" />}
                          {customer.status}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{customer.phone}</span>
                      </div>
                      {customer.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{customer.address}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge 
                      status={customer.status} 
                      variant={getStatusVariant(customer.status)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">
                      {formatDate(customer.createdAt)}
                    </span>
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

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No customers found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
