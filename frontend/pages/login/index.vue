<template>
  <v-layout class="pt-8" justify-center>
    <v-flex xs12 sm8 md4 lg4>
      <v-card class="elevation-1 pa-2">
        <v-card-text>
          <div class="layout column">
            <h1 class="flex mt-4 mb-6 primary--text">Login</h1>
          </div>
          <v-form>
            <v-text-field
              id="email"
              v-model="email"
              class="my-4"
              name="login"
              label="Email"
              type="text"
              :error="error"
              :rules="[rules.required]"
              hide-details
              outlined
            />
            <v-text-field
              id="password"
              v-model="password"
              :type="hidePassword ? 'password' : 'text'"
              name="password"
              label="Password"
              :rules="[rules.required]"
              :error="error"
              hide-details
              outlined
              @click:append="hidePassword = !hidePassword"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            id="login"
            block
            color="primary"
            :loading="loading"
            @click="login"
            >Login</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      email: process.env.NODE_ENV === 'production' ? '' : 'admin@company.com',
      password: process.env.NODE_ENV === 'production' ? '' : 'password',
      hidePassword: true,
      error: false,
      showResult: false,
      result: '',
      rules: {
        required: (value) => !!value || 'Required.',
      },
    }
  },
  created() {
    this.$axios.get('/api/login-set-cookie/')
  },

  methods: {
    login() {
      const vm = this
      const { email, password } = this
      this.email = ''
      this.password = ''
      this.$store
        .dispatch('auth/login', {
          email,
          password,
        })
        .then(() => {
          vm.$router.push('/')
        })
    },
  },
}
</script>

<style scoped></style>
