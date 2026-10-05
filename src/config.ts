import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(8787),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/aibuilder"),
  AI_BASE_URL: z.string().default("https://api.openai.com/v1"),
  AI_API_KEY: z.string().default(""),
  AI_MODEL: z.string().default(""),
  GITHUB_TOKEN: z.string().default(""),
  VERCEL_TOKEN: z.string().default(""),
  ENCRYPTION_KEY: z.string().default(""),
  WORKSPACE_ROOT: z.string().default("./workspaces")
});

export const config = schema.parse(process.env);
