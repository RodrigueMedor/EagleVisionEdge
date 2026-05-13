// Enhanced CRM Types for Eagle Vision Edge Dealership Platform

export type CustomerStatus = 'New Lead' | 'Contacted' | 'Appointment Scheduled' | 'Financing Pending' | 'Negotiation' | 'Rental Inquiry' | 'Sold' | 'Closed'

export type LeadScore = 'hot' | 'warm' | 'cold'

export type LeadSource = 'Website' | 'Phone Call' | 'Walk-in' | 'Referral' | 'Social Media' | 'Email Campaign' | 'Advertisement' | 'Trade-in' | 'Service Department'

export type PreferredContactMethod = 'email' | 'phone' | 'sms' | 'in-person'

export type CommunicationType = 'call' | 'email' | 'sms' | 'note' | 'ai_chat' | 'appointment' | 'financing_update' | 'rental_update'

export type FollowUpPriority = 'high' | 'medium' | 'low'

export type FollowUpStatus = 'pending' | 'completed' | 'overdue' | 'cancelled'

export type FinancingStatus = 'Application Submitted' | 'Under Review' | 'Approved' | 'Pending Documents' | 'Rejected' | 'Funded'

export type RentalType = 'Uber' | 'Cargo Van' | 'Personal' | 'Commercial'

export type RentalStatus = 'Inquiry' | 'Reserved' | 'Active' | 'Completed' | 'Cancelled'

export type PipelineStage = 'New Lead' | 'Contacted' | 'Test Drive Scheduled' | 'Financing' | 'Negotiation' | 'Sold'

export type UserRole = 'Salesperson' | 'Financing Staff' | 'Super Admin' | 'Manager' | 'Rental Staff'

// Enhanced Customer Interface
export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  status: CustomerStatus
  leadScore: LeadScore
  leadSource: LeadSource
  interestedVehicles: string[] // Vehicle IDs
  financingInterest: boolean
  rentalInterest: boolean
  preferredRentalType?: RentalType
  assignedSalesperson?: string // Salesperson ID
  preferredContactMethod: PreferredContactMethod
  customerNotes: CustomerNote[]
  communicationHistory: CommunicationLog[]
  timelineActivity: TimelineActivity[]
  leadValue?: number
  budget?: number
  tradeInVehicle?: string
  creditScore?: number
  incomeVerification?: boolean
  employmentStatus?: string
  createdAt: Date
  updatedAt: Date
  lastContacted?: Date
  nextFollowUp?: Date
  name?: string // Computed field
}

export interface CustomerNote {
  id: string
  content: string
  createdAt: Date
  createdBy: string
  isPrivate: boolean
  category: 'general' | 'financing' | 'rental' | 'vehicle' | 'follow-up'
}

export interface CommunicationLog {
  id: string
  type: CommunicationType
  content: string
  timestamp: Date
  createdBy: string
  duration?: number // For calls in minutes
  outcome?: 'successful' | 'unsuccessful' | 'voicemail' | 'callback_requested'
  aiGenerated?: boolean
}

export interface TimelineActivity {
  id: string
  type: 'customer_action' | 'salesperson_action' | 'ai_action' | 'system_action'
  title: string
  description: string
  timestamp: Date
  userId?: string
  customerId: string
  metadata?: Record<string, any>
  icon?: string
  color?: string
}

// Enhanced Lead Interface
export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: CustomerStatus
  score: LeadScore
  source: LeadSource
  interestedVehicles: string[]
  vehicleInterest?: string
  budget?: number
  location?: string
  preferredContactMethod: PreferredContactMethod
  message?: string
  notes: CustomerNote[]
  communicationHistory: CommunicationLog[]
  lastContact: Date
  nextFollowUp?: Date
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
  pipelineStage: PipelineStage
  estimatedValue?: number
  probability: number // 0-100
  urgency: 'high' | 'medium' | 'low'
  tags: string[]
  customerName?: string // Computed field
}

// Follow-Up Management
export interface FollowUp {
  id: string
  customerId: string
  assignedTo: string
  title: string
  description: string
  dueDate: Date
  priority: FollowUpPriority
  status: FollowUpStatus
  type: 'call' | 'email' | 'meeting' | 'task' | 'reminder'
  completedAt?: Date
  completedBy?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  reminderSent?: boolean
}

// Pipeline Management
export interface Pipeline {
  id: string
  name: string
  stages: PipelineStage[]
  leads: Lead[]
  totalValue: number
  conversionRate: number
  averageDealSize: number
  salesCycleLength: number // in days
}

export interface PipelineMetrics {
  stage: PipelineStage
  count: number
  value: number
  conversionRate: number
  averageTimeInStage: number
}

