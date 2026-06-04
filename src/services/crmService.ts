import {
  Customer,
  Lead,
  FollowUp,
  Pipeline,
  AIRecommendation,
  CRMMetrics,
  CRMDashboardData,
  CRMFilter,
  CRMSearch,
  CRMResponse,
  CreateLeadRequest,
  UpdateLeadStatusRequest,
  AddCustomerNoteRequest,
  AssignSalespersonRequest,
  ScheduleFollowUpRequest,
  CustomerStatus,
  LeadScore,
  LeadSource,
  PipelineStage,
  CustomerNote,
  CommunicationLog
} from '@/types/crm'

// Mock data generators
const generateMockCustomers = (): Customer[] => {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Mary']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
  const statuses: CustomerStatus[] = ['New Lead', 'Contacted', 'Appointment Scheduled', 'Financing Pending', 'Negotiation', 'Rental Inquiry', 'Sold', 'Closed']
  const scores: LeadScore[] = ['hot', 'warm', 'cold']
  const sources: LeadSource[] = ['Website', 'Phone Call', 'Walk-in', 'Referral', 'Social Media', 'Email Campaign', 'Advertisement', 'Trade-in', 'Service Department']

  return Array.from({ length: 50 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const createdAt = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
    
    return {
      id: `customer_${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      address: `${Math.floor(Math.random() * 9999)} Main St`,
      city: 'Miami',
      state: 'FL',
      zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      leadScore: scores[Math.floor(Math.random() * scores.length)],
      leadSource: sources[Math.floor(Math.random() * sources.length)],
      interestedVehicles: [`vehicle_${Math.floor(Math.random() * 20) + 1}`],
      financingInterest: Math.random() > 0.5,
      rentalInterest: Math.random() > 0.7,
      preferredRentalType: Math.random() > 0.5 ? 'Uber' : 'Cargo Van',
      assignedSalesperson: Math.random() > 0.3 ? `sales_${Math.floor(Math.random() * 5) + 1}` : undefined,
      preferredContactMethod: Math.random() > 0.5 ? 'phone' : 'email',
      customerNotes: [],
      communicationHistory: [],
      timelineActivity: [],
      leadValue: Math.floor(Math.random() * 50000) + 15000,
      budget: Math.floor(Math.random() * 60000) + 10000,
      creditScore: Math.floor(Math.random() * 300) + 550,
      incomeVerification: Math.random() > 0.4,
      employmentStatus: 'Full-time',
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      lastContacted: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
      nextFollowUp: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
      name: `${firstName} ${lastName}`
    }
  })
}

const generateMockLeads = (): Lead[] => {
  const customers = generateMockCustomers()
  const pipelineStages: PipelineStage[] = ['New Lead', 'Contacted', 'Test Drive Scheduled', 'Financing', 'Negotiation', 'Sold']
  
  return customers.map((customer, i) => ({
    id: `lead_${i + 1}`,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    status: customer.status,
    score: customer.leadScore,
    source: customer.leadSource,
    interestedVehicles: customer.interestedVehicles,
    vehicleInterest: customer.interestedVehicles[0],
    budget: customer.budget,
    location: `${customer.city}, ${customer.state}`,
    preferredContactMethod: customer.preferredContactMethod,
    notes: [],
    communicationHistory: [],
    lastContact: customer.lastContacted || new Date(),
    nextFollowUp: customer.nextFollowUp,
    assignedTo: customer.assignedSalesperson,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
    pipelineStage: pipelineStages[Math.floor(Math.random() * pipelineStages.length)],
    estimatedValue: customer.leadValue,
    probability: Math.floor(Math.random() * 100),
    urgency: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
    tags: ['urgent', 'financing', 'trade-in'].slice(0, Math.floor(Math.random() * 3)),
    customerName: customer.name
  }))
}

const generateMockFollowUps = (): FollowUp[] => {
  const customers = generateMockCustomers()
  const types: ('call' | 'email' | 'meeting' | 'task' | 'reminder')[] = ['call', 'email', 'meeting', 'task', 'reminder']
  const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low']
  const statuses: ('pending' | 'completed' | 'overdue' | 'cancelled')[] = ['pending', 'completed', 'overdue', 'cancelled']
  
  return Array.from({ length: 30 }, (_, i) => {
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const dueDate = new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000)
    const isCompleted = Math.random() > 0.6
    const status = isCompleted ? 'completed' : (dueDate < new Date() ? 'overdue' : 'pending')
    
    return {
      id: `followup_${i + 1}`,
      customerId: customer.id,
      assignedTo: customer.assignedSalesperson || 'sales_1',
      title: `Follow up with ${customer.firstName}`,
      description: `Contact customer regarding their ${customer.financingInterest ? 'financing' : 'vehicle'} inquiry`,
      dueDate,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: status as any,
      type: types[Math.floor(Math.random() * types.length)],
      completedAt: isCompleted ? new Date(dueDate.getTime() - Math.random() * 24 * 60 * 60 * 1000) : undefined,
      completedBy: isCompleted ? customer.assignedSalesperson : undefined,
      notes: isCompleted ? 'Customer responded positively' : undefined,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      reminderSent: Math.random() > 0.5
    }
  })
}

const generateMockAIRecommendations = (): AIRecommendation[] => {
  const customers = generateMockCustomers()
  const types: AIRecommendation['type'][] = ['follow_up', 'lead_score', 'vehicle_match', 'financing_tip', 'rental_opportunity', 'engagement']
  
  return Array.from({ length: 25 }, (_, i) => {
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const type = types[Math.floor(Math.random() * types.length)]
    
    const recommendations = {
      follow_up: {
        title: 'Immediate Follow-up Recommended',
        description: `${customer.firstName} has viewed the same vehicle 4 times in the past 48 hours. High purchase intent detected.`,
        suggestedAction: 'Call customer within 2 hours to schedule test drive'
      },
      lead_score: {
        title: 'Lead Score Upgrade',
        description: `Customer's lead score should be upgraded to 'Hot'. Credit score and income verification complete.`,
        suggestedAction: 'Update lead score and prioritize for immediate contact'
      },
      vehicle_match: {
        title: 'Perfect Vehicle Match Available',
        description: `New inventory matches ${customer.firstName}'s budget and preferences exactly.`,
        suggestedAction: 'Send vehicle details and schedule viewing'
      },
      financing_tip: {
        title: 'Financing Approval Probability: High',
        description: `Based on credit profile, ${customer.firstName} has 85% chance of financing approval.`,
        suggestedAction: 'Contact customer about pre-approval process'
      },
      rental_opportunity: {
        title: 'Rental Opportunity Detected',
        description: `Customer inquired about rental options. Current availability matches their needs.`,
        suggestedAction: 'Send rental information and availability'
      },
      engagement: {
        title: 'Customer Engagement Declining',
        description: `${customer.firstName} hasn't been contacted in 3 days. Risk of lead cooling.`,
        suggestedAction: 'Send personalized follow-up message immediately'
      }
    }
    
    const rec = recommendations[type]
    
    return {
      id: `ai_rec_${i + 1}`,
      customerId: customer.id,
      type,
      title: rec.title,
      description: rec.description,
      priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      confidence: Math.floor(Math.random() * 40) + 60,
      actionable: true,
      suggestedAction: rec.suggestedAction,
      dueDate: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 3 * 24 * 60 * 60 * 1000) : undefined,
      createdAt: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000),
      acknowledged: Math.random() > 0.7,
      acknowledgedAt: Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) : undefined,
      acknowledgedBy: Math.random() > 0.7 ? customer.assignedSalesperson : undefined
    }
  })
}

