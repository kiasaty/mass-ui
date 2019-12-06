<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card outlined class="pa-6">
              <v-toolbar
                color="white"
                flat
              >
                <v-toolbar-title class="ma-auto">Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>

                <ul v-if="!!serverErrors" class="mb-10">
                  <li v-for="error in serverErrors" :key="error" v-text="error[0]" class="red--text">
                  </li>
                </ul>

                <v-form @keyup.enter="login">
                  <v-text-field
                    ref="username"
                    label="Username"
                    class="text-left"
                    outlined
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="credentials.username"
                    @keyup.enter="$refs.password.focus()"
                  ></v-text-field>

                  <v-text-field
                    ref="password"
                    label="Password"
                    outlined
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="credentials.password"
                    @keyup.enter="login"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" text to="/register">Register</v-btn>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" @click="login">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import store from '@/store'
import { mapGetters } from "vuex"

export default {
  props: {
    source: String,
  },
  data () {
      return {
          recieved_data: Object,
          credentials: {
              username: '',
              password: ''   
          },
          serverErrors: {},
      }
  },

  computed: {
    ...mapGetters({
      user:       'user/getUser',
      isPatient:  'user/isPatient',
    })
  },

  methods: {
      login() {    
          store
              .dispatch('user/login', this.credentials)
              .then( () => {

                if(this.isPatient){

                  this.$router.push({
                    name: 'PatientMedicalRecord',
                    params: {
                      patient_id: this.user.id
                    }
                  })

                } else {

                  this.$router.push({
                    name: 'Dashboard'
                  })

                }

              })
              .catch(error => this.serverErrors = error.response.data.errors.detail)
      }
  }
}
</script>
