import axios from 'axios'

export default {

  fetchSecretaries(args) {
    let url = 'secretaries'

    if (args.searchQuery) {
      url += `?q=${args.searchQuery}`
    }

    return axios.get(url)
  },

  fetchSecretary(secretaryID) {
    let url = `secretaries/${secretaryID}`

    return axios.get(url)
  },

  createSecretary(formData) {
    return axios.post('/secretaries', formData)
  },

  updateSecretary(formData, secretaryID = null) {
    formData.append("_method", "PUT")
    secretaryID = secretaryID || formData.get('id')
    return axios.post("secretaries/" + secretaryID, formData)
  },

  deleteSecretary(secretaryID) {
    return axios.delete("secretaries/" + secretaryID)
  },

}