# backend/AGENTS.md

## Scope

This file defines operational rules for every change under `backend/`.

These rules extend the root `AGENTS.md` and must be followed by AI agents working on the Spring Boot backend.

---

## Backend Stack

- Use Spring Boot 4.
- Use Java 21.
- Use PostgreSQL as the production database.
- Use Flyway for versioned database migrations.
- Do not introduce Testcontainers without a documented decision.

---

## Application Structure

- Follow the existing backend package structure.
- Do not reorganize packages globally unless explicitly requested and documented.
- Keep patches small and coherent with the current task.
- Reuse existing controllers, services, DTOs, repositories, exceptions and test patterns before creating new ones.
- Do not modify frontend files from backend-only tasks.

---

## Dependency Injection

- Use constructor-based dependency injection.
- Declare injected dependencies as `private final`.
- Do not use field injection.

---

## REST API Boundary

- Do not expose JPA entities directly from REST controllers.
- Use explicit DTOs for request and response contracts.
- Use Bean Validation on input DTOs.
- Keep REST controllers thin and delegate application behavior to services.

---

## Service Layer

- Use an application service layer for business behavior and mapping when exposing APIs.
- Keep services stateless.
- Use `@Transactional` at service level when needed.
- Prefer `@Transactional(readOnly = true)` for read-only service classes or methods.
- Use write transactions for create, update and delete operations.

---

## Persistence

- Use Spring Data JPA repositories for database access.
- Keep data access logic in repositories and service-layer orchestration.
- Use Flyway migrations for schema changes.
- Do not bypass repository/service patterns with ad hoc persistence logic.

---

## Logging

- Use SLF4J logging.
- Use parameterized log messages instead of string concatenation.
- Do not log secrets, passwords, tokens or sensitive personal data.

---

## Security Constraints

- Do not introduce login/JWT runtime unless a task explicitly requests it.
- Do not introduce RBAC runtime unless a task explicitly requests it.
- Do not introduce tenant switching runtime unless a task explicitly requests it.
- Preserve existing security behavior unless the current task explicitly changes it.

---

## Testing

- Add meaningful tests when introducing API behavior.
- Prefer MockMvc for controller/API tests when consistent with existing task patterns.
- Keep tests focused on the behavior introduced by the task.
- Run backend build/tests when backend code changes.

\## 13. Backend QA and Model Selection

Per task backend significativi prevedere QA separato.

Il QA backend deve verificare almeno:

- build/test Maven;
- regressioni API;
- coerenza DTO/controller/service/repository;
- sicurezza endpoint;
- coerenza con Flyway/JPA;
- assenza di modifiche fuori scope.

Il QA backend non introduce nuove funzionalità .

I fix backend post-QA devono essere piccoli e mirati, con patch minima.

Ogni report QA backend deve essere registrato in `docs/qa/QA-REPORTS.md` nella sezione **Backend**.

---

## Final Checks

Before considering backend work complete:

- Build/tests relevant to the task pass.
- DTO boundaries are respected.
- Validation is present for input DTOs.
- Transactions are applied where needed.
- MVP and task scope are respected.
- No frontend changes were introduced by backend-only work.
