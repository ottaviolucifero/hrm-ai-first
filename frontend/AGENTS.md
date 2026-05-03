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

