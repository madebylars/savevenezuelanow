<script setup lang="ts">
const route = useRoute()
const { t, lang } = useLang()
const slug = route.params.slug as string

const { data: update } = await useAsyncData(`update-${slug}`, () =>
  queryCollection('updates')
    .path(`/updates/${slug}`)
    .first()
)

if (!update.value) {
  throw createError({ statusCode: 404, statusMessage: 'Update not found' })
}

useHead({
  title: `${lang.value === 'es' ? (update.value?.title_es || update.value?.title) : update.value?.title} — Save Venezuela Now`
})

const bodyEn = computed(() => {
  const body = update.value?.body
  if (!body) return ''
  const raw = typeof body === 'string' ? body : JSON.stringify(body)
  return raw.split('<!-- ES -->')[0].trim()
})

const bodyEs = computed(() => {
  const body = update.value?.body
  if (!body) return ''
  const raw = typeof body === 'string' ? body : JSON.stringify(body)
  const parts = raw.split('<!-- ES -->')
  return parts.length > 1 ? parts[1].trim() : parts[0].trim()
})
</script>

<template>
  <div class="min-h-screen bg-paper" v-if="update">
    <div class="max-w-[720px] mx-auto px-8 py-16">
      <NuxtLink
        to="/updates"
        class="text-[0.8rem] tracking-wide text-muted hover:text-primary no-underline transition-colors mb-8 block"
      >
        ← {{ t('Back to updates', 'Volver a noticias') }}
      </NuxtLink>

      <div class="text-[0.68rem] tracking-[0.14em] uppercase text-muted mb-3">{{ update.date }}</div>

      <h1 class="font-serif text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.2] text-ink mb-8">
        {{ lang === 'es' ? (update.title_es || update.title) : update.title }}
      </h1>

      <div class="prose-content text-[1.05rem] text-ink-light leading-[1.8]">
        <ContentRenderer :value="update" />
      </div>
    </div>
  </div>
</template>

<style>
.prose-content h2 { font-family: 'Libre Baskerville', serif; font-size: 1.5rem; line-height: 1.3; color: #1A1410; margin: 2rem 0 0.75rem; }
.prose-content h3 { font-family: 'Libre Baskerville', serif; font-size: 1.2rem; color: #1A1410; margin: 1.5rem 0 0.5rem; }
.prose-content p { margin-bottom: 1.2rem; }
.prose-content strong { font-weight: 600; color: #1A1410; }
.prose-content ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1.2rem; }
.prose-content ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1.2rem; }
.prose-content li { margin-bottom: 0.4rem; }
.prose-content blockquote { border-left: 3px solid #C8293A; padding: 0.5rem 1.5rem; margin: 1.5rem 0; font-style: italic; }
.prose-content a { color: #C8293A; text-decoration: underline; }
</style>
