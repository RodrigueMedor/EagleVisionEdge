import { UserRole, UserPermissions, Module, Permission, PermissionMatrix, ModuleAccess, ROLE_HIERARCHY } from '@/types/rbac'

// Permission Matrix - Defines what each role can do in each module
export const PERMISSION_MATRIX: PermissionMatrix = {
  // Super Admin - Dealership Owner (Full Access)
  super_admin: {
    dashboard: 'full_access',
    inventory: 'full_access',
    crm: 'full_access',
    leads: 'full_access',
    financing: 'full_access',
    rentals: 'full_access',
    analytics: 'full_access',
    ai_assistant: 'full_access',
    notifications: 'full_access',
    reports: 'full_access',
    settings: 'full_access',
    user_management: 'full_access',
    permissions: 'full_access'
  },

  // Administrator - System Administrator
  administrator: {
    dashboard: 'full_access',
    inventory: 'full_access',
    crm: 'full_access',
    leads: 'full_access',
    financing: 'full_access',
    rentals: 'full_access',
    analytics: 'full_access',
    ai_assistant: 'full_access',
    notifications: 'full_access',
    reports: 'full_access',
    settings: 'full_access',
    user_management: 'write', // Can manage users but not permissions
    permissions: 'view_only'   // Cannot modify core system permissions
  },

  // Salesperson - Sales Representative
  salesperson: {
    dashboard: 'full_access',
    inventory: 'read',
    crm: 'write',
    leads: 'write',
    financing: 'view_only',
    rentals: 'view_only',
    analytics: 'view_only',
    ai_assistant: 'view_only',
    notifications: 'full_access',
    reports: 'view_only',
    settings: 'view_only',
    user_management: 'view_only',
    permissions: 'view_only'
  },

  // Financing Staff
  financing_staff: {
    dashboard: 'full_access',
    inventory: 'view_only',
    crm: 'read',
    leads: 'view_only',
    financing: 'full_access',
    rentals: 'view_only',
    analytics: 'view_only',
    ai_assistant: 'view_only',
    notifications: 'full_access',
    reports: 'view_only',
    settings: 'view_only',
    user_management: 'view_only',
    permissions: 'view_only'
  },

  // Rental Manager
  rental_manager: {
    dashboard: 'full_access',
    inventory: 'view_only',
    crm: 'read',
    leads: 'view_only',
    financing: 'view_only',
    rentals: 'full_access',
    analytics: 'read',
    ai_assistant: 'view_only',
    notifications: 'full_access',
    reports: 'view_only',
    settings: 'view_only',
    user_management: 'view_only',
    permissions: 'view_only'
  },

  // Dealership Employee - Limited Access
  employee: {
    dashboard: 'full_access',
    inventory: 'view_only',
    crm: 'view_only',
    leads: 'view_only',
    financing: 'view_only',
    rentals: 'view_only',
    analytics: 'view_only',
    ai_assistant: 'view_only',
    notifications: 'full_access',
    reports: 'view_only',
    settings: 'view_only',
    user_management: 'view_only',
    permissions: 'view_only'
  }
}

// Module configuration for access control
export const MODULE_CONFIG = {
  dashboard: {
    name: 'Dashboard',
    description: 'Main dealership dashboard',
    icon: 'layout',
    requiredRole: 'employee' as UserRole
  },
  inventory: {
    name: 'Inventory',
    description: 'Vehicle inventory management',
    icon: 'package',
    requiredRole: 'salesperson' as UserRole
  },
  crm: {
    name: 'CRM',
    description: 'Customer relationship management',
    icon: 'users',
    requiredRole: 'salesperson' as UserRole
  },
  leads: {
    name: 'Leads',
    description: 'Lead management and pipeline',
    icon: 'target',
    requiredRole: 'salesperson' as UserRole
  },
  financing: {
    name: 'Financing',
    description: 'Financing operations and workflow',
    icon: 'credit-card',
    requiredRole: 'financing_staff' as UserRole
  },
  rentals: {
    name: 'Rentals',
    description: 'Rental operations and fleet management',
    icon: 'car',
    requiredRole: 'rental_manager' as UserRole
  },
  analytics: {
    name: 'Analytics',
    description: 'Analytics and business intelligence',
    icon: 'bar-chart',
    requiredRole: 'administrator' as UserRole
  },
  ai_assistant: {
    name: 'AI Assistant',
    description: 'AI-powered dealership assistant',
    icon: 'bot',
    requiredRole: 'salesperson' as UserRole
  },
  notifications: {
    name: 'Notifications',
    description: 'System notifications and alerts',
    icon: 'bell',
    requiredRole: 'employee' as UserRole
  },
  reports: {
    name: 'Reports',
    description: 'Report generation and export',
    icon: 'file-text',
    requiredRole: 'administrator' as UserRole
  },
  settings: {
    name: 'Settings',
    description: 'System configuration',
    icon: 'settings',
    requiredRole: 'administrator' as UserRole
  },
  user_management: {
    name: 'User Management',
    description: 'User and role management',
    icon: 'users-cog',
    requiredRole: 'administrator' as UserRole
  },
  permissions: {
    name: 'Permissions',
    description: 'Permission management',
    icon: 'shield',
    requiredRole: 'super_admin' as UserRole
  }
}

