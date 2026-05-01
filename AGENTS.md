# AGENTS.md

## Project Context

This repository contains the HRM AI-first platform.

Primary source documents:
- /docs/analysis/Manifesto_e_Intenzioni_HRM_AI_First
- /docs/analysis/MacroAnalyse_HRMUpdated
- /docs/analysis/Entities_With_Types_v11
- /docs/analysis/HRM_Jmix_UI_Interfaces

Agents must always use these documents as the primary source of truth for:
- Functional scope
- MVP boundaries
- Data model
- UI reference
- Strategic direction

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

1. Manifesto (vision and strategic method)
2. Macro Analysis (functional requirements)
3. Architecture.md (technical structure)
4. Root AGENTS.md (global operational governance)
5. backend/AGENTS.md (backend implementation rules)
6. frontend/AGENTS.md (frontend implementation rules)

If conflicts appear:
- The more specific file applies only within its domain
- Architecture.md governs structural decisions
- Human instruction overrides all

---

## Architecture Governance

Architecture.md is the mandatory technical structure reference.

Agents must:
- Follow Architecture.md strictly
- Never invent alternative architectures
- Never create parallel structures
- Never silently refactor foundational systems
- Never introduce new frameworks unless approved
- Update documentation before structural changes

Mandatory rule:
Any major structural, architectural or strategic deviation must first be documented before implementation.

---

## Documentation Governance

Before implementing major changes:
1. Update Architecture.md if structure changes
2. Update roadmap.md if roadmap changes
3. Update relevant AGENTS.md if operational rules change
4. Then implement code

Do not modify project direction silently.

---

## Working Methodology

Mandatory:
- Work in small, verifiable tasks
- One major task at a time
- Validate before moving forward
- Reuse before creating
- Prefer maintainability over unnecessary complexity
- Respect MVP discipline
- Prioritize clarity
- Use existing repository structure
- Follow naming conventions
- Respect shared systems

---

## Git Workflow

Mandatory:
1 task = 1 branch = 1 pull request

Branch examples:
- feature/employee-module
- feature/device-module
- feature/payroll-upload
- fix/security-validation

Do not group unrelated tasks in one branch.

---

## AI Agent Operational Rules

Agents must:
- Read documentation first
- Analyze existing code before modifying
- Extend before replacing
- Reuse before duplicating
- Preserve consistency
- Avoid scope creep
- Keep implementation incremental
- Build with long-term maintainability in mind

Agents must NOT:
- Expand scope autonomously
- Add speculative features
- Ignore documentation
- Duplicate systems
- Break architecture consistency
- Replace approved foundations

---

## Validation Rules

Before considering work complete:

Backend:
- Build passes
- Structure respected
- Security respected
- Validation included

Frontend:
- Build passes
- Template governance respected
- Shared component governance respected
- UI consistency preserved

Global:
- MVP respected
- Naming respected
- Documentation aligned

---

## Definition of Done

A task is done only if:

- Code builds successfully
- Scope matches task
- MVP boundaries respected
- Architecture respected
- Existing systems reused where appropriate
- Security considered
- Naming conventions respected
- Documentation updated when necessary
- No uncontrolled side effects introduced

---

## Version Governance

When modifying strategic documents:
- Update version
- Update Last Updated field
- Update Version History
- Never erase prior history silently

---

## Execution Priority

Immediate priorities:

1. Governance foundation
2. Technical foundation
3. Data model
4. Employee module
5. Security
6. Core HR modules
7. MVP stabilization

---

## Strategic Principle

Documentation → Architecture → Task → Validation → Release

Never reverse this order.

---

## Final Rule

This project is AI-first, not AI-uncontrolled.

AI accelerates execution.  
Documentation governs execution.  
Humans retain authority.