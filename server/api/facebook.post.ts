export default defineEventHandler(async (event) => {
  const { text } = await readBody<{ text: string }>(event)
  const { facebookPageAccessToken, facebookPageId } = useRuntimeConfig(event)

  if (!facebookPageAccessToken || !facebookPageId) {
    throw createError({ statusCode: 500, statusMessage: 'Facebook credentials not configured' })
  }

  let res: { id: string }
  try {
    res = await $fetch<{ id: string }>(
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
  } catch (error: unknown) {
    const e = error as { data?: { error?: { message?: string; code?: number; error_subcode?: number } }; status?: number; statusCode?: number }
    const fbError = e?.data?.error
    console.error('Facebook API error:', JSON.stringify(fbError ?? e))
    const msg = fbError?.message ?? 'Facebook API error'
    const hint = fbError?.code === 190 ? ' (token expired — generate a new Page Access Token)' : ''
    throw createError({ statusCode: e?.status ?? e?.statusCode ?? 500, statusMessage: msg + hint })
  }

  return {
    success: true,
    post_id: res.id,
    url: `https://www.facebook.com/${res.id}`
  }
})
