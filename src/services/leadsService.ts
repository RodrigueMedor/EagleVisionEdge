// Mock Leads Service
import { Lead, LeadStatus, CommunicationLog } from '@/types/lead'
import { mockLeads } from '@/data/mockLeads'

const leadsData: Lead[] = mockLeads.map(lead => ({
  ...lead,
  createdAt: new Date(lead.createdAt),
  updatedAt: new Date(lead.updatedAt),
  lastContact: new Date(lead.lastContact),
  nextFollowUp: lead.nextFollowUp ? new Date(lead.nextFollowUp) : undefined,
  notes: lead.notes.map(note => ({
    ...note,
    createdAt: new Date(note.createdAt)
  })),
  communicationHistory: lead.communicationHistory.map(comm => ({
    ...comm,
    timestamp: new Date(comm.timestamp)
  }))
}))

export const leadsService = {
  async getLeads(): Promise<Lead[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return leadsData
  },

  async getLeadById(id: string): Promise<Lead> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const lead = leadsData.find((l: Lead) => l.id === id)
    if (!lead) {
      throw new Error('Lead not found')
    }
    return lead
  },

  async searchLeads(query: string): Promise<Lead[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const lowerQuery = query.toLowerCase()
    return leadsData.filter((l: Lead) =>
      `${l.firstName} ${l.lastName} ${l.email} ${l.phone}`.toLowerCase().includes(lowerQuery)
    )
  },

  async filterLeads(filters: {
    status?: LeadStatus
    score?: string
    assignedTo?: string
    source?: string
  }): Promise<Lead[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return leadsData.filter((l: Lead) => {
      if (filters.status && l.status !== filters.status) return false
      if (filters.score && l.score !== filters.score) return false
      if (filters.assignedTo && l.assignedTo !== filters.assignedTo) return false
      if (filters.source && l.source !== filters.source) return false
      return true
    })
  },

  async addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newLead: Lead = {
      ...lead,
      id: `lead_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    leadsData.push(newLead)
    return newLead
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = leadsData.findIndex((l: Lead) => l.id === id)
    if (index === -1) {
      throw new Error('Lead not found')
    }
    leadsData[index] = {
      ...leadsData[index],
      ...updates,
      updatedAt: new Date(),
    }
    return leadsData[index]
  },

  async updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
    return this.updateLead(id, { status, updatedAt: new Date() })
  },

  async addCommunicationLog(leadId: string, communication: Omit<CommunicationLog, 'id'>): Promise<Lead> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = leadsData.findIndex((l: Lead) => l.id === leadId)
    if (index === -1) {
      throw new Error('Lead not found')
    }
    const newComm: CommunicationLog = {
      ...communication,
      id: `comm_${Date.now()}`,
    }
    leadsData[index].communicationHistory.push(newComm)
    leadsData[index].lastContact = new Date()
    leadsData[index].updatedAt = new Date()
    return leadsData[index]
  },

  async getLeadsByStatus(status: LeadStatus): Promise<Lead[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return leadsData.filter((l: Lead) => l.status === status)
  },

  async getLeadStats(): Promise<{
    total: number
    byStatus: { [key in LeadStatus]: number }
  }> {
    await new Promise(resolve => setTimeout(resolve, 150))
    const byStatus: { [key in LeadStatus]: number } = {
      new: 0,
      contacted: 0,
      appointment_scheduled: 0,
      financing_pending: 0,
      negotiation: 0,
      sold: 0,
      closed: 0,
    }
    leadsData.forEach((l: Lead) => {
      byStatus[l.status]++
    })
    return {
      total: leadsData.length,
      byStatus,
    }
  },

  async deleteLead(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = leadsData.findIndex((l: Lead) => l.id === id)
    if (index === -1) {
      throw new Error('Lead not found')
    }
    leadsData.splice(index, 1)
  },
}

