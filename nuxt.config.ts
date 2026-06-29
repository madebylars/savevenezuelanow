import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: { compatibilityVersion: 4 },
  nitro: {
    preset: process.env.NODE_ENV === 'production' ? 'cloudflare-pages' : undefined
  },
  modules: ['@nuxt/content'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  runtimeConfig: {
    adminPassword: process.env.ADMIN_PASSWORD,
    githubToken: process.env.GITHUB_TOKEN,
    githubRepo: process.env.GITHUB_REPO,
    githubBranch: process.env.GITHUB_BRANCH ?? 'main',
    xApiKey: process.env.X_API_KEY,
    xApiSecret: process.env.X_API_SECRET,
    xAccessToken: process.env.X_ACCESS_TOKEN,
    xAccessSecret: process.env.X_ACCESS_SECRET,
    facebookPageAccessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    facebookPageId: process.env.FACEBOOK_PAGE_ID,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  },
  devtools: { enabled: true }
})
