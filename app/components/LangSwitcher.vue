<script setup lang="ts">
const { lang, setLang } = useLang()
</script>

<template>
  <div class="flex items-center gap-[0.25rem] bg-white/[0.07] p-[0.2rem]">
    <button
      v-for="l in (['en', 'es'] as const)"
      :key="l"
      @click="setLang(l)"
      :class="[
        'text-[0.72rem] font-semibold tracking-[0.08em] px-[0.65rem] py-[0.3rem] transition-all duration-150 cursor-pointer border-0',
        lang === l
          ? 'bg-primary text-white'
          : 'bg-transparent text-white/45 hover:text-white/80'
      ]"
    >
      {{ l.toUpperCase() }}
    </button>
  </div>
</template>
