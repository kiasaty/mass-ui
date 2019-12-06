<template>
  <v-container fluid>
    
    <v-row justify="space-around">
      <v-card min-width="400" class="mt-12" :loading="loading">
        <v-card-title>
          <span class="headline">New Appointment</span>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  label="Choose a Doctor"
                  :items="doctors"
                  item-text="fullname"
                  item-value="id"
                  v-model="fields.doctor_id"
                  :error-messages="serverErrors.doctor_id"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="storeAppointment">Schedule</v-btn>
        </v-card-actions>
      </v-card>

    </v-row>
  </v-container>
</template>


<script>
import { mapGetters } from "vuex"
import store from '@/store'

export default {
  data: () => ({
    fields: {
      doctor_id: null,
    },
    loading: false,
    serverErrors: {},
  }),

  computed: {
    ...mapGetters({
      doctors:    'doctor/getDoctors',
      user:       'user/getUser',
    })
  },

  created() {
    this.getDoctors()
  },

  methods: {
    getDoctors () {
      store.dispatch('doctor/fetchDoctors')
    },

    getFormData() {
      let formData = new FormData()
      
      formData.append('doctor_id', this.fields.doctor_id);
      formData.append('patient_id', this.user.id);
      
      return formData;
    },

    storeAppointment() {
      this.loading = true
      return store.dispatch('appointment/createAppointment', this.getFormData())
        .then(response => {

          this.$router.push({
            name: 'Appointment',
            params: {
              appointment_id: response.data.data.id
            }
          })

          this.loading = false

        })
        .catch(error => {
          this.serverErrors = error.response.data.errors.detail
          this.loading = false
          throw error
        });
    },
  }
};
</script>