// Mock Auth Service
// Simulates authentication API calls with artificial delays

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
    role: 'admin' | 'manager' | 'sales_rep'
    dealership: {
      id: string
      name: string
    }
  }
}

const MOCK_USERS = {
  'admin@igr.com': { password: 'admin123', role: 'admin', name: 'Admin User' },
  'manager@igr.com': { password: 'manager123', role: 'manager', name: 'Sales Manager' },
  'sales@igr.com': { password: 'sales123', role: 'sales_rep', name: 'Sales Representative' },
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
        role: 'sales_rep',
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

