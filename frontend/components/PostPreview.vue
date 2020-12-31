<template>
  <v-card :to="{ name: 'posts-id', params: { id: post.id } }" class="my-4">
    <v-card-title>
      {{ post.title }}
    </v-card-title>
    <v-card-text>
      {{ post.body }}
      <div class="text-gray-700">{{ post.created_on | formatDate }}</div>
    </v-card-text>
  </v-card>
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
