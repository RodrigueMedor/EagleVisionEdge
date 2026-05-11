import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Plus, Car, Edit, Trash2, Eye, DollarSign, Grid, List } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { SearchFilterBar } from '@/components/ui/SearchFilterBar'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSkeleton'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { inventoryService } from '@/services/inventoryService'
import { Vehicle, VehicleStatus } from '@/types/vehicle'

export default function InventoryListPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'createdAt'
  })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null)

  useEffect(() => {
    loadVehicles()
  }, [])

  useEffect(() => {
    filterAndSortVehicles()
  }, [vehicles, filters])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const loadVehicles = async () => {
    setLoading(true)
    try {
      const data = await inventoryService.getVehicles()
      setVehicles(data)
    } catch (err) {
      console.error('Failed to load vehicles', err)
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortVehicles = () => {
    let filtered = vehicles

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(vehicle =>
        vehicle.make.toLowerCase().includes(filters.search.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(filters.search.toLowerCase()) ||
        vehicle.vin.toLowerCase().includes(filters.search.toLowerCase()) ||
        vehicle.exteriorColor.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === filters.status)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'mileage':
          return a.mileage - b.mileage
        case 'year':
          return b.year - a.year
        case 'name-asc':
          return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`)
        case 'name-desc':
          return `${b.make} ${b.model}`.localeCompare(`${a.make} ${a.model}`)
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'date-asc':
        default:
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
    })

    setFilteredVehicles(filtered)
  }

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!vehicleToDelete) return

    try {
      await inventoryService.deleteVehicle(vehicleToDelete.id)
      setVehicles(vehicles.filter(v => v.id !== vehicleToDelete.id))
      setDeleteModalOpen(false)
      setVehicleToDelete(null)
    } catch (err) {
      console.error('Failed to delete vehicle', err)
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
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-primary">Inventory Management</h1>
            <p className="text-gray-600 mt-2">Manage your vehicle inventory</p>
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
          <h1 className="text-4xl font-bold text-primary">Inventory Management</h1>
          <p className="text-gray-600 mt-2">Manage your vehicle inventory</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3 py-1"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="px-3 py-1"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Link to="/dashboard/inventory/add">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </Link>
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
        placeholder="Search by make, model, VIN, or color..."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Vehicles</p>
              <p className="text-2xl font-bold text-primary">{vehicles.length}</p>
            </div>
            <Car className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {vehicles.filter(v => v.status === 'available').length}
              </p>
            </div>
            <StatusBadge status="Available" variant="available" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sold</p>
              <p className="text-2xl font-bold text-red-600">
                {vehicles.filter(v => v.status === 'sold').length}
              </p>
            </div>
            <StatusBadge status="Sold" variant="sold" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(vehicles.reduce((sum, v) => sum + v.price, 0))}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Vehicle Display */}
      {paginatedVehicles.length === 0 ? (
        <EmptyState
          type="vehicles"
          title="No vehicles found"
          description={filteredVehicles.length === 0 ? 
            "No vehicles match your current filters. Try adjusting your search criteria." :
            "No vehicles in your inventory yet."
          }
          action={filteredVehicles.length === 0 ? (
            <Button variant="secondary" onClick={() => setFilters({ search: '', status: '', sortBy: 'createdAt' })}>
              Clear Filters
            </Button>
          ) : (
            <Link to="/dashboard/inventory/add">
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Vehicle
              </Button>
            </Link>
          )}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Vehicle Image */}
              <div className="h-48 bg-gray-200 relative">
                {vehicle.images && vehicle.images.length > 0 ? (
                  <img
                    src={vehicle.images[0]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <StatusBadge 
                    status={vehicle.status} 
                    variant={vehicle.status as any} 
                  />
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-primary">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-gray-600 text-sm">{vehicle.vin}</p>
                  </div>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(vehicle.price)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div>{vehicle.mileage.toLocaleString()} miles</div>
                  <div>{vehicle.fuelType}</div>
                  <div>{vehicle.transmission}</div>
                  <div>{vehicle.exteriorColor}</div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/dashboard/inventory/${vehicle.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link to={`/dashboard/inventory/${vehicle.id}/edit`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleDeleteVehicle(vehicle)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VIN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mileage
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
                {paginatedVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {vehicle.images && vehicle.images.length > 0 ? (
                            <img
                              className="h-10 w-10 rounded object-cover"
                              src={vehicle.images[0]}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                              <Car className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicle.exteriorColor} • {vehicle.fuelType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.vin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(vehicle.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.mileage.toLocaleString()} mi
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge 
                        status={vehicle.status} 
                        variant={vehicle.status as any} 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Link to={`/dashboard/inventory/${vehicle.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/dashboard/inventory/${vehicle.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteVehicle(vehicle)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
      {paginatedVehicles.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} of {filteredVehicles.length} vehicles
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete the{' '}
            <strong>
              {vehicleToDelete?.year} {vehicleToDelete?.make} {vehicleToDelete?.model}
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmDelete}>
              Delete Vehicle
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
