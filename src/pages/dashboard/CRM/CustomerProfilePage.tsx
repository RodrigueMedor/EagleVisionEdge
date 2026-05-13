import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Car, 
  MessageSquare,
  Clock,
  Star,
  TrendingUp,
  FileText,
  Bell,
  Edit,
  Save,
  X
} from 'lucide-react'
import { crmService } from '@/services/crmService'
import { Customer, CustomerNote, FollowUp, AIRecommendation } from '@/types/crm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const CustomerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCustomerData()
  }, [id])

  const loadCustomerData = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const [customerResponse, followUpsResponse, aiResponse] = await Promise.all([
        crmService.getCustomerProfile(id),
        crmService.getFollowUps(),
        crmService.getAIRecommendations(id)
      ])

      if (customerResponse.success) {
        setCustomer(customerResponse.data)
      } else {
        setError(customerResponse.message || 'Failed to load customer')
      }

      if (followUpsResponse.success) {
        setFollowUps(followUpsResponse.data.filter(f => f.customerId === id))
      }

      if (aiResponse.success) {
        setAiRecommendations(aiResponse.data)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim() || !customer) return

    try {
      const response = await crmService.addCustomerNote({
        customerId: customer.id,
        content: newNote,
        isPrivate: false,
        category: 'general'
      })

      if (response.success) {
        setCustomer({
          ...customer,
          customerNotes: [...customer.customerNotes, response.data],
          updatedAt: new Date()
        })
        setNewNote('')
      }
    } catch (err) {
      setError('Failed to add note')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'New Lead': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-yellow-100 text-yellow-800',
      'Appointment Scheduled': 'bg-purple-100 text-purple-800',
      'Financing Pending': 'bg-orange-100 text-orange-800',
      'Negotiation': 'bg-pink-100 text-pink-800',
      'Rental Inquiry': 'bg-indigo-100 text-indigo-800',
      'Sold': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getLeadScoreColor = (score: string) => {
    const colors: Record<string, string> = {
      hot: 'bg-red-100 text-red-800',
      warm: 'bg-yellow-100 text-yellow-800',
      cold: 'bg-blue-100 text-blue-800'
    }
    return colors[score] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || 'Customer not found'}</div>
        <button
          onClick={() => navigate('/dashboard/customers')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Customers
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard/customers')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Customers
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editing ? <Save size={20} /> : <Edit size={20} />}
            <span>{editing ? 'Save' : 'Edit'}</span>
          </button>
        </div>

        {/* Status Badges */}
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(customer.status)}`}>
            {customer.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLeadScoreColor(customer.leadScore)}`}>
            {customer.leadScore.toUpperCase()} LEAD
          </span>
          <span className="text-sm text-gray-500">
            Lead Score: {customer.leadScore}
          </span>
          <span className="text-sm text-gray-500">
            Source: {customer.leadSource}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{customer.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-gray-400" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium">{customer.phone}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-gray-400" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="font-medium">
                    {customer.address && `${customer.address}, `}
                    {customer.city && `${customer.city}, `}
                    {customer.state && `${customer.state} `}
                    {customer.zipCode}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="text-gray-400" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Customer Since</div>
                  <div className="font-medium">{customer.createdAt.toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Interest */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Car className="mr-2" size={20} />
              Vehicle Interest
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Interested Vehicles</div>
                <div className="font-medium">{customer.interestedVehicles.length} vehicles</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Budget Range</div>
                <div className="font-medium">
                  {customer.budget ? `$${customer.budget.toLocaleString()}` : 'Not specified'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Financing Interest</div>
                <div className="font-medium">
                  <span className={`px-2 py-1 rounded text-xs ${
                    customer.financingInterest ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.financingInterest ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Rental Interest</div>
                <div className="font-medium">
                  <span className={`px-2 py-1 rounded text-xs ${
                    customer.rentalInterest ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.rentalInterest ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <DollarSign className="mr-2" size={20} />
              Financial Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">Lead Value</div>
                <div className="font-medium text-lg">
                  {customer.leadValue ? `$${customer.leadValue.toLocaleString()}` : 'Not estimated'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Credit Score</div>
                <div className="font-medium">
                  {customer.creditScore ? customer.creditScore : 'Not provided'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Income Verified</div>
                <div className="font-medium">
                  <span className={`px-2 py-1 rounded text-xs ${
                    customer.incomeVerification ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {customer.incomeVerification ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Customer Timeline
            </h2>
            <div className="space-y-4">
              {customer.timelineActivity.length > 0 ? (
                customer.timelineActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b last:border-0">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      activity.type === 'customer_action' ? 'bg-blue-500' :
                      activity.type === 'salesperson_action' ? 'bg-green-500' :
                      activity.type === 'ai_action' ? 'bg-purple-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.title}</h4>
                        <span className="text-sm text-gray-500">
                          {activity.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No timeline activity yet</p>
              )}
            </div>
          </div>

          {/* Customer Notes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2" size={20} />
              Customer Notes
            </h2>
            
            {/* Add Note */}
            <div className="mb-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                />
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-4">
              {customer.customerNotes.length > 0 ? (
                customer.customerNotes.map((note) => (
                  <div key={note.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Note</h4>
                      <span className="text-sm text-gray-500">
                        {note.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{note.content}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {note.category}
                      </span>
                      {note.isPrivate && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No notes yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assigned Salesperson */}
          {customer.assignedSalesperson && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <User className="mr-2" size={18} />
                Assigned Salesperson
              </h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                <div className="font-medium">{customer.assignedSalesperson}</div>
              </div>
            </div>
          )}

          {/* Upcoming Follow-ups */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Bell className="mr-2" size={18} />
              Upcoming Follow-ups
            </h3>
            <div className="space-y-3">
              {followUps.length > 0 ? (
                followUps.slice(0, 3).map((followUp) => (
                  <div key={followUp.id} className="border-l-4 border-yellow-500 pl-3">
                    <h4 className="font-medium text-sm">{followUp.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{followUp.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        followUp.priority === 'high' ? 'bg-red-100 text-red-800' :
                        followUp.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {followUp.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        {followUp.dueDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No upcoming follow-ups</p>
              )}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <TrendingUp className="mr-2" size={18} />
              AI Recommendations
            </h3>
            <div className="space-y-3">
              {aiRecommendations.length > 0 ? (
                aiRecommendations.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="border-l-4 border-purple-500 pl-3">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {rec.confidence}% confidence
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No AI recommendations</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded hover:bg-gray-100">
                📞 Call Customer
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded hover:bg-gray-100">
                📧 Send Email
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded hover:bg-gray-100">
                📅 Schedule Appointment
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded hover:bg-gray-100">
                💰 Start Financing Application
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded hover:bg-gray-100">
                🚗 Schedule Test Drive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerProfilePage
