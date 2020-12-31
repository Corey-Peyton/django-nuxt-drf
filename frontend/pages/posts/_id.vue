<template>
  <v-card class="my-4 mx-2">
    <v-card-title class="text-2xl">{{ post.title }}</v-card-title>
    <v-card-text>
      {{ post.body }}
      <div class="text-gray-700">{{ post.created_on | formatDate }}</div>
    </v-card-text>
  </v-card>
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
