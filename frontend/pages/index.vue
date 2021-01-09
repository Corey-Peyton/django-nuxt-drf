<template>
  <div class="container">
    <div class="bg-gray-300">
      <div class="mx-auto text-center py-8 text-2xl">
        Django - NuxtJS Project
      </div>
      <div>
        <pre
          >{{ $store.getters['user/getAccountStatus'] }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;

  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
  /* text-align: center; */
}
</style>
