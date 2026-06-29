<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: false })

const { data: updates } = await useAsyncData('admin-updates', () =>
  queryCollection('updates')
    .order('date', 'DESC')
    .limit(5)
    .all()
)

function logout() {
  const cookie = useCookie('adminAuth')
  cookie.value = null
  navigateTo('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-ink text-white">
    <header class="border-b border-white/[0.08] px-8 py-5 flex items-center justify-between">
      <div class="font-serif text-accent uppercase tracking-[0.05em]">Save Venezuela Now — Admin</div>
      <button
        @click="logout"
        class="text-white/45 hover:text-white/80 text-sm transition-colors cursor-pointer"
      >
        Sign out
      </button>
    </header>

    <main class="max-w-[860px] mx-auto px-8 py-12">
      <div class="flex items-center justify-between mb-8">
        <h1 class="font-serif text-2xl text-white">Dashboard</h1>
        <NuxtLink
          to="/admin/publish"
          class="bg-primary text-white no-underline px-6 py-3 text-sm font-semibold tracking-wide hover:bg-primary-dark transition-colors"
        >
          + New Update
        </NuxtLink>
      </div>

      <section>
        <h2 class="text-[0.72rem] uppercase tracking-[0.1em] text-white/40 mb-4">Recent Updates</h2>
        <div v-if="updates && updates.length" class="flex flex-col gap-px bg-white/[0.06]">
          <div
            v-for="update in updates"
            :key="update.path"
            class="bg-ink px-6 py-4 flex items-center justify-between"
          >
            <div>
              <div class="text-white text-sm font-medium">{{ update.title }}</div>
              <div class="text-white/40 text-xs mt-1">{{ update.date }}</div>
            </div>
            <div class="flex gap-3 text-xs text-white/35">
              <span v-if="update.posted_to_x">✕</span>
              <span v-if="update.posted_to_facebook">f</span>
              <NuxtLink :to="`/updates/${update.path.split('/').pop()}`" class="text-accent no-underline hover:text-white transition-colors">View →</NuxtLink>
            </div>
          </div>
        </div>
        <p v-else class="text-white/40 text-sm">No updates published yet.</p>
      </section>
    </main>
  </div>
</template>
