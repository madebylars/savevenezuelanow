<script setup lang="ts">
const { t } = useLang()
</script>

<template>
  <footer class="bg-ink text-white/35 py-8 px-8 text-center text-[0.8rem] leading-[1.7]">
    <div class="flex justify-center gap-6 mb-5 pb-5 border-b border-white/[0.08]">
      <a
        href="https://x.com/InfoSaveVen"
        target="_blank"
        rel="noopener"
        class="text-white/55 hover:text-accent no-underline text-[0.82rem] transition-colors duration-150"
      >
        <svg class="inline-block w-4 h-4 mr-1 align-middle" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        @InfoSaveVen
      </a>
      <a
        href="https://www.facebook.com/InfoSaveVen"
        target="_blank"
        rel="noopener"
        class="text-white/55 hover:text-accent no-underline text-[0.82rem] transition-colors duration-150"
      >
        <svg class="inline-block w-4 h-4 mr-1 align-middle" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        InfoSaveVen
      </a>
    </div>
    <p
      v-html="t(
        'savevenezuelanow.com &mdash; an independent fundraising initiative in support of <a href=\'https://www.directrelief.org/emergency/venezuela-earthquakes-2026/\' target=\'_blank\' rel=\'noopener\' class=\'text-white/55 hover:text-accent no-underline transition-colors\'>Direct Relief\'s Venezuela Earthquake Response</a>.',
        'savevenezuelanow.com &mdash; una iniciativa independiente de recaudación de fondos en apoyo a <a href=\'https://www.directrelief.org/emergency/venezuela-earthquakes-2026/\' target=\'_blank\' rel=\'noopener\' class=\'text-white/55 hover:text-accent no-underline transition-colors\'>la Respuesta al Terremoto en Venezuela de Direct Relief</a>.'
      )"
    />
    <p class="mt-2">
      {{ t(
        'This site does not collect donations directly. All donations are processed securely by Direct Relief.',
        'Este sitio no recauda donaciones directamente. Todas las donaciones son procesadas de forma segura por Direct Relief.'
      ) }}
    </p>
    <p class="mt-4 pt-4 border-t border-white/[0.08]"
      v-html="t(
        'Built as a goodwill act by <a href=\'https://madebylars.com\' target=\'_blank\' rel=\'noopener\' class=\'text-white/55 hover:text-accent no-underline transition-colors\'>MadeByLars</a> &mdash; because some things matter more than business.',
        'Creado como un acto de buena voluntad por <a href=\'https://madebylars.com\' target=\'_blank\' rel=\'noopener\' class=\'text-white/55 hover:text-accent no-underline transition-colors\'>MadeByLars</a> &mdash; porque algunas cosas importan más que los negocios.'
      )"
    />
  </footer>
</template>
