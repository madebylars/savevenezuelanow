<script setup lang="ts">
defineProps<{
  title: string
  date: string
  slug: string
  excerpt?: string
}>()

const { t } = useLang()
</script>

<template>
  <NuxtLink
    :to="`/updates/${slug}`"
    class="block border border-warm-mid bg-white p-6 no-underline group transition-colors duration-150 hover:border-muted"
  >
    <div class="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">{{ date }}</div>
    <h3 class="font-serif text-[1.2rem] leading-[1.3] text-ink mb-3 group-hover:text-primary transition-colors duration-150">
      {{ title }}
    </h3>
    <p v-if="excerpt" class="text-[0.9rem] text-ink-light leading-[1.6] mb-4">{{ excerpt }}</p>
    <span class="text-[0.8rem] font-semibold text-primary tracking-wide">
      {{ t('Read update →', 'Leer actualización →') }}
    </span>
  </NuxtLink>
</template>
