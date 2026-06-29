export default defineEventHandler(async (event) => {
  const { text } = await readBody<{ text: string }>(event)
  const { facebookPageAccessToken, facebookPageId } = useRuntimeConfig(event)

  if (!facebookPageAccessToken || !facebookPageId) {
    throw createError({ statusCode: 500, statusMessage: 'Facebook credentials not configured' })
  }

  const res = await $fetch<{ id: string }>(
    `https://graph.facebook.com/v21.0/${facebookPageId}/feed`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        link: 'https://savevenezuelanow.com'
      }),
      query: { access_token: facebookPageAccessToken }
    }
  )

  return {
    success: true,
    post_id: res.id,
    url: `https://www.facebook.com/${res.id}`
  }
})
