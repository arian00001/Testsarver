# Workflow contract

The intended workflow is:

UNDERSTAND
-> PLAN
-> ARCHITECTURE
-> DESIGN
-> IMPLEMENT
-> BUILD
-> TEST
-> INSPECT
-> FIX
-> REBUILD
-> VERIFY
-> PREVIEW
-> DEPLOY

The V1 orchestrator demonstrates the control-plane pattern and quality gates, but does not yet execute arbitrary generated code. The next implementation stage should connect each stage to isolated tools and a project workspace.

## Specialist roles

Roles are contexts, not separate AI providers:

- Product/Requirement Analyst
- Planner
- Technical Architect
- UI/UX Designer
- Design-System Engineer
- Frontend Engineer
- Backend Engineer
- Database Engineer
- Integration Engineer
- Build Engineer
- Test Engineer
- Browser QA
- Visual QA
- Security Reviewer
- Performance Reviewer
- Deployment Engineer

The same model can serve all roles through different system instructions, tools, and context.
