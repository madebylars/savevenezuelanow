async function oauthSign(
  method: string,
  url: string,
  bodyParams: Record<string, string>,
  creds: { apiKey: string; apiSecret: string; accessToken: string; accessSecret: string }
): Promise<string> {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: creds.apiKey,
    oauth_nonce: crypto.randomUUID().replace(/-/g, ''),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: creds.accessToken,
    oauth_version: '1.0'
  }

  const allParams = { ...bodyParams, ...oauthParams }
  const enc = encodeURIComponent
  const sortedParams = Object.keys(allParams)
    .sort()
    .map(k => `${enc(k)}=${enc(allParams[k])}`)
    .join('&')

  const signingBase = `${method.toUpperCase()}&${enc(url)}&${enc(sortedParams)}`
  const signingKey = `${enc(creds.apiSecret)}&${enc(creds.accessSecret)}`

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(signingKey),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  )

  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingBase))
  const sigBase64 = btoa(String.fromCharCode(...new Uint8Array(sig)))

  const authParams = { ...oauthParams, oauth_signature: sigBase64 }
  return 'OAuth ' + Object.keys(authParams)
    .sort()
    .map(k => `${enc(k)}="${enc(authParams[k])}"`)
    .join(', ')
}

export default defineEventHandler(async (event) => {
  const { text } = await readBody<{ text: string }>(event)
  const { xApiKey, xApiSecret, xAccessToken, xAccessSecret } = useRuntimeConfig(event)

  const creds = {
    apiKey: xApiKey ?? '',
    apiSecret: xApiSecret ?? '',
    accessToken: xAccessToken ?? '',
    accessSecret: xAccessSecret ?? ''
  }

  if (!creds.apiKey) throw createError({ statusCode: 500, statusMessage: 'X credentials not configured' })

  const postText = text.includes('savevenezuelanow.com')
    ? text
    : `${text} 👉 savevenezuelanow.com`.substring(0, 280)

  const url = 'https://api.twitter.com/2/tweets'
  const authHeader = await oauthSign('POST', url, {}, creds)

  const res = await $fetch<{ data: { id: string; text: string } }>(url, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: postText })
  })

  return {
    success: true,
    tweet_id: res.data.id,
    url: `https://x.com/InfoSaveVen/status/${res.data.id}`
  }
})
