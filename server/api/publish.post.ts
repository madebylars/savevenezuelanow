import TurndownService from 'turndown'

interface PublishBody {
  title: string
  title_es: string
  slug: string
  date: string
  content_en: string
  content_es: string
  x_text: string
  facebook_text: string
  targets: { website: boolean; x: boolean; facebook: boolean }
}

function htmlToMarkdown(html: string): string {
  const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' })
  return td.turndown(html)
}

async function writeToGitHub(
  filename: string,
  markdownContent: string,
  token: string,
  repo: string,
  branch: string
): Promise<void> {
  const path = `content/updates/${filename}`
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`
  const encoded = btoa(unescape(encodeURIComponent(markdownContent)))

  // Check if file exists to get its SHA (needed for updates)
  let sha: string | undefined
  try {
    const existing = await $fetch<{ sha: string }>(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json'
      }
    })
    sha = existing.sha
  } catch {
    // File doesn't exist yet — fine
  }

  await $fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Add update: ${filename}`,
      content: encoded,
      branch,
      ...(sha ? { sha } : {})
    })
  })
}

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event)
  if (!cookies.adminAuth) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const config = useRuntimeConfig(event)
  const body = await readBody<PublishBody>(event)
  const { title, title_es, slug, date, content_en, content_es, x_text, facebook_text, targets } = body

  if (!title || !content_en || !slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const results: Record<string, unknown> = {}

  // 1. Write to GitHub → triggers Cloudflare Pages redeploy
  if (targets.website) {
    try {
      if (!config.githubToken || !config.githubRepo) throw new Error('GitHub credentials not configured')

      const en_md = htmlToMarkdown(content_en)
      const es_md = htmlToMarkdown(content_es || '')
      const markdown = `---
title: "${title.replace(/"/g, '\\"')}"
title_es: "${(title_es || title).replace(/"/g, '\\"')}"
date: "${date}"
slug: "${slug}"
published: true
posted_to_x: ${targets.x}
posted_to_facebook: ${targets.facebook}
---

${en_md}

<!-- ES -->

${es_md}
`
      const filename = `${date}-${slug}.md`
      await writeToGitHub(filename, markdown, config.githubToken, config.githubRepo, config.githubBranch)
      results.website = { success: true, file: filename }
    } catch (e) {
      results.website = { success: false, error: (e as Error).message }
    }
  }

  // 2. Post to X
  if (targets.x && x_text) {
    try {
      const xResult = await $fetch('/api/x', { method: 'POST', body: { text: x_text } })
      results.x = xResult
    } catch (e) {
      results.x = { success: false, error: (e as Error).message }
    }
  }

  // 3. Post to Facebook
  if (targets.facebook && facebook_text) {
    try {
      const fbResult = await $fetch('/api/facebook', { method: 'POST', body: { text: facebook_text } })
      results.facebook = fbResult
    } catch (e) {
      results.facebook = { success: false, error: (e as Error).message }
    }
  }

  return { success: true, results }
})
