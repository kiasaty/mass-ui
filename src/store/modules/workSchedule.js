import WorkScheduleService from '@/services/WorkScheduleService.js'

export const namespaced = true

export const state = {
  workSchedules: [],
  workSchedule: {},
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
  SET_WORKSCHEDULES(state, workSchedules) {
    state.workSchedules = workSchedules
  },
  ADD_WORKSCHEDULE(state, workSchedule) {
    state.workSchedules.push(workSchedule)
  },
  SET_WORKSCHEDULE(state, workSchedule) {
    state.workSchedule = workSchedule
  },
  EDIT_WORKSCHEDULE(state, workSchedule) {
    state.workSchedules.splice(state.index, 1, workSchedule)
  },
  DELETE_WORKSCHEDULE(state) {
    state.workSchedules.splice(state.index, 1)
  },
}

export const actions = {
  setIndex({ commit }, index) {
    commit('SET_INDEX', index)
  },
  unsetIndex({ commit }) {
    commit('UNSET_INDEX')
  },
  fetchWorkSchedules({ commit }, doctorID) {
    return WorkScheduleService.fetchWorkSchedules(doctorID)
      .then(response => {
        commit('SET_WORKSCHEDULES', response.data.data)
      })
      .catch(error => {
        throw error
      })
  },
  createWorkSchedule({ commit }, args) {
    return WorkScheduleService.createWorkSchedule(args.doctorID, args.formData)
      .then(response => {
        let newWorkSchedule = response.data.data
        commit('ADD_WORKSCHEDULE', newWorkSchedule)
        commit('SET_WORKSCHEDULE', newWorkSchedule)
      })
      .catch(error => {
        throw error
      })
  },
  fetchWorkSchedule({ commit, getters, state }, doctorID, workScheduleID) {
    if (workScheduleID == state.workSchedule.id) {
      return state.workSchedule
    }

    let workSchedule = getters.getWorkScheduleByID(workScheduleID)
    if (workSchedule) {
      commit('SET_WORKSCHEDULE', workSchedule)
      return workSchedule
    }
    
    return WorkScheduleService.fetchWorkSchedule(doctorID, workScheduleID)
      .then(response => {
        commit('SET_WORKSCHEDULE', response.data.data)
        return response.data.data
      })
  },
  updateWorkSchedule({ commit }, args) {
    return WorkScheduleService.updateWorkSchedule(args.doctorID, args.formData)
      .then(response => {
        let updatedWorkSchedule = response.data.data
        commit('EDIT_WORKSCHEDULE', updatedWorkSchedule)
        commit('SET_WORKSCHEDULE', updatedWorkSchedule)
      })
      .catch(error => {
        throw error
      })
  },
  deleteWorkSchedule({ commit }, doctorID) {
    return WorkScheduleService.deleteWorkSchedule(doctorID, state.workSchedules[state.index].id)
      .then(
        commit('DELETE_WORKSCHEDULE')
      )
      .catch(error => {
        throw error
      })
  },
}
export const getters = {
  getWorkSchedules: state => {
    return state.workSchedules
  },
  getWorkSchedule: state => {
    return state.workSchedule
  },
  getIndex: state => {
    return state.index
  },
  getWorkScheduleByID: state => id => {
    return state.workSchedules.find(workSchedule => workSchedule.id == id)
  }
}