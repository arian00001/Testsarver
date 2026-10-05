import { config } from "../config.js";
import type { AIRequest, AIResponse } from "../types.js";

export class AIGateway {
  async generate(request: AIRequest): Promise<AIResponse> {
    if (!config.AI_API_KEY || !config.AI_MODEL) {
      throw new Error("AI_API_KEY and AI_MODEL must be configured");
    }

    const response = await fetch(`${config.AI_BASE_URL.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: config.AI_MODEL,
        temperature: request.temperature ?? 0.2,
        response_format: request.json ? { type: "json_object" } : undefined,
        messages: [
          { role: "system", content: request.system },
          { role: "user", content: request.user }
        ]
      })
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`AI provider error ${response.status}: ${body}`);
    }

    const data = await response.json() as any;
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") throw new Error("AI provider returned no message content");

    return { content, raw: data };
  }
}
