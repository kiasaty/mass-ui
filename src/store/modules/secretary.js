import SecretaryService from '@/services/SecretaryService.js'

export const namespaced = true

export const state = {
  secretaries: [],
  secretary: {},
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
  SET_SECRETARIES(state, secretaries) {
    state.secretaries = secretaries
  },
  ADD_SECRETARY(state, secretary) {
    state.secretaries.push(secretary)
  },
  SET_SECRETARY(state, secretary) {
    state.secretary = secretary
  },
  EDIT_SECRETARY(state, secretary) {
    state.secretaries.splice(state.index, 1, secretary)
  },
  DELETE_SECRETARY(state) {
    state.secretaries.splice(state.index, 1)
  },
}

export const actions = {
  setIndex({ commit }, index) {
    commit('SET_INDEX', index)
  },
  unsetIndex({ commit }) {
    commit('UNSET_INDEX')
  },
  fetchSecretaries({ commit }, args = {}) {
    return SecretaryService.fetchSecretaries(args)
      .then(response => {
        commit('SET_SECRETARIES', response.data.data)
      })
      .catch(error => {
        throw error
      })
  },
  createSecretary({ commit }, formData) {
    return SecretaryService.createSecretary(formData)
      .then(response => {
        let newSecretary = response.data.data
        commit('ADD_SECRETARY', newSecretary)
        commit('SET_SECRETARY', newSecretary)
      })
      .catch(error => {
        throw error
      })
  },
  fetchSecretary({ commit, getters, state }, secretaryID) {
    if (secretaryID == state.secretary.id) {
      return state.secretary
    }

    let secretary = getters.getSecretaryByID(secretaryID)
    if (secretary) {
      commit('SET_SECRETARY', secretary)
      return secretary
    }
    
    return SecretaryService.fetchSecretary(secretaryID)
      .then(response => {
        commit('SET_SECRETARY', response.data.data)
        return response.data.data
      })
  },
  updateSecretary({ commit }, formData) {
    return SecretaryService.updateSecretary(formData)
      .then(response => {
        let updatedSecretary = response.data.data
        commit('EDIT_SECRETARY', updatedSecretary)
        commit('SET_SECRETARY', updatedSecretary)
      })
      .catch(error => {
        throw error
      })
  },
  deleteSecretary({ commit }) {
    return SecretaryService.deleteSecretary(state.secretaries[state.index].id)
      .then(
        commit('DELETE_SECRETARY')
      )
      .catch(error => {
        throw error
      })
  },
}
export const getters = {
  getSecretaries: state => {
    return state.secretaries
  },
  getSecretary: state => {
    return state.secretary
  },
  getIndex: state => {
    return state.index
  },
  getSecretaryByID: state => id => {
    return state.secretaries.find(secretary => secretary.id == id)
  }
}