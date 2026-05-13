import { UserRole, User, CreateUserData, UpdateUserData, ROLE_DISPLAY, PermissionMatrix } from '@/types/rbac'
import { permissionService } from './permissionService'

// Helper function to get default permissions for a role
const getDefaultPermissions = (role: UserRole) => {
  return permissionService.getUserPermissions(role)
}

// Mock user database with role assignments
const MOCK_USERS: User[] = [
  {
    id: 'user_001',
    email: 'admin@igr.com',
    name: 'System Administrator',
    role: 'administrator',
    permissions: getDefaultPermissions('administrator'),
    dealership: {
      id: 'dealership_001',
      name: 'IGR AUTO SALES'
    },
    department: 'IT',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: '2024-05-10T10:30:00Z'
  },
  {
    id: 'user_002',
    email: 'manager@igr.com',
    name: 'Sales Manager',
    role: 'administrator',
    permissions: getDefaultPermissions('administrator'),
    dealership: {
      id: 'dealership_001',
      name: 'IGR AUTO SALES'
    },
    department: 'Sales',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: '2024-05-10T09:15:00Z'
  },
  {
    id: 'user_003',
    email: 'dealer@eaglevisionedge.com',
    name: 'Dealership Manager',
    role: 'super_admin',
    permissions: getDefaultPermissions('super_admin'),
    dealership: {
      id: 'dealership_001',
      name: 'EAGLE VISION EDGE DEMO'
    },
    department: 'Executive',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-05-10T11:20:00Z'
  },
  {
    id: 'user_004',
    email: 'sales@igr.com',
    name: 'John Smith',
    role: 'salesperson',
    permissions: getDefaultPermissions('salesperson'),
    dealership: {
      id: 'dealership_001',
      name: 'IGR AUTO SALES'
    },
    department: 'Sales',
    isActive: true,
    createdAt: '2024-03-15T00:00:00Z',
    lastLogin: '2024-05-09T14:30:00Z'
  },
  {
    id: 'user_005',
    email: 'finance@igr.com',
    name: 'Sarah Johnson',
    role: 'financing_staff',
    permissions: getDefaultPermissions('financing_staff'),
    dealership: {
      id: 'dealership_001',
      name: 'IGR AUTO SALES'
    },
    department: 'Finance',
    isActive: true,
    createdAt: '2024-02-10T00:00:00Z',
    lastLogin: '2024-05-10T08:45:00Z'
  },
  {
    id: 'user_006',
    email: 'rentals@igr.com',
    name: 'Mike Davis',
    role: 'rental_manager',
    permissions: getDefaultPermissions('rental_manager'),
    dealership: {
      id: 'dealership_001',
      name: 'IGR AUTO SALES'
    },
    department: 'Operations',
    isActive: true,
    createdAt: '2024-01-20T00:00:00Z',
    lastLogin: '2024-05-10T07:30:00Z'
  },
  {
    id: 'user_007',
    email: 'employee@igr.com',
    name: 'Emily Wilson',
    role: 'employee',
    permissions: getDefaultPermissions('employee'),
    dealership: {
      id: 'dealership_001',
      name: 'IGR AUTO SALES'
    },
    department: 'General',
    isActive: true,
    createdAt: '2024-04-01T00:00:00Z',
    lastLogin: '2024-05-09T16:20:00Z'
  }
]

export const roleService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return MOCK_USERS
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return MOCK_USERS.find(user => user.id === id) || null
  },

  // Get user by email
  getUserByEmail: async (email: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return MOCK_USERS.find(user => user.email === email) || null
  },

  // Create new user
  createUser: async (userData: CreateUserData): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      role: userData.role,
      permissions: getDefaultPermissions(userData.role),
      dealership: {
        id: 'dealership_001',
        name: 'EAGLE VISION EDGE DEMO'
      },
      department: userData.department || 'General',
      isActive: true,
      createdAt: new Date().toISOString()
    }

    MOCK_USERS.push(newUser)
    return newUser
  },

  // Update user
  updateUser: async (id: string, updateData: UpdateUserData): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const userIndex = MOCK_USERS.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const updatedUser: User = { 
      ...MOCK_USERS[userIndex], 
      ...updateData,
      permissions: {
        ...MOCK_USERS[userIndex].permissions,
        ...updateData.permissions
      }
    }
    MOCK_USERS[userIndex] = updatedUser
    
    return updatedUser
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const userIndex = MOCK_USERS.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    MOCK_USERS.splice(userIndex, 1)
  },

  // Activate/deactivate user
  toggleUserStatus: async (id: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const userIndex = MOCK_USERS.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const user = MOCK_USERS[userIndex]
    user.isActive = !user.isActive
    user.lastLogin = new Date().toISOString()
    
    return user
  },

  // Update user role
  updateUserRole: async (id: string, newRole: UserRole): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const userIndex = MOCK_USERS.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const user = MOCK_USERS[userIndex]
    user.role = newRole
    user.lastLogin = new Date().toISOString()
    
    return user
  },

  // Get users by role
  getUsersByRole: async (role: UserRole): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return MOCK_USERS.filter(user => user.role === role)
  },

  // Search users
  searchUsers: async (query: string): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const lowerQuery = query.toLowerCase()
    return MOCK_USERS.filter(user => 
      user.name.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery) ||
      user.role.toLowerCase().includes(lowerQuery)
    )
  },

  // Get role statistics
  getRoleStatistics: async (): Promise<{ role: UserRole; count: number }[]> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const roleCounts = MOCK_USERS.reduce((acc, user) => {
      const existing = acc.find(item => item.role === user.role)
      if (existing) {
        existing.count++
      } else {
        acc.push({ role: user.role, count: 1 })
      }
      return acc
    }, [] as { role: UserRole; count: number }[])

    return roleCounts
  },

  // Get department statistics
  getDepartmentStatistics: async (): Promise<{ department: string; count: number }[]> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const deptCounts = MOCK_USERS.reduce((acc, user) => {
      const dept = user.department || 'Unassigned'
      const existing = acc.find(item => item.department === dept)
      if (existing) {
        existing.count++
      } else {
        acc.push({ department: dept, count: 1 })
      }
      return acc
    }, [] as { department: string; count: number }[])

    return deptCounts
  },

  // Get active users count
  getActiveUsersCount: async (): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return MOCK_USERS.filter(user => user.isActive).length
  },

  // Get role display information
  getRoleDisplay: (role: UserRole) => {
    return ROLE_DISPLAY[role]
  },

  // Validate role hierarchy
  canAssignRole: (assignerRole: UserRole, targetRole: UserRole): boolean => {
    const roleHierarchy = ['employee', 'rental_manager', 'financing_staff', 'salesperson', 'administrator', 'super_admin']
    const assignerIndex = roleHierarchy.indexOf(assignerRole)
    const targetIndex = roleHierarchy.indexOf(targetRole)
    
    // Only super_admin can assign any role
    if (assignerRole === 'super_admin') return true
    
    // Administrator can assign up to administrator
    if (assignerRole === 'administrator' && targetIndex <= roleHierarchy.indexOf('administrator')) return true
    
    return false
  }
}
