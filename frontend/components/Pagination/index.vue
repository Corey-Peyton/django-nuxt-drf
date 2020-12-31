<template>
  <div class="text-center">
    <v-pagination
      v-model="page"
      :total-visible="10"
      :length="length"
    ></v-pagination>
  </div>
</template>

<script>
export default {
  props: {
    pageNumber: {
      type: Number,
      default: 1,
    },
    length: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    page: {
      get() {
        return this.pageNumber
      },
      set(v) {
        this.$emit('set-page', v)
      },
    },
  },
}
</script>

<style scoped></style>
