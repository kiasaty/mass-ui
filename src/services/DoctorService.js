import axios from 'axios'

export default {

  fetchDoctors(args) {
    let url = 'doctors'

    if (args.searchQuery) {
      url += `?q=${args.searchQuery}`
    }

    return axios.get(url)
  },

  fetchDoctor(doctorID) {
    let url = `doctors/${doctorID}`

    return axios.get(url)
  },

  createDoctor(formData) {
    return axios.post('/doctors', formData)
  },

  updateDoctor(formData, doctorID = null) {
    formData.append("_method", "PUT")
    doctorID = doctorID || formData.get('id')
    return axios.post("doctors/" + doctorID, formData)
  },

  deleteDoctor(doctorID) {
    return axios.delete("doctors/" + doctorID)
  },

}