export interface GitHubCfg {
  token: string
  repo: string
  branch: string
}

function ghHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
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
  const res = await $fetch<{ content: string; sha: string }>(ghUrl(cfg.repo, filePath), {
    headers: ghHeaders(cfg.token)
  })
  return { content: atob(res.content.replace(/\s/g, '')), sha: res.sha }
}

export async function createGithubFile(cfg: GitHubCfg, filePath: string, content: string, message: string): Promise<void> {
  const encoded = btoa(unescape(encodeURIComponent(content)))
  await $fetch(ghUrl(cfg.repo, filePath), {
    method: 'PUT',
    headers: ghHeaders(cfg.token),
    body: JSON.stringify({ message, content: encoded, branch: cfg.branch })
  })
}

export async function updateGithubFile(cfg: GitHubCfg, filePath: string, content: string, sha: string, message: string): Promise<void> {
  const encoded = btoa(unescape(encodeURIComponent(content)))
  await $fetch(ghUrl(cfg.repo, filePath), {
    method: 'PUT',
    headers: ghHeaders(cfg.token),
    body: JSON.stringify({ message, content: encoded, sha, branch: cfg.branch })
  })
}

export async function deleteGithubFile(cfg: GitHubCfg, filePath: string, sha: string, message: string): Promise<void> {
  await $fetch(ghUrl(cfg.repo, filePath), {
    method: 'DELETE',
    headers: ghHeaders(cfg.token),
    body: JSON.stringify({ message, sha, branch: cfg.branch })
  })
}
