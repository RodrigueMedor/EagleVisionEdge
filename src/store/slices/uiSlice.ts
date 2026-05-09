import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  mobile: boolean
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light',
  mobile: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    setMobile: (state, action: PayloadAction<boolean>) => {
      state.mobile = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarOpen, setTheme, setMobile } = uiSlice.actions
export default uiSlice.reducer

