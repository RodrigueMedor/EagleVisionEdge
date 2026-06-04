import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Phone, Mail, Calendar, MapPin, Car } from 'lucide-react'
import { Card, StatusBadge } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { customersService } from '@/services/customersService'
import { Customer } from '@/types/customer'

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadCustomer(id)
    }
  }, [id])

  const loadCustomer = async (customerId: string) => {
    try {
      const data = await customersService.getCustomerById(customerId)
      setCustomer(data)
    } catch (error) {
      console.error('Failed to load customer:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer details...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer not found</h2>
        <Button onClick={() => navigate('/dashboard/customers')}>
          Back to Customers
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/customers')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.firstName} {customer.lastName}</h1>
            <p className="text-gray-600">Customer ID: {customer.id}</p>
          </div>
        </div>
        <Button>
          <Edit className="w-4 h-4 mr-2" />
          Edit Customer
        </Button>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">
                    {customer.address && `${customer.address}, `}
                    {customer.city && `${customer.city}, `}
                    {customer.state && `${customer.state} `}
                    {customer.zipCode}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Customer Since</p>
                  <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Purchase History */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Purchase History</h2>
            <div className="space-y-3">
              {customer.purchaseHistory?.map((purchase, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Vehicle ID: {purchase.vehicleId}</p>
                      <p className="text-sm text-gray-600">{new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${purchase.price.toLocaleString()}</p>
                    <StatusBadge status="completed" variant="success" />
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No purchase history</p>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Status */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <StatusBadge status={customer.status} variant="success" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Segment</span>
                <span className="font-medium capitalize">{customer.segment}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Purchases</span>
                <span className="font-semibold">{customer.purchaseHistory?.length || 0}</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call Customer
              </Button>
              <Button variant="secondary" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button variant="secondary" className="w-full">
                <Car className="w-4 h-4 mr-2" />
                Add Vehicle Interest
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}