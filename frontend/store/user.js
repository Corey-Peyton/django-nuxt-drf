export const state = () => ({
  email: null,
  is_staff: null,
  is_superuser: null,
})

export const getters = {
  getAccountStatus: (s) => s.email,
}

export const actions = {
  fetchData({ commit }) {
    this.$apiCall
      .get('/api/account/')
      .then((resp) => {
        commit('setAccount', resp.data)
      })
      .catch((/* err */) => {})
  },
}

export const mutations = {
  setAccount: (state, payload) => {
    state.email = payload.email
  },
}
