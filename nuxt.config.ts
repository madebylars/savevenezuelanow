import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: { compatibilityVersion: 4 },
  nitro: {
    preset: process.env.NODE_ENV === 'production' ? 'cloudflare-pages' : undefined
  },
  modules: ['@nuxt/content'],
  content: {
    database: process.env.NODE_ENV === 'production'
      ? { type: 'd1' as const, binding: 'DB' }
      : undefined
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  runtimeConfig: {
    adminPassword: '',
    githubToken: '',
    githubRepo: '',
    githubBranch: 'main',
    xApiKey: '',
    xApiSecret: '',
    xAccessToken: '',
    xAccessSecret: '',
    facebookPageAccessToken: '',
    facebookPageId: '',
    anthropicApiKey: '',
  },
  devtools: { enabled: true }
})
