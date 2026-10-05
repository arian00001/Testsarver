# AI Builder Engine V1

A production-oriented starter control plane for an AI software builder.

## Architecture

User/UI -> API -> Orchestrator -> AI Gateway -> specialized roles
                                      -> Project State
                                      -> Build/Test hooks
                                      -> GitHub adapter
                                      -> Vercel adapter

This V1 intentionally keeps provider credentials and deployment actions behind adapters.
It is not a Base44 clone and it does not pretend to be a finished autonomous platform.

## Requirements

- Node.js 20+
- npm 10+
- PostgreSQL 15+ (or Docker)
- Docker (recommended for sandbox execution)
- One OpenAI-compatible AI API key
- GitHub App/OAuth credentials when Git integration is enabled
- Vercel token when Vercel deployment is enabled

## Install

```bash
cp .env.example .env
npm install
npm run dev
```

API: http://localhost:8787

Health:
http://localhost:8787/health

Create a project:

```bash
curl -X POST http://localhost:8787/api/projects \
  -H "content-type: application/json" \
  -d '{"name":"demo","prompt":"Build a premium SaaS dashboard"}'
```

Run the AI workflow:

```bash
curl -X POST http://localhost:8787/api/projects/PROJECT_ID/run \
  -H "content-type: application/json" \
  -d '{"prompt":"Make the dashboard premium, responsive and production-ready."}'
```

## Important

Do not put AI, GitHub, Vercel, database, or encryption secrets in generated frontend code.
Keep them only in the engine server environment.

## Deployment recommendation

For V1, host this engine on a small VPS with Docker. Keep generated source in private GitHub repositories and deploy generated frontend projects to Vercel.

Recommended production topology:

Engine VPS
  -> PostgreSQL
  -> Redis later
  -> Docker sandbox
  -> GitHub API
  -> Vercel API

Your builder frontend can be deployed separately to Vercel.

## Roadmap

V1 core: orchestration + state + AI gateway + adapters.
Next: real repository workspace, isolated build sandbox, Playwright visual QA, incremental patching, queue/worker system, auth, encrypted credential storage, rate limits, and deployment verification.
