# Codex Prompt Governance

Questo documento raccoglie regole operative per prompt e agenti Codex nel progetto HRM AI-first.

Le regole qui definite sono complementari alla governance del repository e non la sostituiscono.

## Fonti prioritarie

Gli agenti devono continuare a rispettare la gerarchia definita in `AGENTS.md`.

Prima di eseguire task Angular o frontend, leggere e applicare almeno:

- `AGENTS.md`;
- `frontend/AGENTS.md`;
- `TASKS.md`;
- `ROADMAP.md`;
- `DECISIONS.md`, se il task tocca scelte architetturali o operative gia decise;
- `docs/design/DESIGN-SYSTEM.md`, se il task tocca UI, layout, componenti, design system o template validati.

Il contesto allegato nel prompt e utile, ma non sostituisce la verifica dello stato reale del repository.

## Angular AI skills

Per task frontend Angular, gli agenti devono considerare la skill Angular `angular-developer` quando disponibile.

Quando la skill e presente nel repository, usare prioritariamente la versione locale sotto `.agents/skills/angular-developer` per garantire allineamento operativo tra agenti sullo stesso branch/repo.

La skill puo essere installata o gestita manualmente con:

```powershell
npx skills add https://github.com/angular/skills --skill angular-developer
```

La skill `angular-developer` va usata come supporto operativo per:

- componenti Angular;
- servizi;
- routing;
- forms e form controls;
- accessibilita;
- testing frontend;
- styling component-scoped;
- best practice Angular coerenti con il progetto.

Non usare `angular-new-app` nel progetto `hrm-ai-first`: il frontend Angular esiste gia e i task devono evolvere la codebase corrente, non crearne una nuova.

Il file `skills-lock.json` traccia la skill approvata versionata nel repository (sorgente e lock/hash). Gli agenti devono considerarlo come riferimento operativo per la skill locale approvata.

La skill non autorizza:

- nuove librerie UI;
- refactor massivi;
- nuove architetture;
- duplicazione di componenti shared;
- bypass di i18n, design system, QA o regole Metronic/HRflow;
- modifiche backend/API.

## Rapporto con governance repository

La skill Angular e sempre subordinata a:

- istruzioni umane;
- `AGENTS.md`;
- `frontend/AGENTS.md`;
- `TASKS.md`;
- `ROADMAP.md`;
- `DECISIONS.md`;
- `docs/design/DESIGN-SYSTEM.md`;
- codice gia implementato.

In caso di conflitto, prevale la governance del repository.

## Spring backend AI skills

Per task backend Spring, gli agenti devono considerare la skill repository-local `spring-backend-developer` quando disponibile.

Quando la skill e presente nel repository, usare prioritariamente la versione locale sotto `.agents/skills/spring-backend-developer` per garantire allineamento operativo tra agenti sullo stesso branch/repo.

La skill `spring-backend-developer` va usata come supporto operativo per:

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

Il file `skills-lock.json` traccia anche questa skill approvata versionata nel repository. Gli agenti devono considerarlo come riferimento operativo del lock repository-local.

La skill non autorizza:

- nuove architetture parallele;
- nuove librerie o framework non approvati;
- migration fuori scope;
- API non richieste;
- RBAC enforcement fuori task;
- refactor security non richiesto.

La skill Spring/backend e sempre subordinata a:

- istruzioni umane;
- `AGENTS.md`;
- `backend/AGENTS.md`;
- `TASKS.md`;
- `ROADMAP.md`;
- `DECISIONS.md`;
- `ARCHITECTURE.md`;
- codice backend gia implementato.

## Plan mode

Usare Plan mode, o comunque una fase di piano esplicito, per task frontend Angular che coinvolgono:

- analisi iniziale;
- refactoring;
- UI/layout;
- modifiche multi-file;
- componenti shared;
- forms;
- routing;
- testing o accessibilita.

Durante la fase di analisi:

- non modificare file;
- identificare i file realmente coinvolti;
- verificare componenti e pattern esistenti da riusare;
- indicare vincoli i18n, accessibilita, design system e testing;
- esplicitare rischi di regressione;
- dichiarare cosa resta fuori scope;
- produrre un piano sintetico prima della patch.

## IDE context e repository state

Quando disponibile, usare il contesto reale del repository/IDE insieme al prompt.

Prima di modificare file, verificare:

- branch corrente;
- `git status`;
- eventuale diff rilevante;
- file aperti o allegati, se indicati dal task;
- esistenza reale dei file citati nel prompt.

Non fidarsi solo del prompt se il repository mostra uno stato diverso. In caso di divergenza, segnalarla e limitare la patch allo scope autorizzato.

## Regola branch nei prompt operativi

Ogni prompt operativo di sviluppo o QA deve includere sempre:

- verifica iniziale del branch corrente;
- creazione del branch dedicato al task, se non gia presente;
- divieto di lavorare direttamente su `main`, salvo task puramente documentale autorizzato esplicitamente.

Esempio comandi Windows cmd da includere nel prompt quando il branch non esiste ancora:

```cmd
git status --short --branch
git checkout main
git pull
git checkout -b nome-branch-task
```

Se il branch del task e gia stato creato, il prompt deve richiedere solo:

```cmd
git status --short --branch
```

## Regola minima per task Angular

Ogni task Angular deve dichiarare:

- quali componenti/pattern esistenti riusa;
- se la skill `angular-developer` e rilevante o non necessaria;
- quali regole i18n/design/test applica;
- quali aree restano fuori scope.
