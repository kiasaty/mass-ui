import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

window.axios = axios

new Vue({
  router,
  store,
  vuetify,
  
  created() {

    axios.defaults.baseURL = this.$store.getters['serverURL']

    const userString = localStorage.getItem('user')
    if (userString) {
      const userData = JSON.parse(userString)
      this.$store.commit('user/SET_USER_DATA', userData)
    }

    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response.status === 401) {
          this.$store.dispatch('user/logout')
        }
        return Promise.reject(error)
      }
    )
  },
  
  render: h => h(App)
}).$mount('#app')
