---
name: spring-backend-developer
description: Repository-local governance skill for HRM AI-first backend tasks. Use for Spring Boot 4 / Java 21 work touching Spring Security, JWT foundation, User/Role/Permission review, permission model foundation, backend authorization enforcement, JPA/Flyway, service layer, DTO/controller boundaries and backend tests.
license: Proprietary
metadata:
  author: HRM AI-first repository
  version: '1.0'
---

# Spring Backend Developer Guidelines

This is a repository-local governance skill. It is intentionally minimal and does not replace repository governance.

## Mandatory sources before acting

Read and apply, in order:

1. Human instructions.
2. `AGENTS.md`.
3. `backend/AGENTS.md`.
4. `TASKS.md`.
5. `ROADMAP.md`.
6. `DECISIONS.md`.
7. `ARCHITECTURE.md` when the task touches backend structure, authorization, DTO/API boundaries, persistence, security or testing strategy.
8. Existing implemented backend code.

## When to use this skill

Use this skill as an operational aid for backend tasks involving:

- Spring Boot 4;
- Java 21;
- Spring Security;
- JWT/security foundation;
- User/Role/Permission domain review;
- permission model foundation;
- backend authorization enforcement;
- JPA/Flyway;
- service layer;
- DTO/controller boundaries;
- backend tests.

## Backend execution rules

1. Follow the current backend package structure and existing backend patterns before introducing anything new.
2. Keep REST controllers thin and use explicit DTOs instead of exposing JPA entities.
3. Keep business behavior in stateless services and use `@Transactional` deliberately.
4. Use Spring Data JPA repositories and Flyway migrations only when the task scope explicitly requires them.
5. Preserve current security behavior unless the task explicitly changes it.
6. When backend code changes, run the relevant Maven tests before closing the task.
7. For documentation-only governance tasks, validate with repository checks instead of backend build/test unless code changed.

## This skill does not authorize

- new parallel architectures;
- new libraries or frameworks not already approved;
- migrations outside the current task scope;
- APIs not explicitly requested by the task;
- RBAC enforcement outside the task that owns it;
- security refactors not explicitly requested.

## Relationship with repository governance

This skill is complementary to:

- `AGENTS.md`;
- `backend/AGENTS.md`;
- `TASKS.md`;
- `ROADMAP.md`;
- `DECISIONS.md`;
- `docs/qa/QA-REPORTS.md`.

If the skill conflicts with repository governance or implemented code, repository governance wins.
