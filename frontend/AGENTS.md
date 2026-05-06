\# frontend/AGENTS.md



\## Frontend Angular Operational Rules



This file defines operational rules for frontend tasks under `frontend/`.



These rules extend the root `AGENTS.md` and must be followed by AI agents working on Angular UI tasks.



\---



\## 1. Reuse First



Before creating any new Angular component, service, layout, directive or utility, the agent must inspect the existing frontend structure.



The agent must prefer reuse of:



\- existing shell layout;

\- existing header;

\- existing sidebar;

\- existing page structure;

\- existing feature components;

\- existing shared components;

\- existing styles and Metronic-adapted patterns.



Every frontend task must start with a short analysis of existing reusable components.



Every new UI implementation must explicitly state which existing components, layouts or patterns are reused.



\---



\## 2. Extend Before Creating



The agent must extend or adapt existing components before creating duplicates.



Do not duplicate:



\- shell layout;

\- header;

\- sidebar;

\- toolbar;

\- page header;

\- cards;

\- tables;

\- forms;

\- buttons;

\- badges;

\- modals;

\- generic layout wrappers.



The existing `app-shell`, `app-header`, `app-sidebar` and approved layout structure must remain the foundation for all UI tasks.



\---



\## 3. Shared Components Governance



Shared components must be created only when they are truly reusable.



If a new shared component is needed, the agent must declare it in the implementation plan before writing code.



Do not create shared components during functional tasks unless there is an explicit reason.



Do not promote a component to shared if it is used only once.



Do not create speculative shared components.



\---



\## 4. Shared Component Creation Threshold



A component may become shared only if at least one of these conditions is true:



\- it is required by at least two different feature areas;

\- it represents a stable UI pattern already present in the project;

\- it standardizes a recurring enterprise structure such as table wrapper, page header, filter bar, status badge or form field group.



For the first usage, keep the component inside the feature/module.



Promote it to shared only after a second real usage exists.



Before creating a shared component, the agent must document:



\- component name;

\- intended responsibility;

\- features expected to reuse it;

\- existing components or patterns checked first;

\- reason why extension or reuse is not enough.



\---



\## 5. Feature Components Governance



Feature-specific components must remain inside the related feature or module.



Frontend tasks must remain small, focused and verifiable.



Do not expand a frontend task into unrelated shared UI refactoring.



\---

\## 5.1 Master Data Table Reuse Rule

Le tabelle Master Data non devono essere duplicate quando condividono struttura, paginazione, filtro, loading/error state e azioni simili.

Durante task funzionali piccoli, non creare automaticamente un componente shared.

Se il task richiede solo il completamento di una schermata esistente, applicare patch minima.

Se la stessa logica tabellare serve a due o più aree Master Data, pianificare un task dedicato di refactoring shared.

Il refactoring shared deve essere esplicitamente autorizzato dal task.

Un componente shared Master Data table deve supportare:

\- colonne configurabili;
\- campi nested, es. `country.code`;
\- paginazione;
\- filtro generico;
\- loading/error state;
\- azioni standard;
\- i18n;
\- test frontend.

Se un task funzionale richiede una nuova tabella simile a una già esistente, l'agente deve dichiarare il debito tecnico oppure proporre un task dedicato prima di duplicare ulteriore logica.

\---



\## 6. Metronic Governance



Metronic is an approved visual reference, not source code to copy indiscriminately.



The agent must adapt Metronic patterns to the existing Angular structure.



Do not import, duplicate or fork Metronic layouts outside the approved Angular shell.



\---



\## 7. Validation



When frontend code is modified, run the frontend build.



For markdown-only governance tasks, validate with:



\- `git status`;

\- `git diff`.



Do not modify backend files during frontend-only tasks unless explicitly requested.



\---



\## 8. Auth Frontend Rules



\- For login foundation, store JWT access tokens in `sessionStorage`, not `localStorage`, unless a later architecture decision says otherwise.

\- Use relative API URLs, for example `/api/auth/login` and `/api/auth/me`.

\- Auth interceptors must add `Authorization: Bearer <token>` only when a token is present.

