<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const activeTab = ref<'en' | 'es'>('en')

const form = reactive({
  title: '',
  title_es: '',
  slug: '',
  date: new Date().toISOString().split('T')[0],
  content_en: '',
  content_es: '',
  x_text: '',
  facebook_text: '',
  targets: {
    website: true,
    x: true,
    facebook: true
  }
})

watch(() => form.title, (val) => {
  form.slug = val
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 60)
})

// ── Translation ──────────────────────────────────────────────────────────────

type TranslateState = 'idle' | 'loading' | 'done'
const translateState = ref<TranslateState>('idle')
const translateError = ref('')
const translateValidationMsg = ref('')

async function translateToSpanish() {
  translateValidationMsg.value = ''
  translateError.value = ''

  if (!form.content_en) {
    translateValidationMsg.value = 'Write the English content first.'
    return
  }

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
    // Reset to idle after 4s so button is reusable
    setTimeout(() => { translateState.value = 'idle' }, 4000)
  } catch (e: unknown) {
    translateState.value = 'idle'
    translateError.value = e instanceof Error ? e.message : 'Translation failed. Check your ANTHROPIC_API_KEY.'
  }
}

// ── Publishing ───────────────────────────────────────────────────────────────

const publishing = ref(false)
const publishResult = ref<{ success: boolean; results?: Record<string, unknown>; error?: string } | null>(null)

async function publish() {
  if (!form.title || !form.content_en) return
  publishing.value = true
  publishResult.value = null
  try {
    const result = await $fetch<{ success: boolean; results: Record<string, unknown> }>('/api/publish', {
      method: 'POST',
      body: { ...form }
    })
    publishResult.value = result
  } catch (e: unknown) {
    publishResult.value = { success: false, error: e instanceof Error ? e.message : 'Publish failed.' }
  } finally {
    publishing.value = false
  }
}

</script>

<template>
  <main class="max-w-225 mx-auto px-8 py-10">
    <h1 class="font-serif text-2xl text-white mb-8">New update</h1>

      <!-- Titles -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="text-[0.72rem] uppercase tracking-[0.1em] text-white/40 block mb-2">Title (EN)</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="English title"
            class="w-full bg-white/10 border border-white/20 text-white placeholder-white/25 px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label class="text-[0.72rem] uppercase tracking-[0.1em] text-white/40 block mb-2">Title (ES)</label>
          <input
            v-model="form.title_es"
            type="text"
            placeholder="Spanish title"
            class="w-full bg-white/10 border border-white/20 text-white placeholder-white/25 px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      <!-- Slug + Date -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label class="text-[0.72rem] uppercase tracking-[0.1em] text-white/40 block mb-2">Slug</label>
          <input
            v-model="form.slug"
            type="text"
            class="w-full bg-white/10 border border-white/20 text-white/70 px-4 py-3 text-sm outline-none focus:border-accent transition-colors font-mono"
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

      <!-- Editor tabs + translate button -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-3">
          <!-- Language tabs -->
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
            >
              {{ tab === 'en' ? 'English' : 'Español' }}
            </button>
          </div>

          <!-- Translate button -->
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
            <!-- Idle -->
            <template v-if="translateState === 'idle'">
              <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M2 4h8M6 2v4M10 10.5c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm0 0H4m0 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/>
              </svg>
              Translate EN → ES
            </template>
            <!-- Loading -->
            <template v-else-if="translateState === 'loading'">
              <svg class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Translating…
            </template>
            <!-- Done -->
            <template v-else>
              <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M2.5 8.5l4 4 7-8"/>
              </svg>
              Done
            </template>
          </button>
        </div>

        <!-- Validation / error messages -->
        <p v-if="translateValidationMsg" class="text-accent text-xs mb-2">
          {{ translateValidationMsg }}
        </p>
        <p v-if="translateError" class="text-primary text-xs mb-2">
          {{ translateError }}
        </p>

        <!-- AI translation notice (shown after successful translation) -->
        <div
          v-if="form.content_es && translateState !== 'idle' || form.content_es && form.title_es"
          class="flex items-center gap-2 text-[0.72rem] text-white/40 mb-3"
        >
          <svg class="w-3 h-3 shrink-0 text-accent" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm.75 4a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.25 7h1.5v4.5h-1.5V7z"/>
          </svg>
          AI translation — please review before publishing
        </div>

        <!-- Editors (client-only — Tiptap requires browser) -->
        <ClientOnly>
          <EditorTiptapEditor
            v-show="activeTab === 'en'"
            v-model="form.content_en"
            lang="en"
          />
          <EditorTiptapEditor
            v-show="activeTab === 'es'"
            v-model="form.content_es"
            lang="es"
          />
        </ClientOnly>
      </div>

      <!-- Social text fields -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <label class="text-[0.72rem] uppercase tracking-[0.1em] text-white/40 block mb-2">X post text</label>
          <textarea
            v-model="form.x_text"
            rows="4"
            placeholder="Text for X post"
            class="w-full bg-white/10 border border-white/20 text-white placeholder-white/25 px-4 py-3 text-sm outline-none focus:border-accent transition-colors resize-none"
          />
        </div>
        <div>
          <label class="text-[0.72rem] uppercase tracking-[0.1em] text-white/40 block mb-2">Facebook post text</label>
          <textarea
            v-model="form.facebook_text"
            rows="4"
            placeholder="Text for Facebook post"
            class="w-full bg-white/10 border border-white/20 text-white placeholder-white/25 px-4 py-3 text-sm outline-none focus:border-accent transition-colors resize-none"
          />
        </div>
      </div>

      <!-- Targets -->
      <div class="mb-8">
        <div class="text-[0.72rem] uppercase tracking-[0.1em] text-white/40 mb-3">Publish to</div>
        <div class="flex flex-wrap gap-4">
          <label
            v-for="(label, key) in { website: 'Website', x: 'X (@InfoSaveVen)', facebook: 'Facebook (InfoSaveVen)' }"
            :key="key"
            class="flex items-center gap-2 cursor-pointer text-sm text-white/70 hover:text-white transition-colors"
          >
            <input
              type="checkbox"
              v-model="form.targets[key as keyof typeof form.targets]"
              class="accent-primary"
            />
            {{ label }}
          </label>
        </div>
      </div>

      <!-- Publish button -->
      <div class="flex items-center gap-4">
        <button
          @click="publish"
          :disabled="publishing || !form.title || !form.content_en"
          class="bg-primary text-white px-8 py-3 font-semibold tracking-wide transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          type="button"
        >
          {{ publishing ? 'Publishing…' : 'Publish Now' }}
        </button>
      </div>

      <!-- Result -->
      <div
        v-if="publishResult"
        class="mt-6 p-5 border"
        :class="publishResult.success ? 'border-accent/30 bg-accent/5' : 'border-primary/30 bg-primary/5'"
      >
        <div v-if="publishResult.success">
          <div class="text-accent font-semibold mb-2">Published successfully</div>
          <pre class="text-white/60 text-xs overflow-auto">{{ JSON.stringify(publishResult.results, null, 2) }}</pre>
        </div>
        <div v-else class="text-primary">{{ publishResult.error }}</div>
      </div>

  </main>
</template>
