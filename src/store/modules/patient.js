import PatientService from '@/services/PatientService.js'

export const namespaced = true

export const state = {
  patients: [],
  patient: {},
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
  SET_PATIENTS(state, patients) {
    state.patients = patients
  },
  ADD_PATIENT(state, patient) {
    state.patients.push(patient)
  },
  SET_PATIENT(state, patient) {
    state.patient = patient
  },
  EDIT_PATIENT(state, patient) {
    state.patients.splice(state.index, 1, patient)
  },
  DELETE_PATIENT(state) {
    state.patients.splice(state.index, 1)
  },
}

export const actions = {
  setIndex({ commit }, index) {
    commit('SET_INDEX', index)
  },
  unsetIndex({ commit }) {
    commit('UNSET_INDEX')
  },
  fetchPatients({ commit }, args = {}) {
    return PatientService.fetchPatients(args)
      .then(response => {
        commit('SET_PATIENTS', response.data.data)
      })
      .catch(error => {
        throw error
      })
  },
  createPatient({ commit }, formData) {
    return PatientService.createPatient(formData)
      .then(response => {
        let newPatient = response.data.data
        commit('ADD_PATIENT', newPatient)
        commit('SET_PATIENT', newPatient)
      })
      .catch(error => {
        throw error
      })
  },
  fetchPatient({ commit, getters, state }, patientID) {
    if (patientID == state.patient.id) {
      return state.patient
    }

    let patient = getters.getPatientByID(patientID)
    if (patient) {
      commit('SET_PATIENT', patient)
      return patient
    }
    
    return PatientService.fetchPatient(patientID)
      .then(response => {
        commit('SET_PATIENT', response.data.data)
        return response.data.data
      })
  },
  updatePatient({ commit }, formData) {
    return PatientService.updatePatient(formData)
      .then(response => {
        let updatedPatient = response.data.data
        commit('EDIT_PATIENT', updatedPatient)
        commit('SET_PATIENT', updatedPatient)
      })
      .catch(error => {
        throw error
      })
  },
  deletePatient({ commit }) {
    return PatientService.deletePatient(state.patients[state.index].id)
      .then(
        commit('DELETE_PATIENT')
      )
      .catch(error => {
        throw error
      })
  },
}
export const getters = {
  getPatients: state => {
    return state.patients
  },
  getPatient: state => {
    return state.patient
  },
  getIndex: state => {
    return state.index
  },
  getPatientByID: state => id => {
    return state.patients.find(patient => patient.id == id)
  },
}