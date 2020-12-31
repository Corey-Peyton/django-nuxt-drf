const state = {
  email: null,
  is_staff: null,
  is_superuser: null,
}

const getters = {
  getAccountStatus: (s) => s.email,
}

const actions = {
  fetchData({ commit }) {
    this.$apiCall
      .get('/api/account/')
      .then((resp) => {
        commit('setAccount', resp.data)
      })
      .catch((/* err */) => {})
  },
}

const mutations = {
  setAccount: (state, payload) => {
    // eslint-disable-next-line
    // console.log(payload)
    state.email = payload.email
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
