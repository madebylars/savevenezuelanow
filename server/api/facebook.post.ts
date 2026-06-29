export default defineEventHandler(async (event) => {
  const { text } = await readBody<{ text: string }>(event)

  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
  const pageId = process.env.FACEBOOK_PAGE_ID

  if (!token || !pageId) {
    throw createError({ statusCode: 500, statusMessage: 'Facebook credentials not configured' })
  }

  const res = await $fetch<{ id: string }>(
    `https://graph.facebook.com/v21.0/${pageId}/feed`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        link: 'https://savevenezuelanow.com'
      }),
      query: { access_token: token }
    }
  )

  return {
    success: true,
    post_id: res.id,
    url: `https://www.facebook.com/${res.id}`
  }
})
