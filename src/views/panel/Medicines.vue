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
              <v-col cols="12">
                <v-text-field
                  label="Title"
                  v-model="dialogFields.title"
                  :error-messages="serverErrors.title"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Description"
                  v-model="dialogFields.description"
                  :error-messages="serverErrors.description"
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
      :items="medicines"
      sort-by="id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Medicines</v-toolbar-title>
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
      title: null,
      description: null,
    },
    headers: [
      { text: 'id',           value: 'id' },
      { text: 'Title',        value: 'title' },
      { text: 'Description',  value: 'description', sortable: false },
      { text: 'Actions',      value: 'action',      sortable: false,  align: 'end' },
    ],
    serverErrors: {},
  }),

  computed: {
    isUpdateTask() {
      return !!this.dialogFields.id;
    },
    dialogTitle() {
      return this.isUpdateTask ? "Update Medicine" : "Create Medicine";
    },
    ...mapGetters({
      medicines:      'medicine/getMedicines',
      medicine:       'medicine/getMedicine',
      medicineIndex:  'medicine/getIndex',
      isAdmin:        'user/isAdmin',
    })
  },

  watch: {
    dialogOpen(val) {
      val || this.endTask()  // if openDialog got false (it is being closed), run the endTask method
    }
  },

  created() {
    this.getMedicines()
  },

  methods: {
    getMedicines () {
      store.dispatch('medicine/fetchMedicines')
    },

    storeMedicine() {
      return store.dispatch('medicine/createMedicine', this.getFormData())
        .catch(error => {
          this.serverErrors = error.response.data.errors.detail
          throw error
        });
    },

    updateMedicine() {
      return store.dispatch('medicine/updateMedicine', this.getFormData())
        .catch(error => {
          this.serverErrors = error.response.data.errors.detail
          throw error
        });
    },

    deleteMedicine() {
      return store.dispatch('medicine/deleteMedicine')
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
      store.dispatch('medicine/setIndex', this.medicines.indexOf(item))
      this.assignDialog(item)
      this.dialogOpen = true
    },

    deleteItem(item) {
      store.dispatch('medicine/setIndex', this.medicines.indexOf(item))

      confirm("Are you sure?") && this.deleteMedicine()

      this.endTask()
    },

    endTask() {
      this.resetDialog()
      this.dialogOpen = false
      this.serverErrors = {}
      store.dispatch('medicine/unsetIndex')
    },

    save() {
      
      let promise = this.isUpdateTask ? this.updateMedicine() : this.storeMedicine()

      promise.then(() => {
        this.endTask()
      })
    },

    assignDialog(item) {
      this.dialogFields.id          = item.id
      this.dialogFields.title       = item.title
      this.dialogFields.description = item.description
    },

    resetDialog() {
      this.dialogFields.id = null
      this.dialogFields.title = null
      this.dialogFields.description = null
    },
  }
};
</script>