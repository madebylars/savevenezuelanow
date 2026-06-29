<script setup lang="ts">
const { t } = useLang()

const props = defineProps<{
  stats: Array<{ num: string; label: string }>
}>()
</script>

<template>
  <section class="bg-ink text-white flex flex-col">
    <!-- Hero body -->
    <div class="flex flex-col justify-center px-8 py-16 max-w-[860px] mx-auto w-full flex-1">
      <div class="text-[0.7rem] tracking-[0.15em] uppercase text-accent mb-6 flex items-center gap-3 before:block before:w-8 before:h-px before:bg-accent">
        {{ t('Emergency earthquake relief', 'Ayuda de emergencia por terremoto') }}
      </div>

      <h1 class="font-serif text-[clamp(2.6rem,7vw,5.2rem)] leading-[1.08] font-bold text-white mb-6">
        {{ t('A country ', 'Un país ') }}<em class="font-serif italic text-accent">{{ t('already broken', 'ya roto') }}</em>{{ t(' — now shattered.', ' — ahora devastado.') }}
      </h1>

      <p class="text-[clamp(1rem,2vw,1.2rem)] text-white/65 max-w-[560px] leading-[1.7] mb-10">
        {{ t(
          "On June 24, 2026, twin earthquakes struck Venezuela — a nation already facing one of the world's worst humanitarian crises. Hundreds are dead. Thousands are missing. Millions more are suffering. We're raising funds for Direct Relief's emergency response.",
          'El 24 de junio de 2026, dos terremotos sacudieron Venezuela — una nación que ya enfrentaba una de las peores crisis humanitarias del mundo. Cientos han muerto. Miles están desaparecidos. Millones más sufren. Recaudamos fondos para la respuesta de emergencia de Direct Relief.'
        ) }}
      </p>

      <a
        href="https://www.directrelief.org/emergency/venezuela-earthquakes-2026/"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-[0.6rem] bg-primary text-white no-underline px-8 py-4 text-[0.95rem] font-semibold tracking-[0.02em] transition-colors duration-200 hover:bg-primary-dark self-start"
      >
        {{ t('Donate to Direct Relief', 'Donar a Direct Relief') }}
        <svg class="w-4 h-4 transition-transform duration-200" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4"/>
        </svg>
      </a>
    </div>

    <!-- Stats bar -->
    <div class="border-t border-white/[0.08]">
      <div class="flex flex-col sm:flex-row">
        <div
          v-for="(stat, i) in props.stats"
          :key="i"
          class="flex-1 px-8 py-6 border-b border-white/[0.08] sm:border-b-0 sm:border-r sm:last:border-r-0"
        >
          <span class="font-serif text-[clamp(1.4rem,3vw,2rem)] font-bold text-accent block">{{ stat.num }}</span>
          <span class="text-[0.72rem] tracking-[0.06em] uppercase text-white/40 mt-1 block">{{ stat.label }}</span>
        </div>
      </div>
      <div class="px-8 py-3 bg-black/30 text-[0.7rem] tracking-[0.04em] text-white/30 text-center border-t border-white/[0.06]">
        {{ t(
          'Figures: ABC News / Venezuela National Assembly · Last updated June 28, 2026. Numbers are rising — official counts may be understated.',
          'Cifras: ABC News / Asamblea Nacional de Venezuela · Última actualización: 28 de junio de 2026. Los números siguen aumentando — las cifras oficiales pueden estar subestimadas.'
        ) }}
      </div>
    </div>
  </section>
</template>
