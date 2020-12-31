import Vue from 'vue'
import Vuex from 'vuex'
import posts from './modules/posts.js'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      posts,
      // TODO: add these later
      // user,
      // core,
      // auth,
    },
    strict: debug,
  })
  return Store
}
