import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

interface UIState {
  sidebarOpen: boolean
  notifications: Notification[]
  isDragging: boolean
  activeWidget: string | null
}

const initialState: UIState = {
  sidebarOpen: true,
  notifications: [],
  isDragging: false,
  activeWidget: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const id = Math.random().toString(36).substring(7)
      state.notifications.push({ ...action.payload, id })
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
    setDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload
    },
    setActiveWidget: (state, action: PayloadAction<string | null>) => {
      state.activeWidget = action.payload
    },
  },
})

export const {
  toggleSidebar,
  addNotification,
  removeNotification,
  setDragging,
  setActiveWidget,
} = uiSlice.actions

export default uiSlice.reducer 