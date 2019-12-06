<template>
  <v-container fluid>
    <v-row justify="space-around">

      <v-col cols="12" sm="6">
        <v-card
          min-height="200"
        >
          <v-list-item>
            <v-list-item-avatar>
              <v-avatar color="teal" size="45">
                <img
                  v-if="appointment.patient.profile_photo"
                  :src="`${serverURL}/${appointment.patient.profile_photo}`"
                >
                <span v-else class="white--text body-2" v-text="getNameInitials(appointment.patient)"></span>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="subtitle-1" v-text="appointment.patient.fullname"></v-list-item-title>
              <v-list-item-subtitle>Patient</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-text>
            <v-col cols="12">
              <span class="subtitle-2">Patient Medical Record Number: </span>
              <span class="body-2" v-text="appointment.patient.medical_record_number"></span>
            </v-col>
            <v-col cols="12">
              <span class="subtitle-2">Patient Phone Number: </span>
              <span class="body-2" v-text="appointment.patient.phone_number"></span>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card
          min-height="200"
        >
          <v-list-item>
            <v-list-item-avatar>
              <v-avatar color="teal" size="45">
                <img
                  v-if="appointment.doctor.profile_photo"
                  :src="`${serverURL}/${appointment.doctor.profile_photo}`"
                >
                <span v-else class="white--text body-2" v-text="getNameInitials(appointment.doctor)"></span>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="subtitle-1" v-text="appointment.doctor.fullname"></v-list-item-title>
              <v-list-item-subtitle>Doctor</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-text>
            <v-col cols="12">
              <span class="subtitle-2">Doctor Phone Number: </span>
              <span class="body-2" v-text="appointment.doctor.phone_number"></span>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>


      <v-card>
        <v-tabs
          background-color="white"
          color="deep-purple accent-4"
        >
          <v-tab>General</v-tab>
          <v-tab>Medicines</v-tab>
          <v-tab>Experiments</v-tab>
          <v-tab>Doctor Diagnosis</v-tab>

          <v-tab-item>
            <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <span class="subtitle-2">Appointment Start Time: </span>
                  <span class="body-2" v-text="appointment.start_time"></span>
                </v-col>
                <v-col cols="12">
                  <span class="subtitle-2">Appointment End Time: </span>
                  <span class="body-2" v-text="appointment.end_time"></span>
                </v-col>
                <v-col cols="12">
                  <span class="subtitle-2">Patient Name: </span>
                  <span class="body-2" v-text="appointment.patient.fullname"></span>
                </v-col>
                <v-col cols="12">
                  <span class="subtitle-2">Patient Medical Record Number: </span>
                  <span class="body-2" v-text="appointment.patient.medical_record_number"></span>
                </v-col>
                <v-col cols="12">
                  <span class="subtitle-2">Patient Phone Number: </span>
                  <span class="body-2" v-text="appointment.patient.phone_number"></span>
                </v-col>
                <v-col cols="12">
                  <span class="subtitle-2">Doctor Name: </span>
                  <span class="body-2" v-text="appointment.doctor.fullname"></span>
                </v-col>
                <v-col cols="12">
                  <span class="subtitle-2">Doctor Phone Number: </span>
                  <span class="body-2" v-text="appointment.doctor.phone_number"></span>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>

          <v-tab-item>
            <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <v-data-table
                    :headers="medicineHeaders"
                    :items="appointment.medicines"
                    sort-by="title"
                    hide-default-footer
                  >
                    <template v-slot:item.action="{ item }" v-if="!isPatient">
                      <v-icon
                        small
                        class="mr-2"
                        @click="editMedicine(item)"
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon
                        @click="removeMedicine(item)"
                      >
                        mdi-minus
                      </v-icon>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>

              <v-row v-if="isDoctor">
                <div class="flex-grow-1"></div>
                <v-btn text class="mt-9 mr-3" @click="addMedicine()">Add Medicine</v-btn>
              </v-row>

              <v-dialog v-model="medicineDialogOpen" max-width="500px" v-if="!isPatient">
                <v-card :loading="false">
                  <v-card-title>
                    <span class="headline">{{ dialogTitle + " Medicine" }}</span>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="9">
                          <span 
                            v-if="isUpdateTask"
                            v-text="medicines[index].title"
                            class="headline"
                          ></span>
                          <v-autocomplete
                            v-else
                            label="Medicine"
                            :items="medicines"
                            item-text="title"
                            item-value="id"
                            v-model="medicineDialogFields.medicine_id"
                            :error-messages="serverErrors.medicine_id"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field
                            v-model="medicineDialogFields.count"
                            label="Count"
                            min="1"
                            step="1"
                            type="number"
                            :error-messages="serverErrors.count"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            v-model="medicineDialogFields.doctor_order"
                            label="Doctor Order"
                            :error-messages="serverErrors.doctor_order"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="blue darken-1" text @click="endTask">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="saveMedicine">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            </v-container>
          </v-tab-item>

          <v-tab-item>
            <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <v-data-table
                    :headers="experimentHeaders"
                    :items="appointment.experiments"
                    sort-by="title"
                    hide-default-footer
                  >
                    <template v-slot:item.action="{ item }">
                      <v-icon
                        small
                        class="mr-2"
                        @click="editExperiment(item)"
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon
                        @click="removeExperiment(item)"
                      >
                        mdi-minus
                      </v-icon>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
              <v-row v-if="isDoctor">
                <div class="flex-grow-1"></div>
                <v-btn text class="mt-9 mr-3" @click="addExperiment()">Add Experiment</v-btn>
              </v-row>

              <v-dialog v-model="experimentDialogOpen" max-width="500px" v-if="!isPatient">
                <v-card :loading="false">
                  <v-card-title>
                    <span class="headline">{{ dialogTitle + " Experiment" }}</span>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="9">
                          <span 
                            v-if="isUpdateTask"
                            v-text="experiments[index].title"
                            class="headline"
                          ></span>
                          <v-autocomplete
                            v-else
                            label="Experiment"
                            :items="experiments"
                            item-text="title"
                            item-value="id"
                            v-model="experimentDialogFields.experiment_id"
                            :error-messages="serverErrors.experiment_id"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            v-model="experimentDialogFields.doctor_order"
                            label="Doctor Order"
                            :error-messages="serverErrors.doctor_order"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="blue darken-1" text @click="endTask">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="saveExperiment">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            </v-container>
          </v-tab-item>

          <v-tab-item>
            <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <span class="body-2" v-text="appointment.doctor_diagnosis"></span>
                </v-col>
              </v-row>
              <v-row v-if="isDoctor">
                <div class="flex-grow-1"></div>
                <v-btn text class="mt-9 mr-3" @click="editDoctorDiagnosis()">Edit Diagnosis</v-btn>
              </v-row>

              <v-dialog v-model="diagnosisDialogOpen" max-width="500px" v-if="isDoctor">
                <v-card :loading="false">
                  <v-card-title>
                    <span class="headline">{{ dialogTitle + " Doctor Diagnosis" }}</span>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-textarea
                            v-model="diagnosisDialogFields.doctor_diagnosis"
                            label="Diagnosis"
                            :error-messages="serverErrors.doctor_diagnosis"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="blue darken-1" text @click="endTask">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="updateAppointmentDiagnosis">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

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
    medicineHeaders: [
      { text: 'Medicine',     value: 'title' },
      { text: 'Count',        value: 'count' },
      { text: 'Doctor Order', value: 'doctor_order' },
      { text: '',             value: 'action',      sortable: false,  align: 'end' },
    ],
    experimentHeaders: [
      { text: 'Experiment',   value: 'title' },
      { text: 'Doctor Order', value: 'doctor_order' },
      { text: '',             value: 'action',      sortable: false,  align: 'end' },
    ],
    medicineDialogOpen: false,
    medicineDialogFields: {
      medicine_id: null,
      count: null,
      doctor_order: null,
    },
    experimentDialogOpen: false,
    experimentDialogFields: {
      experiment_id: null,
      doctor_order: null,
    },
    diagnosisDialogOpen: false,
    diagnosisDialogFields: {
      doctor_diagnosis: null,
    },
    isUpdateTask: false,
    serverErrors: {},
  }),

  computed: {
    dialogTitle() {
      return this.isUpdateTask ? "Update" : "Add";
    },
    ...mapGetters({
      appointment:  'appointment/getAppointment',
      index:        'appointment/getIndex',
      medicines:    'medicine/getMedicines',
      experiments:  'experiment/getExperiments',
      isDoctor:     'user/isDoctor',
      isPatient:    'user/isPatient',
      serverURL:    'serverURL',
    })
  },

  watch: {
    medicineDialogOpen(val) {
      val || this.endTask()  // if openDialog got false (it is being closed), run the endTask method
    },
    experimentDialogOpen(val) {
      val || this.endTask()  // if openDialog got false (it is being closed), run the endTask method
    }
  },

  created() {
    this.fetchMedicines()
    this.fetchExperiments()
    this.fetchAppointment()
  },

  methods: {
    fetchAppointment () {
      store.dispatch('appointment/fetchAppointment', this.$route.params.appointment_id)
    },

    fetchMedicines () {
      store.dispatch('medicine/fetchMedicines')
    },

    fetchExperiments () {
      store.dispatch('experiment/fetchExperiments')
    },

    getNameInitials(person) {
      let firstnameFirstcharacter = person.firstname.toUpperCase().charAt(0)
      let lastnameFirstcharacter  = person.lastname.toUpperCase().charAt(0)
      return firstnameFirstcharacter + ' ' + lastnameFirstcharacter
    },

    getFormData() {
      let formData = new FormData()

      let fields = this.medicineDialogOpen ? this.medicineDialogFields : this.experimentDialogFields
      
      for (let field in fields) {
        if (fields[field]) {
          formData.append(field, fields[field]);
        }
      }

      return formData;
    },

    addAppointmentMedicine() {
      return store.dispatch('appointment/addMedicine', this.getFormData())
        .catch(error => {
          this.serverErrors = error.response.data.errors.detail
          throw error
        });
    },

    updateAppointmentMedicine() {
      return store.dispatch('appointment/updateMedicine', this.getFormData())
        .catch(error => {
          this.serverErrors = error.response.data.errors.detail
          throw error
        });
    },

    removeAppointmentMedicine() {
      return store.dispatch('appointment/removeMedicine')
        .catch(error => {
          this.serverErrors = error.response.data.errors.detail
          throw error
        });
    },

    addMedicine() {
      this.medicineDialogOpen = true
    },

    editMedicine(item) {
      this.assignMedicineDialog(item)
      this.medicineDialogOpen = true
      store.dispatch('appointment/setIndex', this.appointment.medicines.indexOf(item))
      this.isUpdateTask = true
    },

    removeMedicine(item) {
      store.dispatch('appointment/setIndex', this.appointment.medicines.indexOf(item))

      confirm("Are you sure?") && this.removeAppointmentMedicine()

      this.endTask()
    },

    addAppointmentExperiment() {
      return store.dispatch('appointment/addExperiment', this.getFormData())
        .catch(error => {
          this.serverErrors = error.response.data.errors.detail
          throw error
        });
    },

    updateAppointmentExperiment() {
      return store.dispatch('appointment/updateExperiment', this.getFormData())
        .catch(error => {
          this.serverErrors = error.response.data.errors.detail
          throw error
        });
    },

    removeAppointmentExperiment() {
      return store.dispatch('appointment/removeExperiment')
        .catch(error => {
          this.serverErrors = error.response.data.errors.detail
          throw error
        });
    },

    addExperiment() {
      this.experimentDialogOpen = true
    },

    editExperiment(item) {
      this.assignExperimentDialog(item)
      this.experimentDialogOpen = true
      store.dispatch('appointment/setIndex', this.appointment.experiments.indexOf(item))
      this.isUpdateTask = true
    },

    removeExperiment(item) {
      store.dispatch('appointment/setIndex', this.appointment.experiments.indexOf(item))

      confirm("Are you sure?") && this.removeAppointmentExperiment()

      this.endTask()
    },

    updateAppointmentDiagnosis() {

      let formData = new FormData()
      formData.append('id', this.appointment.id);
      formData.append('doctor_diagnosis', this.diagnosisDialogFields.doctor_diagnosis);

      return store.dispatch('appointment/updateAppointment', formData)
        .then(
          this.endTask()
        )
        .catch(error => {
          this.serverErrors = error.response.data.errors.detail
          throw error
        });
    },

    editDoctorDiagnosis() {
      this.assignDiagnosisDialog()
      this.diagnosisDialogOpen = true
      // this.isUpdateTask = true
    },

    endTask() {
      this.resetMedicineDialog()
      this.resetExperimentDialog()
      this.medicineDialogOpen = false
      this.experimentDialogOpen = false
      this.diagnosisDialogOpen = false
      this.isUpdateTask = false
      this.serverErrors = {}
      store.dispatch('appointment/unsetIndex')
    },

    saveMedicine() {
      
      let promise = this.isUpdateTask ? this.updateAppointmentMedicine() : this.addAppointmentMedicine()

      promise.then(() => {
        this.endTask()
      })
    },

    saveExperiment() {
      
      let promise = this.isUpdateTask ? this.updateAppointmentExperiment() : this.addAppointmentExperiment()

      promise.then(() => {
        this.endTask()
      })
    },

    assignMedicineDialog(item) {
      console.log(item)
      this.medicineDialogFields.medicine_id   = item.id
      this.medicineDialogFields.count         = item.count
      this.medicineDialogFields.doctor_order  = item.doctor_order
    },

    resetMedicineDialog() {
      this.medicineDialogFields.medicine_id   = null
      this.medicineDialogFields.count         = null
      this.medicineDialogFields.doctor_order  = null
    },

    assignExperimentDialog(item) {
      this.experimentDialogFields.experiment_id   = item.id
      this.experimentDialogFields.doctor_order    = item.doctor_order
    },

    resetExperimentDialog() {
      this.experimentDialogFields.experiment_id   = null
      this.experimentDialogFields.doctor_order    = null
    },

    assignDiagnosisDialog() {
      this.diagnosisDialogFields.doctor_diagnosis  = this.appointment.doctor_diagnosis
    },
  }
};
</script>