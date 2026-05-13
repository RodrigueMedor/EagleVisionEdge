// Mock Auth Service
// Simulates authentication API calls with artificial delays

import { UserRole } from '@/types/rbac';

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: UserRole
    dealership: {
      id: string
      name: string
    }
  }
}

const MOCK_USERS = {
  'admin@igr.com': { password: 'admin123', role: 'administrator' as UserRole, name: 'System Administrator' },
  'manager@igr.com': { password: 'manager123', role: 'administrator' as UserRole, name: 'Sales Manager' },
  'sales@igr.com': { password: 'sales123', role: 'salesperson' as UserRole, name: 'Sales Representative' },
  'finance@igr.com': { password: 'finance123', role: 'financing_staff' as UserRole, name: 'Finance Manager' },
  'rentals@igr.com': { password: 'rentals123', role: 'rental_manager' as UserRole, name: 'Rental Manager' },
  'employee@igr.com': { password: 'employee123', role: 'employee' as UserRole, name: 'Dealership Employee' },
  'dealer@eaglevisionedge.com': { password: 'dealer123', role: 'super_admin' as UserRole, name: 'Dealership Owner' },
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const user = (MOCK_USERS as any)[credentials.email]
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid email or password')
    }

    return {
      token: `mock_token_${Date.now()}`,
      user: {
        id: `user_${credentials.email}`,
        email: credentials.email,
        name: user.name,
        role: user.role,
        dealership: {
          id: 'dealership_001',
          name: 'IGR AUTO SALES',
        },
      },
    }
  },

  async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check if user already exists
    const existingUser = (MOCK_USERS as any)[userData.email]
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      role: userData.role as UserRole,
      dealership: {
        id: 'dealership_001',
        name: 'EAGLE VISION EDGE DEMO',
      },
    }

    // Add to mock database
    ;(MOCK_USERS as any)[userData.email] = newUser

    return {
      token: `mock_token_${Date.now()}`,
      user: newUser,
    }
  },

  async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))

    if ((MOCK_USERS as any)[data.email]) {
      throw new Error('Email already exists')
    }

    return {
      token: `mock_token_${Date.now()}`,
      user: {
        id: `user_${data.email}`,
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        role: 'employee' as UserRole,
        dealership: {
          id: 'dealership_001',
          name: 'IGR AUTO SALES',
        },
      },
    }
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))
  },

  async resetPassword(email: string): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { message: 'Password reset email sent' }
  },

  async validateToken(token: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return token.startsWith('mock_token_')
  },
}
