import { useState } from 'react'
import { Bot, MessageCircle, TrendingUp, Car, DollarSign, Calendar, Users, Settings, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AIChatWidget from '@/components/ai/AIChatWidget'
import AILeadQualification from '@/components/ai/AILeadQualification'
import AIFinancingAssistant from '@/components/ai/AIFinancingAssistant'
import AIRentalAssistant from '@/components/ai/AIRentalAssistant'
import AIRecommendationEngine from '@/components/ai/AIRecommendationEngine'
import AIAutomationDashboard from '@/components/ai/AIAutomationDashboard'
import AIConversationHistory from '@/components/ai/AIConversationHistory'
import { clsx } from 'clsx'

export default function AIDashboard() {
  const [activeSection, setActiveSection] = useState('overview')

  const aiSections = [
    {
      id: 'overview',
      title: 'AI Overview',
      icon: Bot,
      description: 'AI system status and performance metrics',
      component: <AIAutomationDashboard />
    },
    {
      id: 'chat',
      title: 'AI Chat Assistant',
      icon: MessageCircle,
      description: 'Interactive AI chatbot for customer support',
      component: <div className="text-center py-8"><p className="text-gray-600">AI Chat Widget is available in the bottom-right corner</p></div>
    },
    {
      id: 'qualification',
      title: 'Lead Qualification',
      icon: Users,
      description: 'AI-powered lead qualification system',
      component: <AILeadQualification />
    },
    {
      id: 'financing',
      title: 'Financing Assistant',
      icon: DollarSign,
      description: 'Smart financing recommendations',
      component: <AIFinancingAssistant />
    },
    {
      id: 'rental',
      title: 'Rental Assistant',
      icon: Car,
      description: 'AI rental recommendations and booking',
      component: <AIRentalAssistant />
    },
    {
      id: 'recommendations',
      title: 'Recommendation Engine',
      icon: TrendingUp,
      description: 'Personalized vehicle and service recommendations',
      component: <AIRecommendationEngine />
    },
    {
      id: 'history',
      title: 'Conversation History',
      icon: Calendar,
      description: 'View and analyze AI conversation history',
      component: <AIConversationHistory />
    },
    {
      id: 'automation',
      title: 'Automation Workflows',
      icon: Settings,
      description: 'Configure and monitor AI automation workflows',
      component: <AIAutomationDashboard />
    }
  ]

  const currentSection = aiSections.find(section => section.id === activeSection)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant & Automation</h1>
        <p className="text-gray-600">
          Manage AI-powered dealership operations and customer interactions
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Conversations</p>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>
            <MessageCircle className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Leads Qualified</p>
              <p className="text-2xl font-bold text-green-600">156</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Automation Success</p>
              <p className="text-2xl font-bold text-purple-600">94%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-orange-600">2.1s</p>
            </div>
            <Bot className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">AI Features</h3>
            <nav className="space-y-2">
              {aiSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                    activeSection === section.id
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <section.icon className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="font-medium">{section.title}</div>
                    <div className="text-xs opacity-75">{section.description}</div>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </nav>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4 mt-4">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Test Chat Assistant
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Start Lead Qualification
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {currentSection && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentSection.title}
                </h2>
                <p className="text-gray-600">{currentSection.description}</p>
              </div>
              {currentSection.component}
            </div>
          )}
        </div>
      </div>

      {/* AI Chat Widget - Always Visible */}
      <AIChatWidget />
    </div>
  )
}
