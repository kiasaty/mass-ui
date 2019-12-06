import axios from 'axios'

export default {

  fetchExperiments(args) {
    let url = 'experiments'

    if (args.searchQuery) {
      url += `?q=${args.searchQuery}`
    }

    return axios.get(url)
  },

  fetchExperiment(experimentID) {
    let url = `experiments/${experimentID}`

    return axios.get(url)
  },

  createExperiment(formData) {
    return axios.post('/experiments', formData)
  },

  updateExperiment(formData, medicineID = null) {
    formData.append("_method", "PUT")
    medicineID = medicineID || formData.get('id')
    return axios.post("experiments/" + medicineID, formData)
  },

  deleteExperiment(experimentID) {
    return axios.delete("experiments/" + experimentID)
  },

}