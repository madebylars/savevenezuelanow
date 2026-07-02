# CLAUDE.md — savevenezuelanow.com

## Project Overview

A bilingual (EN/ES) humanitarian fundraising and news site for Venezuela earthquake relief.
Built with Nuxt 4, Nuxt Content, and Tailwind 4, hosted on Cloudflare Pages.

The site serves two purposes:
1. **Public-facing** — awareness, donation CTA, live updates, diaspora outreach
2. **Admin** — password-protected publishing tool that posts to the website, X (@InfoSaveVen), and Facebook (InfoSaveVen) simultaneously

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Nuxt 4 |
| Content | Nuxt Content v3 (latest stable) |
| Styling | Tailwind CSS v4 |
| Editor | Tiptap v2 (WYSIWYG, Vue-native) |
| Hosting | Cloudflare Pages |
| Runtime | Cloudflare Workers (Nitro preset: `cloudflare-pages`) |
| Social APIs | X API v2 (write-only), Facebook Graph API v21 |
| Language | TypeScript throughout |

---

## Nuxt Config Requirements

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: { compatibilityVersion: 4 },
  nitro: {
    preset: 'cloudflare-pages'
  },
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss'
  ]
})
```

---

## Project Structure

```
savevenezuelanow/
├── app/
│   ├── components/
│   │   ├── TheHeader.vue
│   │   ├── TheFooter.vue
│   │   ├── HeroSection.vue
│   │   ├── StatsBar.vue
│   │   ├── UpdateCard.vue
│   │   ├── LangSwitcher.vue
│   │   └── editor/
│   │       └── TiptapEditor.vue
│   ├── pages/
│   │   ├── index.vue          # Public homepage
│   │   ├── updates/
│   │   │   ├── index.vue      # Updates listing
│   │   │   └── [slug].vue     # Individual update
│   │   └── admin/
│   │       ├── index.vue      # Admin dashboard (protected)
│   │       └── publish.vue    # Publish tool
│   ├── middleware/
│   │   └── admin.ts           # Password protection for /admin
│   └── composables/
│       └── useLang.ts         # EN/ES language switching
├── content/
│   └── updates/               # Markdown files for each update post
│       └── YYYY-MM-DD-slug.md
├── server/
│   └── api/
│       ├── publish.post.ts    # Handles simultaneous publish to X + Facebook + content
│       ├── x.post.ts          # X API v2 post endpoint
│       └── facebook.post.ts   # Facebook Graph API post endpoint
├── public/
├── .env                       # Secrets (never commit)
└── CLAUDE.md
```

---

## Content Schema

Each update post is a markdown file in `content/updates/` with this frontmatter:

```yaml
---
title: "Update title in English"
title_es: "Update title in Spanish"
date: "2026-06-29"
slug: "june-29-update"
published: true
posted_to_x: true
posted_to_facebook: true
---
```

Body content is bilingual markdown, separated by a `<!-- ES -->` divider:

```md
English content here.

<!-- ES -->

Contenido en español aquí.
```

---

## Admin Publishing Flow

The `/admin/publish` page contains:

1. **Tiptap WYSIWYG editor** — rich text, bilingual tabs (EN / ES)
2. **Publish targets** — checkboxes for Website, X, Facebook (all checked by default)
3. **Character counter** — live X character count (280 limit) with warning
4. **Preview** — shows how the post will appear on each platform
5. **Publish button** — calls `/api/publish` which fans out to all selected targets

### `/api/publish.post.ts` logic

```
1. Validate password (from Authorization header)
2. Write markdown file to content/updates/ via GitHub API
   → this triggers a Cloudflare Pages redeploy automatically
