import SpecialtyService from '@/services/SpecialtyService.js'

export const namespaced = true

export const state = {
  specialties: [],
  specialty: {},
  index: null,
  perPage: 3
}

export const mutations = {
  SET_INDEX(state, index) {
    state.index = index
  },
  UNSET_INDEX(state) {
    state.index = null
  },
  SET_SPECIALTIES(state, specialties) {
    state.specialties = specialties
  },
  ADD_SPECIALTY(state, specialty) {
    state.specialties.push(specialty)
  },
  SET_SPECIALTY(state, specialty) {
    state.specialty = specialty
  },
  EDIT_SPECIALTY(state, specialty) {
    state.specialties.splice(state.index, 1, specialty)
  },
  DELETE_SPECIALTY(state) {
    state.specialties.splice(state.index, 1)
  },
}

export const actions = {
  setIndex({ commit }, index) {
    commit('SET_INDEX', index)
  },
  unsetIndex({ commit }) {
    commit('UNSET_INDEX')
  },
  fetchSpecialties({ commit }, args = {}) {
    return SpecialtyService.fetchSpecialties(args)
      .then(response => {
        commit('SET_SPECIALTIES', response.data.data)
      })
      .catch(error => {
        throw error
      })
  },
  createSpecialty({ commit }, formData) {
    return SpecialtyService.createSpecialty(formData)
      .then(response => {
        let newSpecialty = response.data.data
        commit('ADD_SPECIALTY', newSpecialty)
        commit('SET_SPECIALTY', newSpecialty)
      })
      .catch(error => {
        throw error
      })
  },
  fetchSpecialty({ commit, getters, state }, specialtyID) {
    if (specialtyID == state.specialty.id) {
      return state.specialty
    }

    let specialty = getters.getSpecialtyByID(specialtyID)
    if (specialty) {
      commit('SET_SPECIALTY', specialty)
      return specialty
    }
    
    return SpecialtyService.fetchSpecialty(specialtyID)
      .then(response => {
        commit('SET_SPECIALTY', response.data.data)
        return response.data.data
      })
  },
  updateSpecialty({ commit }, formData) {
    return SpecialtyService.updateSpecialty(formData)
      .then(response => {
        let updatedSpecialty = response.data.data
        commit('EDIT_SPECIALTY', updatedSpecialty)
        commit('SET_SPECIALTY', updatedSpecialty)
      })
      .catch(error => {
        throw error
      })
  },
  deleteSpecialty({ commit }) {
    return SpecialtyService.deleteSpecialty(state.specialties[state.index].id)
      .then(
        commit('DELETE_SPECIALTY')
      )
      .catch(error => {
        throw error
      })
  },
}
export const getters = {
  getSpecialties: state => {
    return state.specialties
  },
  getSpecialty: state => {
    return state.specialty
  },
  getIndex: state => {
    return state.index
  },
  getSpecialtyByID: state => id => {
    return state.specialties.find(specialty => specialty.id == id)
  }
}