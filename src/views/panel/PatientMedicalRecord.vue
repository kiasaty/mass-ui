<template>
  <v-container fluid>
    <v-row justify="space-around" class="text-center">

      <v-col cols="12">
        <v-avatar color="teal" size="100">
          <img
            v-if="patient.profile_photo"
            :src="`${serverURL}/${patient.profile_photo}`"
            alt="John"
          >
          <span v-else class="white--text headline" v-text="patientNameInitials"></span>
        </v-avatar>
      </v-col>

      <v-col cols="12" class="py-0">
        <v-text color="teal" size="100" v-text="patient.fullname">
        </v-text>
      </v-col>

      <v-col cols="12" class="green--text">
        <v-text color="teal" size="100"> MRN:
        </v-text>
        <v-text color="teal" size="100" v-text="patient.medical_record_number">
        </v-text>
      </v-col>

    </v-row>


    <v-card>
      <v-tabs
        background-color="white"
        color="deep-purple accent-4"
      >
        <v-tab>Patient Information</v-tab>
        <v-tab>Appointments</v-tab>

        <v-tab-item>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <span class="subtitle-2">Patient Name: </span>
                <span class="body-2" v-text="patient.fullname"></span>
              </v-col>
              <v-col cols="12">
                <span class="subtitle-2">Patient Medical Record Number: </span>
                <span class="body-2" v-text="patient.medical_record_number"></span>
              </v-col>
              <v-col cols="12">
                <span class="subtitle-2">Patient Phone Number: </span>
                <span class="body-2" v-text="patient.phone_number"></span>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>

        <v-tab-item>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  :headers="appointmentHeaders"
                  :items="appointments"
                  sort-by="start_time"
                  hide-default-footer
                >
                  <template v-slot:item.action="{ item }">
                    <v-icon
                      small
                      class="mr-2"
                      @click="showAppointment(item)"
                    >
                      mdi-eye
                    </v-icon>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>

      </v-tabs>
    </v-card>

  </v-container>
</template>


<script>
import { mapGetters } from "vuex"
import store from '@/store'

export default {
  data: () => ({
    appointmentHeaders: [
      { text: 'id',           value: 'id' },
      { text: 'Patient',      value: 'patient.fullname' },
      { text: 'Doctor',       value: 'doctor.fullname' },
      { text: 'Start Time',   value: 'start_time' },
      { text: 'End Time',     value: 'end_time' },
      { text: 'Actions',      value: 'action',      sortable: false,  align: 'end' },
    ],
    serverErrors: {},
  }),

  computed: {
    patientNameInitials() {
      let firstnameFirstcharacter = this.patient.firstname.toUpperCase().charAt(0)
      let lastnameFirstcharacter  = this.patient.lastname.toUpperCase().charAt(0)
      return firstnameFirstcharacter + ' ' + lastnameFirstcharacter
    },
    ...mapGetters({
      patient:      'patient/getPatient',
      appointments: 'appointment/getAppointments',
      isAdmin:      'user/isAdmin',
      serverURL:    'serverURL',
    })
  },


  created() {
    this.getPatient()
    this.getAppointments()
  },

  methods: {
    getPatient () {
      store.dispatch('patient/fetchPatient', this.$route.params.patient_id)
    },

    getAppointments () {
      store.dispatch('appointment/fetchAppointments')
    },

    showAppointment(item) {
      this.$router.push(
        "/panel/appointments/" + item.id
      )
    },
  }
};
</script>