import DoctorService from '@/services/DoctorService.js'

export const namespaced = true

export const state = {
  doctors: [],
  doctor: {},
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
  SET_DOCTORS(state, doctors) {
    state.doctors = doctors
  },
  ADD_DOCTOR(state, doctor) {
    state.doctors.push(doctor)
  },
  SET_DOCTOR(state, doctor) {
    state.doctor = doctor
  },
  EDIT_DOCTOR(state, doctor) {
    state.doctors.splice(state.index, 1, doctor)
  },
  DELETE_DOCTOR(state) {
    state.doctors.splice(state.index, 1)
  },
}

export const actions = {
  setIndex({ commit }, index) {
    commit('SET_INDEX', index)
  },
  unsetIndex({ commit }) {
    commit('UNSET_INDEX')
  },
  fetchDoctors({ commit }, args = {}) {
    return DoctorService.fetchDoctors(args)
      .then(response => {
        commit('SET_DOCTORS', response.data.data)
      })
      .catch(error => {
        throw error
      })
  },
  createDoctor({ commit }, formData) {
    return DoctorService.createDoctor(formData)
      .then(response => {
        let newDoctor = response.data.data
        commit('ADD_DOCTOR', newDoctor)
        commit('SET_DOCTOR', newDoctor)
      })
      .catch(error => {
        throw error
      })
  },
  fetchDoctor({ commit, getters, state }, doctorID) {
    if (doctorID == state.doctor.id) {
      return state.doctor
    }

    let doctor = getters.getDoctorByID(doctorID)
    if (doctor) {
      commit('SET_DOCTOR', doctor)
      return doctor
    }
    
    return DoctorService.fetchDoctor(doctorID)
      .then(response => {
        commit('SET_DOCTOR', response.data.data)
        return response.data.data
      })
  },
  updateDoctor({ commit }, formData) {
    return DoctorService.updateDoctor(formData)
      .then(response => {
        let updatedDoctor = response.data.data
        commit('EDIT_DOCTOR', updatedDoctor)
        commit('SET_DOCTOR', updatedDoctor)
      })
      .catch(error => {
        throw error
      })
  },
  deleteDoctor({ commit }) {
    return DoctorService.deleteDoctor(state.doctors[state.index].id)
      .then(
        commit('DELETE_DOCTOR')
      )
      .catch(error => {
        throw error
      })
  },
}
export const getters = {
  getDoctors: state => {
    return state.doctors
  },
  getDoctor: state => {
    return state.doctor
  },
  getIndex: state => {
    return state.index
  },
  getDoctorByID: state => id => {
    return state.doctors.find(doctor => doctor.id == id)
  }
}