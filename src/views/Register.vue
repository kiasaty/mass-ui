<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card outlined class="pa-6">
              <v-toolbar color="white" flat>
                <v-toolbar-title class="ma-auto">Register</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form @keyup.enter="register">
                  <v-text-field
                    ref="firstname"
                    label="First Name"
                    outlined
                    name="firstname"
                    type="text"
                    v-model="fields.firstname"
                    :error-messages="serverErrors.firstname"
                    @keyup.enter="$refs.lastname.focus()"
                  ></v-text-field>
                  <v-text-field
                    ref="lastname"
                    label="Last Name"
                    outlined
                    name="lastname"
                    type="text"
                    v-model="fields.lastname"
                    :error-messages="serverErrors.lastname"
                    @keyup.enter="$refs.phonenumber.focus()"
                  ></v-text-field>
                  <v-text-field
                    ref="phonenumber"
                    label="Phone Number"
                    outlined
                    name="phone_number"
                    type="text"
                    v-model="fields.phone_number"
                    :error-messages="serverErrors.phone_number"
                    @keyup.enter="$refs.username.focus()"
                  ></v-text-field>
                  <v-text-field
                    ref="username"
                    label="Username"
                    outlined
                    name="username"
                    type="username"
                    v-model="fields.username"
                    :error-messages="serverErrors.username"
                    @keyup.enter="$refs.password.focus()"
                  ></v-text-field>
                  <v-text-field
                    ref="password"
                    label="Password"
                    outlined
                    name="password"
                    type="password"
                    v-model="fields.password"
                    :error-messages="serverErrors.password"
                    @keyup.enter="$refs.password_confirmation.focus()"
                  ></v-text-field>
                  <v-text-field
                    ref="password_confirmation"
                    label="Confirm Password"
                    outlined
                    name="password_confirmation"
                    type="password"
                    v-model="fields.password_confirmation"
                    @keyup.enter="register"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" text to="/login">Login</v-btn>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" @click="register">Register</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    source: String
  },
  data() {
    return {
      fields: {
        firstname: "",
        lastname: "",
        phone_number: "",
        username: "",
        password: "",
        password_confirmation: ""
      },
      serverErrors: {}
    };
  },

  methods: {
    register() {
      axios
        .post('patients', this.fields)
        .then( () => this.$router.push('/login') )
        .catch(
          error => (this.serverErrors = error.response.data.errors.detail)
        );
    }
  }
};
</script>