\- Do not introduce refresh tokens, advanced expiry handling, advanced multitab handling, frontend proxy configuration or global error handling without a dedicated task.

\- Login errors must remain generic, for example `Email o password non corretti.`



\---



\## 9. Frontend i18n Rules



\- Do not add new hardcoded UI text in Angular templates or components.

\- Use the existing runtime i18n foundation under `frontend/src/app/core/i18n/`.

\- Every new label, message, placeholder, title, tooltip or `aria-label` must have a key in `frontend/src/app/core/i18n/i18n.messages.ts`.

\- Always update all supported languages when adding or changing an i18n key: `it`, `fr` and `en`.

\- Italian (`it`) is the baseline language and fallback.

\- Do not translate dynamic data coming from backend APIs, database records or tenant/user content.

\- Do not introduce new i18n libraries, including Angular localize, Transloco or ngx-translate, without a documented architecture decision.

\- Frontend tests should avoid fragile assertions on hardcoded UI strings when possible; when string assertions are necessary, align them with the current i18n keys and translations.

\- New UI components must be verified at least in Italian and, when language behavior is relevant, with language changes through `I18nService` or the persisted `localStorage` language.



\---



\## 10. Angular UI State Rules



\- Every loading state activated by an HTTP call must be restored on both success and error, preferably with RxJS `finalize()`.

\- UI errors must appear immediately after the HTTP response, without depending on focus, blur or other user interactions.

\- If signals or `OnPush` are used, explicitly verify that the UI updates immediately.

\- Stuck loading states or delayed error messages are functional regressions.



\---



\## 11. Frontend Manual Validation



\- When a task introduces or changes screens, manual UI validation is required in addition to build/test.

\- Verify rendering, basic responsive behavior, error states, loading states, disabled/re-enabled buttons and main interactions.

\- On Windows, prefer `npm.cmd` in documented commands when `npm.ps1` may be blocked by PowerShell execution policy.


\---



\## 12. Frontend Brand Color Guidelines



Frontend visual decisions must remain coherent with the HRM AI-first logo without introducing a general redesign.



Logo-derived palette:



\- Primary deep indigo: `#203070`.

\- Primary navy support: `#202050`.

\- Accent blue: `#2080F0`.

\- Secondary violet-blue: `#6060F0`.

\- Soft highlight tint: `#F0F0FF`.



Usage rules:



\- Use the deep indigo as the main brand anchor for primary accents, active navigation and important identity moments.

\- Use accent blue for primary actions, focused states, selected states and links when the existing Metronic/Tailwind token allows it.

\- Use violet-blue sparingly for secondary accents, illustrations, badges or subtle emphasis.

\- Use the soft highlight tint only for low-emphasis backgrounds, hover surfaces or gentle visual grouping.

\- Keep neutral surfaces, borders, body text and enterprise layout density aligned with the existing Metronic/Tailwind-adapted style.

\- Login, shell, header, sidebar, buttons, links, badges and UI states must use brand colors consistently, but only when the task scope includes UI implementation.

\- Do not recolor existing screens opportunistically during unrelated frontend tasks.

\- Do not introduce a full theme rewrite, broad palette replacement, decorative gradients or general redesign under the pretext of brand alignment.

\- Reuse existing shell, header, sidebar, login UI, buttons, badges and layout patterns before changing styles.

\- Create or promote shared components only when the existing shared component rules justify it and the task explicitly documents the reason.

\## 13. Frontend QA and Model Separation


Per task frontend significativi prevedere QA separato.

Il QA frontend deve verificare almeno:

\- i18n obbligatorio;
\- assenza di testi hardcoded;
\- route e sidebar;
\- regressioni su login/home/shell/header/sidebar;
\- build e test Angular;
\- coerenza UI senza redesign non richiesti.

Il QA frontend non introduce nuove funzionalità.

I fix frontend post-QA devono essere piccoli e mirati, con patch minima.
\## 14. Frontend QA Reporting

Ogni report QA frontend deve essere registrato in `docs/qa/QA-REPORTS.md` nella sezione **Frontend**.

La compilazione deve includere almeno: task, area verificata, comandi eseguiti, regressioni trovate, fix richiesti e stato finale.
