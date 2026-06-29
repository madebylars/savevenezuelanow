<script setup lang="ts">
const { t, lang } = useLang()

useHead({ title: t('Latest Updates — Save Venezuela Now', 'Últimas Noticias — Save Venezuela Now') })

const { data: updates } = await useAsyncData('updates', () =>
  queryCollection('updates')
    .where('published', '=', true)
    .order('date', 'DESC')
    .all()
)
</script>

<template>
  <div class="min-h-screen bg-paper">
    <div class="max-w-[860px] mx-auto px-8 py-16">
      <div class="text-[0.68rem] tracking-[0.14em] uppercase text-muted mb-4 flex items-center gap-[0.6rem] before:block before:w-6 before:h-px before:bg-muted">
        {{ t('News & Updates', 'Noticias y Actualizaciones') }}
      </div>
      <h1 class="font-serif text-[clamp(2rem,5vw,3rem)] leading-[1.15] text-ink mb-12">
        {{ t('Latest Updates', 'Últimas Noticias') }}
      </h1>

      <div v-if="updates && updates.length" class="flex flex-col gap-4">
        <UpdateCard
          v-for="update in updates"
          :key="update.path"
          :title="lang === 'es' ? (update.title_es || update.title) : update.title"
          :date="update.date"
          :slug="update.path.split('/').pop() || ''"
        />
      </div>

      <p v-else class="text-ink-light">
        {{ t('No updates yet.', 'Sin actualizaciones por ahora.') }}
      </p>
    </div>
  </div>
</template>
