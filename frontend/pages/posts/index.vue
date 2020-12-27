<template>
  <div>
    <div class="my-4">
      <post-preview v-for="(post, i) in posts.results" :key="i" :post="post" />
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const posts = await $axios.$get(`http://localhost:8000/api/posts/`)

    return { posts }
  },
}
</script>

<style scoped></style>
