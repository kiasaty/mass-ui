<template>
  <v-app>
      <router-view/>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
        responsive:true,
    }),
  }
</script>

<style>
  @import './assets/styles.css';
</style>