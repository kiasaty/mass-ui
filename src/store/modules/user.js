// import UserService from '@/services/UserService.js'
import axios from 'axios'

export const namespaced = true

export const state = {
  user: null
}

export const mutations = {
  SET_USER_DATA(state, data) {
      state.user = data.user
      localStorage.setItem('user', JSON.stringify(data))
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
  },
  CLEAR_USER_DATA() {
      localStorage.removeItem('user')
      location.reload()
  }
}

export const actions = {
  register({ commit }, credentials) {
      return axios
          .post('/register', credentials)
          .then(({ data }) => {
              commit('SET_USER_DATA', data)
          })
  },
  login({ commit }, credentials) {
      return axios
          .post('/login', credentials)
          .then((response) => {
              commit('SET_USER_DATA', response.data)
              return response
          })
  },
  logout({ commit }) {
      commit('CLEAR_USER_DATA')
  }
}

export const getters = {
  isLoggedIn(state) {
      return !!state.user
  },
  isAdmin(state) {
      return (state.user) && (state.user.role == 'admin')
  },
  isDoctor(state) {
      return (state.user) && (state.user.role == 'doctor')
  },
  isSecretary(state) {
      return (state.user) && (state.user.role == 'secretary')
  },
  isPatient(state) {
      return (state.user) && (state.user.role == 'patient')
  },
  getUser(state) {
      if(state.user) return state.user
  },
  getUserInitials() {
    let firstnameFirstcharacter = state.user.firstname.toUpperCase().charAt(0)
    let lastnameFirstcharacter  = state.user.lastname.toUpperCase().charAt(0)
    return firstnameFirstcharacter + ' ' + lastnameFirstcharacter
  },
}