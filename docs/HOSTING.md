# Hosting guide

## Recommended V1

Use a small Linux VPS for the engine.

1. Create a VPS with Ubuntu 24.04.
2. Install Docker and Git.
3. Upload/clone this project.
4. Copy `.env.example` to `.env`.
5. Set `AI_BASE_URL`, `AI_API_KEY`, and `AI_MODEL`.
6. Start with `docker compose up -d --build`.
7. Put Nginx or Caddy in front of port 8787.
8. Enable HTTPS.
9. Point `api.yourdomain.com` to the VPS.

## GitHub

Create a GitHub App or use a tightly scoped token. Store credentials only on the engine server.

The engine should create one private repository per generated project and commit generated files there.

## Vercel

Create a Vercel token with the minimum permissions required. Store it only on the engine server.

The engine can create a Vercel project and connect it to the generated GitHub repository. For production, use a GitHub App/Vercel integration with least-privilege credentials rather than a broad personal token.

## Important production upgrades

- PostgreSQL persistence instead of the V1 in-memory store
- Redis-backed job queue
- per-project isolated Docker sandboxes
- workspace quotas
- command allow/deny policy
- authentication and RBAC
- encrypted OAuth/token storage
- audit log
- rate limiting
- webhook-based GitHub/Vercel status updates
- Playwright browser QA
- artifact storage
- rollback and deployment history

Never run arbitrary generated code directly on the engine host.
