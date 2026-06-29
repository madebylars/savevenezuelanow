<script setup lang="ts">
const route = useRoute()

function logout() {
  const cookie = useCookie('adminAuth')
  cookie.value = null
  navigateTo('/admin/login')
}

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <div class="min-h-screen bg-ink text-white">
    <header class="border-b border-white/[0.08] px-8 py-4 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <span class="font-serif text-accent text-sm tracking-[0.05em] uppercase">SaveVen Admin</span>
        <nav class="flex items-center gap-1">
          <NuxtLink
            to="/admin"
            :class="['px-3 py-1.5 text-xs tracking-wide no-underline transition-colors', isActive('/admin') ? 'text-white bg-white/10' : 'text-white/50 hover:text-white']"
          >Updates</NuxtLink>
          <NuxtLink
            to="/admin/publish"
            :class="['px-3 py-1.5 text-xs tracking-wide no-underline transition-colors', isActive('/admin/publish') ? 'text-white bg-white/10' : 'text-white/50 hover:text-white']"
          >+ New post</NuxtLink>
          <a
            href="/"
            target="_blank"
            rel="noopener"
            class="px-3 py-1.5 text-xs tracking-wide text-white/50 hover:text-white no-underline transition-colors"
          >View site ↗</a>
        </nav>
      </div>
      <button
        @click="logout"
        class="text-white/40 hover:text-white/80 text-xs tracking-wide transition-colors cursor-pointer border-0 bg-transparent"
      >Sign out</button>
    </header>
    <slot />
  </div>
</template>
