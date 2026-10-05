export type WorkflowStage =
  | "UNDERSTAND"
  | "PLAN"
  | "ARCHITECTURE"
  | "DESIGN"
  | "IMPLEMENT"
  | "BUILD"
  | "TEST"
  | "INSPECT"
  | "FIX"
  | "REBUILD"
  | "VERIFY"
  | "PREVIEW"
  | "DEPLOY";

export type ProjectStatus = "idle" | "running" | "failed" | "ready";

export interface Project {
  id: string;
  name: string;
  prompt: string;
  status: ProjectStatus;
  plan: unknown[];
  architecture: Record<string, unknown>;
  designSystem: Record<string, unknown>;
  events: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface AIRequest {
  system: string;
  user: string;
  temperature?: number;
  json?: boolean;
}

export interface AIResponse {
  content: string;
  raw?: unknown;
}
