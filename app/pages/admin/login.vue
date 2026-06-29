<script setup lang="ts">
definePageMeta({ layout: false })

const password = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth', {
      method: 'POST',
      body: { password: password.value }
    })
    const cookie = useCookie('adminAuth', { maxAge: 60 * 60 * 8 })
    cookie.value = 'true'
    await navigateTo('/admin')
  } catch {
    error.value = 'Incorrect password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-ink flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="font-serif text-accent uppercase tracking-[0.05em] text-base mb-8 text-center">
        Save Venezuela Now
      </div>
      <h1 class="font-serif text-white text-2xl mb-8 text-center">Admin Access</h1>
      <form @submit.prevent="login" class="flex flex-col gap-4">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          autocomplete="current-password"
          class="bg-white/10 border border-white/20 text-white placeholder-white/35 px-4 py-3 text-base outline-none focus:border-accent transition-colors"
        />
        <p v-if="error" class="text-primary text-sm">{{ error }}</p>
        <button
          type="submit"
          :disabled="loading"
          class="bg-primary text-white px-6 py-3 font-semibold tracking-wide transition-colors hover:bg-primary-dark disabled:opacity-50 cursor-pointer"
        >
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>