3. If X selected → POST to /api/x
4. If Facebook selected → POST to /api/facebook
5. Return {success: true, results: {website, x, facebook}}
```

---

## Social API Integration

### X API v2

- Endpoint: `POST https://api.twitter.com/2/tweets`
- Auth: OAuth 2.0 Bearer Token (app-only) stored in `.env` as `X_BEARER_TOKEN`
- Also store `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_SECRET`
- Cost: $0.015 per post (text only), $0.20 per post with URL
- Posts include the savevenezuelanow.com link + hashtags

### Facebook Graph API

- Endpoint: `POST https://graph.facebook.com/v21.0/{page-id}/feed`
- Auth: Page Access Token stored in `.env` as `FACEBOOK_PAGE_ACCESS_TOKEN`
- Page ID stored as `FACEBOOK_PAGE_ID`
- Free, no per-post cost

### Environment Variables

```bash
# .env — never commit this file
ADMIN_PASSWORD=           # Simple password for /admin route protection
GITHUB_TOKEN=             # Fine-grained PAT for writing content files
GITHUB_REPO=              # e.g. madebylars/savevenezuelanow
GITHUB_BRANCH=            # main
X_API_KEY=
X_API_SECRET=
X_ACCESS_TOKEN=
X_ACCESS_SECRET=
FACEBOOK_PAGE_ACCESS_TOKEN=
FACEBOOK_PAGE_ID=
```

---

## Bilingual (EN/ES) Strategy

- Language preference stored in a cookie (`lang=en|es`)
- `useLang()` composable provides `lang`, `setLang()`, `t(en, es)` helper
- All UI strings passed through `t()`: `t('Donate now', 'Donar ahora')`
- Content markdown uses `<!-- ES -->` divider — parsed and split at render time
- `LangSwitcher.vue` component in header updates cookie and reactively re-renders

---

## Design System

Match the existing savevenezuelanow.com aesthetic:

```
Background:  #1A1410 (dark ink) / #F7F3EE (paper)
Primary:     #C8293A (red)
Accent:      #D4A847 (gold)
Text:        #1A1410 / rgba(255,255,255,0.65)
Font:        Libre Baskerville (headings, serif) + Inter (body, sans)
```

- Dark hero sections on ink background
- Light content sections on paper background
- No rounded corners — sharp, editorial feel
- Minimal UI — urgency over decoration

---

## Cloudflare Pages Deployment

- Build command: `npx nuxi generate` (static) or `npx nuxt build` (SSR via Workers)
- Output directory: `.output/public`
- Node version: 20
- Environment variables set in Cloudflare Pages dashboard (not `.env`)

