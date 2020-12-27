<template>
  <div class="my-4">
    <div class="p-8 bg-gray-300 mx-4">
      <div class="text-2xl">{{ post.title }}</div>
      <div>{{ post.body }}</div>
      <div class="text-gray-700">{{ post.created_on | formatDate }}</div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({
    isDev,
    route,
    store,
    env,
    params,
    query,
    req,
    res,
    redirect,
    error,
    $axios,
  }) {
    const post = await $axios.$get(`/api/posts/${params.id}/`)

    return { post }
  },
}
</script>

<style scoped></style>
