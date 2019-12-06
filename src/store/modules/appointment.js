import AppointmentService from '@/services/AppointmentService.js'

export const namespaced = true

export const state = {
  appointments: [],
  appointment: {},
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
  SET_APPOINTMENTS(state, appointments) {
    state.appointments = appointments
  },
  ADD_APPOINTMENT(state, appointment) {
    state.appointments.push(appointment)
  },
  SET_APPOINTMENT(state, appointment) {
    state.appointment = appointment
  },
  EDIT_APPOINTMENT(state, appointment) {
    state.appointments.splice(state.index, 1, appointment)
  },
  DELETE_APPOINTMENT(state) {
    state.appointments.splice(state.index, 1)
  },
  ADD_MEDICINE(state, medicine) {
    state.appointment.medicines.push(medicine)
  },
  EDIT_MEDICINE(state, medicine) {
    state.appointment.medicines.splice(state.index, 1, medicine)
  },
  REMOVE_MEDICINE(state) {
    state.appointment.medicines.splice(state.index, 1)
  },
  ADD_EXPERIMENT(state, experiment) {
    state.appointment.experiments.push(experiment)
  },
  EDIT_EXPERIMENT(state, experiment) {
    state.appointment.experiments.splice(state.index, 1, experiment)
  },
  REMOVE_EXPERIMENT(state) {
    state.appointment.experiments.splice(state.index, 1)
  },
}

export const actions = {
  setIndex({ commit }, index) {
    commit('SET_INDEX', index)
  },
  unsetIndex({ commit }) {
    commit('UNSET_INDEX')
  },
  fetchAppointments({ commit }, args = {}) {
    return AppointmentService.fetchAppointments(args)
      .then(response => {
        commit('SET_APPOINTMENTS', response.data.data)
      })
      .catch(error => {
        throw error
      })
  },
  createAppointment({ commit }, formData) {
    return AppointmentService.createAppointment(formData)
      .then(response => {
        let newAppointment = response.data.data
        commit('ADD_APPOINTMENT', newAppointment)
        commit('SET_APPOINTMENT', newAppointment)
        return response
      })
      .catch(error => {
        throw error
      })
  },
  fetchAppointment({ commit, getters, state }, appointmentID) {
    if (appointmentID == state.appointment.id) {
      return state.appointment
    }

    let appointment = getters.getAppointmentByID(appointmentID)
    if (appointment) {
      commit('SET_APPOINTMENT', appointment)
      return appointment
    }
    
    return AppointmentService.fetchAppointment(appointmentID)
      .then(response => {
        commit('SET_APPOINTMENT', response.data.data)
        return response.data.data
      })
  },
  updateAppointment({ commit }, formData) {
    return AppointmentService.updateAppointment(formData)
      .then(response => {
        let updatedAppointment = response.data.data
        commit('EDIT_APPOINTMENT', updatedAppointment)
        commit('SET_APPOINTMENT', updatedAppointment)
      })
      .catch(error => {
        throw error
      })
  },
  deleteAppointment({ commit }) {
    return AppointmentService.deleteAppointment(state.appointments[state.index].id)
      .then(
        commit('DELETE_APPOINTMENT')
      )
      .catch(error => {
        throw error
      })
  },
  addMedicine({ commit }, formData) {
    return AppointmentService.addMedicine(state.appointment.id, formData)
      .then(response => {
        let addedMedicine = response.data.data
        commit('ADD_MEDICINE', addedMedicine)
      })
      .catch(error => {
        throw error
      })
  },
  updateMedicine({ commit }, formData) {
    return AppointmentService.updateMedicine(state.appointment.id, formData)
      .then(response => {
        let editiedMedicine = response.data.data
        commit('EDIT_MEDICINE', editiedMedicine)
      })
      .catch(error => {
        throw error
      })
  },
  removeMedicine({ commit }) {
    return AppointmentService.removeMedicine(state.appointment.id, state.appointment.medicines[state.index].id)
      .then(
        commit('REMOVE_MEDICINE')
      )
      .catch(error => {
        throw error
      })
  },
  addExperiment({ commit }, formData) {
    return AppointmentService.addExperiment(state.appointment.id, formData)
      .then(response => {
        let addedExperiment = response.data.data
        commit('ADD_EXPERIMENT', addedExperiment)
      })
      .catch(error => {
        throw error
      })
  },
  updateExperiment({ commit }, formData) {
    return AppointmentService.updateExperiment(state.appointment.id, formData)
      .then(response => {
        let editiedExperiment = response.data.data
        commit('EDIT_EXPERIMENT', editiedExperiment)
      })
      .catch(error => {
        throw error
      })
  },
  removeExperiment({ commit }) {
    return AppointmentService.removeExperiment(state.appointment.id, state.appointment.experiments[state.index].id)
      .then(
        commit('REMOVE_EXPERIMENT')
      )
      .catch(error => {
        throw error
      })
  },
}
export const getters = {
  getAppointments: state => {
    return state.appointments
  },
  getAppointment: state => {
    return state.appointment
  },
  getIndex: state => {
    return state.index
  },
  getAppointmentByID: state => id => {
    return state.appointments.find(appointment => appointment.id == id)
  }
}