<script setup lang="ts">
const { t, lang } = useLang()

const { data: latestUpdate } = await useAsyncData('latest-update', () =>
  queryCollection('updates')
    .where('published', '=', true)
    .order('date', 'DESC')
    .limit(1)
    .first()
)

const latestExcerpt = computed(() => {
  const raw = lang.value === 'es'
    ? (latestUpdate.value as Record<string, unknown>)?.content_es as string
    : (latestUpdate.value as Record<string, unknown>)?.content_en as string
  return raw?.replace(/<[^>]*>/g, '').slice(0, 200) + '...' ?? ''
})

const latestTitle = computed(() => {
  if (!latestUpdate.value) return ''
  return lang.value === 'es'
    ? (latestUpdate.value as Record<string, unknown>).title_es as string || latestUpdate.value.title
    : latestUpdate.value.title
})

const latestSlug = computed(() =>
  latestUpdate.value?.path?.split('/').pop()
    ?? (latestUpdate.value as Record<string, unknown>)?.slug as string
    ?? ''
)

const latestDate = computed(() => {
  if (!latestUpdate.value?.date) return ''
  const d = new Date(latestUpdate.value.date + 'T12:00:00')
  return lang.value === 'es'
    ? d.toLocaleDateString('es', { month: 'long', day: 'numeric' })
    : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
})

useHead({
  title: 'Save Venezuela Now — Earthquake Relief',
  meta: [
    {
      name: 'description',
      content: "Two earthquakes struck Venezuela on June 24, 2026. Over 900 dead, thousands missing. A country already broken — now shattered. Help us support Direct Relief's emergency response."
    }
  ]
})

const contextCards = computed(() => [
  {
    num: '~23%',
    label: t('Population that has fled', 'Población que ha huido'),
    body: t(
      'Nearly one in four Venezuelans has left the country since 2014 — one of the largest mass exoduses in modern history.',
      'Casi uno de cada cuatro venezolanos ha abandonado el país desde 2014 — uno de los mayores éxodos masivos de la historia moderna.'
    )
  },
  {
    num: t('Hyperinflation', 'Hiperinflación'),
    label: t('Economic collapse', 'Colapso económico'),
    body: t(
      "Venezuela's oil-dependent economy imploded after 2014. Millions couldn't afford basic food or medicine long before the quake.",
      'La economía venezolana, dependiente del petróleo, implosionó después de 2014. Millones no podían permitirse alimentos básicos ni medicinas mucho antes del terremoto.'
    )
  },
  {
    num: t('Broken', 'Destruido'),
    label: t('Health system', 'Sistema de salud'),
    body: t(
      'Hospitals were already short of supplies, staff, and power. Frequent blackouts left emergency response stretched to its absolute limits.',
      'Los hospitales ya escaseaban de suministros, personal y energía. Los frecuentes apagones dejaron la respuesta de emergencia al límite absoluto.'
    )
  }
])

const stats = computed(() => [
  { num: '1,430+', label: t('Confirmed dead', 'Muertos confirmados') },
  { num: '3,200+', label: t('Injured', 'Heridos') },
  { num: '50,000+', label: t('Missing', 'Desaparecidos') },
  { num: 'Mw 7.5', label: t('Strongest since 1900', 'El más fuerte desde 1900') }
])

const diasporaCountries = computed(() => [
  { name: t('Colombia', 'Colombia'), num: '2.8M' },
  { name: t('Peru', 'Perú'), num: '1.5M' },
  { name: t('Ecuador', 'Ecuador'), num: '~500K' },
  { name: t('Chile', 'Chile'), num: '~450K' },
  { name: t('Brazil', 'Brasil'), num: '~400K' },
  { name: t('Worldwide', 'En todo el mundo'), num: '7.9M' }
])
</script>

