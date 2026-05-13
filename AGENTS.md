# AGENTS.md

## Project Context

This repository contains the HRM AI-first platform.

Primary governance documents:
- `AGENTS.md`
- `ARCHITECTURE.md`
- `ROADMAP.md`
- `TASKS.md`
- `DECISIONS.md`

Operational support documents:
- `docs/qa/QA-REPORTS.md`
- `docs/ai/MODEL-SELECTION-GUIDE.md`
- `docs/ai-prompts/codex-prompt-governance.md`

Supporting historical analysis input:
- `/docs/analysis/Manifesto_e_Intenzioni_HRM_AI_First`
- `/docs/analysis/MacroAnalyse_HRMUpdated`
- `/docs/analysis/Entities_With_Types_v11`
- `/docs/analysis/HRM_Jmix_UI_Interfaces`

Agents may consult `docs/analysis` for historical context and background analysis.

Operational support documents help execution but do not override primary governance documents.

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
- Follow `ARCHITECTURE.md` strictly
- Never invent alternative architectures
- Never create parallel structures
- Never silently refactor foundational systems
- Never introduce new frameworks unless approved
- Update documentation before structural changes

---

## Documentation Governance

Before implementing major changes:
1. Update `ARCHITECTURE.md` if structure changes
2. Update `ROADMAP.md` if roadmap changes
3. Update relevant `AGENTS.md` if operational rules change
4. Then implement code

---

## AI Model and Agent Selection Governance

Per ogni task significativo, prima dell'esecuzione va suggerito il modello/agente piu adatto e, quando viene preparato un prompt operativo, va sempre inclusa una sezione obbligatoria `Modello consigliato`.

La selezione deve seguire anche `docs/ai/MODEL-SELECTION-GUIDE.md`, che resta la guida centrale.

La governance prompt e l'uso di eventuali skills operative, incluse skills Angular, sono documentati in `docs/ai-prompts/codex-prompt-governance.md` e restano subordinati alla gerarchia di governance del repository.
Quando previste da decisioni approvate, le skills operative possono essere versionate localmente nel repository (esempio: `.agents/` e `skills-lock.json`).

Le scelte devono distinguere almeno:

- Analisi / planning
- Sviluppo
- QA / regression test
- Fix post-QA

La raccomandazione deve tenere conto almeno di:

- tipo di task
- area di codice coinvolta
- rischio regressione
- complessita attesa
- consumo/costo token

Separare sviluppo e QA:

- il prompt di sviluppo implementa la patch
- il prompt QA verifica regressioni, scope creep, i18n, build/test e coerenza generale
- il QA agent non introduce nuove funzionalita
- i fix emersi dal QA devono essere trattati come patch correttive separate e minime

Per task QA / regression test e possibile usare anche Gemini AI quando l'obiettivo principale e revisione, controllo regressioni, scope creep, i18n, build/test e coerenza UI/API.

I fix post-QA devono essere applicati dal modello/agente piu adatto al codice interessato, con patch minima.

I report QA devono essere registrati in `docs/qa/QA-REPORTS.md`.

Modelli consigliati:

- Prima scelta: 5.3 Codex
- Alternativa veloce/economica: 5.3 Spark
- Alternativa ragionata: 5.4

La scelta concreta deve sempre essere adattata al task e motivata nella sezione `Modello consigliato`, includendo al confronto 5.3 Codex, 5.3 Spark e 5.4 quando pertinente.

---

## Working Methodology

- Work in small tasks
- Validate continuously
- Reuse before creating
- Respect MVP
- Quando un task introduce una nuova entita con campo `code`, il default e auto-code `PPNNN` (`prime due lettere + progressivo 3 cifre`) con `code` non editabile da UI; eventuali eccezioni devono essere documentate in `DECISIONS.md` o nel task dedicato.

---

## Git Workflow

1 task = 1 branch = 1 PR

---

## QA Agent

Il QA Agent e responsabile della validazione finale dei task.

Responsabilita:
- verificare implementazione rispetto a `TASKS.md`
- identificare bug e regressioni
- controllare coerenza con `ARCHITECTURE.md` e `DECISIONS.md`
- verificare aggiornamento documentazione

Regole:
- non modifica codice automaticamente
- produce report strutturato
- classifica problemi in `BLOCKER` / `MAJOR` / `MINOR` / `NOTE`
- propone fix ma non li applica senza richiesta

Output:
- aggiornamento `docs/qa/QA-REPORTS.md`
- esito: `PASS` / `PASS WITH NOTES` / `FAIL`

---

## Final Rule

Documentation governs execution. Humans retain authority.
