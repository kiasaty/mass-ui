import axios from 'axios'

export default {

  fetchPatients(args) {
    let url = 'patients'

    if (args.searchQuery) {
      url += `?q=${args.searchQuery}`
    }

    return axios.get(url)
  },

  fetchPatient(patientID) {
    let url = `patients/${patientID}`

    return axios.get(url)
  },

  createPatient(formData) {
    return axios.post('/patients', formData)
  },

  updatePatient(formData, patientID = null) {
    formData.append("_method", "PUT")
    patientID = patientID || formData.get('id')
    return axios.post("patients/" + patientID, formData)
  },

  deletePatient(patientID) {
    return axios.delete("patients/" + patientID)
  },

}