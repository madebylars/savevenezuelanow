export default defineEventHandler(async (event) => {
  const { title, content } = await readBody<{ title: string; content: string }>(event)
  const { anthropicApiKey } = useRuntimeConfig(event)

  if (!anthropicApiKey) throw createError({ statusCode: 500, statusMessage: 'ANTHROPIC_API_KEY not configured' })

  if (!title && !content) {
    throw createError({ statusCode: 400, statusMessage: 'Title or content required' })
  }

  const prompt = `You are a professional translator specialising in Venezuelan Spanish for humanitarian communications.

Translate the following from English to Venezuelan Spanish. Rules:
- Preserve ALL HTML tags exactly as they appear — do not modify, remove or add any tags
- Maintain the urgent, compassionate humanitarian tone of the original
- Use Venezuelan Spanish vocabulary and phrasing, not Castilian
- Translate only the visible text content, never the HTML attributes or tag names
- Return ONLY a JSON object with exactly these two fields: {"title_es": "...", "content_es": "..."}
- No markdown code blocks, no preamble, no explanation — just the raw JSON object

Title to translate: ${title}
Content to translate: ${content}`

  const res = await $fetch<{
    content: Array<{ type: string; text: string }>
  }>('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const raw = (res.content[0]?.text ?? '{}').trim()
  const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

  try {
    const parsed = JSON.parse(clean) as { title_es: string; content_es: string }
    return {
      title_es: parsed.title_es ?? '',
      content_es: parsed.content_es ?? ''
    }
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Failed to parse translation response' })
  }
})
