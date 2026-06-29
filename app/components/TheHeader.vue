<script setup lang="ts">
const { t } = useLang()
</script>

<template>
  <header class="bg-ink border-b border-white/[0.08]">
    <nav class="flex items-center justify-between px-8 py-6">
      <div class="flex items-center gap-8">
        <NuxtLink
          to="/"
          class="font-serif text-accent uppercase tracking-[0.05em] text-base no-underline"
        >
          Save Venezuela Now
        </NuxtLink>
        <NuxtLink
          to="/updates"
          class="text-white/55 hover:text-white/90 text-sm tracking-wide transition-colors duration-150 no-underline"
        >
          {{ t('Latest Updates', 'Últimas Noticias') }}
        </NuxtLink>
      </div>
      <LangSwitcher />
    </nav>
  </header>
</template>
