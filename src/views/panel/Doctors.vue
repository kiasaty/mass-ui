<template>
  <v-container fluid>
    <v-btn bottom color="pink" dark fab fixed right @click="dialogOpen = true" v-if="isAdmin">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-dialog v-model="dialogOpen" max-width="500px" v-if="isAdmin">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogTitle }}</span>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="First Name"
                  v-model="dialogFields.firstname"
                  :error-messages="serverErrors.firstname"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Last Name"
                  v-model="dialogFields.lastname"
                  :error-messages="serverErrors.lastname"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  label="Secretary"
                  :items="secretaries"
                  item-text="fullname"
                  item-value="id"
                  v-model="dialogFields.secretary_id"
                  :error-messages="serverErrors.secretary_id"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-file-input
                  v-model="dialogFields.profile_photo"
                  accept="image/png, image/jpeg, image/bmp"
                  prepend-icon="mdi-camera"
                  label="Profile Photo"
                  :error-messages="serverErrors.profile_photo"
                ></v-file-input>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Phone Number"
                  v-model="dialogFields.phone_number"
                  :error-messages="serverErrors.phone_number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Username"
                  v-model="dialogFields.username"
                  :error-messages="serverErrors.username"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Password"
                  name="password"
                  type="password"
                  v-model="dialogFields.password"
                  :error-messages="serverErrors.password"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Confirm Password"
                  name="password_confirmation"
                  type="password"
                  v-model="dialogFields.password_confirmation"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="endTask">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-data-table
      :headers="headers"
      :items="doctors"
      sort-by="id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Doctors</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>

        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }" v-if="isAdmin">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
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
    dialogOpen: false,
    dialogFields: {
      id: null,
      firstname: null,
      lastname: null,
      phone_number: null,
      profile_photo: null,
      username: null,
      password: null,
      password_confirmation: null,
      secretary_id: null,
    },
    headers: [
      { text: 'id',           value: 'id' },
      { text: 'First Name',   value: 'firstname' },
      { text: 'Last Name',    value: 'lastname' },
      { text: 'Phone Number', value: 'phone_number',    sortable: false },
      { text: 'Actions',      value: 'action',          sortable: false,  align: 'end' },
    ],
    serverErrors: {},
  }),

  computed: {
    isUpdateTask() {
      return !!this.dialogFields.id;
    },
    dialogTitle() {
      return this.isUpdateTask ? "Update Doctor" : "Register Doctor";
    },
    ...mapGetters({
      doctors:      'doctor/getDoctors',
      secretaries:  'secretary/getSecretaries',
      doctor:       'doctor/getDoctor',
      doctorIndex:  'doctor/getIndex',
      isAdmin:      'user/isAdmin',
    })
  },

  watch: {
    dialogOpen(val) {
      val || this.endTask()  // if openDialog got false (it is being closed), run the endTask method
    }
  },

  created() {
    this.getDoctors()
    this.getSecretaries()
  },

  methods: {
    getDoctors () {
      store.dispatch('doctor/fetchDoctors')
    },

    getSecretaries () {
      store.dispatch('secretary/fetchSecretaries')
    },

    storeDoctor() {
      return store.dispatch('doctor/createDoctor', this.getFormData())
        .catch(error => {
          this.serverErrors = error.response.data.errors.detail
          throw error
        });
    },

    updateDoctor() {
      return store.dispatch('doctor/updateDoctor', this.getFormData())
        .catch(error => {
          this.serverErrors = error.response.data.errors.detail
          throw error
        });
    },

    deleteDoctor() {
      return store.dispatch('doctor/deleteDoctor')
        .catch(
          error => (this.serverErrors = error.response.data.errors.detail)
        );
    },

    getFormData() {
      let formData = new FormData()
      
      for (let field in this.dialogFields) {
        if (this.dialogFields[field]) {
          formData.append(field, this.dialogFields[field]);
        }
      }
      
      return formData;
    },

    editItem(item) {
      store.dispatch('doctor/setIndex', this.doctors.indexOf(item))
      this.assignDialog(item)
      this.dialogOpen = true
    },

    deleteItem(item) {
      store.dispatch('doctor/setIndex', this.doctors.indexOf(item))

      confirm("Are you sure?") && this.deleteDoctor()

      this.endTask()
    },

    endTask() {
      this.resetDialog()
      this.dialogOpen = false
      this.serverErrors = {}
      store.dispatch('doctor/unsetIndex')
    },

    save() {
      
      let promise = this.isUpdateTask ? this.updateDoctor() : this.storeDoctor()

      promise.then(() => {
        this.endTask()
      })
    },

    assignDialog(item) {
      this.dialogFields.id                    = item.id
      this.dialogFields.firstname             = item.firstname
      this.dialogFields.lastname              = item.lastname
      this.dialogFields.phone_number          = item.phone_number
      // this.dialogFields.profile_photo         = item.profile_photo
      this.dialogFields.username              = item.username
      this.dialogFields.password              = item.password
      this.dialogFields.password_confirmation = item.password_confirmation
      this.dialogFields.secretary_id          = item.secretary_id
    },

    resetDialog() {
      this.dialogFields.id = null
      this.dialogFields.firstname = null
      this.dialogFields.lastname = null
      this.dialogFields.phone_number = null
      this.dialogFields.profile_photo = null
      this.dialogFields.username = null
      this.dialogFields.password = null
      this.dialogFields.password_confirmation = null
      this.dialogFields.secretary_id = null
    },
  }
};
</script>