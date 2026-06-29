interface UpdateBody {
  title: string
  title_es: string
  date: string
  slug: string
  content_en: string
  content_es: string
}

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event)
  if (!cookies.adminAuth) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const stem = getRouterParam(event, 'slug')
  if (!stem) throw createError({ statusCode: 400, statusMessage: 'Missing slug' })

  const config = useRuntimeConfig(event)
  if (!config.githubToken || !config.githubRepo) {
    throw createError({ statusCode: 500, statusMessage: 'GitHub credentials not configured' })
  }

  const body = await readBody<UpdateBody>(event)
  if (!body.title || !body.content_en) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const cfg = ghCfgFromRuntime(config)
  const filePath = `content/updates/${stem}.md`

  const { sha } = await getGithubFile(cfg, filePath).catch((e: unknown) => {
    const status = (e as { status?: number; statusCode?: number }).status
      ?? (e as { status?: number; statusCode?: number }).statusCode
      ?? 0
    if (status === 401 || status === 403) {
      throw createError({ statusCode: 500, statusMessage: 'GitHub token lacks Contents: Read permission — update your fine-grained PAT' })
    }
    throw createError({ statusCode: 404, statusMessage: `File not found on GitHub: ${filePath}` })
  })

  const markdown = `---
title: ${JSON.stringify(body.title)}
title_es: ${JSON.stringify(body.title_es || body.title)}
date: "${body.date}"
slug: "${body.slug}"
published: true
posted_to_x: true
posted_to_facebook: true
content_en: ${JSON.stringify(body.content_en)}
content_es: ${JSON.stringify(body.content_es || '')}
---
`

  await updateGithubFile(cfg, filePath, markdown, sha, `Update: ${body.title} (${body.date})`)

  return { success: true }
})
