// Backend-Ready AI Service (Frontend Mock)
// This service is structured to easily integrate with backend AI APIs later

import {
  AIMessage,
  AIConversation,
  AILeadQualification,
  AIRecommendation,
  AIResponse,
  ChatMessageRequest,
  ChatMessageResponse,
  AIQuickAction,
  LeadQualificationRequest,
  LeadQualificationResponse,
  AIAnalytics,
  AIActivity,
  AIWorkflow
} from '@/types/ai'
import {
  mockAIResponses,
  mockQuickActions,
  mockVehicleRecommendations,
  mockFinancingRecommendations,
  mockConversationHistory,
  mockQuickReplies
} from '@/data/mockAIConversations'

// Simulated API delay (will be real API call later)
const API_DELAY = 800

// AI Service - Backend Ready Architecture
export const aiService = {
  // =====================
  // CHAT & CONVERSATION
  // =====================

  /**
   * Send chat message - Backend Ready Structure
   * Future: POST /api/ai/chat/send-message
   */
  async sendChatMessage(request: ChatMessageRequest): Promise<AIResponse<ChatMessageResponse>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const response = this.generateChatResponse(request.content)

          const chatResponse: ChatMessageResponse = {
            id: `msg-${Date.now()}`,
            conversationId: request.conversationId,
            message: {
              id: `msg-${Date.now()}`,
              role: 'assistant',
              content: response.text,
              timestamp: new Date(),
              conversationId: request.conversationId
            },
            nextActions: response.actions
          }

          resolve({
            success: true,
            data: chatResponse,
            timestamp: new Date()
          })
        } catch (error) {
          resolve({
            success: false,
            error: 'Failed to send message',
            timestamp: new Date()
          })
        }
      }, API_DELAY)
    })
  },

  /**
   * Get conversation history - Backend Ready
   * Future: GET /api/ai/conversations/:conversationId
   */
  async getConversationHistory(conversationId: string): Promise<AIResponse<AIConversation>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const conversation = mockConversationHistory.find(c => c.id === conversationId)

        resolve({
          success: !!conversation,
          data: conversation,
          message: conversation ? 'Conversation retrieved' : 'Conversation not found',
          timestamp: new Date()
        })
      }, 500)
    })
  },

  /**
   * Get all conversations - Backend Ready
   * Future: GET /api/ai/conversations
   */
  async getConversations(customerId?: string): Promise<AIResponse<AIConversation[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: mockConversationHistory,
          timestamp: new Date()
        })
      }, 500)
    })
  },

  /**
   * Create new conversation - Backend Ready
   * Future: POST /api/ai/conversations
   */
  async createConversation(type: string, customerId?: string): Promise<AIResponse<AIConversation>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const conversation: AIConversation = {
          id: `conv-${Date.now()}`,
          type: type as any,
          title: `New ${type} conversation`,
          messages: [],
          startedAt: new Date(),
          updatedAt: new Date(),
          status: 'active',
          customerId
        }

        resolve({
          success: true,
          data: conversation,
          timestamp: new Date()
        })
      }, 300)
    })
  },

  // =====================
  // LEAD QUALIFICATION
  // =====================

  /**
   * Start lead qualification - Backend Ready
   * Future: POST /api/ai/lead-qualification/start
   */
  async startLeadQualification(conversationId: string, customerId?: string): Promise<AIResponse<string>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const message = this.getRandomResponse('lead_qualification_start')[0]

        resolve({
          success: true,
          data: message,
          timestamp: new Date()
        })
      }, 600)
    })
  },

  /**
   * Qualify lead - Backend Ready
   * Future: POST /api/ai/lead-qualification/qualify
   */
  async qualifyLead(request: LeadQualificationRequest): Promise<AIResponse<LeadQualificationResponse>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const qualification: AILeadQualification = {
          id: `lead-${Date.now()}`,
          conversationId: request.conversationId,
          customerId: request.customerId,
          budget: request.answers.budget,
          vehicleType: request.answers.vehicleType,
          financingNeeds: request.answers.financingNeeds,
          status: 'qualified',
          qualificationScore: Math.floor(Math.random() * 40) + 60, // 60-100
          createdAt: new Date(),
          qualifiedAt: new Date()
        }

        resolve({
          success: true,
          data: {
            qualification,
            recommendation: 'Based on your needs, I recommend checking out our selection of vehicles in your price range.',
            nextSteps: [
              'Schedule a dealership demo',
              'Get pre-approved for financing',
              'Explore vehicle options'
            ]
          },
          timestamp: new Date()
        })
      }, 1000)
    })
  },

  // =====================
  // RECOMMENDATIONS
  // =====================

  /**
   * Get vehicle recommendations - Backend Ready
   * Future: POST /api/ai/recommendations/vehicles
   */
  async getVehicleRecommendations(budget?: number, type?: string): Promise<AIResponse<AIRecommendation[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter recommendations based on budget
        let recommendations = mockVehicleRecommendations
        if (budget) {
          recommendations = recommendations.filter(r => r.metadata.price <= budget)
        }

        resolve({
          success: true,
          data: recommendations,
          timestamp: new Date()
        })
      }, 700)
    })
  },

  /**
   * Get financing recommendations - Backend Ready
   * Future: POST /api/ai/recommendations/financing
   */
  async getFinancingRecommendations(creditScore?: number): Promise<AIResponse<AIRecommendation[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter based on credit score
        let recommendations = mockFinancingRecommendations
        if (creditScore) {
          if (creditScore >= 750) {
            recommendations = [mockFinancingRecommendations[0]]
          } else if (creditScore >= 700) {
            recommendations = [mockFinancingRecommendations[1]]
          } else if (creditScore >= 600) {
            recommendations = [mockFinancingRecommendations[2]]
          }
        }

        resolve({
          success: true,
          data: recommendations,
          timestamp: new Date()
        })
      }, 700)
    })
  },

  // =====================
  // APPOINTMENTS
  // =====================

  /**
   * Schedule appointment - Backend Ready
   * Future: POST /api/ai/appointments/schedule
   */
  async scheduleAppointment(
    conversationId: string,
    appointmentDate: Date,
    customerId?: string
  ): Promise<AIResponse<string>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const confirmationMessage = `Perfect! I've scheduled your appointment for ${appointmentDate.toLocaleDateString()} at ${appointmentDate.toLocaleTimeString()}. We look forward to seeing you!`

        resolve({
          success: true,
          data: confirmationMessage,
          timestamp: new Date()
        })
      }, 800)
    })
  },

  // =====================
  // AUTOMATION WORKFLOWS
  // =====================

  /**
   * Trigger follow-up automation - Backend Ready
   * Future: POST /api/ai/automation/trigger-followup
   */
  async triggerFollowUpAutomation(leadId: string, customerId?: string): Promise<AIResponse<AIWorkflow>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const workflow: AIWorkflow = {
          id: `workflow-${Date.now()}`,
          name: 'Lead Follow-up Automation',
          type: 'followup',
          status: 'in_progress',
          trigger: `lead_created`,
          actions: [
            {
              id: 'action-1',
              type: 'send_message',
              name: 'Send Initial Follow-up',
              status: 'completed',
              timestamp: new Date()
            },
            {
              id: 'action-2',
              type: 'add_to_crm',
              name: 'Add Lead to CRM',
              status: 'completed',
              timestamp: new Date(Date.now() + 5000)
            },
            {
              id: 'action-3',
              type: 'create_notification',
              name: 'Notify Sales Team',
              status: 'pending',
              timestamp: new Date(Date.now() + 10000)
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }

        resolve({
          success: true,
          data: workflow,
          timestamp: new Date()
        })
      }, 1000)
    })
  },

  /**
   * Get automation workflow status - Backend Ready
   * Future: GET /api/ai/automation/workflows/:workflowId
   */
  async getWorkflowStatus(workflowId: string): Promise<AIResponse<AIWorkflow>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock workflow
        const workflow: AIWorkflow = {
          id: workflowId,
          name: 'Lead Processing Workflow',
          type: 'lead_processing',
          status: 'completed',
          trigger: 'lead_qualified',
          actions: [
            {
              id: 'a1',
              type: 'qualification',
              name: 'Lead Qualification',
              status: 'completed',
              timestamp: new Date()
            },
            {
              id: 'a2',
              type: 'notification',
              name: 'Send Notification',
              status: 'completed',
              timestamp: new Date()
            }
          ],
          createdAt: new Date(Date.now() - 3600000),
          updatedAt: new Date(Date.now() - 1800000),
          completedAt: new Date(Date.now() - 1200000)
        }

        resolve({
          success: true,
          data: workflow,
          timestamp: new Date()
        })
      }, 500)
    })
  },

  // =====================
  // ANALYTICS
  // =====================

  /**
   * Get AI analytics - Backend Ready
   * Future: GET /api/ai/analytics
   */
  async getAnalytics(): Promise<AIResponse<AIAnalytics>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const analytics: AIAnalytics = {
          totalConversations: 1247,
          totalLeadsGenerated: 456,
          qualificationRate: 0.74,
          averageConversationLength: 8.3,
          popularTopics: ['Financing', 'Vehicle Inquiry', 'Rental', 'Appointment Scheduling'],
          automationWorkflowsCompleted: 2341,
          averageResponseTime: 2.1
        }

        resolve({
          success: true,
          data: analytics,
          timestamp: new Date()
        })
      }, 600)
    })
  },

  /**
   * Get activity log - Backend Ready
   * Future: GET /api/ai/activity
   */
  async getActivityLog(limit: number = 50): Promise<AIResponse<AIActivity[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const activities: AIActivity[] = [
          {
            id: 'act-1',
            type: 'conversation_started',
            description: 'Customer initiated vehicle inquiry chat',
            timestamp: new Date(Date.now() - 600000)
          },
          {
            id: 'act-2',
            type: 'lead_qualified',
            description: 'Lead qualified through AI qualification workflow',
            timestamp: new Date(Date.now() - 300000)
          },
          {
            id: 'act-3',
            type: 'recommendation_provided',
            description: 'AI provided 3 vehicle recommendations',
            timestamp: new Date(Date.now() - 120000)
          },
          {
            id: 'act-4',
            type: 'appointment_scheduled',
            description: 'Dealership demo appointment scheduled',
            timestamp: new Date(Date.now() - 60000)
          }
        ]

        resolve({
          success: true,
          data: activities.slice(0, limit),
          timestamp: new Date()
        })
      }, 500)
    })
  },

  // =====================
  // HELPER FUNCTIONS (Internal)
  // =====================

  generateChatResponse(userMessage: string): { text: string; actions: AIQuickAction[] } {
    const lowerMessage = userMessage.toLowerCase()

    // Check for quick replies
    for (const [query, reply] of Object.entries(mockQuickReplies)) {
      if (lowerMessage.includes(query)) {
        return {
          text: reply,
          actions: mockQuickActions.slice(0, 3)
        }
      }
    }

    // Keyword matching
    if (lowerMessage.includes('vehicle') || lowerMessage.includes('car')) {
      return {
        text: this.getRandomResponse('vehicle_inquiry')[0],
        actions: mockQuickActions.filter(a => a.action === 'show_vehicles')
      }
    }

    if (lowerMessage.includes('financ')) {
      return {
        text: this.getRandomResponse('financing_inquiry')[0],
        actions: mockQuickActions.filter(a => a.action === 'financing_options')
      }
    }

    if (lowerMessage.includes('rent')) {
      return {
        text: this.getRandomResponse('rental_inquiry')[0],
        actions: mockQuickActions.filter(a => a.action === 'rental_info')
      }
    }

    if (lowerMessage.includes('credit') || lowerMessage.includes('qualify')) {
      return {
        text: this.getRandomResponse('bad_credit')[0],
        actions: mockQuickActions
      }
    }

    if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('demo')) {
      return {
        text: this.getRandomResponse('appointment_request')[0],
        actions: mockQuickActions.filter(a => a.action === 'schedule_appointment')
      }
    }

    // Default response
    return {
      text: "I'd be happy to help! Are you looking for a vehicle, financing information, or rental options?",
      actions: mockQuickActions
    }
  },

  getRandomResponse(key: string): string[] {
    return mockAIResponses[key] || ['How can I help you today?']
  }
}

