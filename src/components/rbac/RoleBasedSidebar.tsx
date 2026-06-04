import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { 
  Module, 
  UserSession, 
  ROLE_DISPLAY 
} from '@/types/rbac';
import { userService } from '@/services/userService';
import { permissionService } from '@/services/permissionService';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Car, 
  Target, 
  BarChart3, 
  Settings, 
  Bell, 
  FileText, 
  Bot, 
  Shield, 
  LogOut 
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  module?: Module;
  requiredPermission?: string;
  badge?: string;
}

export default function RoleBasedSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<UserSession | null>(null);

  React.useEffect(() => {
    // Initialize session from storage
    console.log('=== DEBUG Session Initialization ===');
    userService.initializeSession();
    
    // Get current user session
    userService.getCurrentUser().then(session => {
      console.log('Session retrieved:', session);
      console.log('Session user role:', session?.user?.role);
      console.log('Session is authenticated:', session?.isAuthenticated);
      setSessionInfo(session);
      
      // Additional debugging - check localStorage directly
      const userFromStorage = localStorage.getItem('current_user');
      const tokenFromStorage = localStorage.getItem('auth_token');
      console.log('Direct localStorage check - user:', userFromStorage);
      console.log('Direct localStorage check - token:', tokenFromStorage);
    });
  }, []);

  // Add a second effect to monitor session changes
  React.useEffect(() => {
    console.log('=== DEBUG Session Update - SessionInfo changed ===');
    console.log('New sessionInfo:', sessionInfo);
  }, [sessionInfo]);

  const menuItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/dashboard',
      module: 'dashboard'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Package className="w-5 h-5" />,
      path: '/dashboard/inventory',
      module: 'inventory'
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: <Target className="w-5 h-5" />,
      path: '/dashboard/leads',
      module: 'leads'
    },
    {
      id: 'crm',
      label: 'CRM',
      icon: <Users className="w-5 h-5" />,
      path: '/dashboard/crm',
      module: 'crm'
    },
    {
      id: 'financing',
      label: 'Financing',
      icon: <FileText className="w-5 h-5" />,
      path: '/dashboard/financing',
      module: 'financing'
    },
    {
      id: 'rentals',
      label: 'Rentals',
      icon: <Car className="w-5 h-5" />,
      path: '/dashboard/rentals',
      module: 'rentals'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/dashboard/analytics',
      module: 'analytics'
    },
    {
      id: 'ai-assistant',
      label: 'AI Assistant',
      icon: <Bot className="w-5 h-5" />,
      path: '/dashboard/ai',
      module: 'ai_assistant'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      path: '/dashboard/notifications',
      module: 'notifications'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText className="w-5 h-5" />,
      path: '/dashboard/reports',
      module: 'reports'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/dashboard/settings',
      module: 'settings'
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: <Users className="w-5 h-5" />,
      path: '/dashboard/users',
      module: 'user_management'
    },
    {
      id: 'permissions',
      label: 'Permissions',
      icon: <Shield className="w-5 h-5" />,
      path: '/dashboard/permissions',
      module: 'permissions'
    }
  ];

  const canAccessItem = (item: SidebarItem): boolean => {
    console.log('=== DEBUG canAccessItem - Item:', item.id);
    console.log('Session info:', sessionInfo);
    console.log('Is authenticated:', sessionInfo?.isAuthenticated);
    console.log('User role:', sessionInfo?.user?.role);
    
    if (!sessionInfo?.isAuthenticated) {
      console.log('❌ Not authenticated');
      return false;
    }
    if (!sessionInfo?.user) {
      console.log('❌ No user in session');
      return false;
    }

    // Super Admin can access everything
    if (sessionInfo.user.role === 'super_admin') {
      console.log('✅ Super admin access granted for:', item.id);
      return true;
    }

    if (item.module) {
      const canAccess = permissionService.canAccessModule(sessionInfo.user.role, item.module);
      console.log('Module access check for', item.module, ':', canAccess);
      return canAccess;
    }
    console.log('✅ Default access granted');
    return true;
  };

  const getItemPermission = (item: SidebarItem): string => {
    if (!sessionInfo?.isAuthenticated || !sessionInfo?.user) return 'view_only';
    
    if (item.module) {
      const permissions = permissionService.getUserPermissions(sessionInfo.user.role);
      return permissions[item.module] || 'view_only';
    }
    
    return 'full_access';
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const userRole = sessionInfo?.user?.role;
  const roleDisplay = userRole ? ROLE_DISPLAY[userRole] : null;

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} min-h-screen`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {roleDisplay && (
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${roleDisplay.color}-100`}>
                  <div className={`text-${roleDisplay.color}-600`}>
                    {/* Role Icon */}
                    {roleDisplay.icon === 'crown' && <Shield className="w-4 h-4" />}
                    {roleDisplay.icon === 'shield' && <Shield className="w-4 h-4" />}
                    {roleDisplay.icon === 'user' && <Users className="w-4 h-4" />}
                    {roleDisplay.icon === 'credit-card' && <FileText className="w-4 h-4" />}
                    {roleDisplay.icon === 'car' && <Car className="w-4 h-4" />}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-white">{roleDisplay.label}</p>
                  <p className="text-xs text-gray-400">{sessionInfo?.user?.name || 'Unknown User'}</p>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7a2 2 0 01-2-2v2a2 2 0 012 2v2a2 2 0 002-2h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {menuItems.map((item) => {
            const hasAccess = canAccessItem(item);
            const permission = getItemPermission(item);
            const isActive = location.pathname === item.path;

            if (!hasAccess) return null;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                  ${permission === 'view_only' ? 'opacity-60' : ''}
                `}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                
                {!isCollapsed && (
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.label}</span>
                      
                      {/* Permission Badge */}
                      {permission === 'view_only' && (
                        <span className="ml-auto px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
                          View Only
                        </span>
                      )}
                      
                      {item.badge && (
                        <span className="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Collapsed State - Show only icons */}
                {isCollapsed && (
                  <div 
                    className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center"
                    title={item.label}
                  >
                    {item.icon}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
}
