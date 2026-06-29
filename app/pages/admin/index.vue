<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { data: updatesData, refresh } = await useAsyncData('admin-updates', () =>
  queryCollection('updates').order('date', 'DESC').all()
)

const updates = ref(updatesData.value ?? [])
watch(updatesData, val => { updates.value = val ?? [] })

const loading = ref(false)
onMounted(async () => {
  loading.value = true
  await refresh()
  loading.value = false
})

// ── Delete modal ──────────────────────────────────────────────────────────────
const deleteTarget = ref<{ stem: string; title: string } | null>(null)
const deleting = ref(false)

function confirmDelete(stem: string, title: string) {
  deleteTarget.value = { stem, title }
}

function cancelDelete() {
  deleteTarget.value = null
}

async function executeDelete() {
  if (!deleteTarget.value) return
  const { stem } = deleteTarget.value
  deleting.value = true
  try {
    await $fetch(`/api/updates/${stem}`, { method: 'DELETE' })
    updates.value = updates.value.filter(u => u.path.split('/').pop() !== stem)
    deleteTarget.value = null
    showToast('Update deleted.')
  } catch (e: unknown) {
    showToast(e instanceof Error ? e.message : 'Delete failed.', 'error')
  } finally {
    deleting.value = false
  }
}

// ── Toast ─────────────────────────────────────────────────────────────────────
const toast = ref<{ message: string; type: 'success' | 'error' } | null>(null)

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 3500)
}
</script>

<template>
  <main class="max-w-225 mx-auto px-8 py-12">

    <div class="flex items-center justify-between mb-8">
      <h1 class="font-serif text-2xl text-white">Updates</h1>
      <NuxtLink
        to="/admin/publish"
        class="bg-primary text-white no-underline px-5 py-2.5 text-xs font-semibold tracking-wide hover:bg-primary-dark transition-colors"
      >+ New update</NuxtLink>
    </div>

    <div v-if="loading" class="text-white/40 text-sm py-4">Loading…</div>

    <div v-else-if="updates.length" class="flex flex-col gap-px bg-white/5">
      <div
        v-for="update in updates"
        :key="update.path"
        class="bg-ink px-5 py-4 flex items-center justify-between gap-4"
      >
        <div class="min-w-0">
          <div class="text-white text-sm font-medium truncate">{{ update.title }}</div>
          <div class="text-white/35 text-xs mt-0.5">{{ update.date }}</div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span
            class="text-[0.65rem] px-2 py-0.5 tracking-wide"
            :class="update.published ? 'bg-accent/15 text-accent' : 'bg-white/10 text-white/40'"
          >{{ update.published ? 'Published' : 'Draft' }}</span>

          <NuxtLink
            :to="`/admin/edit/${update.path.split('/').pop()}`"
            class="px-3 py-1.5 text-xs bg-accent text-ink font-semibold no-underline hover:brightness-110 transition-all"
          >Edit</NuxtLink>

          <button
            @click="confirmDelete(update.path.split('/').pop()!, update.title)"
            class="px-3 py-1.5 text-xs bg-primary/80 text-white font-semibold hover:bg-primary transition-colors cursor-pointer border-0"
            type="button"
          >Delete</button>
        </div>
      </div>
    </div>

    <p v-else class="text-white/40 text-sm py-4">No updates yet.</p>
  </main>

  <!-- Delete confirmation modal -->
  <Teleport to="body">
    <div
      v-if="deleteTarget"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      @click.self="cancelDelete"
    >
      <div class="bg-ink border border-white/10 p-8 max-w-md w-full">
        <h2 class="font-serif text-white text-xl mb-3">Delete update?</h2>
        <p class="text-white/55 text-sm mb-1">
          "<span class="text-white/80">{{ deleteTarget.title }}</span>"
        </p>
        <p class="text-white/40 text-sm mb-8">
          This cannot be undone. The file will be permanently removed from GitHub.
        </p>
        <div class="flex gap-3">
          <button
            @click="cancelDelete"
            class="flex-1 px-4 py-2.5 text-sm border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors cursor-pointer bg-transparent"
            type="button"
          >Cancel</button>
          <button
            @click="executeDelete"
            :disabled="deleting"
            class="flex-1 px-4 py-2.5 text-sm bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors cursor-pointer border-0"
            type="button"
          >{{ deleting ? 'Deleting…' : 'Delete' }}</button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Toast -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 translate-y-2"
      leave-active-class="transition-all duration-150"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="toast"
        class="fixed bottom-6 right-6 z-50 px-5 py-3 text-sm font-medium"
        :class="toast.type === 'error' ? 'bg-primary text-white' : 'bg-accent text-ink'"
      >{{ toast.message }}</div>
    </Transition>
  </Teleport>
</template>
