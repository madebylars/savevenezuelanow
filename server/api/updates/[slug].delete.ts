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

  const cfg = ghCfgFromRuntime(config)
  const filePath = `content/updates/${stem}.md`

  const { sha } = await getGithubFile(cfg, filePath).catch(() => {
    throw createError({ statusCode: 404, statusMessage: 'File not found on GitHub' })
  })

  await deleteGithubFile(cfg, filePath, sha, `Delete update: ${stem}`)

  return { success: true }
})
