<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const route = useRoute()
const stem = route.params.slug as string

const { data: update } = await useAsyncData(`edit-${stem}`, () =>
  queryCollection('updates').path(`/updates/${stem}`).first()
)

if (!update.value) {
  throw createError({ statusCode: 404, statusMessage: 'Update not found' })
}

const activeTab = ref<'en' | 'es'>('en')

const form = reactive({
  title: update.value.title ?? '',
  title_es: update.value.title_es ?? '',
  date: update.value.date ?? '',
  slug: (update.value as Record<string, unknown>).slug as string ?? stem,
  content_en: (update.value as Record<string, unknown>).content_en as string ?? '',
  content_es: (update.value as Record<string, unknown>).content_es as string ?? '',
})

const savedSnapshot = ref(JSON.stringify({ ...form }))
const hasUnsavedChanges = computed(() => JSON.stringify({ ...form }) !== savedSnapshot.value)

// ── Translate ─────────────────────────────────────────────────────────────────
type TranslateState = 'idle' | 'loading' | 'done'
const translateState = ref<TranslateState>('idle')
const translateError = ref('')

async function translateToSpanish() {
  translateError.value = ''
  if (!form.content_en) return
  translateState.value = 'loading'
  try {
    const result = await $fetch<{ title_es: string; content_es: string }>('/api/translate', {
      method: 'POST',
      body: { title: form.title, content: form.content_en }
    })
    form.title_es = result.title_es
    form.content_es = result.content_es
    translateState.value = 'done'
    activeTab.value = 'es'
    setTimeout(() => { translateState.value = 'idle' }, 4000)
  } catch (e: unknown) {
    translateState.value = 'idle'
    translateError.value = e instanceof Error ? e.message : 'Translation failed.'
  }
}

// ── Save ──────────────────────────────────────────────────────────────────────
const saving = ref(false)
const lastSaved = ref<Date | null>(null)
const saveError = ref('')

async function save() {
  if (!form.title || !form.content_en) return
  saving.value = true
  saveError.value = ''
  try {
    await $fetch(`/api/updates/${stem}`, {
      method: 'PUT',
      body: { ...form }
    })
    savedSnapshot.value = JSON.stringify({ ...form })
    lastSaved.value = new Date()
  } catch (e: unknown) {
    saveError.value = e instanceof Error ? e.message : 'Save failed.'
  } finally {
    saving.value = false
  }
}

// ── Unsaved changes guard ─────────────────────────────────────────────────────
onBeforeRouteLeave(() => {
  if (hasUnsavedChanges.value) {
    return window.confirm('You have unsaved changes. Leave anyway?')
  }
})

const lastSavedLabel = computed(() => {
  if (!lastSaved.value) return ''
  return `Last saved at ${lastSaved.value.toLocaleTimeString()}`
})
</script>

<template>
  <main class="max-w-225 mx-auto px-8 py-10">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif text-2xl text-white">Edit update</h1>
        <p class="text-white/35 text-xs mt-1 font-mono">{{ stem }}</p>
      </div>
      <a
        :href="`/updates/${stem}`"
        target="_blank"
        rel="noopener"
        class="text-white/40 hover:text-white/70 text-xs no-underline transition-colors"
      >View live ↗</a>
    </div>

    <!-- Titles -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div>
        <label class="text-[0.72rem] uppercase tracking-[0.1em] text-white/40 block mb-2">Title (EN)</label>
        <input
          v-model="form.title"
          type="text"
          class="w-full bg-white/10 border border-white/20 text-white placeholder-white/25 px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
        />
      </div>
      <div>
        <label class="text-[0.72rem] uppercase tracking-[0.1em] text-white/40 block mb-2">Title (ES)</label>
        <input
          v-model="form.title_es"
          type="text"
          class="w-full bg-white/10 border border-white/20 text-white placeholder-white/25 px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
        />
      </div>
    </div>

    <!-- Slug (read-only) + Date -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div>
        <label class="text-[0.72rem] uppercase tracking-[0.1em] text-white/40 block mb-2">
          Slug <span class="normal-case text-white/25">(read-only — changing would break URLs)</span>
        </label>
        <input
          :value="form.slug"
          type="text"
          readonly
          class="w-full bg-white/5 border border-white/10 text-white/40 px-4 py-3 text-sm font-mono cursor-not-allowed"
        />
      </div>
      <div>
        <label class="text-[0.72rem] uppercase tracking-[0.1em] text-white/40 block mb-2">Date</label>
        <input
          v-model="form.date"
          type="date"
          class="w-full bg-white/10 border border-white/20 text-white px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
        />
      </div>
    </div>

    <!-- Editor tabs + translate -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-3">
        <div class="flex gap-0">
          <button
            v-for="tab in (['en', 'es'] as const)"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-5 py-2 text-xs font-semibold tracking-[0.1em] uppercase transition-colors cursor-pointer border-0',
              activeTab === tab ? 'bg-primary text-white' : 'bg-white/10 text-white/50 hover:text-white'
            ]"
            type="button"
          >{{ tab === 'en' ? 'English' : 'Español' }}</button>
        </div>

        <button
          @click="translateToSpanish"
          :disabled="translateState === 'loading'"
          :class="[
            'inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-[0.06em] uppercase transition-all cursor-pointer border-0',
            translateState === 'done'
              ? 'bg-green-600 text-white'
              : 'bg-accent text-ink hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed'
          ]"
          type="button"
        >
          <template v-if="translateState === 'idle'">
            <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M2 4h8M6 2v4M10 10.5c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm0 0H4m0 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/>
            </svg>
            Translate EN → ES
          </template>
          <template v-else-if="translateState === 'loading'">
            <svg class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Translating…
          </template>
          <template v-else>
            <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M2.5 8.5l4 4 7-8"/>
            </svg>
            Done
          </template>
        </button>
      </div>

      <p v-if="translateError" class="text-primary text-xs mb-2">{{ translateError }}</p>

      <ClientOnly>
        <EditorTiptapEditor v-show="activeTab === 'en'" v-model="form.content_en" lang="en" />
        <EditorTiptapEditor v-show="activeTab === 'es'" v-model="form.content_es" lang="es" />
      </ClientOnly>
    </div>

    <!-- Save bar -->
    <div class="flex items-center gap-4">
      <button
        @click="save"
        :disabled="saving || !form.title || !form.content_en"
        class="bg-accent text-ink px-8 py-3 font-semibold text-sm tracking-wide transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0"
        type="button"
      >{{ saving ? 'Saving…' : 'Save changes' }}</button>

      <span v-if="hasUnsavedChanges && !saving" class="text-white/35 text-xs">Unsaved changes</span>
      <span v-if="lastSavedLabel && !hasUnsavedChanges" class="text-accent/60 text-xs">{{ lastSavedLabel }}</span>
    </div>

    <p v-if="saveError" class="text-primary text-xs mt-3">{{ saveError }}</p>
  </main>
</template>
