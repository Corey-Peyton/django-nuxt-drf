const axios = require('axios')

export default {
  env: {
    // fallback value
    baseUrl: process.env.BASE_URL,
  },
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL || 'http://localhost',
    },
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL || 'http://backend:8000',
    },
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'frontend',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['~/plugins/filters.js', '~/plugins/axios'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',

    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/sitemap',
    '@nuxtjs/axios',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  sitemap: {
    exclude: ['/login'],
    routes: async () => {
      const baseURL = process.env.BASE_URL || 'http://backend:8000'
      const instance = axios.create({
        baseURL,
      })
      const resp = await instance.get('/api/posts/')
      // get a count of how many posts there are
      const limit = resp.data.count
      // fetch all of the posts for the sitemap by passing the
      const { data } = await instance.get(`/api/posts/?limit=${limit}`)
      return data.results.map((post) => `/posts/${post.id}`)
    },
  },

  vuetify: {
    optionsPath: './vuetify.options.js',
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
  server: {
    port: process.env.NUXT_PORT || 3000, // default: 3000
    host: process.env.NUXT_HOST || '0.0.0.0', // default: localhost
  },
}
