import {
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
import { inventoryService } from './inventoryService'
import { rentalsService } from './rentalsService'

const DEALERSHIP_INFO = {
  name: 'Eagle Vision Edge',
  location: '123 Main Street, Miami, FL 33101',
  phone: '(555) 123-4567',
  email: 'info@eaglevisionedge.com',
  hours: 'Mon-Fri 9AM-7PM, Sat 9AM-5PM',
  website: 'www.eaglevisionedge.com'
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value)
}

function formatVehicleSummary(v: { year: number; make: string; model: string; price: number; mileage: number; fuelType: string; transmission: string; exteriorColor: string; bodyType: string }) {
  return `• ${v.year} ${v.make} ${v.model} — ${formatCurrency(v.price)} | ${v.mileage.toLocaleString()} mi | ${v.fuelType} | ${v.transmission} | ${v.exteriorColor}`
}

export const aiService = {
  async sendChatMessage(request: ChatMessageRequest): Promise<AIResponse<ChatMessageResponse>> {
    const response = await this.generateChatResponse(request.content)
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
    return {
      success: true,
      data: chatResponse,
      timestamp: new Date()
    }
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

  async generateChatResponse(userMessage: string): Promise<{ text: string; actions: AIQuickAction[] }> {
    const lower = userMessage.toLowerCase()

    for (const [query, reply] of Object.entries(mockQuickReplies)) {
      if (lower.includes(query)) {
        return { text: reply, actions: mockQuickActions.slice(0, 3) }
      }
    }

    if (lower.includes('book') || lower.includes('reserve') || lower.includes('buy') || lower.includes('purchase') || (lower.includes('i want') && (lower.includes('car') || lower.includes('vehicle'))) || lower.includes('interested in')) {
      return {
        text: "I'd love to help you book a vehicle! Let me guide you through a few quick questions.\n\nFirst, **which vehicle are you interested in?** You can tell me the make and model, or describe what you're looking for.",
        actions: mockQuickActions.filter(a => a.action === 'show_vehicles')
      }
    }

    if (lower.includes('hello') || lower.includes('hi ') || lower === 'hi' || lower === 'hey') {
      return {
        text: "👋 Welcome to Eagle Vision Edge! I'm your AI assistant. I can help you browse our vehicles, check financing options, or explore rentals. What are you looking for?",
        actions: mockQuickActions.slice(0, 4)
      }
    }

    if (lower.includes('how many') || lower.includes('total') || lower.includes('in stock') || lower.includes('available')) {
      try {
        const stats = await inventoryService.getInventoryStats()
        return {
          text: `📊 Here's our current inventory:\n• Available: ${stats.available} vehicles\n• Sold: ${stats.sold}\n• Rented: ${stats.rented}\n• In Maintenance: ${stats.maintenance}\n• Total: ${stats.total} vehicles\n\nWould you like to see what's available?`,
          actions: mockQuickActions.filter(a => a.action === 'show_vehicles')
        }
      } catch {
        return { text: 'Let me check our inventory...', actions: mockQuickActions }
      }
    }

    if ((lower.includes('vehicle') || lower.includes('car') || lower.includes('suv') || lower.includes('truck') || lower.includes('sedan')) && !lower.includes('show')) {
      try {
        const vehicles = await inventoryService.getVehicles()
        const available = vehicles.filter(v => v.status === 'available').slice(0, 5)
        if (available.length === 0) {
          return { text: 'We currently have no available vehicles. Check back soon!', actions: mockQuickActions }
        }
        const makes = [...new Set(vehicles.filter(v => v.status === 'available').map(v => v.make))].join(', ')
        const bodyTypes = [...new Set(vehicles.filter(v => v.status === 'available').map(v => v.bodyType))].join(', ')
        const priceRange = vehicles.filter(v => v.status === 'available')
        const minP = Math.min(...priceRange.map(v => v.price))
        const maxP = Math.max(...priceRange.map(v => v.price))
        const lines = available.map(formatVehicleSummary)
        return {
          text: `We have ${priceRange.length} vehicles available! Here are some highlights:\n\n${lines.join('\n')}\n\nMakes: ${makes}\nBody types: ${bodyTypes}\nPrice range: ${formatCurrency(minP)} – ${formatCurrency(maxP)}\n\nNeed help narrowing it down?`,
          actions: mockQuickActions.filter(a => a.action === 'show_vehicles')
        }
      } catch {
        return { text: this.getRandomResponse('vehicle_inquiry')[0], actions: mockQuickActions }
      }
    }

    const makes = ['toyota', 'honda', 'ford', 'chevrolet', 'nissan', 'mercedes', 'hyundai', 'kia', 'ram', 'volkswagen', 'bmw', 'audi', 'mazda', 'subaru', 'lexus']
    const matchedMake = makes.find(m => lower.includes(m))
    if (matchedMake) {
      try {
        const vehicles = await inventoryService.getVehicles()
        const filtered = vehicles.filter(v => v.make.toLowerCase() === matchedMake && v.status === 'available')
        if (filtered.length === 0) {
          return { text: `We don't have any ${matchedMake.charAt(0).toUpperCase() + matchedMake.slice(1)} vehicles in stock right now. Would you like to see what other makes we carry?`, actions: mockQuickActions }
        }
        const lines = filtered.map(formatVehicleSummary)
        const priceRange = filtered.map(v => v.price)
        const minP = Math.min(...priceRange)
        const maxP = Math.max(...priceRange)
        return {
          text: `We have ${filtered.length} ${matchedMake.charAt(0).toUpperCase() + matchedMake.slice(1)} vehicle${filtered.length > 1 ? 's' : ''} available:\n\n${lines.join('\n')}\n\nPrice range: ${formatCurrency(minP)} – ${formatCurrency(maxP)}\n\nInterested in any of these?`,
          actions: mockQuickActions.filter(a => a.action === 'show_vehicles')
        }
      } catch {
        return { text: this.getRandomResponse('vehicle_inquiry')[0], actions: mockQuickActions }
      }
    }

    if (lower.includes('budget') || lower.includes('under') || lower.includes('afford') || (lower.includes('$') && lower.match(/\$\d/))) {
      const match = lower.match(/\$\d[\d,]*/)
      if (match) {
        const budget = parseInt(match[0].replace(/[$,]/g, ''))
        try {
          const vehicles = await inventoryService.getVehicles()
          const filtered = vehicles.filter(v => v.status === 'available' && v.price <= budget)
          if (filtered.length === 0) {
            return { text: `We don't have any available vehicles under ${formatCurrency(budget)}. Our cheapest vehicle is ${formatCurrency(Math.min(...vehicles.filter(v => v.status === 'available').map(v => v.price)))}.`, actions: mockQuickActions }
          }
          const lines = filtered.slice(0, 5).map(formatVehicleSummary)
          return {
            text: `We have ${filtered.length} vehicle${filtered.length > 1 ? 's' : ''} under ${formatCurrency(budget)}:\n\n${lines.join('\n')}${filtered.length > 5 ? `\n\n...and ${filtered.length - 5} more.` : ''}\n\nWant to see them in detail?`,
            actions: mockQuickActions.filter(a => a.action === 'show_vehicles')
          }
        } catch {
          return { text: 'Let me check what we have in your budget range...', actions: mockQuickActions }
        }
      }
      return { text: 'What budget range are you looking at? I can show you vehicles that fit your price point.', actions: mockQuickActions }
    }

    if (lower.includes('location') || lower.includes('address') || lower.includes('where')) {
      return {
        text: `📍 You can find us at:\n${DEALERSHIP_INFO.location}\n\n🕐 Hours: ${DEALERSHIP_INFO.hours}\n📞 Phone: ${DEALERSHIP_INFO.phone}\n📧 Email: ${DEALERSHIP_INFO.email}\n\nWe'd love to see you!`,
        actions: mockQuickActions.filter(a => a.action === 'schedule_appointment')
      }
    }

    if (lower.includes('hour') || lower.includes('open') || lower.includes('close')) {
      return {
        text: `🕐 Our hours are:\n${DEALERSHIP_INFO.hours}\n\nWe're ready to help!`,
        actions: mockQuickActions
      }
    }

    if (lower.includes('phone') || lower.includes('call') || lower.includes('contact')) {
      return {
        text: `📞 You can reach us at ${DEALERSHIP_INFO.phone} or email ${DEALERSHIP_INFO.email}. Or schedule a visit!`,
        actions: mockQuickActions.filter(a => a.action === 'schedule_appointment')
      }
    }

    if (lower.includes('financ') || lower.includes('loan') || lower.includes('apr') || lower.includes('interest') || lower.includes('credit')) {
      if (lower.includes('bad') || lower.includes('poor') || lower.includes('low') || lower.includes('challenge') || lower.includes('fair')) {
        return {
          text: 'No worries — we work with all credit levels! Our Fair Credit Program offers rates starting at 7.9% APR with flexible terms (up to 72 months). We\'ll find a solution that works for your budget.\n\nWant to get pre-approved?',
          actions: mockQuickActions.filter(a => a.action === 'financing_options' || a.action === 'apply_financing')
        }
      }
      if (lower.includes('good') || lower.includes('excellent') || lower.includes('great')) {
        return {
          text: 'Great news! With good to excellent credit, we offer rates as low as 3.9% APR for up to 60 months. That could mean payments as low as $19 per month per $1,000 financed.\n\nWant to check your payment estimate?',
          actions: mockQuickActions.filter(a => a.action === 'financing_options' || a.action === 'apply_financing')
        }
      }
      return {
        text: `We offer flexible financing for all credit situations:\n\n• Prime (Excellent Credit): From 3.9% APR\n• Standard (Good Credit): From 5.9% APR\n• Fair Credit Program: From 7.9% APR\n\nWe work with multiple lenders to get you the best rate. What's your credit situation?`,
        actions: mockQuickActions.filter(a => a.action === 'financing_options' || a.action === 'apply_financing')
      }
    }

    if (lower.includes('rent') || lower.includes('rental')) {
      try {
        const rentals = await rentalsService.getRentals()
        const upcoming = rentals.filter(r => r.status === 'pending' || r.status === 'active')
        const hasRentals = rentals.length > 0
        if (!hasRentals) {
          return { text: 'We offer vehicle rentals! Give us a call at (555) 123-4567 for current availability and rates.', actions: mockQuickActions.filter(a => a.action === 'rental_info') }
        }
        const activeCount = upcoming.length
        return {
          text: `We have ${rentals.length} rental vehicle${rentals.length > 1 ? 's' : ''} in our system (${activeCount} currently active).\n\nFor rental inquiries, call us at (555) 123-4567 or visit our showroom!\n\nTypes available: Daily, Weekly, and Monthly rentals.`,
          actions: mockQuickActions.filter(a => a.action === 'rental_info')
        }
      } catch {
        return { text: 'We offer vehicle rentals! Call (555) 123-4567 for rates and availability.', actions: mockQuickActions }
      }
    }

    if (lower.includes('appointment') || lower.includes('schedule') || lower.includes('demo') || lower.includes('test drive')) {
      return {
        text: `I'd love to schedule you for a visit! We're open ${DEALERSHIP_INFO.hours}. You can:\n\n1. Book a test drive\n2. Schedule a financing consultation\n3. Tour our showroom\n\nWhat works best for you? Or call us at ${DEALERSHIP_INFO.phone} to book directly.`,
        actions: mockQuickActions.filter(a => a.action === 'schedule_appointment')
      }
    }

    if (lower.includes('feature') || lower.includes('spec') || lower.includes('detail') || lower.includes('option')) {
      try {
        const vehicles = await inventoryService.getVehicles()
        const available = vehicles.filter(v => v.status === 'available').slice(0, 3)
        const lines = available.map(v => {
          const feats = v.features?.slice(0, 4).join(', ') || 'N/A'
          return `• ${v.year} ${v.make} ${v.model}: ${feats}`
        })
        return {
          text: `Here are some featured vehicles and their key specs:\n\n${lines.join('\n')}\n\nWant me to show you all available vehicles?`,
          actions: mockQuickActions.filter(a => a.action === 'show_vehicles')
        }
      } catch {
        return { text: 'Let me pull up the details on our vehicles...', actions: mockQuickActions }
      }
    }

    if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
      try {
        const vehicles = await inventoryService.getVehicles()
        const available = vehicles.filter(v => v.status === 'available')
        const prices = available.map(v => v.price)
        const minP = Math.min(...prices)
        const maxP = Math.max(...prices)
        return {
          text: `Our available vehicles range from ${formatCurrency(minP)} to ${formatCurrency(maxP)}.\n\nHere are a few examples:\n${available.slice(0, 3).map(formatVehicleSummary).join('\n')}\n\nWant to see everything we have?`,
          actions: mockQuickActions.filter(a => a.action === 'show_vehicles')
        }
      } catch {
        return { text: 'Let me check our pricing...', actions: mockQuickActions }
      }
    }

    if (lower.includes('thank')) {
      return {
        text: "You're welcome! Is there anything else I can help you with? Feel free to call us anytime at (555) 123-4567.",
        actions: mockQuickActions.slice(0, 3)
      }
    }

    if (lower.includes('bye') || lower.includes('goodbye') || lower.includes('see you')) {
      return {
        text: 'Thanks for chatting with Eagle Vision Edge! Have a great day, and we hope to see you soon! 🚗',
        actions: mockQuickActions.slice(0, 2)
      }
    }

    return {
      text: "I'd be happy to help! Are you looking for a vehicle, financing information, or rental options? You can also ask about our location, hours, or inventory.",
      actions: mockQuickActions
    }
  },

  getRandomResponse(key: string): string[] {
    return mockAIResponses[key] || ['How can I help you today?']
  }
}

