export default function ({ store, redirect }) {
  // https://nuxtjs.org/docs/2.x/directory-structure/middleware#named-middleware
  // If the user is not authenticated, redirect to login page
  if (!store.getters['auth/getAuthenticated']) {
    return redirect('/login')
  }
}
