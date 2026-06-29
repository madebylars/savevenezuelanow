export default defineNuxtRouteMiddleware(() => {
  const authCookie = useCookie('adminAuth')
  if (!authCookie.value) {
    return navigateTo('/admin/login')
  }
})
