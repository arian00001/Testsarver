import Fastify from "fastify";
import { config } from "./config.js";
import { store } from "./store.js";
import { runWorkflow } from "./orchestrator.js";

const app = Fastify({ logger: true });

app.get("/health", async () => ({
  ok: true,
  service: "ai-builder-engine",
  version: "0.1.0"
}));

app.post("/api/projects", async (request, reply) => {
  const body = request.body as { name?: string; prompt?: string };
  if (!body?.name || !body?.prompt) {
    return reply.code(400).send({ error: "name and prompt are required" });
  }
  return store.createProject(body.name, body.prompt);
});

app.get("/api/projects/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const project = store.getProject(id);
  if (!project) return reply.code(404).send({ error: "Project not found" });
  return project;
});

app.post("/api/projects/:id/run", async (request, reply) => {
  const { id } = request.params as { id: string };
  const body = request.body as { prompt?: string };
  const project = store.getProject(id);

  if (!project) return reply.code(404).send({ error: "Project not found" });
  if (!body?.prompt) return reply.code(400).send({ error: "prompt is required" });

  try {
    return await runWorkflow(project, body.prompt);
  } catch (error) {
    store.updateProject(id, { status: "failed" });
    store.addEvent(id, {
      type: "workflow.failed",
      error: error instanceof Error ? error.message : String(error)
    });
    return reply.code(500).send({
      error: error instanceof Error ? error.message : "Workflow failed"
    });
  }
});

app.listen({ port: config.PORT, host: "0.0.0.0" })
  .then(() => app.log.info(`AI Builder Engine listening on ${config.PORT}`))
  .catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