### Important: Cloudflare Workers runtime constraints
- No Node.js `fs` module — use GitHub API for file writes, not local filesystem
- No `child_process` — keep server routes edge-compatible
- Use `$fetch` (Nuxt's built-in) for all API calls in server routes
- Test with `wrangler dev` locally before deploying

---

## Tiptap Editor Setup

```bash
npm install @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-character-count
```

Key extensions to enable:
- `StarterKit` — bold, italic, headings, lists, blockquote
- `CharacterCount` — live count for X 280 char limit
- `Link` — for adding URLs in posts
- `Placeholder` — "Write your update here..."

The editor should have two tabs: **English** and **Español**, each with their own Tiptap instance. Content is merged on publish.

---

## Admin Security

Simple password protection is sufficient for this project:
- Middleware checks for `adminAuth` cookie
- `/admin` login page sets the cookie on correct password entry
- Password stored as `ADMIN_PASSWORD` env var
- No user accounts needed — single operator (Lars)

Do NOT use Supabase auth for this project — keep it dependency-light.

---

## Key Commands

```bash
# Install
npm install

# Dev server
npm run dev

# Build for Cloudflare
npm run build

# Preview with Wrangler
npx wrangler pages dev .output/public

# Deploy (via GitHub → Cloudflare Pages auto-deploy)
git push origin main
```

---

## Do Not

- Do not add Supabase — this project has no database
- Do not add authentication beyond the simple admin password
- Do not proxy X or Facebook calls through a separate backend service
- Do not use `localStorage` — use cookies for language and auth state
- Do not add unnecessary npm packages — keep the bundle lean
- Do not store secrets in the repository

---


---

## AI Translation (EN → ES)

The admin publish page includes a **"Translate to Spanish"** button that uses the Anthropic API to automatically translate the English content into Spanish.

### How it works

1. Editor writes English title + content in the EN tab
2. Clicks **"Translate to Spanish"** button
3. `/api/translate` is called with the EN title and HTML content
4. Claude translates both, preserving all HTML formatting and Tiptap structure
5. ES tab is populated automatically — editor can review and edit before publishing

### Environment Variable

```bash
ANTHROPIC_API_KEY=        # Anthropic API key for translation
```

### Translation Quality Notes

- Claude preserves HTML tags exactly — bold, italic, headings, links all survive translation
- Prompt instructs Claude to maintain the urgent, humanitarian tone of the original
- Venezuelan Spanish is specified in the prompt (not Castilian)
- Editor should always review the translation before publishing — AI is a starting point, not a rubber stamp

---


---

## Documented Pitfalls

### ❌ Do not use `process.env` in `nuxt.config.ts` runtimeConfig

**Wrong:**
```ts
runtimeConfig: {
  githubToken: process.env.GITHUB_TOKEN,
}
```

**Correct:**
```ts
runtimeConfig: {
  githubToken: '',
}
```

Nuxt 4 automatically maps `NUXT_`-prefixed environment variables to runtimeConfig keys at runtime. Setting `process.env` values directly in `nuxt.config.ts` breaks this on Cloudflare Workers where `process.env` is not available at build time.

All env vars must use the `NUXT_` prefix:
```bash
NUXT_GITHUB_TOKEN=github_pat_xxxxx
NUXT_ADMIN_PASSWORD=yourpassword
NUXT_ANTHROPIC_API_KEY=sk-ant-xxxxx
# etc.
```

Access in server routes always via:
```ts
const config = useRuntimeConfig()
const token = config.githubToken
```

Never via `process.env.GITHUB_TOKEN` directly in server routes.

### ❌ Do not use `<!-- ES -->` body divider for bilingual content

Nuxt Content v3 returns `body` as a parsed AST object, not a raw string. Splitting on `<!-- ES -->` does not work reliably.

**Correct approach:** Store bilingual content as HTML strings in frontmatter fields:
```yaml
---
content_en: "<p>English content</p>"
content_es: "<p>Contenido en español</p>"
---
```

Render with `v-html`:
```vue
<div v-html="lang === 'es' ? update.content_es : update.content_en" />
```

### ❌ Do not use `<ContentRenderer>` for bilingual updates

`<ContentRenderer :value="update" />` renders the entire raw body and ignores the language selection. Use `v-html` with the frontmatter `content_en` / `content_es` fields instead.


### ❌ Cloudflare Workers do not send a User-Agent header on outbound requests

GitHub's API (and many other APIs) require a `User-Agent` header and will return 403 if it is missing. Cloudflare Workers strip or omit the User-Agent on outbound `$fetch` calls — it must always be set explicitly.

Always include these headers on every GitHub API call:

```ts
const headers = {
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'savevenezuelanow/1.0'
}
```

This applies to any third party API called from a Cloudflare Worker — not just GitHub. When an outbound API call returns an unexpected 403, missing User-Agent is the first thing to check.

### ❌ Do not use `localStorage` anywhere

Cloudflare Workers do not support browser storage APIs. Use cookies for all persistent state (language preference, admin auth).

### ❌ Do not use Node.js `fs` module in server routes

Cloudflare Workers have no filesystem access. All file operations (reading, writing, deleting content files) must go through the GitHub API using the helpers in `server/utils/github.ts`.

---

## Out of Scope (for now)

- Comments or user-generated content
- Email newsletter
- Analytics beyond Cloudflare's built-in dashboard
- Multiple admin users
- Scheduled posts
