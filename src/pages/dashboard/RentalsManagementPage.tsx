import { useEffect, useState } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { Plus, Eye, Edit, Calendar, Car, DollarSign, Clock, TrendingUp, Activity, Trash2, ArrowLeft, Save, X, AlertTriangle } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { SearchFilterBar } from '@/components/ui/SearchFilterBar'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSkeleton'
import { DashboardCard } from '@/components/ui/DashboardCard'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { rentalsService } from '@/services/rentalsService'
import { Rental, RentalStatus } from '@/types/rental'
import { useNotification } from '@/hooks'

const rentalStatuses = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'active', label: 'Active', color: 'blue' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' }
]

const emptyForm = {
  customerName: '',
  customerEmail: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: new Date().getFullYear(),
  vehicleVin: '',
  vehicleId: '',
  customerId: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  dailyRate: 0,
  status: 'pending' as RentalStatus,
  notes: '',
}

type FormData = typeof emptyForm

export default function RentalsManagementPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { success, error: showError } = useNotification()

  const isAdd = location.pathname.endsWith('/add')
  const isEdit = location.pathname.endsWith('/edit')
  const isDetail = !!id && !isAdd && !isEdit
  const isList = !isAdd && !isEdit && !isDetail

  const [rentals, setRentals] = useState<Rental[]>([])
  const [filteredRentals, setFilteredRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [filters, setFilters] = useState({ search: '', status: '', sortBy: 'createdAt' })
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null)
  const [formData, setFormData] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState<RentalStatus>('pending')

  useEffect(() => {
    if (isList || isEdit || isDetail) loadRentals()
  }, [])

  useEffect(() => {
    if (isDetail && id) loadRentalDetail(id)
    if (isEdit && id) loadRentalForEdit(id)
  }, [id, isDetail, isEdit])

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
    } catch {
      showError('Failed to load rentals')
      setRentals([])
    } finally {
      setLoading(false)
    }
  }

  const loadRentalDetail = async (rentalId: string) => {
    setDetailLoading(true)
    try {
      const data = await rentalsService.getRentalById(rentalId)
      setSelectedRental(data)
    } catch {
      showError('Rental not found')
      navigate('/dashboard/rentals')
    } finally {
      setDetailLoading(false)
    }
  }

  const loadRentalForEdit = async (rentalId: string) => {
    setDetailLoading(true)
    try {
      const data = await rentalsService.getRentalById(rentalId)
      setFormData({
        customerName: data.customerName || '',
        customerEmail: data.customerEmail || '',
        vehicleMake: data.vehicleMake || '',
        vehicleModel: data.vehicleModel || '',
        vehicleYear: data.vehicleYear || new Date().getFullYear(),
        vehicleVin: data.vehicleVin || '',
        vehicleId: data.vehicleId,
        customerId: data.customerId,
        startDate: new Date(data.startDate).toISOString().split('T')[0],
        endDate: new Date(data.endDate).toISOString().split('T')[0],
        dailyRate: data.dailyRate,
        status: data.status,
        notes: data.notes || '',
      })
    } catch {
      showError('Rental not found')
      navigate('/dashboard/rentals')
    } finally {
      setDetailLoading(false)
    }
  }

  const filterAndSortRentals = () => {
    let filtered = rentals
    if (filters.search) {
      const q = filters.search.toLowerCase()
      filtered = filtered.filter(r =>
        (r.customerName || '').toLowerCase().includes(q) ||
        (r.vehicleMake || '').toLowerCase().includes(q) ||
        (r.vehicleModel || '').toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      )
    }
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(r => r.status === filters.status)
    }
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'startDate': return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        case 'endDate': return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        case 'customer': return (a.customerName || '').localeCompare(b.customerName || '')
        case 'amount': return (b.totalAmount || 0) - (a.totalAmount || 0)
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
    setFilteredRentals(filtered)
  }

  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d)
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value)

  const handleFormChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = (): string | null => {
    if (!formData.customerName.trim()) return 'Customer name is required'
    if (!formData.customerEmail.trim()) return 'Customer email is required'
    if (!formData.vehicleMake.trim()) return 'Vehicle make is required'
    if (!formData.vehicleModel.trim()) return 'Vehicle model is required'
    if (!formData.startDate) return 'Start date is required'
    if (!formData.endDate) return 'End date is required'
    if (new Date(formData.endDate) <= new Date(formData.startDate)) return 'End date must be after start date'
    if (formData.dailyRate <= 0) return 'Daily rate must be greater than 0'
    return null
  }

  const handleSave = async () => {
    const validationError = validateForm()
    if (validationError) {
      showError(validationError)
      return
    }
    setSaving(true)
    try {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000))
      const totalAmount = days * formData.dailyRate

      if (isEdit && id) {
        await rentalsService.updateRental(id, {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          vehicleMake: formData.vehicleMake,
          vehicleModel: formData.vehicleModel,
          vehicleYear: formData.vehicleYear,
          vehicleVin: formData.vehicleVin,
          startDate: start,
          endDate: end,
          dailyRate: formData.dailyRate,
          totalAmount,
          totalCost: totalAmount,
          status: formData.status,
          notes: formData.notes,
        })
        success('Rental updated successfully')
      } else {
        await rentalsService.addRental({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          vehicleMake: formData.vehicleMake,
          vehicleModel: formData.vehicleModel,
          vehicleYear: formData.vehicleYear,
          vehicleVin: formData.vehicleVin,
          vehicleId: formData.vehicleId || `vehicle_${Date.now()}`,
          customerId: formData.customerId || `cust_${Date.now()}`,
          startDate: start,
          endDate: end,
          dailyRate: formData.dailyRate,
          totalAmount,
          totalCost: totalAmount,
          status: formData.status,
          notes: formData.notes,
        })
        success('Rental created successfully')
      }
      navigate('/dashboard/rentals')
    } catch {
      showError(isEdit ? 'Failed to update rental' : 'Failed to create rental')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedRental) return
    setDeleting(true)
    try {
      await rentalsService.deleteRental(selectedRental.id)
      success('Rental deleted successfully')
      setShowDeleteModal(false)
      navigate('/dashboard/rentals')
    } catch {
      showError('Failed to delete rental')
    } finally {
      setDeleting(false)
    }
  }

  const handleStatusChange = async (newStatusValue: RentalStatus) => {
    if (!selectedRental) return
    try {
      await rentalsService.updateRental(selectedRental.id, { status: newStatusValue })
      setSelectedRental({ ...selectedRental, status: newStatusValue, updatedAt: new Date() })
      loadRentals()
      success(`Rental status changed to ${newStatusValue}`)
      setShowStatusModal(false)
    } catch {
      showError('Failed to update status')
    }
  }

  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage)
  const paginatedRentals = filteredRentals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalRevenue = rentals.reduce((sum, r) => sum + (r.totalAmount || 0), 0)
  const activeRentals = rentals.filter(r => r.status === 'active').length
  const pendingRentals = rentals.filter(r => r.status === 'pending').length
  const completedRentals = rentals.filter(r => r.status === 'completed').length

  if (loading && isList) {
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

  if (isDetail) {
    if (detailLoading) {
      return (
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-6 bg-gray-200 rounded w-96" />
            <div className="grid grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      )
    }

    if (!selectedRental) {
      return (
        <EmptyState type="general" title="Rental not found" description="The rental you're looking for doesn't exist." />
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/dashboard/rentals')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Rental #{selectedRental.id}</h1>
              <p className="text-gray-600">Manage rental details and status</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowDeleteModal(true)}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
            <Link to={`/dashboard/rentals/${selectedRental.id}/edit`}>
              <Button variant="primary">
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title="Total Amount" value={formatCurrency(selectedRental.totalAmount || 0)} icon={<DollarSign className="w-6 h-6" />} color="green" />
          <DashboardCard title="Status" value={selectedRental.status} icon={<Activity className="w-6 h-6" />} color={selectedRental.status === 'active' ? 'green' : selectedRental.status === 'pending' ? 'orange' : selectedRental.status === 'completed' ? 'blue' : 'red'} />
          <DashboardCard title="Daily Rate" value={formatCurrency(selectedRental.dailyRate)} icon={<Calendar className="w-6 h-6" />} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Name</span>
                <span className="font-medium">{selectedRental.customerName || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{selectedRental.customerEmail || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Customer ID</span>
                <span className="font-medium">{selectedRental.customerId}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Vehicle</span>
                <span className="font-medium">{selectedRental.vehicleYear} {selectedRental.vehicleMake} {selectedRental.vehicleModel}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">VIN</span>
                <span className="font-medium">{selectedRental.vehicleVin || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Vehicle ID</span>
                <span className="font-medium">{selectedRental.vehicleId}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Rental Period</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Start Date</span>
                <span className="font-medium">{formatDate(selectedRental.startDate)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">End Date</span>
                <span className="font-medium">{formatDate(selectedRental.endDate)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">
                  {Math.max(1, Math.round((new Date(selectedRental.endDate).getTime() - new Date(selectedRental.startDate).getTime()) / 86400000))} days
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Status</h3>
            <div className="flex items-center space-x-3 mb-4">
              <StatusBadge status={selectedRental.status} variant={selectedRental.status === 'active' ? 'success' : selectedRental.status === 'pending' ? 'warning' : selectedRental.status === 'completed' ? 'info' : 'default'} />
              <Button variant="secondary" size="sm" onClick={() => { setNewStatus(selectedRental.status); setShowStatusModal(true) }}>
                Change Status
              </Button>
            </div>
            {selectedRental.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Notes</h4>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3">{selectedRental.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-500 flex justify-between border-t border-gray-200 pt-4">
          <span>Created: {formatDate(selectedRental.createdAt)}</span>
          <span>Updated: {formatDate(selectedRental.updatedAt)}</span>
        </div>

        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Rental" size="sm">
          <div className="text-center">
            <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
            <p className="text-gray-600 mb-2">Are you sure you want to delete this rental?</p>
            <p className="font-medium mb-4">#{selectedRental.id} - {selectedRental.customerName}</p>
            <p className="text-sm text-red-500 mb-6">This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete Rental'}
              </Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title="Change Rental Status" size="sm">
          <div className="space-y-4">
            <p className="text-gray-600">Select new status for this rental:</p>
            <div className="grid grid-cols-2 gap-3">
              {rentalStatuses.map(s => (
                <button
                  key={s.value}
                  onClick={() => handleStatusChange(s.value as RentalStatus)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    newStatus === s.value ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{s.label}</div>
                </button>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  if (isAdd || isEdit) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard/rentals')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-primary">{isAdd ? 'New Rental' : 'Edit Rental'}</h1>
            <p className="text-gray-600">{isAdd ? 'Create a new vehicle rental record' : 'Update rental information'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input type="text" value={formData.customerName} onChange={e => handleFormChange('customerName', e.target.value)}
                className="input-field w-full" placeholder="John Smith" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email *</label>
              <input type="email" value={formData.customerEmail} onChange={e => handleFormChange('customerEmail', e.target.value)}
                className="input-field w-full" placeholder="john@email.com" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
              <input type="text" value={formData.vehicleMake} onChange={e => handleFormChange('vehicleMake', e.target.value)}
                className="input-field w-full" placeholder="Ford" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <input type="text" value={formData.vehicleModel} onChange={e => handleFormChange('vehicleModel', e.target.value)}
                className="input-field w-full" placeholder="F-150" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input type="number" value={formData.vehicleYear} onChange={e => handleFormChange('vehicleYear', Number(e.target.value))}
                className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
              <input type="text" value={formData.vehicleVin} onChange={e => handleFormChange('vehicleVin', e.target.value)}
                className="input-field w-full" placeholder="1FTFW1E50KFA12345" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Rental Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input type="date" value={formData.startDate} onChange={e => handleFormChange('startDate', e.target.value)}
                className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input type="date" value={formData.endDate} onChange={e => handleFormChange('endDate', e.target.value)}
                className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate ($) *</label>
              <input type="number" min="0" step="1" value={formData.dailyRate || ''} onChange={e => handleFormChange('dailyRate', Number(e.target.value))}
                className="input-field w-full" placeholder="75" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={formData.status} onChange={e => handleFormChange('status', e.target.value)}
                className="input-field w-full">
                {rentalStatuses.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
          {formData.startDate && formData.endDate && formData.dailyRate > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Estimated total: <strong>{formatCurrency(Math.max(1, Math.round((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / 86400000)) * formData.dailyRate)}</strong>
                ({Math.max(1, Math.round((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / 86400000))} days at {formatCurrency(formData.dailyRate)}/day)
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Notes</h3>
          <textarea value={formData.notes} onChange={e => handleFormChange('notes', e.target.value)}
            className="input-field w-full h-24 resize-none" placeholder="Optional notes about the rental..." />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate('/dashboard/rentals')}>
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : isAdd ? 'Create Rental' : 'Save Changes'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-primary">Rentals Management</h1>
          <p className="text-gray-600 mt-2">Manage your vehicle rental operations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={loadRentals}>
            <Activity className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Link to="/dashboard/rentals/add">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" /> New Rental
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={<DollarSign className="w-6 h-6" />} color="green" />
        <DashboardCard title="Active Rentals" value={activeRentals} icon={<Car className="w-6 h-6" />} color="blue" />
        <DashboardCard title="Pending" value={pendingRentals} icon={<Clock className="w-6 h-6" />} color="orange" />
        <DashboardCard title="Completed" value={completedRentals} icon={<TrendingUp className="w-6 h-6" />} color="purple" />
      </div>

      <SearchFilterBar
        searchValue={filters.search}
        onSearchChange={(value) => setFilters({ ...filters, search: value })}
        filters={{ status: filters.status, sortBy: filters.sortBy }}
        onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
        placeholder="Search by customer, vehicle, or rental ID..."
      />

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
                <Plus className="w-4 h-4 mr-2" /> Create Your First Rental
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rental ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rental Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" />{formatDate(rental.startDate)}</div>
                        <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" />{formatDate(rental.endDate)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(rental.totalAmount || 0)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={rental.status || ''} variant={(rental.status === 'active' ? 'success' : rental.status === 'pending' ? 'warning' : rental.status === 'completed' ? 'info' : 'default') as any} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Link to={`/dashboard/rentals/${rental.id}`}>
                          <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                        </Link>
                        <Link to={`/dashboard/rentals/${rental.id}/edit`}>
                          <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
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

      {paginatedRentals.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRentals.length)} of {filteredRentals.length} rentals
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  )
}
