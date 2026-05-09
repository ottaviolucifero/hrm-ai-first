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

## Regola minima per task Angular

Ogni task Angular deve dichiarare:

- quali componenti/pattern esistenti riusa;
- se la skill `angular-developer` e rilevante o non necessaria;
- quali regole i18n/design/test applica;
- quali aree restano fuori scope.
