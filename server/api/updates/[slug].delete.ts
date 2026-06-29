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

  const { sha } = await getGithubFile(cfg, filePath).catch((e: unknown) => {
    const status = (e as { status?: number; statusCode?: number }).status
      ?? (e as { status?: number; statusCode?: number }).statusCode
      ?? 0
    if (status === 401 || status === 403) {
      throw createError({ statusCode: 500, statusMessage: 'GitHub token lacks Contents: Read permission — update your fine-grained PAT' })
    }
    throw createError({ statusCode: 404, statusMessage: `File not found on GitHub: ${filePath}` })
  })

  await deleteGithubFile(cfg, filePath, sha, `Delete update: ${stem}`)

  return { success: true }
})
