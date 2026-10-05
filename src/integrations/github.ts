import { config } from "../config.js";

export class GitHubAdapter {
  private headers() {
    if (!config.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN is not configured");
    return {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${config.GITHUB_TOKEN}`,
      "x-github-api-version": "2022-11-28"
    };
  }

  async createPrivateRepository(owner: string, name: string) {
    const response = await fetch(`https://api.github.com/orgs/${owner}/repos`, {
      method: "POST",
      headers: { ...this.headers(), "content-type": "application/json" },
      body: JSON.stringify({ name, private: true, auto_init: true })
    });

    if (response.status === 404) {
      const fallback = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: { ...this.headers(), "content-type": "application/json" },
        body: JSON.stringify({ name, private: true, auto_init: true })
      });
      if (!fallback.ok) throw new Error(`GitHub repository creation failed: ${await fallback.text()}`);
      return fallback.json();
    }

    if (!response.ok) throw new Error(`GitHub repository creation failed: ${await response.text()}`);
    return response.json();
  }
}
