<template>
  <div class="my-4">
    <div v-if="error">
      <div class="text-red text-center">Unable to load posts</div>
    </div>
    <div v-else>
      <post-preview v-for="(post, i) in posts.results" :key="i" :post="post" />
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    let posts, error
    try {
      posts = await $axios.$get(`http://localhost/api/posts/`)
    } catch (err) {
      error = err
      // eslint-disable-next-line no-console
      console.log(err)
    }

    return { posts, error }
  },
}
</script>

<style scoped></style>
