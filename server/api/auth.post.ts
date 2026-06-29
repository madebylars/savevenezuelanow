export default defineEventHandler(async (event) => {
  const { password } = await readBody<{ password: string }>(event)
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || password !== adminPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return { success: true }
})
