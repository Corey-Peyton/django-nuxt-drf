<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Django + Nuxt.js Starter Application</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-switch v-model="$vuetify.theme.dark" hide-details inset></v-switch>
      <v-spacer></v-spacer>
      <v-btn
        v-if="$store.getters['auth/getAuthenticated'] === 'success'"
        @click="$store.dispatch('auth/logout')"
        >Logout</v-btn
      >
      <v-btn v-else to="/login">Login</v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      items: [
        { title: 'Home', icon: 'mdi-view-dashboard', to: '/' },
        { title: 'Posts', icon: 'mdi-image', to: '/posts' },
        { title: 'About', icon: 'mdi-help-box', to: '/about' },
        { title: 'Login', icon: 'mdi-key', to: '/login' },
      ],
    }
  },
}
</script>
