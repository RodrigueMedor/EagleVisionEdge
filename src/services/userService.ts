import { User, UserSession, UserRole, CreateUserData, UpdateUserData } from '@/types/rbac'
import { permissionService } from './permissionService'

// Mock session storage
let currentSession: UserSession | null = null

export const userService = {
  // Get current user session
  getCurrentUser: async (): Promise<UserSession | null> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Get from localStorage (simulating session)
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('current_user')
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        const permissions = permissionService.getUserPermissions(user.role)
        
        currentSession = {
          user,
          token,
          isAuthenticated: true,
          permissions,
          roleHierarchy: ['employee', 'rental_manager', 'financing_staff', 'salesperson', 'administrator', 'super_admin']
        }
        
        return currentSession
      } catch (e) {
        console.error('Failed to parse user session:', e)
        return null
      }
    }
    
    return null
  },

  // Set user session
  setUserSession: async (user: User, token: string): Promise<void> => {
    console.log('=== DEBUG setUserSession ===');
    console.log('Setting session for user:', user.email, 'with role:', user.role);
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const permissions = permissionService.getUserPermissions(user.role)
    
    currentSession = {
      user,
      token,
      isAuthenticated: true,
      permissions,
      roleHierarchy: ['employee', 'rental_manager', 'financing_staff', 'salesperson', 'administrator', 'super_admin']
    }
    
    console.log('Current session set:', currentSession);
    
    // Store in localStorage (simulating session)
    localStorage.setItem('auth_token', token)
    localStorage.setItem('current_user', JSON.stringify(user))
  },

  // Clear user session
  clearSession: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    currentSession = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('current_user')
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const session = await userService.getCurrentUser()
    return session?.isAuthenticated || false
  },

  // Get current user role
  getCurrentRole: async (): Promise<UserRole | null> => {
    const session = await userService.getCurrentUser()
    return session?.user?.role || null
  },

  // Check if current user has specific permission
  hasPermission: async (module: string, permission: string): Promise<boolean> => {
    const session = await userService.getCurrentUser()
    if (!session?.isAuthenticated) return false
    
    return permissionService.hasPermission(session.user.role, module as any, permission as any)
  },

  // Check if current user can access module
  canAccessModule: async (module: string): Promise<boolean> => {
    const session = await userService.getCurrentUser()
    if (!session?.isAuthenticated) return false
    
    return permissionService.canAccessModule(session.user.role, module as any)
  },

  // Get current user permissions
  getCurrentPermissions: async (): Promise<any> => {
    const session = await userService.getCurrentUser()
    return session?.permissions || {}
  },

  // Update user profile
  updateProfile: async (updateData: UpdateUserData): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const session = await userService.getCurrentUser()
    if (!session?.user) {
      throw new Error('No active session')
    }
    
    // In a real implementation, this would call the backend
    // For now, just simulate the update
    const updatedUser: User = { 
      ...session.user, 
      ...updateData,
      permissions: {
        ...session.user.permissions,
        ...updateData.permissions
      }
    }
    
    // Update session
    currentSession = {
      ...session,
      user: updatedUser
    }
    
    localStorage.setItem('current_user', JSON.stringify(updatedUser))
    
    return updatedUser
  },

  // Get session info for components
  getSessionInfo: () => {
    return currentSession
  },

  // Create new user
  createUser: async (userData: CreateUserData): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // In a real implementation, this would call the backend API
    // For now, just simulate user creation
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      role: userData.role,
      permissions: permissionService.getUserPermissions(userData.role),
      dealership: {
        id: 'default-dealership',
        name: 'Default Dealership'
      },
      department: userData.department,
      isActive: true,
      createdAt: new Date().toISOString()
    }
    
    return newUser
  },

  // Initialize session from storage
  initializeSession: () => {
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('current_user')
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        const permissions = permissionService.getUserPermissions(user.role)
        
        currentSession = {
          user,
          token,
          isAuthenticated: true,
          permissions,
          roleHierarchy: ['employee', 'rental_manager', 'financing_staff', 'salesperson', 'administrator', 'super_admin']
        }
      } catch (e) {
        console.error('Failed to initialize session:', e)
      }
    }
  }
}
