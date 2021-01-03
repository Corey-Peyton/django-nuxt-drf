<template>
  <div class="my-4 mx-2">
    <div>
      <div class="my-2">
        <v-btn color="primary" to="/posts/new">New Post</v-btn>
      </div>

      <v-text-field
        v-model="search"
        outlined
        placeholder="Search posts"
      ></v-text-field>
    </div>
    <div>
      <pagination
        :length="Math.ceil(count / 10)"
        :page-number="currentPage"
        @set-page="setPage"
      />
      <post-preview v-for="(post, i) in posts" :key="i" :post="post" />
      <pagination
        :length="Math.ceil(count / 10)"
        :page-number="currentPage"
        @set-page="setPage"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  async asyncData({ store, $axios, query }) {
    if (query !== {}) {
      store.commit('posts/SET_PARAMS', query)
    }
    await store.dispatch('posts/fetchData')
  },
  computed: {
    ...mapState('posts', ['posts', 'count', 'search']),
    currentPage: {
      get() {
        return this.$store.getters['posts/getCurrentPage']
      },
      set(v) {
        this.$store.dispatch('posts/setPage', v)
      },
    },
  },
  methods: {
    setPage(v) {
      this.$router.push({ query: { ...this.$router.query, page: v } })
      this.$store.dispatch('posts/setPage', v)
    },
  },
  middleware: 'authenticationMiddleware',
}
</script>

<style scoped></style>
