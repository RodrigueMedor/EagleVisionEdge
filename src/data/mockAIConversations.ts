// Mock AI Conversation Scenarios and Data
import { AIMessage, AIConversation, AIRecommendation, AIQuickAction } from '@/types/ai'

// Mock Quick Actions
export const mockQuickActions: AIQuickAction[] = [
  {
    id: 'action-1',
    label: 'Show Available Vehicles',
    action: 'show_vehicles',
    icon: 'car'
  },
  {
    id: 'action-2',
    label: 'Financing Options',
    action: 'financing_options',
    icon: 'dollar-sign'
  },
  {
    id: 'action-3',
    label: 'Rental Information',
    action: 'rental_info',
    icon: 'calendar'
  },
  {
    id: 'action-4',
    label: 'Schedule Demo',
    action: 'schedule_appointment',
    icon: 'clock'
  },
  {
    id: 'action-5',
    label: 'Apply For Financing',
    action: 'apply_financing',
    icon: 'file-text'
  },
  {
    id: 'action-6',
    label: 'Talk To Sales',
    action: 'talk_to_sales',
    icon: 'users'
  }
]

// Mock AI Conversation Responses
export const mockAIResponses: Record<string, string[]> = {
  greeting: [
    "👋 Hello! I'm Eagle Vision Edge's AI Assistant. I'm here to help you find the perfect vehicle, explore financing options, or learn about our rental services. What brings you in today?",
    "Welcome to Eagle Vision Edge! I'm your AI assistant, ready to help with vehicle inquiries, financing questions, or rental needs. How can I assist you?"
  ],
  vehicle_inquiry: [
    "Great question! We have a wide selection of vehicles available. What type of vehicle are you interested in? (e.g., SUV, sedan, truck, cargo van)",
    "I'd be happy to help you find a vehicle. Are you interested in a specific make or model? Or would you like recommendations based on your needs?"
  ],
  financing_inquiry: [
    "Yes, we offer flexible financing options for various credit situations. We work with multiple lenders to find the best rates for you. What's your credit situation like?",
    "We can definitely help with financing! We have programs for excellent credit, good credit, fair credit, and even challenging credit situations. What's your budget range?"
  ],
  rental_inquiry: [
    "Absolutely! We offer both cargo van rentals and short-term vehicle rental options. How long are you looking to rent for, and what type of vehicle do you need?",
    "We have rental options available! Are you looking for a cargo van, a passenger vehicle, or something specific? When do you need it?"
  ],
  bad_credit: [
    "No worries! We specialize in financing for all credit levels. We have lenders who work specifically with customers with lower credit scores. Let's find a solution for you!",
    "Many of our customers have had similar concerns. We have several financing programs designed specifically for fair and challenged credit situations."
  ],
  appointment_request: [
    "I'd love to help you schedule an appointment! What day and time work best for you? We're typically open Monday-Saturday.",
    "Let me get you scheduled. When would you like to visit Eagle Vision Edge? I can check our availability for you."
  ],
  lead_qualification_start: [
    "To help you better, I'd like to ask a few quick questions about your needs. Ready?",
    "Let me gather some information so I can give you the best recommendations. This will just take a minute."
  ],
  recommendation_vehicles: [
    "Based on your preferences, here are my top recommendations for you:",
    "I think these vehicles would be perfect for your needs:"
  ],
  follow_up: [
    "Thanks for chatting with me! A sales specialist will follow up with you shortly with more details.",
    "We appreciate your interest! Our team will reach out within 24 hours to help you move forward."
  ]
}

// Mock Vehicle Recommendations
export const mockVehicleRecommendations: AIRecommendation[] = [
  {
    id: 'rec-1',
    type: 'vehicle',
    title: '2024 Honda CR-V EX',
    description: 'Perfect family SUV with excellent fuel efficiency and reliability',
    score: 9.5,
    confidence: 0.95,
    metadata: {
      price: 32500,
      trim: 'EX',
      year: 2024,
      mileage: 5000,
      color: 'Pearl White',
      features: ['All-Wheel Drive', 'Apple CarPlay', 'Honda Sensing Suite']
    },
    createdAt: new Date()
  },
  {
    id: 'rec-2',
    type: 'vehicle',
    title: '2024 Toyota Camry LE',
    description: 'Reliable sedan with excellent resale value',
    score: 9.2,
    confidence: 0.92,
    metadata: {
      price: 28900,
      trim: 'LE',
      year: 2024,
      mileage: 2000,
      color: 'Silver Metallic',
      features: ['Hybrid Option', 'Toyota Safety Sense', 'Adaptive Cruise Control']
    },
    createdAt: new Date()
  },
  {
    id: 'rec-3',
    type: 'vehicle',
    title: '2023 Ford F-150 XLT',
    description: 'Powerful truck for work or weekend adventures',
    score: 8.8,
    confidence: 0.88,
    metadata: {
      price: 45900,
      trim: 'XLT',
      year: 2023,
      mileage: 15000,
      color: 'Lightning Blue',
      features: ['Towing Package', 'Crew Cab', 'Sync 4 Infotainment']
    },
    createdAt: new Date()
  }
]

