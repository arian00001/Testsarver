import { config } from "../config.js";

export class VercelAdapter {
  async createProject(name: string, repo: string) {
    if (!config.VERCEL_TOKEN) throw new Error("VERCEL_TOKEN is not configured");

    const response = await fetch("https://api.vercel.com/v10/projects", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.VERCEL_TOKEN}`
      },
      body: JSON.stringify({
        name,
        gitRepository: {
          type: "github",
          repo
        }
      })
    });

    if (!response.ok) throw new Error(`Vercel project creation failed: ${await response.text()}`);
    return response.json();
  }
}
