interface PublishBody {
  title: string
  title_es: string
  slug: string
  date: string
  content_en: string
  content_es: string
  x_text: string
  facebook_text: string
  targets: { website: boolean; x: boolean; facebook: boolean }
}

function buildMarkdown(body: PublishBody): string {
  return `---
title: ${JSON.stringify(body.title)}
title_es: ${JSON.stringify(body.title_es || body.title)}
date: "${body.date}"
slug: "${body.slug}"
published: true
posted_to_x: ${body.targets.x}
posted_to_facebook: ${body.targets.facebook}
content_en: ${JSON.stringify(body.content_en)}
content_es: ${JSON.stringify(body.content_es || '')}
---
`
}

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event)
  if (!cookies.adminAuth) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const config = useRuntimeConfig(event)
  const body = await readBody<PublishBody>(event)
  const { title, content_en, slug } = body

  if (!title || !content_en || !slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const cfg = ghCfgFromRuntime(config)
  const results: Record<string, unknown> = {}

  // 1. Write to GitHub → triggers Cloudflare Pages redeploy
  if (body.targets.website) {
    try {
      if (!config.githubToken || !config.githubRepo) throw new Error('GitHub credentials not configured')

      const filename = `${body.date}-${slug}.md`
      const filePath = `content/updates/${filename}`
      const markdown = buildMarkdown(body)

      let sha: string | undefined
      try {
        const existing = await getGithubFile(cfg, filePath)
        sha = existing.sha
      } catch { /* new file */ }

      if (sha) {
        await updateGithubFile(cfg, filePath, markdown, sha, `Update: ${filename}`)
      } else {
        await createGithubFile(cfg, filePath, markdown, `Add update: ${filename}`)
      }

      results.website = { success: true, file: filename }
    } catch (e) {
      results.website = { success: false, error: (e as Error).message }
    }
  }

  // 2. Post to X
  if (body.targets.x && body.x_text) {
    try {
      const xResult = await $fetch('/api/x', { method: 'POST', body: { text: body.x_text } })
      results.x = xResult
    } catch (e) {
      results.x = { success: false, error: (e as Error).message }
    }
  }

  // 3. Post to Facebook
  if (body.targets.facebook && body.facebook_text) {
    try {
      const fbResult = await $fetch('/api/facebook', { method: 'POST', body: { text: body.facebook_text } })
      results.facebook = fbResult
    } catch (e) {
      results.facebook = { success: false, error: (e as Error).message }
    }
  }

  return { success: true, results }
})
