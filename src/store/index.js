import Vue from 'vue'
import Vuex from 'vuex'
import * as user from '@/store/modules/user.js'
import * as specialty from '@/store/modules/specialty.js'
import * as workSchedule from '@/store/modules/workSchedule.js'
import * as medicine from '@/store/modules/medicine.js'
import * as experiment from '@/store/modules/experiment.js'
import * as doctor from '@/store/modules/doctor.js'
import * as secretary from '@/store/modules/secretary.js'
import * as patient from '@/store/modules/patient.js'
import * as appointment from '@/store/modules/appointment.js'

Vue.use(Vuex)

export default new Vuex.Store({

  modules: {
    user,
    specialty,
    workSchedule,
    medicine,
    experiment,
    doctor,
    secretary,
    patient,
    appointment,
  },

  state: {
    serverURL: 'http://localhost:8000',
  },

  mutations: {
  },

  actions: {
  },

  getters: {
      serverURL(state) {
          return state.serverURL
      },
  }

})
