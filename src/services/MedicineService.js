import axios from 'axios'

export default {

  fetchMedicines(args) {
    let url = 'medicines'

    if (args.searchQuery) {
      url += `?q=${args.searchQuery}`
    }

    return axios.get(url)
  },

  fetchMedicine(medicineID) {
    let url = `medicines/${medicineID}`

    return axios.get(url)
  },

  createMedicine(formData) {
    return axios.post('/medicines', formData)
  },

  updateMedicine(formData, medicineID = null) {
    formData.append("_method", "PUT")
    medicineID = medicineID || formData.get('id')
    return axios.post("medicines/" + medicineID, formData)
  },

  deleteMedicine(medicineID) {
    return axios.delete("medicines/" + medicineID)
  },

}