// Mock Financing Recommendations
export const mockFinancingRecommendations: AIRecommendation[] = [
  {
    id: 'fin-rec-1',
    type: 'financing',
    title: 'Prime Auto Loan',
    description: '3.9% APR for qualified buyers with excellent credit',
    score: 9.8,
    confidence: 0.98,
    metadata: {
      apr: 3.9,
      termMonths: 60,
      monthlyPayment: 595,
      downPayment: 5000,
      creditReq: 'excellent'
    },
    createdAt: new Date()
  },
  {
    id: 'fin-rec-2',
    type: 'financing',
    title: 'Good Credit Program',
    description: '5.9% APR for customers with good credit',
    score: 8.5,
    confidence: 0.85,
    metadata: {
      apr: 5.9,
      termMonths: 60,
      monthlyPayment: 632,
      downPayment: 3000,
      creditReq: 'good'
    },
    createdAt: new Date()
  },
  {
    id: 'fin-rec-3',
    type: 'financing',
    title: 'Fair Credit Solution',
    description: '7.9% APR - we work with you!',
    score: 7.2,
    confidence: 0.72,
    metadata: {
      apr: 7.9,
      termMonths: 72,
      monthlyPayment: 568,
      downPayment: 2000,
      creditReq: 'fair'
    },
    createdAt: new Date()
  }
]

// Sample Conversation History
export const mockConversationHistory: AIConversation[] = [
  {
    id: 'conv-1',
    type: 'general',
    title: 'Vehicle Inquiry - Today',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Hi! I\'m looking for an SUV under $35,000',
        timestamp: new Date(Date.now() - 3600000),
        conversationId: 'conv-1'
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Great! I have several excellent SUVs in that price range. Are you interested in new or used vehicles? Any specific features you\'re looking for?',
        timestamp: new Date(Date.now() - 3570000),
        conversationId: 'conv-1'
      },
      {
        id: 'msg-3',
        role: 'user',
        content: 'New vehicle, preferably with good fuel economy',
        timestamp: new Date(Date.now() - 3540000),
        conversationId: 'conv-1'
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: 'Perfect! The 2024 Honda CR-V EX and 2024 Mazda CX-5 are excellent choices. Would you like financing information or would you prefer to see these in person?',
        timestamp: new Date(Date.now() - 3510000),
        conversationId: 'conv-1'
      }
    ],
    startedAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3510000),
    status: 'active'
  },
  {
    id: 'conv-2',
    type: 'financing',
    title: 'Financing Discussion - Yesterday',
    messages: [
      {
        id: 'msg-5',
        role: 'user',
        content: 'What financing options do you have for someone with fair credit?',
        timestamp: new Date(Date.now() - 86400000),
        conversationId: 'conv-2'
      },
      {
        id: 'msg-6',
        role: 'assistant',
        content: 'We have several programs for fair credit! We can offer rates starting at 7.9% APR with flexible terms. Would you like to know about specific options?',
        timestamp: new Date(Date.now() - 86370000),
        conversationId: 'conv-2'
      }
    ],
    startedAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86370000),
    status: 'closed'
  }
]

// Mock Quick Replies for Common Questions
export const mockQuickReplies: Record<string, string> = {
  'what are your hours': 'We\'re open Monday-Saturday 9 AM - 7 PM, and Sunday 10 AM - 6 PM.',
  'do you have financing': 'Yes! We work with multiple lenders and offer programs for all credit levels.',
  'do you have rentals': 'Absolutely! We offer both cargo van and vehicle rentals. Check our availability!',
  'what about bad credit': 'No problem! We specialize in financing for all credit situations.',
  'how much down payment': 'Down payments vary by loan and credit, but we typically require $0-$5,000.',
  'warranty options': 'We offer manufacturer warranties and extended warranty plans for your peace of mind.',
  'trade-in value': 'I can help estimate your trade-in value. Tell me about your current vehicle!',
  'schedule appointment': 'I\'d be happy to schedule you! What day and time work best?'
}

