import axios from 'axios'

export default {

  fetchSpecialties(args) {
    let url = 'specialties'

    if (args.searchQuery) {
      url += `?q=${args.searchQuery}`
    }

    return axios.get(url)
  },

  fetchSpecialty(specialtyID) {
    let url = `specialties/${specialtyID}`

    return axios.get(url)
  },

  createSpecialty(formData) {
    return axios.post('/specialties', formData)
  },

  updateSpecialty(formData, medicineID = null) {
    formData.append("_method", "PUT")
    medicineID = medicineID || formData.get('id')
    return axios.post("specialties/" + medicineID, formData)
  },

  deleteSpecialty(specialtyID) {
    return axios.delete("specialties/" + specialtyID)
  },

}