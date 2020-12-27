<template>
  <nuxt-link :to="`/posts/${post.id}`">
    <div class="p-8 bg-gray-300 mx-4">
      <div class="text-2xl">{{ post.title }}</div>
      <div>{{ post.body }}</div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style scoped></style>
