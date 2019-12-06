import ExperimentService from '@/services/ExperimentService.js'

export const namespaced = true

export const state = {
  experiments: [],
  experiment: {},
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
  SET_EXPERIMENTS(state, experiments) {
    state.experiments = experiments
  },
  ADD_EXPERIMENT(state, experiment) {
    state.experiments.push(experiment)
  },
  SET_EXPERIMENT(state, experiment) {
    state.experiment = experiment
  },
  EDIT_EXPERIMENT(state, experiment) {
    state.experiments.splice(state.index, 1, experiment)
  },
  DELETE_EXPERIMENT(state) {
    state.experiments.splice(state.index, 1)
  },
}

export const actions = {
  setIndex({ commit }, index) {
    commit('SET_INDEX', index)
  },
  unsetIndex({ commit }) {
    commit('UNSET_INDEX')
  },
  fetchExperiments({ commit }, args = {}) {
    return ExperimentService.fetchExperiments(args)
      .then(response => {
        commit('SET_EXPERIMENTS', response.data.data)
      })
      .catch(error => {
        throw error
      })
  },
  createExperiment({ commit }, formData) {
    return ExperimentService.createExperiment(formData)
      .then(response => {
        let newExperiment = response.data.data
        commit('ADD_EXPERIMENT', newExperiment)
        commit('SET_EXPERIMENT', newExperiment)
      })
      .catch(error => {
        throw error
      })
  },
  fetchExperiment({ commit, getters, state }, experimentID) {
    if (experimentID == state.experiment.id) {
      return state.experiment
    }

    let experiment = getters.getExperimentByID(experimentID)
    if (experiment) {
      commit('SET_EXPERIMENT', experiment)
      return experiment
    }
    
    return ExperimentService.fetchExperiment(experimentID)
      .then(response => {
        commit('SET_EXPERIMENT', response.data.data)
        return response.data.data
      })
  },
  updateExperiment({ commit }, formData) {
    return ExperimentService.updateExperiment(formData)
      .then(response => {
        let updatedExperiment = response.data.data
        commit('EDIT_EXPERIMENT', updatedExperiment)
        commit('SET_EXPERIMENT', updatedExperiment)
      })
      .catch(error => {
        throw error
      })
  },
  deleteExperiment({ commit }) {
    return ExperimentService.deleteExperiment(state.experiments[state.index].id)
      .then(
        commit('DELETE_EXPERIMENT')
      )
      .catch(error => {
        throw error
      })
  },
}
export const getters = {
  getExperiments: state => {
    return state.experiments
  },
  getExperiment: state => {
    return state.experiment
  },
  getIndex: state => {
    return state.index
  },
  getExperimentByID: state => id => {
    return state.experiments.find(experiment => experiment.id == id)
  }
}