// Mock data storage
const mockCustomers = generateMockCustomers()
const mockLeads = generateMockLeads()
const mockFollowUps = generateMockFollowUps()
const mockAIRecommendations = generateMockAIRecommendations()

// CRM Service Class
class CRMService {
  // Customer Management
  async getCustomers(filter?: CRMFilter, search?: CRMSearch): Promise<CRMResponse<Customer[]>> {
    await this.simulateDelay(500)
    
    let filteredCustomers = [...mockCustomers]
    
    // Apply filters
    if (filter) {
      if (filter.status && filter.status.length > 0) {
        filteredCustomers = filteredCustomers.filter(c => filter.status!.includes(c.status))
      }
      if (filter.leadScore && filter.leadScore.length > 0) {
        filteredCustomers = filteredCustomers.filter(c => filter.leadScore!.includes(c.leadScore))
      }
      if (filter.assignedTo && filter.assignedTo.length > 0) {
        filteredCustomers = filteredCustomers.filter(c => 
          c.assignedSalesperson && filter.assignedTo!.includes(c.assignedSalesperson)
        )
      }
      if (filter.financingInterest !== undefined) {
        filteredCustomers = filteredCustomers.filter(c => c.financingInterest === filter.financingInterest)
      }
      if (filter.rentalInterest !== undefined) {
        filteredCustomers = filteredCustomers.filter(c => c.rentalInterest === filter.rentalInterest)
      }
    }
    
    // Apply search
    if (search && search.query) {
      const query = search.query.toLowerCase()
      filteredCustomers = filteredCustomers.filter(c => {
        const nameMatch = c.name?.toLowerCase().includes(query)
        const emailMatch = c.email.toLowerCase().includes(query)
        const phoneMatch = c.phone.includes(query)
        return nameMatch || emailMatch || phoneMatch
      })
    }
    
    return {
      data: filteredCustomers,
      success: true,
      pagination: {
        page: 1,
        limit: filteredCustomers.length,
        total: filteredCustomers.length,
        totalPages: 1
      }
    }
  }

