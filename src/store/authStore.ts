import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  login: (isAuthenticated: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: localStorage.getItem('dx_admin') === '1',
  login: (isAuthenticated) => {
    if (isAuthenticated) {
      localStorage.setItem('dx_admin', '1')
      set({ isAuthenticated: true })
    }
  },
  logout: () => {
    localStorage.removeItem('dx_admin')
    set({ isAuthenticated: false })
  }
}))
