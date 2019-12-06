<template>
  <v-container fluid>
    <v-btn bottom color="pink" dark fab fixed right @click="dialogOpen = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-dialog v-model="dialogOpen" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogTitle }}</span>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  :items="days"
                  v-model="dialogFields.day_of_week"
                  label="Day"
                ></v-select>
              </v-col>
                <template>
                  <div>
                    <v-row justify="space-around" align="center">
                      <v-col style="width: 290px; flex: 0 1 auto;" col="12" sm="6">
                        <h2>Start:</h2>
                        <v-time-picker v-model="dialogFields.start_time" format="24hr" :max="end" width="250"></v-time-picker>
                      </v-col>
                      <v-col style="width: 290px; flex: 0 1 auto;" col="12" sm="6">
                        <h2>End:</h2>
                        <v-time-picker v-model="dialogFields.end_time" format="24hr" :min="start" width="250"></v-time-picker>
                      </v-col>
                    </v-row>
                  </div>
                </template>
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
      :items="workSchedules"
      sort-by="id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>WorkSchedules</v-toolbar-title>
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
      day_of_week: null,
      start_time: null,
      end_time: null,
    },
    days: [
      {
        text: 'Sunday',
        value: 0,
      },
      {
        text: 'Monday',
        value: 1,
      },
      {
        text: 'Tuesday',
        value: 2,
      },
      {
        text: 'Wednesday',
        value: 3,
      },
      {
        text: 'Thursday',
        value: 4,
      },
      {
        text: 'Friday',
        value: 5,
      },
      {
        text: 'Saturday',
        value: 6,
      },
    ],
    headers: [
      { text: 'id',           value: 'id' },
      { text: 'Day',          value: 'day_of_week' },
      { text: 'Start Time',   value: 'start_time', },
      { text: 'End Time',     value: 'end_time', },
      { text: 'Actions',      value: 'action',      sortable: false,  align: 'end' },
    ],
    serverErrors: {},
  }),

  computed: {
    isUpdateTask() {
      return !!this.dialogFields.id;
    },
    dialogTitle() {
      return this.isUpdateTask ? "Update WorkSchedule" : "Create WorkSchedule";
    },
    ...mapGetters({
      workSchedules:      'workSchedule/getWorkSchedules',
      workSchedule:       'workSchedule/getWorkSchedule',
      workScheduleIndex:  'workSchedule/getIndex',
      user:               'user/getUser',
    })
  },

  watch: {
    dialogOpen(val) {
      val || this.endTask()  // if openDialog got false (it is being closed), run the endTask method
    }
  },

  created() {
    this.getWorkSchedules()
  },

  methods: {
    getWorkSchedules () {
      store.dispatch('workSchedule/fetchWorkSchedules', this.user.id)
    },

    storeWorkSchedule() {
      return store.dispatch('workSchedule/createWorkSchedule', {
          doctorID: this.user.id,
          formData: this.getFormData(),
        })
        .catch(error => {
          this.serverErrors = error.response.data.errors.detail
          throw error
        });
    },

    updateWorkSchedule() {
      return store.dispatch('workSchedule/updateWorkSchedule', {
          doctorID: this.user.id,
          formData: this.getFormData(),
        })
        .catch(error => {
          this.serverErrors = error.response.data.errors.detail
          throw error
        });
    },

    deleteWorkSchedule() {
      return store.dispatch('workSchedule/deleteWorkSchedule', this.user.id)
        .catch(
          error => (this.serverErrors = error.response.data.errors.detail)
        );
    },

    getFormData() {
      let formData = new FormData()
      
      for (let field in this.dialogFields) {
        if (this.dialogFields[field] !== null) {
          formData.append(field, this.dialogFields[field]);
        }
      }
      
      return formData;
    },

    editItem(item) {
      store.dispatch('workSchedule/setIndex', this.workSchedules.indexOf(item))
      this.assignDialog(item)
      this.dialogOpen = true
    },

    deleteItem(item) {
      store.dispatch('workSchedule/setIndex', this.workSchedules.indexOf(item))

      confirm("Are you sure?") && this.deleteWorkSchedule()

      this.endTask()
    },

    endTask() {
      this.resetDialog()
      this.dialogOpen = false
      this.serverErrors = {}
      store.dispatch('workSchedule/unsetIndex')
    },

    save() {
      
      let promise = this.isUpdateTask ? this.updateWorkSchedule() : this.storeWorkSchedule()

      promise.then(() => {
        this.endTask()
      })
    },

    assignDialog(item) {


      this.dialogFields.id          = item.id
      this.dialogFields.day_of_week = this.getDayNumber(item.day_of_week)
      this.dialogFields.start_time  = item.start_time
      this.dialogFields.end_time    = item.end_time
    },

    resetDialog() {
      this.dialogFields.id          = null
      this.dialogFields.day_of_week = null
      this.dialogFields.start_time  = null
      this.dialogFields.end_time    = null
    },
    
    getDayNumber(dayTitle) {
      let day = this.days.find(day => 
        day.text == dayTitle
      )
      return day.value
    }
  }
};
</script>