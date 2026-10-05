import { AIGateway } from "./ai/gateway.js";
import { store } from "./store.js";
import type { Project, WorkflowStage } from "./types.js";

const ai = new AIGateway();

const stagePrompt: Record<WorkflowStage, string> = {
  UNDERSTAND: "Extract explicit requirements, constraints, unknowns and acceptance criteria. Never invent missing business facts.",
  PLAN: "Create a dependency-aware implementation plan with ordered tasks and quality gates.",
  ARCHITECTURE: "Design a maintainable architecture. Identify routes, components, services, APIs, data models and dependencies.",
  DESIGN: "Create a premium, consistent design system: typography, spacing, color roles, components, responsive behavior and motion rules.",
  IMPLEMENT: "Describe the minimal file-level implementation required by the plan. Preserve existing behavior and avoid unrelated changes.",
  BUILD: "Review build prerequisites, scripts and dependency consistency. Return deterministic build checks.",
  TEST: "Define functional and regression tests for the changed behavior.",
  INSPECT: "Act as a strict senior visual/functional QA reviewer. Reject weak, broken or unprofessional output.",
  FIX: "Identify root causes and produce a minimal corrective patch plan. Do not hide failures.",
  REBUILD: "Re-run affected build and test checks after fixes.",
  VERIFY: "Verify acceptance criteria, regressions, security-sensitive assumptions and deployment readiness.",
  PREVIEW: "Prepare preview/deployment metadata. Do not claim deployment happened unless an adapter confirms it.",
  DEPLOY: "Prepare deployment actions and report only confirmed results."
};

export async function runWorkflow(project: Project, prompt: string) {
  store.updateProject(project.id, { status: "running", prompt });

  const stages: WorkflowStage[] = [
    "UNDERSTAND", "PLAN", "ARCHITECTURE", "DESIGN",
    "IMPLEMENT", "BUILD", "TEST", "INSPECT",
    "VERIFY", "PREVIEW"
  ];

  let context = {
    prompt,
    architecture: project.architecture,
    designSystem: project.designSystem,
    previousEvents: project.events.slice(-20)
  };

  for (const stage of stages) {
    store.addEvent(project.id, { type: "stage.started", stage });

    const response = await ai.generate({
      system: [
        "You are one specialist inside a deterministic software-engineering orchestrator.",
        "Do not fabricate completed actions. Return structured JSON only.",
        stagePrompt[stage],
        "Keep outputs concise but technically actionable."
      ].join("\n"),
      user: JSON.stringify({ stage, context }),
      temperature: 0.1,
      json: true
    });

    let parsed: any;
    try {
      parsed = JSON.parse(response.content);
    } catch {
      parsed = { raw: response.content };
    }

    if (stage === "PLAN") store.updateProject(project.id, { plan: parsed.tasks ?? parsed.plan ?? [] });
    if (stage === "ARCHITECTURE") store.updateProject(project.id, { architecture: parsed });
    if (stage === "DESIGN") store.updateProject(project.id, { designSystem: parsed });

    store.addEvent(project.id, {
      type: "stage.completed",
      stage,
      result: parsed
    });

    context = {
      prompt,
      architecture: store.getProject(project.id)?.architecture ?? {},
      designSystem: store.getProject(project.id)?.designSystem ?? {},
      previousEvents: store.getProject(project.id)?.events.slice(-20) ?? []
    };
  }

  const final = store.updateProject(project.id, { status: "ready" });
  store.addEvent(project.id, { type: "workflow.completed" });
  return final;
}
