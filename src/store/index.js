import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || ''
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    userRole: (state) => state.user?.role || 'student'
  },
  actions: {
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})

export const usePositionStore = defineStore('position', {
  state: () => ({
    positions: [],
    currentPosition: null
  }),
  actions: {
    setPositions(positions) {
      this.positions = positions
    },
    setCurrentPosition(position) {
      this.currentPosition = position
    }
  }
})