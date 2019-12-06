<template>
   <div>

    <v-app-bar app>
      <v-toolbar-title style="width: 300px">
        <span class="hidden-sm-and-down">MASS</span>
      </v-toolbar-title>
      <!-- <v-toolbar-title class="mr-5">JustInTime</v-toolbar-title> -->

      <div class="flex-grow-1"></div>

      <v-toolbar-items>
        <v-btn 
          v-if="isLoggedIn"
          text
          to="/panel"
        >Panel</v-btn>
        <v-btn
          v-if="!isLoggedIn"
          text
          to="/login"
        >Login</v-btn>
      </v-toolbar-items>
      <!-- <v-btn v-if="!isLoggedIn" class="mx-3" color="primary" large to="/register">Register</v-btn> -->

      <template v-if="isLoggedIn && $vuetify.breakpoint.smAndUp">
        <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>

    </v-app-bar>
        
    <router-view/>
    
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data () {
        return {
          //
        }
    },

    computed: {
      ...mapGetters({
        isLoggedIn: 'user/isLoggedIn',
      }),
    },

    methods: {
      logout() {
        this.$store.dispatch('user/logout')
      }
    }

  }
</script>