import React from 'react';
import { UserRole, UserSession } from '@/types/rbac';
import { userService } from '@/services/userService';
import { 
  Bot, 
  Brain, 
  TrendingUp, 
  Users, 
  Target, 
  Car, 
  CreditCard, 
  FileText,
  BarChart3 
} from 'lucide-react';

interface AIAssistantProps {
  className?: string;
}

export default function AIRoleAwareness({ className = '' }: AIAssistantProps) {
  const [session, setSession] = React.useState<UserSession | null>(null);

  React.useEffect(() => {
    userService.getCurrentUser().then(userSession => {
      setSession(userSession);
    });
  }, []);

  const getRoleBasedResponse = (userInput: string): string => {
    if (!session?.user) return "I'm sorry, I don't have access to that information. Please contact your administrator.";
    
    const role = session.user.role;
    
    switch (role) {
      case 'super_admin':
        return `As the dealership owner, I have comprehensive access to all dealership operations including inventory, CRM, financing, rentals, analytics, and user management. I can provide strategic insights for dealership growth and help you optimize business operations across all departments.`;
      
      case 'administrator':
        return `As a system administrator, I can help manage dealership operations, user accounts, and system settings. I have access to inventory, CRM, leads, financing, rentals, and analytics dashboards. I can assist with operational workflows and system configuration.`;
      
      case 'salesperson':
        return `As your AI sales assistant, I specialize in lead generation, customer relationship management, and sales pipeline optimization. I can help you capture more leads, track customer interactions, and improve conversion rates. I have access to CRM and lead management tools.`;
      
      case 'financing_staff':
        return `As your financing AI assistant, I focus on credit applications, loan processing, and financing workflow automation. I can help evaluate credit applications, suggest financing options, and streamline the approval process. I have access to financing dashboards and customer credit information.`;
      
      case 'rental_manager':
        return `As your rental operations AI assistant, I specialize in fleet management, rental reservations, and vehicle availability optimization. I can help you manage rental inventory, track fleet utilization, and optimize rental revenue. I have access to rental dashboards and fleet analytics.`;
      
      case 'employee':
        return `As your dealership AI assistant, I can provide basic operational support and information access. I can help with general dealership operations, customer inquiries, and basic task management within my assigned permissions.`;
      
      default:
        return "I'm here to help with dealership operations. Please contact your administrator for specific assistance.";
    }
  };

  const getRoleBasedCapabilities = (): string[] => {
    if (!session?.user) return [];
    
    const role = session.user.role;
    
    switch (role) {
      case 'super_admin':
        return [
          'Complete dealership oversight and analytics',
          'User and role management',
          'System configuration and permissions',
          'Strategic business insights and growth planning',
          'Cross-departmental workflow optimization'
        ];
      
      case 'administrator':
        return [
          'System administration and user support',
          'Inventory and CRM management',
          'Financing and rental operations oversight',
          'Analytics and reporting',
          'Workflow automation and process optimization'
        ];
      
      case 'salesperson':
        return [
          'Lead generation and qualification',
          'Customer relationship management',
          'Sales pipeline tracking',
          'Appointment scheduling and follow-up',
          'Product recommendations and pricing assistance'
        ];
      
      case 'financing_staff':
        return [
          'Credit application processing',
          'Loan approval workflows',
          'Financing option recommendations',
          'Customer credit evaluation',
          'Compliance and documentation management'
        ];
      
      case 'rental_manager':
        return [
          'Fleet management and optimization',
          'Rental reservation handling',
          'Vehicle availability tracking',
          'Revenue and utilization analytics',
          'Maintenance scheduling and coordination'
        ];
      
      case 'employee':
        return [
          'Basic operational support',
          'Customer information lookup',
          'Task management within permissions',
          'General dealership assistance'
        ];
      
      default:
        return [];
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-lg ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI Assistant</h3>
            {session?.user && (
              <p className="text-sm text-gray-600">
                Role: <span className="font-semibold text-primary">{session.user.role.replace('_', ' ').toUpperCase()}</span>
              </p>
            )}
          </div>
        </div>

        {/* Capabilities */}
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">My Capabilities</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getRoleBasedCapabilities().map((capability, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{capability}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Generate Sales Report</span>
              </button>
              
              <button className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Find High-Value Leads</span>
              </button>
              
              <button className="flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Optimize Pricing</span>
              </button>
              
              <button className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Analyze Trends</span>
              </button>
            </div>
          </div>

          {/* Role-Specific Features */}
          {session?.user?.role === 'super_admin' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Super Admin Features</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Business Intelligence</p>
                    <p className="text-xs text-purple-700">Comprehensive analytics and strategic insights</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Users className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">User Management</p>
                    <p className="text-xs text-purple-700">Create and manage user accounts</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {session?.user?.role === 'salesperson' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Sales Assistant Features</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Target className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Lead Scoring</p>
                    <p className="text-xs text-green-700">AI-powered lead qualification</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Car className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Vehicle Matching</p>
                    <p className="text-xs text-green-700">Match customers to perfect inventory</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {session?.user?.role === 'financing_staff' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Financing Assistant Features</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <CreditCard className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-900">Credit Analysis</p>
                    <p className="text-xs text-orange-700">Instant credit evaluation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <FileText className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-900">Document Generation</p>
                    <p className="text-xs text-orange-700">Auto-generate financing paperwork</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {session?.user?.role === 'rental_manager' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Rental Assistant Features</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <Car className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Fleet Optimization</p>
                    <p className="text-xs text-red-700">Maximize rental revenue</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Demand Forecasting</p>
                    <p className="text-xs text-red-700">Predict rental demand</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Interface Preview */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">AI Chat Interface</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Interactive Chat</p>
                <p className="text-xs text-gray-700">Type your questions below</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p className="text-sm text-gray-600">Try asking: "What are my top performing vehicles this month?"</p>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600">AI Response: "Based on current data, your top performers are: 2021 Honda Accord (3 sales), 2022 Toyota Camry (2 sales), 2023 Ford F-150 (4 sales)"</p>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Try asking: "Show me leads that need follow-up today"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
