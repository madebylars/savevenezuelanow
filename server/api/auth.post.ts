export default defineEventHandler(async (event) => {
  const { password } = await readBody<{ password: string }>(event)
  const adminPassword = (useRuntimeConfig(event).adminPassword || process.env.ADMIN_PASSWORD || '').trim()
  const submitted = (password || '').trim()

  if (!adminPassword) {
    throw createError({ statusCode: 500, statusMessage: 'ADMIN_PASSWORD not configured' })
  }

  if (submitted !== adminPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return { success: true }
})