// Financing Workflow
export interface FinancingApplication {
  id: string
  customerId: string
  status: FinancingStatus
  applicationDate: Date
  loanAmount: number
  downPayment: number
  termMonths: number
  interestRate?: number
  monthlyPayment?: number
  creditScore: number
  income: number
  employmentStatus: string
  debtToIncomeRatio?: number
  requestedVehicle?: string
  documents: FinancingDocument[]
  notes: string[]
  assignedTo?: string
  approvedAt?: Date
  fundedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface FinancingDocument {
  id: string
  name: string
  type: 'id_proof' | 'income_proof' | 'address_proof' | 'bank_statement' | 'other'
  uploadedAt: Date
  uploadedBy: string
  status: 'pending' | 'approved' | 'rejected'
  url?: string
}

// Rental Workflow
export interface RentalInquiry {
  id: string
  customerId: string
  rentalType: RentalType
  status: RentalStatus
  startDate: Date
  endDate?: Date
  preferredVehicle?: string
  pickupLocation?: string
  estimatedCost?: number
  deposit?: number
  driverLicense?: string
  insurance?: boolean
  notes: string[]
  assignedTo?: string
  confirmedAt?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// AI CRM Suggestions
export interface AIRecommendation {
  id: string
  customerId: string
  type: 'follow_up' | 'lead_score' | 'vehicle_match' | 'financing_tip' | 'rental_opportunity' | 'engagement'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  confidence: number // 0-100
  actionable: boolean
  suggestedAction?: string
  dueDate?: Date
  createdAt: Date
  acknowledged: boolean
  acknowledgedAt?: Date
  acknowledgedBy?: string
}

// Communication Center
export interface CommunicationThread {
  id: string
  customerId: string
  participants: string[] // User IDs
  messages: CommunicationMessage[]
  subject?: string
  status: 'active' | 'archived' | 'closed'
  createdAt: Date
  updatedAt: Date
  lastMessageAt: Date
}

export interface CommunicationMessage {
  id: string
  threadId: string
  senderId: string
  content: string
  type: CommunicationType
  timestamp: Date
  isRead: boolean
  readAt?: Date
  attachments?: string[]
  aiGenerated?: boolean
}

// CRM Analytics
export interface CRMMetrics {
  totalLeads: number
  newLeadsThisMonth: number
  conversionRate: number
  financingConversionRate: number
  rentalConversionRate: number
  averageResponseTime: number // in minutes
  salespersonPerformance: SalespersonMetrics[]
  pipelineMetrics: PipelineMetrics[]
  leadSourcePerformance: LeadSourceMetrics[]
  customerSatisfactionScore: number
  revenueThisMonth: number
  projectedRevenue: number
}

export interface SalespersonMetrics {
  userId: string
  name: string
  leadsAssigned: number
  leadsConverted: number
  conversionRate: number
  averageDealSize: number
  responseTime: number
  followUpCompletionRate: number
  customerSatisfactionScore: number
}

export interface LeadSourceMetrics {
  source: LeadSource
  leads: number
  conversions: number
  conversionRate: number
  costPerLead?: number
  revenueGenerated: number
  roi?: number
}

// CRM Dashboard Data
export interface CRMDashboardData {
  metrics: CRMMetrics
  recentActivities: TimelineActivity[]
  upcomingFollowUps: FollowUp[]
  aiRecommendations: AIRecommendation[]
  pipelineStages: PipelineMetrics[]
  topPerformers: SalespersonMetrics[]
  urgentLeads: Lead[]
  recentCommunications: CommunicationMessage[]
}

// Filter and Search Types
export interface CRMFilter {
  status?: CustomerStatus[]
  leadScore?: LeadScore[]
  leadSource?: LeadSource[]
  assignedTo?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  financingInterest?: boolean
  rentalInterest?: boolean
  tags?: string[]
}

export interface CRMSearch {
  query: string
  fields?: ('name' | 'email' | 'phone' | 'vehicle' | 'notes')[]
}

// API Response Types
export interface CRMResponse<T> {
  data: T
  success: boolean
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CRMError {
  code: string
  message: string
  details?: Record<string, any>
}

// Service Request Types
export interface CreateLeadRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  source: LeadSource
  interestedVehicles?: string[]
  budget?: number
  message?: string
  preferredContactMethod?: PreferredContactMethod
}

export interface UpdateLeadStatusRequest {
  status: CustomerStatus
  pipelineStage?: PipelineStage
  notes?: string
  assignedTo?: string
}

export interface CreateFollowUpRequest {
  customerId: string
  assignedTo: string
  title: string
  description: string
  dueDate: Date
  priority: FollowUpPriority
  type: 'call' | 'email' | 'meeting' | 'task' | 'reminder'
}

export interface AddCustomerNoteRequest {
  customerId: string
  content: string
  isPrivate?: boolean
  category?: 'general' | 'financing' | 'rental' | 'vehicle' | 'follow-up'
}

export interface AssignSalespersonRequest {
  customerId: string
  salespersonId: string
  notes?: string
}

export interface ScheduleFollowUpRequest {
  customerId: string
  title: string
  description: string
  scheduledDate: Date
  priority: FollowUpPriority
  type: 'call' | 'email' | 'meeting' | 'task' | 'reminder'
  assignedTo: string
}
