<template>
  <div>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-toolbar-title style="width: 300px">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">MASS</span>
      </v-toolbar-title>
      <!-- <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field> -->
      <div class="flex-grow-1"></div>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-avatar color="teal" size="40">
        <img
          v-if="user.profile_photo"
          :src="`${serverURL}/${user.profile_photo}`"
        >
        <span v-else class="white--text body-2" v-text="userInitials"></span>
      </v-avatar>
    </v-app-bar>
    
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>

      <template v-slot:prepend v-if="isPatient">
        <div class="pa-2 mt-5 mx-4">
          <v-btn
            to="/panel/new-appointment"
            rounded 
            large
          >
            <v-icon dark class="mr-1">mdi-plus</v-icon>
            New Appointment
          </v-btn>
        </div>
      </template>
      
      <v-list dense nav>
        <v-list-item v-for="item in menu" :key="item.title" :to="item.to" link>
          <v-list-item-icon>
            <v-icon class="ml-2">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title :to="item.to">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <!-- If using vue-router -->
      <router-view></router-view>
    </v-content>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    drawer: null,
    responsive: true
  }),

  computed: {
    menu() {
      let menu = [];
      let menuItems = this.menuItems()
      menuItems.forEach(item => {
        if(item.access.indexOf(this.user.role) >= 0) {
          menu.push(item)
        }
      });
      // for(item in menuItems) {
      //   if(item.access.indexOf(this.user.role) >= 0) {
      //     menu.push(item)
      //   }
      // }
      return menu
    },
    ...mapGetters({
      isPatient:    'user/isPatient',
      user:         'user/getUser',
      userInitials: 'user/getUserInitials',
      serverURL:    'serverURL',
    }),
  },

  methods: {
    menuItems() {
      return [
        {
          title:    "Medical Record",
          icon:     "mdi-account-badge-horizontal",
          to:       `/panel/patients/${this.user.id}/medicalrecord`,
          access:   ['patient']
        },
        {
          title:    "Dashboard",
          icon:     "mdi-view-dashboard",
          to:       "/panel/dashboard",
          access:   ['admin', 'doctor', 'secretary']
        },
        {
          title:    "Appointments",
          icon:     "mdi-calendar",
          to:       "/panel/appointments",
          access:   ['admin', 'doctor', 'secretary', 'patient']
        },
        {
          title:    "Doctors",
          icon:     "mdi-account-tie",
          to:       "/panel/doctors",
          access:   ['admin']
        },
        {
          title:    "Secretaries",
          icon:     "mdi-account-multiple",
          to:       "/panel/secretaries",
          access:   ['admin', 'doctor']
        },
        {
          title:    "Patients",
          icon:     "mdi-account-group",
          to:       "/panel/patients",
          access:   ['admin', 'doctor', 'secretary']
        },
        {
          title:    "WorkSchedules",
          icon:     "mdi-calendar-clock",
          to:       "/panel/workschedules",
          access:   ['doctor']
        },
        {
          title:    "Specialties",
          icon:     "mdi-file-document-box-check",
          to:       "/panel/specialties",
          access:   ['admin']
        },
        {
          title:    "Medicines",
          icon:     "mdi-pill",
          to:       "/panel/medicines",
          access:   ['admin']
        },
        {
          title:    "Experiments",
          icon:     "mdi-flask",
          to:       "/panel/experiments",
          access:   ['admin']
        },
      ]
    },
    logout() {
      this.$router.push("/");
      this.$store.dispatch("user/logout");
    }
  }
};
</script>