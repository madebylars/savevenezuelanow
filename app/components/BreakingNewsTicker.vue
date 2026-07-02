<script setup lang="ts">
const route = useRoute()
const { lang } = useLang()

const isAdmin = computed(() => route.path.startsWith('/admin'))

const { data: latestUpdate } = await useAsyncData('latest-update', () =>
  queryCollection('updates')
    .where('published', '=', true)
    .order('date', 'DESC')
    .limit(1)
    .first()
)

const headline = computed(() => {
  if (!latestUpdate.value) return ''
  return lang.value === 'es'
    ? latestUpdate.value.title_es || latestUpdate.value.title
    : latestUpdate.value.title
})

const updateSlug = computed(() =>
  latestUpdate.value?.path?.split('/').pop()
    ?? latestUpdate.value?.slug
    ?? ''
)

const labelText = computed(() => lang.value === 'es' ? 'ÚLTIMA ACTUALIZACIÓN' : 'LATEST UPDATE')

const wrapperRef = ref<HTMLElement>()
const singleRef = ref<HTMLElement>()
const shouldScroll = ref(false)

onMounted(() => {
  if (singleRef.value && wrapperRef.value) {
    shouldScroll.value = singleRef.value.offsetWidth > wrapperRef.value.offsetWidth
  }
})
</script>

<template>
  <div v-if="!isAdmin && latestUpdate" class="ticker-bar" role="banner" aria-label="Latest update">
    <NuxtLink :to="`/updates/${updateSlug}`" class="ticker-inner">
      <div class="ticker-label">
        <span class="ticker-dot" aria-hidden="true" />
        <span class="ticker-label-text">{{ labelText }}</span>
      </div>
      <div class="ticker-divider" aria-hidden="true" />
      <div ref="wrapperRef" class="ticker-track-wrapper">
        <div :class="['ticker-track', shouldScroll ? 'ticker-scroll' : '']">
          <span ref="singleRef" class="ticker-headline">{{ headline }}</span>
          <span v-if="shouldScroll" class="ticker-sep" aria-hidden="true">&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;</span>
          <span v-if="shouldScroll" class="ticker-headline" aria-hidden="true">{{ headline }}</span>
          <span v-if="shouldScroll" class="ticker-sep" aria-hidden="true">&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;</span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.ticker-bar {
  background: #C8293A;
  height: 44px;
  width: 100%;
  overflow: hidden;
  flex-shrink: 0;
}

.ticker-inner {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1.5rem;
  text-decoration: none;
  color: inherit;
}

.ticker-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.ticker-dot {
  display: block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #D4A847;
  animation: dot-pulse 2s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.ticker-label-text {
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  color: #D4A847;
  white-space: nowrap;
}

.ticker-divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 1rem;
  flex-shrink: 0;
}

.ticker-track-wrapper {
  flex: 1;
  overflow: hidden;
  height: 100%;
  display: flex;
  align-items: center;
  min-width: 0;
}

.ticker-track {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.ticker-scroll {
  animation: ticker-scroll 30s linear infinite;
}

.ticker-inner:hover .ticker-scroll {
  animation-play-state: paused;
}

@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.ticker-headline {
  font-family: 'Libre Baskerville', Georgia, serif;
  font-size: 0.875rem;
  color: white;
}

.ticker-sep {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.4);
}

@media (max-width: 640px) {
  .ticker-scroll {
    animation: none;
  }

  span[aria-hidden="true"] {
    display: none;
  }

  .ticker-headline {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
}
</style>