  async getCustomerProfile(customerId: string): Promise<CRMResponse<Customer>> {
    await this.simulateDelay(300)
    
    const customer = mockCustomers.find(c => c.id === customerId)
    if (!customer) {
      return {
        data: null as any,
        success: false,
        message: 'Customer not found'
      }
    }
    
    return {
      data: customer,
      success: true
    }
  }

  async createLead(request: CreateLeadRequest): Promise<CRMResponse<Lead>> {
    await this.simulateDelay(800)
    
    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      phone: request.phone,
      status: 'New Lead',
      score: 'warm',
      source: request.source,
      interestedVehicles: request.interestedVehicles || [],
      budget: request.budget,
      preferredContactMethod: request.preferredContactMethod || 'email',
      notes: [],
      communicationHistory: [],
      lastContact: new Date(),
      assignedTo: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      pipelineStage: 'New Lead',
      estimatedValue: request.budget || 25000,
      probability: 25,
      urgency: 'medium',
      tags: [],
      customerName: `${request.firstName} ${request.lastName}`
    }
    
    mockLeads.push(newLead)
    
    // Create corresponding customer
    const newCustomer: Customer = {
      id: `customer_${Date.now()}`,
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      phone: request.phone,
      status: 'New Lead',
      leadScore: 'warm',
      leadSource: request.source,
      interestedVehicles: request.interestedVehicles || [],
      financingInterest: false,
      rentalInterest: false,
      preferredContactMethod: request.preferredContactMethod || 'email',
      customerNotes: [],
      communicationHistory: [],
      timelineActivity: [],
      budget: request.budget,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: `${request.firstName} ${request.lastName}`
    }
    
    mockCustomers.push(newCustomer)
    
