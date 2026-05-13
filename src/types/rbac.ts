// Role-Based Access Control (RBAC) Type Definitions
// Enterprise Dealership Operations Platform

export type UserRole = 
  | 'super_admin'      // Dealership Owner
  | 'administrator'    // System Administrator
  | 'salesperson'      // Sales Representative
  | 'financing_staff' // Financing Staff
  | 'rental_manager'  // Rental Manager
  | 'employee'         // Dealership Employee

export type Permission = 
  | 'read'           // Read access
  | 'write'          // Write access
  | 'update'         // Update access
  | 'delete'         // Delete access
  | 'view_only'      // View only access
  | 'full_access'    // Full access

export type Module = 
  | 'dashboard'       // Main dashboard
  | 'inventory'       // Vehicle inventory management
  | 'crm'            // Customer relationship management
  | 'leads'          // Lead management
  | 'financing'      // Financing operations
  | 'rentals'        // Rental operations
  | 'analytics'       // Analytics and reports
  | 'ai_assistant'   // AI assistant features
  | 'notifications'   // Notification system
  | 'reports'         // Report generation
  | 'settings'        // System settings
  | 'user_management' // User management
  | 'permissions'     // Permission management

export type User = {
  id: string
  email: string
  name: string
  role: UserRole
  permissions: UserPermissions
  dealership: {
    id: string
    name: string
  }
  department?: string
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

export type UserPermissions = {
  [key in Module]: Permission
}

export type RolePermissions = {
  role: UserRole
  permissions: UserPermissions
  description: string
  responsibilities: string[]
}

export type ModuleAccess = {
  module: Module
  hasAccess: boolean
  permissions: Permission[]
}

export type UserSession = {
  user: User
  token: string
  isAuthenticated: boolean
  permissions: UserPermissions
  roleHierarchy: UserRole[]
}

export type PermissionMatrix = {
  [K in UserRole]: {
    [M in Module]: Permission
  }
}

export type CreateUserData = {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  department?: string
  permissions?: Partial<UserPermissions>
}

export type UpdateUserData = {
  id: string
  email?: string
  name?: string
  role?: UserRole
  department?: string
  permissions?: Partial<UserPermissions>
  isActive?: boolean
}

export type AuthResponse = {
  user: User
  token: string
  permissions: UserPermissions
}

export type LoginCredentials = {
  email: string
  password: string
}

// Role hierarchy for permission inheritance
export const ROLE_HIERARCHY: UserRole[] = [
  'employee',
  'rental_manager',
  'financing_staff',
  'salesperson',
  'administrator',
  'super_admin'
]

// Check if one role has higher or equal permissions than another
export const hasHigherOrEqualRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const userIndex = ROLE_HIERARCHY.indexOf(userRole)
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole)
  return userIndex >= requiredIndex
}

// Role display configuration
export const ROLE_DISPLAY = {
  super_admin: {
    label: 'Super Admin',
    description: 'Dealership Owner',
    color: 'purple',
    icon: 'crown'
  },
  administrator: {
    label: 'Administrator',
    description: 'System Administrator',
    color: 'blue',
    icon: 'shield'
  },
  salesperson: {
    label: 'Salesperson',
    description: 'Sales Representative',
    color: 'green',
    icon: 'user'
  },
  financing_staff: {
    label: 'Financing Staff',
    description: 'Financing Team',
    color: 'orange',
    icon: 'credit-card'
  },
  rental_manager: {
    label: 'Rental Manager',
    description: 'Rental Operations',
    color: 'red',
    icon: 'car'
  },
  employee: {
    label: 'Employee',
    description: 'Dealership Employee',
    color: 'gray',
    icon: 'users'
  }
} as const

// Module configuration for UI
export const MODULE_CONFIG = {
  dashboard: {
    name: 'Dashboard',
    description: 'Main dashboard overview',
    icon: 'layout',
    requiredRole: 'employee' as UserRole
  },
  inventory: {
    name: 'Inventory',
    description: 'Vehicle inventory management',
    icon: 'car',
    requiredRole: 'employee' as UserRole
  },
  crm: {
    name: 'CRM',
    description: 'Customer relationship management',
    icon: 'users',
    requiredRole: 'salesperson' as UserRole
  },
  leads: {
    name: 'Leads',
    description: 'Lead management',
    icon: 'target',
    requiredRole: 'salesperson' as UserRole
  },
  financing: {
    name: 'Financing',
    description: 'Financing operations',
    icon: 'credit-card',
    requiredRole: 'financing_staff' as UserRole
  },
  rentals: {
    name: 'Rentals',
    description: 'Rental operations',
    icon: 'car',
    requiredRole: 'rental_manager' as UserRole
  },
  analytics: {
    name: 'Analytics',
    description: 'Analytics and reports',
    icon: 'bar-chart',
    requiredRole: 'administrator' as UserRole
  },
  ai_assistant: {
    name: 'AI Assistant',
    description: 'AI assistant features',
    icon: 'settings',
    requiredRole: 'employee' as UserRole
  },
  notifications: {
    name: 'Notifications',
    description: 'Notification system',
    icon: 'bell',
    requiredRole: 'employee' as UserRole
  },
  reports: {
    name: 'Reports',
    description: 'Report generation',
    icon: 'file-text',
    requiredRole: 'administrator' as UserRole
  },
  settings: {
    name: 'Settings',
    description: 'System settings',
    icon: 'settings',
    requiredRole: 'administrator' as UserRole
  },
  user_management: {
    name: 'User Management',
    description: 'User management',
    icon: 'users-cog',
    requiredRole: 'administrator' as UserRole
  },
  permissions: {
    name: 'Permissions',
    description: 'Permission management',
    icon: 'shield',
    requiredRole: 'super_admin' as UserRole
  }
} as const
