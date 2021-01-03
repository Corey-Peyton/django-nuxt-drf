<template>
  <div>
    <v-card class="pa-4 ma-4">
      <v-card-title class="px-1">New Post</v-card-title>
      <form>
        <div class="">
          <v-text-field
            v-model="title"
            label="Name"
            outlined
            required
          ></v-text-field>
          <v-textarea
            v-model="body"
            label="E-mail"
            outlined
            required
          ></v-textarea>
          <div>
            <v-btn color="success" class="mr-4" @click="submit"> submit </v-btn>
            <v-btn @click="clear"> clear </v-btn>
          </div>
        </div>
      </form>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      body: '',
    }
  },
  methods: {
    clear() {
      this.title = ''
      this.body = ''
    },
    submit() {
      const vm = this
      const { title, body } = this
      this.clear()
      this.$apiCall
        .$post('/api/posts/', {
          title,
          body,
        })
        .then((post) => {
          vm.$router.push(`/posts/${post.id}`)
        })
        .catch(() => {
          alert('there was an error')
        })
    },
  },
}
</script>

<style scoped></style>