<template>
  <!-- Hero -->
  <HeroSection :stats="stats" />

  <!-- What Happened -->
  <section class="py-20 px-8 bg-white">
    <div class="max-w-[860px] mx-auto">
      <div class="text-[0.68rem] tracking-[0.14em] uppercase text-muted mb-4 flex items-center gap-[0.6rem] before:block before:w-6 before:h-px before:bg-muted">
        {{ t('The earthquake', 'El terremoto') }}
      </div>
      <h2 class="font-serif text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.2] mb-6 text-ink">
        {{ t('Two strikes, 39 seconds apart.', 'Dos golpes, 39 segundos de diferencia.') }}
      </h2>
      <p class="text-[1.05rem] text-ink-light leading-[1.8] max-w-[680px] mb-5">
        {{ t(
          'At 6:04 PM local time on June 24, 2026, a magnitude 7.2 earthquake hit the Yumare–Morón area of Yaracuy state. Thirty-nine seconds later, a 7.5 mainshock followed — the strongest earthquake to strike Venezuela in over 125 years.',
          'A las 6:04 PM hora local del 24 de junio de 2026, un terremoto de magnitud 7.2 sacudió la zona de Yumare–Morón en el estado Yaracuy. Treinta y nueve segundos después, siguió un sismo principal de 7.5 — el más fuerte en sacudir Venezuela en más de 125 años.'
        ) }}
      </p>
      <p class="text-[1.05rem] text-ink-light leading-[1.8] max-w-[680px] mb-5">
        {{ t(
          'The tremors were felt across the entire country. Dozens of buildings collapsed in Caracas. The coastal state of La Guaira was devastated. Rescue crews, soldiers, and civilians armed with nothing but shovels are still digging through the rubble, racing against time.',
          'Los temblores se sintieron en todo el país. Decenas de edificios colapsaron en Caracas. El estado costero de La Guaira fue devastado. Equipos de rescate, soldados y civiles armados apenas con palas siguen excavando entre los escombros, contra el tiempo.'
        ) }}
      </p>

      <blockquote class="border-l-[3px] border-primary pl-6 py-4 my-8 bg-paper">
        <p class="font-serif italic text-[1.15rem] text-ink leading-[1.6]">
          {{ t(
            '"We are trying to find anything, to understand what happened — and to find even just a small piece."',
            '"Intentamos encontrar cualquier cosa, entender qué pasó — y encontrar aunque sea un pequeño pedazo."'
          ) }}
        </p>
        <cite class="block mt-2 text-[0.78rem] not-italic tracking-[0.05em] uppercase text-muted">
          {{ t(
            '— Simon Medina, searching for his mother and brother in La Guaira',
            '— Simon Medina, buscando a su madre y hermano en La Guaira'
          ) }}
        </cite>
      </blockquote>

      <p class="text-[1.05rem] text-ink-light leading-[1.8] max-w-[680px]">
        {{ t(
          "Venezuela's main international airport was closed after structural damage was found in the terminal roof. Schools shut. Hospitals — already short of equipment and staff — were overwhelmed with trauma patients. The death toll is expected to rise significantly.",
          'El principal aeropuerto internacional de Venezuela fue cerrado tras encontrarse daños estructurales en el techo de la terminal. Las escuelas cerraron. Los hospitales — ya escasos de equipos y personal — fueron desbordados por pacientes traumatizados. Se espera que el número de muertos aumente significativamente.'
        ) }}
      </p>
    </div>
  </section>

  <!-- Latest Update -->
  <section v-if="latestUpdate" class="py-16 px-8 bg-white">
    <div class="max-w-[860px] mx-auto">
      <div class="border-l-[3px] border-primary bg-paper px-8 py-7">
        <div class="flex items-baseline justify-between mb-5">
          <div class="text-[0.68rem] tracking-[0.14em] uppercase text-muted flex items-center gap-[0.6rem] before:block before:w-6 before:h-px before:bg-muted">
            {{ t('Latest update', 'Última actualización') }}
          </div>
          <span class="text-[0.78rem] text-muted">{{ latestDate }}</span>
        </div>
        <h2 class="font-serif text-[clamp(1.3rem,3vw,1.8rem)] leading-tight mb-3 text-ink">
          {{ latestTitle }}
        </h2>
        <p class="text-[0.95rem] text-ink-light leading-[1.75] mb-5 max-w-165">
          {{ latestExcerpt }}
        </p>
        <NuxtLink
          :to="`/updates/${latestSlug}`"
          class="inline-flex items-center gap-[0.4rem] text-primary text-[0.9rem] font-semibold no-underline hover:gap-[0.7rem] transition-all"
        >
          {{ t('Read full update', 'Leer actualización completa') }} →
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- Before the Earthquake -->
  <section class="py-20 px-8 bg-ink text-white">
    <div class="max-w-[860px] mx-auto">
      <div class="text-[0.68rem] tracking-[0.14em] uppercase text-white/30 mb-4 flex items-center gap-[0.6rem] before:block before:w-6 before:h-px before:bg-white/30">
        {{ t('Before the earthquake', 'Antes del terremoto') }}
      </div>
      <h2 class="font-serif text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.2] mb-2 text-white">
        {{ t('This disaster struck a country already on its knees.', 'Este desastre golpeó a un país ya de rodillas.') }}
      </h2>
      <p class="text-[1.05rem] text-white/60 max-w-[640px] leading-[1.8] mb-12">
        {{ t(
          "Venezuela has been in deep crisis for over a decade — political repression, economic collapse, and the collapse of public services. The earthquakes didn't create a catastrophe; they hit one that was already unfolding.",
          'Venezuela lleva más de una década en profunda crisis — represión política, colapso económico y el derrumbe de los servicios públicos. Los terremotos no crearon una catástrofe; golpearon una que ya se estaba desarrollando.'
        ) }}
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-3 border border-white/[0.08]">
        <div
          v-for="(card, i) in contextCards"
          :key="i"
          class="p-8 border-r border-b border-white/[0.08] sm:border-b-0 sm:last:border-r-0"
        >
          <div class="font-serif text-[2.2rem] font-bold text-accent leading-none mb-2">{{ card.num }}</div>
          <div class="text-[0.72rem] tracking-[0.1em] uppercase text-white/35 mb-3">{{ card.label }}</div>
          <p class="text-[0.9rem] text-white/60 leading-[1.6]">{{ card.body }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Diaspora -->
  <section class="py-20 px-8 bg-paper">
    <div class="max-w-[860px] mx-auto">
      <div class="text-[0.68rem] tracking-[0.14em] uppercase text-muted mb-4 flex items-center gap-[0.6rem] before:block before:w-6 before:h-px before:bg-muted">
        {{ t('The Venezuelan diaspora', 'La diáspora venezolana') }}
      </div>
      <h2 class="font-serif text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.2] mb-4 text-ink">
        {{ t('7.9 million have already left.', '7,9 millones ya se han ido.') }}
      </h2>
      <p class="text-[1.05rem] text-ink-light max-w-[660px] leading-[1.8] mb-10">
        {{ t(
          "Venezuela's displacement crisis is the largest in Latin America's history — and the second-largest in the world, surpassing Syria. Most fled years of violence, hunger, and political repression. Many are watching from abroad, desperate and helpless as their homeland faces this new catastrophe.",
          'La crisis de desplazamiento de Venezuela es la más grande en la historia de América Latina — y la segunda más grande del mundo, superando a Siria. La mayoría huyó de años de violencia, hambre y represión política. Muchos observan desde el exterior, desesperados e impotentes mientras su patria enfrenta esta nueva catástrofe.'
        ) }}
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-px bg-warm-mid border border-warm-mid mb-8">
        <div
          v-for="(country, i) in diasporaCountries"
          :key="i"
          class="bg-paper px-6 py-5"
        >
          <div class="text-[0.72rem] tracking-[0.08em] uppercase text-muted mb-1">{{ country.name }}</div>
          <div class="font-serif text-[1.5rem] font-bold text-primary">{{ country.num }}</div>
        </div>
      </div>

      <p class="text-[0.85rem] text-muted leading-[1.6] max-w-[600px]">
        {{ t(
          "If you're Venezuelan and your family is still in the country — or if you simply believe in helping people in crisis — this is a moment to act. 100% of donations through Direct Relief go directly to the earthquake response.",
          'Si eres venezolano y tu familia sigue en el país — o si simplemente crees en ayudar a las personas en crisis — este es el momento de actuar. El 100% de las donaciones a través de Direct Relief va directamente a la respuesta al terremoto.'
        ) }}
      </p>
    </div>
  </section>

  <!-- Donate CTA -->
  <section class="py-20 px-8 bg-primary text-white text-center">
    <div class="max-w-[860px] mx-auto">
      <h2 class="font-serif text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] mb-4">
        {{ t("Don't look away.", 'No apartes la mirada.') }}<br>
        <em class="italic">{{ t('Help now.', 'Ayuda ahora.') }}</em>
      </h2>
      <p class="text-[1rem] text-white/80 max-w-[520px] mx-auto mb-8 leading-[1.7]">
        {{ t(
          "Every donation goes directly to Direct Relief's emergency earthquake response in Venezuela. Medical supplies, surgical kits, first-responder equipment — getting where it's needed most.",
          'Cada donación va directamente a la respuesta de emergencia de Direct Relief en Venezuela. Suministros médicos, equipos quirúrgicos, material para primeros respondedores — llegando donde más se necesita.'
        ) }}
      </p>
      <a
        href="https://www.directrelief.org/emergency/venezuela-earthquakes-2026/"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-[0.6rem] bg-white text-primary no-underline px-10 py-[1.1rem] text-[1rem] font-bold tracking-[0.02em] transition-colors duration-200 hover:bg-ink hover:text-white"
      >
        {{ t('Donate via Direct Relief', 'Donar a través de Direct Relief') }}
      </a>
      <p class="mt-6 text-[0.78rem] text-white/55 tracking-[0.04em]">
        {{ t(
          '100% of your donation dedicated to Venezuela earthquake response · directrelief.org',
          'El 100% de tu donación dedicado a la respuesta al terremoto en Venezuela · directrelief.org'
        ) }}
      </p>
    </div>
  </section>

  <!-- About Direct Relief -->
  <section class="py-20 px-8 bg-white">
    <div class="max-w-[860px] mx-auto">
      <div class="text-[0.68rem] tracking-[0.14em] uppercase text-muted mb-4 flex items-center gap-[0.6rem] before:block before:w-6 before:h-px before:bg-muted">
        {{ t('About Direct Relief', 'Sobre Direct Relief') }}
      </div>
      <h2 class="font-serif text-[clamp(1.6rem,3.5vw,2.2rem)] leading-[1.25] mb-4 text-ink">
        {{ t("Why we're directing donations to Direct Relief.", 'Por qué dirigimos las donaciones a Direct Relief.') }}
      </h2>
      <p class="text-[1rem] text-ink-light leading-[1.8] max-w-[660px] mb-4">
        {{ t(
          "Direct Relief is already on the ground. They're coordinating with local and regional health providers, mobilising emergency medicine, surgical supplies, antibiotics, and field medic packs for first responders. They have an established history of earthquake response, including Haiti in 2010, Nepal in 2015, and Turkey–Syria in 2023.",
          'Direct Relief ya está sobre el terreno. Están coordinando con proveedores de salud locales y regionales, movilizando medicamentos de emergencia, suministros quirúrgicos, antibióticos y botiquines de campo para los primeros respondedores. Tienen una trayectoria establecida en respuesta a terremotos, incluyendo Haití en 2010, Nepal en 2015 y Turquía–Siria en 2023.'
        ) }}
      </p>
      <p class="text-[1rem] text-ink-light leading-[1.8] max-w-[660px]">
        {{ t(
          'Critically, 100% of donations designated for Venezuela will go directly to the earthquake response — not to overhead or administration. Direct Relief is a trusted, accredited humanitarian organisation with a long track record in South America and the Caribbean.',
          'De manera crucial, el 100% de las donaciones destinadas a Venezuela irán directamente a la respuesta al terremoto — no a gastos generales ni administración. Direct Relief es una organización humanitaria de confianza y acreditada con una larga trayectoria en América del Sur y el Caribe.'
        ) }}
      </p>
    </div>
  </section>
</template>
