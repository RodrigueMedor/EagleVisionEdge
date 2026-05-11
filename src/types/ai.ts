// AI Assistant & Automation TypeScript Interfaces
export type AIMessageRole = 'user' | 'assistant' | 'system'
export type AIConversationType = 'chat' | 'lead_qualification' | 'financing' | 'rental' | 'appointment' | 'general'
export type AILeadStatus = 'new' | 'qualified' | 'contacted' | 'converted' | 'lost'
export type AIWorkflowStatus = 'pending' | 'in_progress' | 'completed' | 'failed'

// AI Message Interface
export interface AIMessage {
  id: string
  role: AIMessageRole
  content: string
  timestamp: Date
  conversationId: string
  metadata?: {
    actionType?: string
    leadId?: string
    appointmentId?: string
    financingApplicationId?: string
  }
}

// AI Conversation Interface
export interface AIConversation {
  id: string
  type: AIConversationType
  title: string
  messages: AIMessage[]
  startedAt: Date
  updatedAt: Date
  status: 'active' | 'closed'
  customerId?: string
  leadId?: string
  metadata?: Record<string, any>
}

// AI Lead Qualification
export interface AILeadQualification {
  id: string
  conversationId: string
  customerId?: string
  budget?: number
  vehicleType?: string
  financingNeeds?: boolean
  tradeIn?: boolean
  rentalNeeds?: boolean
  timeline?: string
  status: AILeadStatus
  qualificationScore: number
  createdAt: Date
  qualifiedAt?: Date
}

// AI Recommendation
export interface AIRecommendation {
  id: string
  type: 'vehicle' | 'financing' | 'rental' | 'service'
  title: string
  description: string
  score: number
  confidence?: number
  targetAudience?: string[]
  metadata: Record<string, any>
  createdAt: Date
}

// AI Appointment
export interface AIAppointment {
  id: string
  conversationId: string
  customerId?: string
  type: string
  requestedDate?: Date
  confirmedDate?: Date
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: Date
}

// AI Automation Workflow
export interface AIWorkflow {
  id: string
  name: string
  type: string
  status: AIWorkflowStatus
  trigger: string
  actions: AIWorkflowAction[]
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

// Workflow Action
export interface AIWorkflowAction {
  id: string
  type: string
  name: string
  status: AIWorkflowStatus
  parameters?: Record<string, any>
  result?: Record<string, any>
  timestamp: Date
}

// AI Service Response Structure
export interface AIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp: Date
}

// Chat Message Request/Response for Backend Ready
export interface ChatMessageRequest {
  conversationId: string
  content: string
  customerId?: string
  metadata?: Record<string, any>
}

export interface ChatMessageResponse {
  id: string
  conversationId: string
  message: AIMessage
  nextActions?: AIQuickAction[]
  metadata?: Record<string, any>
}

// Quick Action for Chat
export interface AIQuickAction {
  id: string
  label: string
  action: string
  icon?: string
  metadata?: Record<string, any>
}

// Lead Qualification Request/Response
export interface LeadQualificationRequest {
  conversationId: string
  customerId?: string
  answers: Record<string, any>
}

export interface LeadQualificationResponse {
  qualification: AILeadQualification
  recommendation: string
  nextSteps: string[]
}

// AI Analytics
export interface AIAnalytics {
  totalConversations: number
  totalLeadsGenerated: number
  qualificationRate: number
  averageConversationLength: number
  popularTopics: string[]
  automationWorkflowsCompleted: number
  averageResponseTime: number
}

// AI Activity
export interface AIActivity {
  id: string
  type: string
  description: string
  timestamp: Date
  conversationId?: string
  leadId?: string
}