    return {
      data: newLead,
      success: true,
      message: 'Lead created successfully'
    }
  }

  async updateLeadStatus(leadId: string, request: UpdateLeadStatusRequest): Promise<CRMResponse<Lead>> {
    await this.simulateDelay(400)
    
    const leadIndex = mockLeads.findIndex(l => l.id === leadId)
    if (leadIndex === -1) {
      return {
        data: null as any,
        success: false,
        message: 'Lead not found'
      }
    }
    
    mockLeads[leadIndex] = {
      ...mockLeads[leadIndex],
      status: request.status,
      pipelineStage: request.pipelineStage || mockLeads[leadIndex].pipelineStage,
      assignedTo: request.assignedTo || mockLeads[leadIndex].assignedTo,
      updatedAt: new Date()
    }
    
    // Update corresponding customer
    const customerIndex = mockCustomers.findIndex(c => 
      c.email === mockLeads[leadIndex].email && c.firstName === mockLeads[leadIndex].firstName
    )
    if (customerIndex !== -1) {
      mockCustomers[customerIndex].status = request.status
      mockCustomers[customerIndex].assignedSalesperson = request.assignedTo
      mockCustomers[customerIndex].updatedAt = new Date()
    }
    
    return {
      data: mockLeads[leadIndex],
      success: true,
      message: 'Lead status updated successfully'
    }
  }

  async addCustomerNote(request: AddCustomerNoteRequest): Promise<CRMResponse<CustomerNote>> {
    await this.simulateDelay(300)
    
    const newNote: CustomerNote = {
      id: `note_${Date.now()}`,
      content: request.content,
      createdAt: new Date(),
      createdBy: 'current_user', // Would come from auth context
      isPrivate: request.isPrivate || false,
      category: request.category || 'general'
    }
    
    const customerIndex = mockCustomers.findIndex(c => c.id === request.customerId)
    if (customerIndex !== -1) {
      mockCustomers[customerIndex].customerNotes.push(newNote)
      mockCustomers[customerIndex].updatedAt = new Date()
    }
    
    return {
      data: newNote,
      success: true,
      message: 'Note added successfully'
    }
  }

  async assignSalesperson(request: AssignSalespersonRequest): Promise<CRMResponse<Customer>> {
    await this.simulateDelay(400)
    
    const customerIndex = mockCustomers.findIndex(c => c.id === request.customerId)
    if (customerIndex === -1) {
      return {
        data: null as any,
        success: false,
        message: 'Customer not found'
      }
    }
    
    mockCustomers[customerIndex].assignedSalesperson = request.salespersonId
    mockCustomers[customerIndex].updatedAt = new Date()
    
    // Also update corresponding lead
    const leadIndex = mockLeads.findIndex(l => 
      l.email === mockCustomers[customerIndex].email && 
      l.firstName === mockCustomers[customerIndex].firstName
    )
    if (leadIndex !== -1) {
      mockLeads[leadIndex].assignedTo = request.salespersonId
      mockLeads[leadIndex].updatedAt = new Date()
    }
    
    return {
      data: mockCustomers[customerIndex],
      success: true,
      message: 'Salesperson assigned successfully'
    }
  }

  async scheduleFollowUp(request: ScheduleFollowUpRequest): Promise<CRMResponse<FollowUp>> {
    await this.simulateDelay(500)
    
    const newFollowUp: FollowUp = {
      id: `followup_${Date.now()}`,
      customerId: request.customerId,
      assignedTo: request.assignedTo,
      title: request.title,
      description: request.description,
      dueDate: request.scheduledDate,
      priority: request.priority,
      status: 'pending',
      type: request.type,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    mockFollowUps.push(newFollowUp)
    
    // Update customer's next follow up
    const customerIndex = mockCustomers.findIndex(c => c.id === request.customerId)
    if (customerIndex !== -1) {
      mockCustomers[customerIndex].nextFollowUp = request.scheduledDate
      mockCustomers[customerIndex].updatedAt = new Date()
    }
    
    return {
      data: newFollowUp,
      success: true,
      message: 'Follow-up scheduled successfully'
    }
  }

  async getPipelineData(): Promise<CRMResponse<Pipeline>> {
    await this.simulateDelay(600)
    
    const stages: PipelineStage[] = ['New Lead', 'Contacted', 'Test Drive Scheduled', 'Financing', 'Negotiation', 'Sold']
    const pipelineMetrics = stages.map(stage => ({
      stage,
      count: mockLeads.filter(l => l.pipelineStage === stage).length,
      value: mockLeads.filter(l => l.pipelineStage === stage).reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
      conversionRate: Math.random() * 100,
      averageTimeInStage: Math.random() * 7
    }))
    
    const pipeline: Pipeline = {
      id: 'main_pipeline',
      name: 'Sales Pipeline',
      stages,
      leads: mockLeads,
      totalValue: mockLeads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
      conversionRate: 15.5,
      averageDealSize: 28500,
      salesCycleLength: 21
    }
    
    return {
      data: pipeline,
      success: true
    }
  }

  async getCommunicationHistory(customerId: string): Promise<CRMResponse<CommunicationLog[]>> {
    await this.simulateDelay(400)
    
    const customer = mockCustomers.find(c => c.id === customerId)
    if (!customer) {
      return {
        data: [],
        success: false,
        message: 'Customer not found'
      }
    }
    
    return {
      data: customer.communicationHistory,
      success: true
    }
  }

  async getFollowUps(assignedTo?: string): Promise<CRMResponse<FollowUp[]>> {
    await this.simulateDelay(300)
    
    let followUps = [...mockFollowUps]
    
    if (assignedTo) {
      followUps = followUps.filter(f => f.assignedTo === assignedTo)
    }
    
    return {
      data: followUps,
      success: true
    }
  }

  async getAIRecommendations(customerId?: string): Promise<CRMResponse<AIRecommendation[]>> {
    await this.simulateDelay(400)
    
    let recommendations = [...mockAIRecommendations]
    
    if (customerId) {
      recommendations = recommendations.filter(r => r.customerId === customerId)
    }
    
    return {
      data: recommendations,
      success: true
    }
  }

  async getCRMDashboardData(): Promise<CRMResponse<CRMDashboardData>> {
    await this.simulateDelay(800)
    
    const metrics: CRMMetrics = {
      totalLeads: mockLeads.length,
      newLeadsThisMonth: mockLeads.filter(l => 
        l.createdAt.getMonth() === new Date().getMonth()
      ).length,
      conversionRate: 15.5,
      financingConversionRate: 68.2,
      rentalConversionRate: 42.1,
      averageResponseTime: 45, // minutes
      salespersonPerformance: [],
      pipelineMetrics: [],
      leadSourcePerformance: [],
      customerSatisfactionScore: 4.6,
      revenueThisMonth: 1250000,
      projectedRevenue: 2100000
    }
    
    const dashboardData: CRMDashboardData = {
      metrics,
      recentActivities: [],
      upcomingFollowUps: mockFollowUps.filter(f => f.status === 'pending').slice(0, 5),
      aiRecommendations: mockAIRecommendations.filter(r => !r.acknowledged).slice(0, 5),
      pipelineStages: [],
      topPerformers: [],
      urgentLeads: mockLeads.filter(l => l.urgency === 'high').slice(0, 5),
      recentCommunications: []
    }
    
    return {
      data: dashboardData,
      success: true
    }
  }

  // Helper method to simulate async delay
  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export singleton instance
export const crmService = new CRMService()
export default crmService
