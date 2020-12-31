const state = {
  authenticated: '',
}

const getters = {
  getAuthenticated: (s) => s.authenticated,
}

const actions = {
  login({ commit, dispatch }, payload) {
    this.$apiCall.$post('/api/login/', payload).then((resp) => {
      commit('authSuccess', resp)
      dispatch('user/fetchData', null, { root: true })
    })
  },

  logout({ commit }) {
    this.$apiCall.$post('/api/logout/').then((resp) => {
      commit('logout', resp)
    })
  },
}

const mutations = {
  authSuccess: (state, payload) => {
    state.authenticated = 'success'
  },
  logout: (state, payload) => {
    state.authenticated = ''
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