export const permissionService = {
  // Get user permissions based on role
  getUserPermissions: (role: UserRole): UserPermissions => {
    return PERMISSION_MATRIX[role] as UserPermissions
  },

  // Check if user has specific permission for module
  hasPermission: (role: UserRole, module: Module, requiredPermission: Permission): boolean => {
    const userPermissions = PERMISSION_MATRIX[role]
    if (!userPermissions) return false
    
    const userPermission = userPermissions[module]
    if (!userPermission) return false

    // Permission hierarchy: full_access > write > update > read > view_only
    const permissionLevels = ['view_only', 'read', 'update', 'write', 'delete', 'full_access']
    const userLevel = permissionLevels.indexOf(userPermission)
    const requiredLevel = permissionLevels.indexOf(requiredPermission)
    
    return userLevel >= requiredLevel
  },

  // Check if user can access module
  canAccessModule: (role: UserRole, module: Module): boolean => {
    const userPermissions = PERMISSION_MATRIX[role]
    if (!userPermissions) return false
    
    const modulePermission = userPermissions[module]
    return modulePermission !== undefined && modulePermission !== 'view_only'
  },

  // Get module access information
  getModuleAccess: (role: UserRole): ModuleAccess[] => {
    const userPermissions = PERMISSION_MATRIX[role]
    if (!userPermissions) return []

    return Object.entries(userPermissions)
      .filter(([module, permission]) => module !== 'permissions')
      .map(([module, permission]) => ({
        module: module as Module,
        hasAccess: permission !== 'view_only',
        permissions: [permission as Permission]
      }))
  },

  // Get all available permissions for a role
  getRolePermissions: (role: UserRole): { module: Module; permission: Permission }[] => {
    const userPermissions = PERMISSION_MATRIX[role]
    if (!userPermissions) return []

    return Object.entries(userPermissions)
      .filter(([module]) => module !== 'permissions')
      .map(([module, permission]) => ({
        module: module as Module,
        permission: permission as Permission
      }))
  },

  // Check if role can manage other users
  canManageUsers: (role: UserRole): boolean => {
    return role === 'super_admin' || role === 'administrator'
  },

  // Get required minimum role for module
  getRequiredRole: (module: Module): UserRole => {
    return MODULE_CONFIG[module].requiredRole
  },

  // Check if user has write access or higher
  hasWriteAccess: (role: UserRole, module: Module): boolean => {
    const userPermissions = PERMISSION_MATRIX[role]
    if (!userPermissions) return false
    
    const userPermission = userPermissions[module]
    if (!userPermission) return false

    const writePermissions = ['write', 'update', 'delete', 'full_access']
    return writePermissions.includes(userPermission)
  },

  // Get permission level description
  getPermissionDescription: (permission: Permission): string => {
    const descriptions = {
      view_only: 'View Only',
      read: 'Read Access',
      write: 'Write Access',
      update: 'Update Access',
      delete: 'Delete Access',
      full_access: 'Full Access'
    }
    return descriptions[permission] || 'Unknown'
  },

  // Check if one role has higher or equal permissions than another
  hasHigherOrEqualRole: (userRole: UserRole, requiredRole: UserRole): boolean => {
    const userIndex = ROLE_HIERARCHY.indexOf(userRole)
    const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole)
    return userIndex >= requiredIndex
  }
}
