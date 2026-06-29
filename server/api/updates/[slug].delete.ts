export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event)
  if (!cookies.adminAuth) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const stem = getRouterParam(event, 'slug')
  if (!stem) throw createError({ statusCode: 400, statusMessage: 'Missing slug' })

  const config = useRuntimeConfig(event)

  console.log('Delete requested for slug:', stem)
  console.log('Using repo:', config.githubRepo)
  console.log('Using branch:', config.githubBranch)
  console.log('Token present:', !!config.githubToken)
  console.log('Token prefix:', config.githubToken?.slice(0, 10))

  if (!config.githubToken || !config.githubRepo) {
    throw createError({ statusCode: 500, statusMessage: 'GitHub credentials not configured' })
  }

  const cfg = ghCfgFromRuntime(config)
  const filePath = `content/updates/${stem}.md`
  console.log('File path:', filePath)

  const { sha } = await getGithubFile(cfg, filePath)

  await deleteGithubFile(cfg, filePath, sha, `Delete update: ${stem}`)

  return { success: true }
})
