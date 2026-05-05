# AGENTS.md

## Project Context

This repository contains the HRM AI-first platform.

Primary governance documents:
- `AGENTS.md`
- `ARCHITECTURE.md`
- `ROADMAP.md`
- `TASKS.md`
- `DECISIONS.md`

Supporting historical analysis input:
- `/docs/analysis/Manifesto_e_Intenzioni_HRM_AI_First`
- `/docs/analysis/MacroAnalyse_HRMUpdated`
- `/docs/analysis/Entities_With_Types_v11`
- `/docs/analysis/HRM_Jmix_UI_Interfaces`

Agents may consult `docs/analysis` for historical context and background analysis.

`docs/analysis` must not override:
- explicit human instructions
- already implemented code
- `ARCHITECTURE.md`
- `TASKS.md`
- `ROADMAP.md`
- `DECISIONS.md`
- `backend/AGENTS.md`
- `frontend/AGENTS.md`

---

## Project Objective

The goal is to build a secure, maintainable and scalable HRM web platform using an AI-first execution model.

AI agents act as implementation accelerators, but human governance remains the final authority.

---

## MVP Scope

Implement ONLY:

- Employee management
- Basic authentication (JWT)
- Users, roles and permissions
- Device management
- Payroll document upload and consultation
- Leave requests
- Holiday calendar
- Email notifications
- Audit logging
- Dockerized deployment baseline

---

## Explicitly Out of MVP Scope

Do NOT implement unless explicitly requested:

- Keycloak
- S3 / MinIO
- Mobile app
- Advanced dashboards
- ERP/payroll integrations
- Complex workflows
- Advanced AI automations
- Enterprise multitenancy
- Alternative authentication providers
- UI redesign outside approved template

---

## Governance Hierarchy

Agents must follow this order of authority:

1. Human instruction
2. `DECISIONS.md`
3. `ARCHITECTURE.md`
4. `TASKS.md`
5. `ROADMAP.md`
6. Root `AGENTS.md`
7. `backend/AGENTS.md`
8. `frontend/AGENTS.md`
9. Existing implemented code
10. `docs/analysis`

---

## Architecture Governance

Agents must:
- Follow Architecture.md strictly
- Never invent alternative architectures
- Never create parallel structures
- Never silently refactor foundational systems
- Never introduce new frameworks unless approved
- Update documentation before structural changes

---

## Documentation Governance

Before implementing major changes:
1. Update Architecture.md if structure changes
2. Update roadmap.md if roadmap changes
3. Update relevant AGENTS.md if operational rules change
4. Then implement code

---

## Working Methodology

- Work in small tasks
- Validate continuously
- Reuse before creating
- Respect MVP

---

## Git Workflow

1 task = 1 branch = 1 PR

---

## QA Agent

Il QA Agent è responsabile della validazione finale dei task.

Responsabilità:
- verificare implementazione rispetto a TASKS.md
- identificare bug e regressioni
- controllare coerenza con ARCHITECTURE.md e DECISIONS.md
- verificare aggiornamento documentazione

Regole:
- non modifica codice automaticamente
- produce report strutturato
- classifica problemi in BLOCKER / MAJOR / MINOR / NOTE
- propone fix ma non li applica senza richiesta

Output:
- aggiornamento `docs/qa/QA-REPORTS.md`
- esito: PASS / PASS WITH NOTES / FAIL

---

## Final Rule

Documentation governs execution. Humans retain authority.
