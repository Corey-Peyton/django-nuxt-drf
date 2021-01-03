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

  async logout({ commit }) {
    await this.$apiCall.post('/api/logout/')
    commit('logout')
    this.$router.push('/')
  },
}

const mutations = {
  authSuccess: (state, payload) => {
    state.authenticated = 'success'
  },
  logout: (state) => {
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
