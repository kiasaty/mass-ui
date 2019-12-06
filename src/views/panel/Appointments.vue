<template>
  <v-container fluid>

    <v-data-table
      :headers="headers"
      :items="appointments"
      sort-by="id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Appointments</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>

        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="showItem(item)"
        >
          mdi-eye
        </v-icon>
      </template>
    </v-data-table>

  </v-container>
</template>


<script>
import { mapGetters } from "vuex"
import store from '@/store'

export default {
  data: () => ({
    headers: [
      { text: 'id',           value: 'id' },
      { text: 'Patient',      value: 'patient.fullname' },
      { text: 'Doctor',       value: 'doctor.fullname' },
      { text: 'Start Time',   value: 'start_time' },
      { text: 'End Time',     value: 'end_time' },
      { text: 'Actions',      value: 'action',      sortable: false,  align: 'end' },
    ],
  }),

  computed: {
    ...mapGetters({
      appointments:     'appointment/getAppointments',
      isAdmin:          'user/isAdmin',
    })
  },

  created() {
    this.getAppointments()
  },

  methods: {
    getAppointments () {
      store.dispatch('appointment/fetchAppointments')
    },

    showItem(item) {
      this.$router.push(
        "/panel/appointments/" + item.id
      )
    }
  }
};
</script>