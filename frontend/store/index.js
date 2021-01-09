// this is the old way using modules. To use Vuex server side,
// nuxt requires that state be a function that returns a state object

// import Vue from 'vue'
// import Vuex from 'vuex'
// // import posts from './modules/posts.js'
// // import auth from './modules/auth.js'
// // import user from './modules/user.js'

// Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

// export default function (/* { ssrContext } */) {
//   const Store = new Vuex.Store({
//     actions: {
//       async nuxtServerInit({ commit }) {
//         let response = null
//         response = await this.$apiCall.get('/api/account/').catch((err) => {
//           // eslint-disable-next-line
//           console.log(err)
//         })

//         if (response) {
//           const data = response.data
//           commit('user/setAccount', data)
//           commit('auth/authSuccess', 'success')
//         }
//       },
//     },
//     // modules: {
//     //   posts,
//     //   auth,
//     //   user,
//     //   // core,
//     // },
//     strict: debug,
//   })
//   return Store
// }

export const actions = {
  async nuxtServerInit({ commit }) {
    let response = null
    response = await this.$apiCall.get('/api/account/').catch((err) => {
      // eslint-disable-next-line
      console.log(err)
    })

    if (response) {
      const data = response.data
      commit('user/setAccount', data)
      commit('auth/authSuccess', 'success')
    }
  },
}
