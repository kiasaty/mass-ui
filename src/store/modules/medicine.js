import MedicineService from '@/services/MedicineService.js'

export const namespaced = true

export const state = {
  medicines: [],
  medicine: {},
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
  SET_MEDICINES(state, medicines) {
    state.medicines = medicines
  },
  ADD_MEDICINE(state, medicine) {
    state.medicines.push(medicine)
  },
  SET_MEDICINE(state, medicine) {
    state.medicine = medicine
  },
  EDIT_MEDICINE(state, medicine) {
    state.medicines.splice(state.index, 1, medicine)
  },
  DELETE_MEDICINE(state) {
    state.medicines.splice(state.index, 1)
  },
}

export const actions = {
  setIndex({ commit }, index) {
    commit('SET_INDEX', index)
  },
  unsetIndex({ commit }) {
    commit('UNSET_INDEX')
  },
  fetchMedicines({ commit }, args = {}) {
    return MedicineService.fetchMedicines(args)
      .then(response => {
        commit('SET_MEDICINES', response.data.data)
      })
      .catch(error => {
        throw error
      })
  },
  createMedicine({ commit }, formData) {
    return MedicineService.createMedicine(formData)
      .then(response => {
        let newMedicine = response.data.data
        commit('ADD_MEDICINE', newMedicine)
        commit('SET_MEDICINE', newMedicine)
      })
      .catch(error => {
        throw error
      })
  },
  fetchMedicine({ commit, getters, state }, medicineID) {
    if (medicineID == state.medicine.id) {
      return state.medicine
    }

    let medicine = getters.getMedicineByID(medicineID)
    if (medicine) {
      commit('SET_MEDICINE', medicine)
      return medicine
    }
    
    return MedicineService.fetchMedicine(medicineID)
      .then(response => {
        commit('SET_MEDICINE', response.data.data)
        return response.data.data
      })
  },
  updateMedicine({ commit }, formData) {
    return MedicineService.updateMedicine(formData)
      .then(response => {
        let updatedMedicine = response.data.data
        commit('EDIT_MEDICINE', updatedMedicine)
        commit('SET_MEDICINE', updatedMedicine)
      })
      .catch(error => {
        throw error
      })
  },
  deleteMedicine({ commit }) {
    return MedicineService.deleteMedicine(state.medicines[state.index].id)
      .then(
        commit('DELETE_MEDICINE')
      )
      .catch(error => {
        throw error
      })
  },
}
export const getters = {
  getMedicines: state => {
    return state.medicines
  },
  getMedicine: state => {
    return state.medicine
  },
  getIndex: state => {
    return state.index
  },
  getMedicineByID: state => id => {
    return state.medicines.find(medicine => medicine.id == id)
  }
}