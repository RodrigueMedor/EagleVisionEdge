export type LeadStatus = 'new' | 'contacted' | 'appointment_scheduled' | 'financing_pending' | 'negotiation' | 'sold' | 'closed'

export type LeadScore = 'hot' | 'warm' | 'cold'

export interface CommunicationLog {
  id: string
  type: 'call' | 'email' | 'sms' | 'note'
  content: string
  timestamp: Date
  createdBy: string
}

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: LeadStatus
  score: LeadScore
  source: string
  interestedVehicles: string[] // Vehicle IDs
  vehicleInterest?: string
  budget?: number
  location?: string
  preferredContactMethod?: 'email' | 'phone' | 'sms'
  message?: string
  notes: {
    id: string
    content: string
    createdAt: Date
    createdBy: string
  }[]
  communicationHistory: CommunicationLog[]
  lastContact: Date
  nextFollowUp?: Date
  assignedTo?: string // Sales rep ID
  createdAt: Date
  updatedAt: Date
  customerName?: string // Computed field
}

