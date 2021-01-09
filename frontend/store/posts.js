/* eslint-disable no-unused-vars */

export const state = () => ({
  posts: [],
  count: null,
  search: '',
  paginationLimit: 10,
  currentPage: 1,
})

export const getters = {
  getPosts: (s) => s.posts,
  getCount: (s) => s.count,
  getSearch: (s) => s.search,
  getCurrentPage: (s) => s.currentPage,
  getParams: (s) => {
    return {
      limit: s.paginationLimit,
      offset: (s.currentPage - 1) * s.paginationLimit,
      search: s.search,
    }
  },
}

export const actions = {
  setPage({ commit, dispatch }, payload) {
    commit('SET_PAGE', payload)
    dispatch('fetchData')
  },
  async fetchData({ commit, getters }) {
    const response = await this.$axios.$get(`/api/posts/`, {
      params: getters.getParams,
    })
    commit('SET_POSTS', response)
  },
}

export const mutations = {
  SET_POSTS: (state, payload) => {
    state.posts = payload.results
    state.count = payload.count
  },
  SET_PAGE: (state, payload) => {
    state.currentPage = payload
  },
  SET_PARAMS: (state, payload) => {
    if (payload.page) {
      state.currentPage = parseInt(payload.page, 10)
    }

    if (payload.search) {
      state.search = payload.search
    }
  },
}
