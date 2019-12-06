import axios from 'axios'

export default {

  fetchWorkSchedules(doctorID) {
    return axios.get(`doctors/${doctorID}/workschedules`)
  },

  fetchWorkSchedule(doctorID, workScheduleID) {
    let url = `doctors/${doctorID}/workschedules/${workScheduleID}`

    return axios.get(url)
  },

  createWorkSchedule(doctorID, formData) {
    return axios.post(`doctors/${doctorID}/workschedules`, formData)
  },

  updateWorkSchedule(doctorID, formData, workScheduleID = null) {
    formData.append("_method", "PUT")
    workScheduleID = workScheduleID || formData.get('id')
    return axios.post(`doctors/${doctorID}/workschedules/${workScheduleID}`, formData)
  },

  deleteWorkSchedule(doctorID, workScheduleID) {
    return axios.delete(`doctors/${doctorID}/workschedules/${workScheduleID}`)
  },

}