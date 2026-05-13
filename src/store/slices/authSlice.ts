import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/types/rbac'
import { userService } from '@/services/userService'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  token: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      console.log('=== DEBUG loginSuccess ===');
      console.log('User role:', action.payload.user.role);
      console.log('User email:', action.payload.user.email);
      
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.loading = false
      localStorage.setItem('auth_token', action.payload.token)
      localStorage.setItem('current_user', JSON.stringify(action.payload.user))
      
      // Also set the session in userService
      userService.setUserSession(action.payload.user, action.payload.token)
      console.log('Session set in userService');
    },
    loginFailure: (state) => {
      state.loading = false
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('auth_token')
      localStorage.removeItem('current_user')
      
      // Also clear the session in userService
      userService.clearSession()
    },
    restoreAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
  },
})

export const { setLoading, loginSuccess, loginFailure, logout, restoreAuth } = authSlice.actions
export default authSlice.reducer
