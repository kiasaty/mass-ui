<template>
  <v-content>
    <section>

      <v-parallax
        dark
        src="../assets/vbanner.webp"
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col v-if="!isLoggedIn" class="text-center" cols="12">
            <h1 class="display-1 font-weight-thin mb-4">Need an appointment with a doctor?!</h1>
            <v-btn to="/register" large class="ml-5 mt-2">Get Started</v-btn>
          </v-col>
        </v-row>
      </v-parallax>

    </section>
  </v-content>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      //
    };
  },

  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
    }),
  },
};
</script>