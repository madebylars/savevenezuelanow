export interface GitHubCfg {
  token: string
  repo: string
  branch: string
}

function ghBaseHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'savevenezuelanow/1.0'
  }
}

function ghReadHeaders(token: string) {
  return ghBaseHeaders(token)
}

function ghWriteHeaders(token: string) {
  return {
    ...ghBaseHeaders(token),
    'Content-Type': 'application/json'
  }
}

function ghUrl(repo: string, filePath: string) {
  return `https://api.github.com/repos/${repo}/contents/${filePath}`
}

export function ghCfgFromRuntime(config: { githubToken: string; githubRepo: string; githubBranch: string }): GitHubCfg {
  return { token: config.githubToken, repo: config.githubRepo, branch: config.githubBranch }
}

export async function getGithubFile(cfg: GitHubCfg, filePath: string): Promise<{ content: string; sha: string }> {
  try {
    const res = await $fetch<{ content: string; sha: string }>(ghUrl(cfg.repo, filePath), {
      headers: ghReadHeaders(cfg.token)
    })
    return { content: atob(res.content.replace(/\s/g, '')), sha: res.sha }
  } catch (error: unknown) {
    const e = error as { data?: unknown; message?: string; status?: number; statusCode?: number }
    console.error('GitHub getGithubFile error:', JSON.stringify(e?.data ?? e?.message ?? error))
    throw createError({
      statusCode: e?.status ?? e?.statusCode ?? 500,
      statusMessage: JSON.stringify(e?.data ?? e?.message ?? 'GitHub API error')
    })
  }
}

export async function createGithubFile(cfg: GitHubCfg, filePath: string, content: string, message: string): Promise<void> {
  const encoded = btoa(unescape(encodeURIComponent(content)))
  try {
    await $fetch(ghUrl(cfg.repo, filePath), {
      method: 'PUT',
      headers: ghWriteHeaders(cfg.token),
      body: JSON.stringify({ message, content: encoded, branch: cfg.branch })
    })
  } catch (error: unknown) {
    const e = error as { data?: unknown; message?: string; status?: number; statusCode?: number }
    console.error('GitHub createGithubFile error:', JSON.stringify(e?.data ?? e?.message ?? error))
    throw createError({
      statusCode: e?.status ?? e?.statusCode ?? 500,
      statusMessage: JSON.stringify(e?.data ?? e?.message ?? 'GitHub API error')
    })
  }
}

export async function updateGithubFile(cfg: GitHubCfg, filePath: string, content: string, sha: string, message: string): Promise<void> {
  const encoded = btoa(unescape(encodeURIComponent(content)))
  try {
    await $fetch(ghUrl(cfg.repo, filePath), {
      method: 'PUT',
      headers: ghWriteHeaders(cfg.token),
      body: JSON.stringify({ message, content: encoded, sha, branch: cfg.branch })
    })
  } catch (error: unknown) {
    const e = error as { data?: unknown; message?: string; status?: number; statusCode?: number }
    console.error('GitHub updateGithubFile error:', JSON.stringify(e?.data ?? e?.message ?? error))
    throw createError({
      statusCode: e?.status ?? e?.statusCode ?? 500,
      statusMessage: JSON.stringify(e?.data ?? e?.message ?? 'GitHub API error')
    })
  }
}

export async function deleteGithubFile(cfg: GitHubCfg, filePath: string, sha: string, message: string): Promise<void> {
  try {
    await $fetch(ghUrl(cfg.repo, filePath), {
      method: 'DELETE',
      headers: ghWriteHeaders(cfg.token),
      body: JSON.stringify({ message, sha, branch: cfg.branch })
    })
  } catch (error: unknown) {
    const e = error as { data?: unknown; message?: string; status?: number; statusCode?: number }
    console.error('GitHub deleteGithubFile error:', JSON.stringify(e?.data ?? e?.message ?? error))
    throw createError({
      statusCode: e?.status ?? e?.statusCode ?? 500,
      statusMessage: JSON.stringify(e?.data ?? e?.message ?? 'GitHub API error')
    })
  }
}
