import axios from 'axios'

export default {

  fetchAppointments(args) {
    let url = 'appointments'

    if (args.searchQuery) {
      url += `?q=${args.searchQuery}`
    }

    return axios.get(url)
  },

  fetchAppointment(appointmentID) {
    let url = `appointments/${appointmentID}`

    return axios.get(url)
  },

  createAppointment(formData) {
    return axios.post('/appointments', formData)
  },

  updateAppointment(formData, appointmentID = null) {
    formData.append("_method", "PUT")
    appointmentID = appointmentID || formData.get('id')
    return axios.post("appointments/" + appointmentID, formData)
  },

  deleteAppointment(appointmentID) {
    return axios.delete("appointments/" + appointmentID)
  },

  addMedicine(appointmentID, formData) {
    formData.append("_method", "PUT")
    return axios.post(
      '/appointments/' + appointmentID + '/medicines/' + formData.get('medicine_id'),
      formData
    )
  },

  updateMedicine(appointmentID, formData) {
    formData.append("_method", "PATCH")
    return axios.post(
      '/appointments/' + appointmentID + '/medicines/' + formData.get('medicine_id'),
      formData
    )
  },

  removeMedicine(appointmentID, medicineID) {
    return axios.delete(
      '/appointments/' + appointmentID + '/medicines/' + medicineID
    )
  },

  addExperiment(appointmentID, formData) {
    formData.append("_method", "PUT")
    return axios.post(
      '/appointments/' + appointmentID + '/experiments/' + formData.get('experiment_id'),
      formData
    )
  },

  updateExperiment(appointmentID, formData) {
    formData.append("_method", "PATCH")
    return axios.post(
      '/appointments/' + appointmentID + '/experiments/' + formData.get('experiment_id'),
      formData
    )
  },

  removeExperiment(appointmentID, experimentID) {
    return axios.delete(
      '/appointments/' + appointmentID + '/experiments/' + experimentID
    )
  },

}