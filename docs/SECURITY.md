# Security baseline

Generated code is untrusted code.

Never execute generated shell commands directly on the engine host.

Use isolated containers/VMs with:
- no host filesystem access
- restricted network egress
- CPU/memory/time limits
- non-root user
- ephemeral workspace
- process limits
- command allowlists where possible

Secrets:
- never send GitHub/Vercel credentials to the LLM
- never write secrets into generated repositories
- encrypt credentials at rest
- redact secrets from logs
- use least-privilege tokens
