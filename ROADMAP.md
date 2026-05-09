# ROADMAP.md

## Progetto HRM AI-first

Versione: 1.92
Ultimo aggiornamento: 2026-05-09
Stato: In avanzamento

---

## 1. Obiettivo

Definire le fasi operative per sviluppare il MVP della piattaforma HRM.

---

## 2. Perimetro MVP

### Incluso nel MVP

- Gestione dipendenti
- Login JWT
- Utenti, ruoli e permessi
- Gestione dispositivi aziendali
- Upload e consultazione documenti payroll
- Richieste di congedo
- Calendario festività
- Notifiche email base
- Audit log
- Docker Compose

### Escluso dal MVP

- Keycloak
- S3 / MinIO
- App mobile
- Dashboard avanzate
- Workflow complessi

---

## 3. Stato avanzamento

### Completato

- Governance documentale completa
- Backend Spring Boot 4 / Java 21
- Configurazione backend YAML
- PostgreSQL + Docker Compose
- Frontend Angular base
- Integrazione asset base Metronic Tailwind HTML
- Shell layout Angular modulare (`app-shell`, `app-header`, `app-sidebar`)
- Adattamento layout reale Metronic
- Swagger / OpenAPI backend
- Profili backend dev/test/prod
- DEC-012 frontend enterprise modulare
- TASK-012 master tables globali foundation
- TASK-013 master tables HR/business tenant-scoped
- TASK-014 governance/security master foundation
- TASK-015 Tenant, CompanyProfile, OfficeLocation, SmtpConfiguration foundation and FK hardening
- TASK-016 Foundation validation and API readiness
- TASK-017 Employee core domain foundation
- TASK-018 Contract governance and employment lifecycle foundation
- TASK-019 Backend-first backlog reorganization
- TASK-020 UserAccount identity/security foundation
- TASK-021 RBAC bridge foundation
- TASK-022 Device backend foundation
- TASK-023 PayrollDocument backend foundation
- TASK-024 LeaveRequest backend foundation
- TASK-025 HolidayCalendar backend foundation
- TASK-026 AuditLog backend foundation
- TASK-027 EmployeeDisciplinaryAction backend foundation
- TASK-028 Core HR API readiness backend read-only
- TASK-029 Frontend UI and shared components governance
- TASK-030 API CRUD master data globali
- TASK-031 API CRUD master data HR/business
- TASK-032 API CRUD master data governance/security
- TASK-033 Backlog login/JWT before admin UI reorganization
- TASK-034 Backend login/JWT foundation
- TASK-035 Frontend login foundation
- TASK-036 Frontend authenticated home shell foundation
- TASK-037 Frontend application logo integration in login UI
- TASK-038 Frontend design guidelines based on logo brand colors
- TASK-039 Frontend sidebar navigation tree foundation
- TASK-040 Frontend i18n foundation
- TASK-041 UI Master Data Admin foundation/list
- TASK-042 Seed/import dati globali iniziali
- TASK-043 Master Data API/UI pagination and generic filters
- TASK-044 Import CAP italiani
- TASK-045 Shared Master Data table component
- TASK-046.1 Master Data CRUD action foundation
- Backlog governance updated: Master Data Admin UI follows backend CRUD APIs
- Backlog governance updated: Login foundation precedes administrative UI
- Backlog governance updated: authenticated home shell, logo integration and frontend design guidelines precede Master Data Admin UI
- Backlog governance updated: sidebar navigation tree foundation and frontend i18n foundation immediately follow authenticated home shell before Master Data Admin UI
- TASK-047.2 Master Data physical delete frontend action
- TASK-047.3 Master Data physical delete QA and hardening
- TASK-048.1 Master Data design refinement preparation
- TASK-048.2 Validated UI template catalog from Stitch
- TASK-048.3 Reframe TASK-048 subtasks around validated UI templates
- TASK-048.4 Data list and Generic DataTable refinement
- TASK-048.5 CRUD modal and action confirmation refinement
- TASK-048.6 Buttons and toast feedback refinement
- TASK-048.7 Shared list buttons pattern foundation

### Prossimo passo

- TASK-048.11 Sidebar visual alignment to TEMPLATE-08

---

## 4. Fase 1 - Fondazione tecnica

Stato: Frontend login foundation, authenticated home shell foundation, sidebar navigation tree foundation, frontend i18n foundation, logo integration, design guidelines, Master Data Admin foundation/list, seed dati globali iniziali e shared Master Data table completati

Completato:

- Repository
- Backend
- Config base backend
- Docker + PostgreSQL
- Frontend Angular
- Metronic asset base
- Shell layout enterprise
- Layout reale Metronic
- Swagger / OpenAPI
- Profili dev/test/prod
- Master tables globali foundation
- Master tables HR/business tenant-scoped
- Master tables governance/security foundation
- Tenant + CompanyProfile + OfficeLocation + SmtpConfiguration foundation
- FK hardening from tenant-scoped master data to real Tenant domain
- Read-only foundation API readiness for Tenant, CompanyProfile, OfficeLocation and SmtpConfiguration
- DTO/service boundary for foundation API responses
- Employee core persistence foundation with tenant/company/office relational integrity and documented Employee foundation fields
- Contract governance foundation with tenant/company/employee/contract type/currency relational integrity and lifecycle dates
- Backend-first backlog reorganization from TASK-019 onward
- UserAccount identity/security persistence foundation with email-first login identity, authentication method governance and strong authentication readiness
- RBAC bridge persistence foundation with UserRole, RolePermission and UserTenantAccess relational integrity
- Device backend persistence foundation with tenant/company/master device/employee assignment relational integrity
- PayrollDocument backend persistence foundation with PayrollDocument entity, PayrollDocumentStatus enum, PayrollDocumentRepository, Flyway V10 `payroll_documents` table and backend persistence/query tests validated with BUILD SUCCESS
- LeaveRequest backend persistence foundation with LeaveRequest entity, LeaveRequestStatus enum, LeaveRequestRepository, Flyway V11 `leave_requests` table and backend persistence/query/constraint tests validated with BUILD SUCCESS
- HolidayCalendar backend persistence foundation with HolidayCalendar entity, HolidayCalendarRepository, Flyway V12 `holiday_calendars` table and backend persistence/query/constraint tests validated with BUILD SUCCESS
- AuditLog backend persistence foundation with AuditLog entity, AuditLogRepository, Flyway V13 `audit_logs` table and backend persistence/query/constraint tests validated with BUILD SUCCESS
- EmployeeDisciplinaryAction backend persistence foundation with EmployeeDisciplinaryAction entity, EmployeeDisciplinaryActionRepository, Flyway V14 `employee_disciplinary_actions` table and backend persistence/query/constraint tests validated with BUILD SUCCESS
- Core HR API readiness backend read-only with `/api/core-hr` controller, read-only service, explicit DTO responses and MockMvc/OpenAPI tests validated with BUILD SUCCESS
- Frontend UI and shared components governance documented in `frontend/AGENTS.md`
- Master Data Admin backlog reordered so backend CRUD APIs are implemented before operational UI
- API CRUD master data globali available under `/api/master-data/global` for Country, Region, Area, GlobalZipCode, Currency, Gender, MaritalStatus and NationalIdentifierType, with explicit DTOs, application service layer, soft delete and MockMvc/OpenAPI tests validated with BUILD SUCCESS
- API CRUD master data HR/business available under `/api/master-data/hr-business` for Department, JobTitle, ContractType, EmploymentStatus, WorkMode, LeaveRequestType, DocumentType, DeviceType, DeviceBrand and DeviceStatus, with tenant-scoped DTOs, application service layer, soft delete and MockMvc/OpenAPI tests validated with BUILD SUCCESS
- API CRUD master data governance/security available under `/api/master-data/governance-security` for UserType, AuthenticationMethod, AuditActionType, DisciplinaryActionType, SmtpEncryptionType, Role, Permission, CompanyProfileType and OfficeLocationType, with explicit DTOs, application service layer, soft delete and MockMvc/OpenAPI tests validated with BUILD SUCCESS
- TASK-033 backlog reorganization completed: backend login/JWT foundation and frontend login foundation now precede Master Data Admin UI
- Backend login/JWT foundation available with `/api/auth/login`, `/api/auth/me`, stateless JWT, email-only case-insensitive login, BCrypt password verification, password policy foundation and user email global case-insensitive uniqueness
- Frontend login foundation available with `/login`, sessionStorage JWT token handling, route guard, auth HTTP interceptor, reusable email/password fields, alert feedback component and frontend build/test validation
- Frontend authenticated home shell foundation available with protected `/` route under `app-shell`, `app-header`, `app-sidebar` and a minimal `HomeComponent`
- Frontend sidebar navigation tree foundation available with typed local menu data, three-level tree support, expand/collapse, active route highlighting, local search/filter and collapsable sidebar compact mode
- Frontend i18n foundation available with runtime custom/minimal service, default Italian language, typed dictionary, Italian fallback, localStorage language persistence, login language selector and main shell/login/sidebar/header/home/shared field texts extracted
- Frontend application logo integrated in the existing login UI using `assets/logos/hrm-logo.png`
- Frontend design guidelines based on logo brand colors documented in `frontend/AGENTS.md`
- Frontend Master Data Admin foundation/list available at protected route `/master-data` with sidebar entry, category/entity selection, read-only table rendering, manual refresh and loading/error/empty states across global, HR/business and governance/security master data endpoints
- TASK-042 completed: global seed foundation with `countries.default_currency_id` nullable, ISO 3166-1 alpha-2 seed (249 Paesi/territori), source documentation and Flyway V17 vendor-specific migrations for PostgreSQL/H2 validated with backend tests.
- TASK-044 completed: import CAP italiani con dataset normalizzato da JSON acquistato (8465 record validi), import backend idempotente in `global_zip_codes`, endpoint analisi/import dedicato e test backend di coerenza/idempotenza.
- TASK-045 completed: shared read-only Master Data table component integrated in `/master-data`, with configurable columns, nested fields, loading/error/empty states and pagination events validated by frontend build/test.
- TASK-046 Master Data CRUD standard foundation
- TASK-046.1 completed: configurable row actions foundation added to `DataTableComponent`, with entity-level enablement and container event wiring in `/master-data`, while non-candidate entities remain read-only.
- TASK-046.2 completed: Master Data CRUD form foundation added with metadata-driven create/edit/view form, required/read-only handling, i18n keys and frontend save hooks without backend mutations.
- TASK-046.3 completed: real frontend create/update integration added on existing HR/business CRUD APIs for `Department`, `JobTitle`, `ContractType` and `WorkMode`, with authenticated tenant-aware payloads, modal feedback, post-save refresh and frontend build/test validation.
- TASK-046.4 completed: Master Data deactivation flow on `/master-data` aligned with existing soft-delete semantics (`active=false`), with explicit confirmation modal, coherent list refresh and i18n `it/fr/en`.
- Backlog governance updated: Master Data physical delete is separated from logical deactivation and planned as TASK-047.
- TASK-047.1 completed: backend foundation for physical delete on HR/business CRUD candidates (`Department`, `JobTitle`, `ContractType`, `WorkMode`) with dedicated `/physical` endpoints, `409 Conflict` on referenced records and backend tests validated.
- TASK-048 HRflow design system and validated UI templates
- TASK-048.3 Reframe TASK-048 subtasks around validated UI templates
- TASK-048.4 completed: Data list page and shared Generic DataTable refinement applied to `/master-data` with TEMPLATE-01, TEMPLATE-03 and TEMPLATE-10, i18n `it/fr/en`, build/test frontend validated and no backend changes.
- TASK-048.5 completed: CRUD modal and confirmation dialog footers refined on `/master-data` with a shared modal footer pattern, coherent action ordering, compact TEMPLATE-04 alignment and removal of duplicated `Annulla`/`Chiudi` semantics in read-only footer.
- TASK-048.6 completed: buttons and toast feedback refinement applied with TEMPLATE-07 and TEMPLATE-11, reusing `AlertMessageComponent`, Metronic/Keenicons, global button styles and i18n `it/fr/en`; build/test frontend validated and no backend/API changes.
- TASK-048.8 completed: login visual alignment review applied with TEMPLATE-06, refining hierarchy/layout/states on `/login` with card, brand, language selector, CTA, responsive behavior, forgot-password visual link and legal footer; i18n consistent and no backend/API changes.

Nota:

Tenant placeholder strategy converted into full Tenant domain in TASK-015.
Governance/security split active: global authentication standards are shared, while roles, permissions and operational classifications remain tenant-scoped.
Foundation API readiness active through read-only DTO responses; operational write APIs remain deferred.
Employee persistence foundation is available with documented core fields; Employee REST API, UI and operational workflows remain deferred.
Contract persistence foundation is available with start/end dates and active lifecycle flag; contract APIs, HR workflows and payroll integration remain deferred.
Backlog execution is now backend-first: core technical foundations and API readiness precede operational UI tasks.
UserAccount persistence foundation is available; login runtime, JWT, OTP/MFA execution and API remain deferred.
RBAC bridge persistence foundation is available; runtime authorization, Spring Security RBAC, tenant switching, impersonation, service layer, API and UI remain deferred.
Device persistence foundation is available; assignment workflow, service layer, API and UI remain deferred.
PayrollDocument persistence foundation is available; physical upload/download, API REST, DTO, service layer, frontend/UI, notifications and publication workflow remain deferred.
LeaveRequest persistence foundation is available; approval workflow, API REST, DTO, service layer, leave balance calculation, attachments, frontend/UI and notifications remain deferred.
HolidayCalendar persistence foundation is available; API REST, DTO, service layer, UI, holiday seed data, movable holiday calculation and operational workflow remain deferred.
AuditLog persistence foundation is available; automatic audit runtime, interceptors/aspects, login/JWT integration, real tenant switching, real impersonation, API REST, DTO, service layer and UI remain deferred.
EmployeeDisciplinaryAction persistence foundation is available; API REST, DTO, service layer, controller, UI, disciplinary workflow, notifications, upload/download, audit runtime and security integration remain deferred.
Core HR read-only API readiness is available for Employee, Contract, Device, PayrollDocument, LeaveRequest, HolidayCalendar, AuditLog and EmployeeDisciplinaryAction; write APIs, operational CRUD, workflows, physical document transfer, login/JWT runtime, RBAC runtime, tenant switching runtime, automatic audit, frontend/UI and notifications remain deferred.
Frontend governance is active: UI tasks must analyze and reuse existing Angular components, extend before creating duplicates, keep feature components local, create shared components only with explicit motivation, and adapt Metronic as a visual reference rather than copying code indiscriminately.
Logo brand color governance is active: frontend UI tasks must use the documented deep indigo, navy, accent blue, violet-blue and soft highlight tint consistently when the task scope includes visual implementation, without opportunistic redesign.
Master Data Admin UI must follow backend CRUD APIs. Existing read-only APIs can support consultation, but they are not sufficient for complete administrative CRUD screens.
UserAccount persistence foundation is available and backend/frontend login foundation is active.
Global, HR/business and governance/security master data CRUD APIs are available; the read-only Master Data Admin foundation/list is active and TASK-043 pagination/generic filters plus TASK-045 shared table refactoring are completed before proceeding to the reusable Master Data CRUD standard foundation.

Da fare:

- TASK-048.11 Sidebar visual alignment to TEMPLATE-08
- TASK-048.12 Spreadsheet-style bulk editor planning
- TASK-048.13 Shared form controls and form patterns foundation
- TASK-048.14 Global typography foundation
- TASK-049 Platform Super Admin and tenant-aware permissions model
- TASK-050 User, Role and Permission domain review
- TASK-051 Permission model foundation by scope/resource/action
- TASK-052 Tenant user and role administration foundation
- TASK-053 Apply permissions to frontend navigation and actions
- TASK-054 Apply permissions to backend API authorization

Sequenza funzionale prevista per il blocco Super Admin / permessi:

- TASK-048: iniziativa generale HRflow design system/template UI basata sul catalogo Stitch validato, con Master Data come caso pilota prima del blocco permessi;
- TASK-049: strategia e modello Super Admin / tenant-aware permissions;
- TASK-050: review dominio esistente e gap analysis;
- TASK-051: foundation modello permessi (`SCOPE.RESOURCE.ACTION`);
- TASK-052: foundation utenti/ruoli tenant;
- TASK-053: applicazione permessi lato frontend per UX/visibilita;
- TASK-054: enforcement reale lato backend sulle API.

Nota roadmap TASK-048:

- TASK-048 non e piu un task solo Master Data: diventa iniziativa generale per design system e template UI HRflow.
- Master Data resta la prima applicazione concreta/caso pilota per evitare lavoro doppio sui prossimi CRUD e UI amministrative.
- TASK-048.1 ha creato `docs/design/DESIGN-SYSTEM.md` come draft preparatorio.
- TASK-048.2 ha validato il catalogo astratto di UI template Stitch documentato in `docs/design/DESIGN-SYSTEM.md`.
- Gli screenshot Stitch locali non sono versionati e sono ignorati via `.gitignore`.
- TASK-048.4 ha applicato TEMPLATE-01, TEMPLATE-03 e TEMPLATE-10 a `/master-data` e al `DataTableComponent` shared senza creare componenti tabellari paralleli.
- TASK-048.5 completa il pattern modal/dialog su `/master-data` con footer standard condiviso, ordine azioni coerente, spacing allineato al mockup HTML validato e rimozione del doppio `Annulla`/`Chiudi` nel read-only footer.
- Sequenza aggiornata: TASK-048.3 reframe sottotask, TASK-048.4 Data list/Generic DataTable, TASK-048.5 CRUD modal/action confirmations, TASK-048.6 buttons/toast, TASK-048.7 shared list button foundation, TASK-048.8 login visual alignment review, TASK-048.9 Angular AI skills/project agent integration, TASK-048.10 shell navigation review, TASK-048.11 sidebar visual alignment to TEMPLATE-08, TASK-048.12 bulk editor planning, TASK-048.13 shared form controls foundation, TASK-048.14 global typography foundation.
- TEMPLATE-01, TEMPLATE-03 e TEMPLATE-10 guidano lista dati, stati tabella e DataTable principale.
- TEMPLATE-04 e TEMPLATE-05 guidano modali CRUD e conferme azione.
- TEMPLATE-07 e TEMPLATE-11 guidano toast e pulsanti.
- TASK-048.6 applica TEMPLATE-07 e TEMPLATE-11 a feedback toast e pulsanti condivisi, senza introdurre nuove librerie UI o modifiche backend/API.
- TEMPLATE-06 guida solo la review visuale della login esistente, senza redesign non richiesto.
- TASK-048.9 introduce governance documentale e integrazione repository-local per usare la skill Angular `angular-developer` come supporto complementare a `AGENTS.md`, `frontend/AGENTS.md`, `TASKS.md`, `ROADMAP.md`, `DECISIONS.md` e design system; `angular-new-app` resta esclusa perche il frontend Angular esiste gia.
- TASK-048.9 include `.agents/skills/angular-developer` e `skills-lock.json` come asset versionabili del repository per standardizzare il lavoro agentico sul frontend Angular.
- TASK-048.9 e completato come governance + integrazione repository-local della skill Angular approvata, senza modifiche applicative/backend/API.
- TASK-048.10 valuta TEMPLATE-08 e TEMPLATE-09 come riferimenti extra senza modifiche Angular/backend/API; la sidebar verra riallineata a TEMPLATE-08 solo nel task dedicato TASK-048.11.
- TEMPLATE-09 resta riferimento extra per eventuale header/topbar refinement futuro, senza applicazione concreta in TASK-048.10.
- TEMPLATE-02 resta pattern avanzato futuro per pianificazione bulk editor stile spreadsheet.
- TASK-048.8 e completato come login visual alignment review: consolidato l'allineamento visuale login rispetto al template validato con seconda iterazione piu profonda su layout/card/brand/language selector/CTA e final refinement su password link/footer legale, senza modifiche funzionali.
- TASK-048.13 e dedicato alla foundation dei form controls condivisi: censimento input/textarea/select/checkbox/radio/switch/date/number/search e pattern validazione/help text, con possibile `app-checkbox` come primo controllo condiviso.
- TASK-048.14 e dedicato alla foundation tipografica globale: analisi font attuale/Metronic, confronto con mockup validati, decisione su font globale (Inter/Manrope o alternativa), preferenza per asset locali e centralizzazione gerarchie tipografiche.
- Nessuna modifica Angular o backend è prevista in TASK-048.3.
- `frontend/AGENTS.md` rimane fonte applicativa vigente per le regole frontend; `docs/design/DESIGN-SYSTEM.md` dettaglia lo standard UI quando approvato e aggiornato dai task TASK-048.x.
Nota roadmap TASK-045:

- TASK-045 resta frontend-only ed e completato come primo rilascio read-only.
- Filtri fuori dal componente tabella (restano nel container/pagina).
- Fuori scope in TASK-045: inline editing/CRUD dinamico, drag & drop colonne, preferenze utente colonne.
- Le estensioni fuori scope verranno trattate con task futuri dedicati.

Nota roadmap TASK-046:

- TASK-046 definisce uno standard CRUD frontend incrementale per Master Data, non una patch CRUD specifica per una sola tabella.
- Il pattern preferito resta `DataTableComponent` read-only con azioni configurabili e form/modal o pannello laterale per create/update.
- Il CRUD usa le API backend gia esistenti dei TASK-030, TASK-031 e TASK-032; non sono previste nuove API backend salvo bug bloccante documentato.
- Editing inline, drag & drop colonne, preferenze utente colonne, lookup remoti complessi, RBAC runtime UI e redesign restano fuori scope.
- Entita importate o globali possono restare read-only o CRUD limitato; entita tenant-scoped semplici sono candidate per il primo CRUD completo.
- TASK-046.1 completa la foundation azioni riga: `DataTableComponent` emette eventi `edit` / `delete` configurabili e il container `/master-data` li riceve senza introdurre ancora form CRUD o mutazioni backend.
- TASK-046.2 completa la foundation form: componente metadata-driven `create`/`edit`/`view`, validazioni base e hook frontend di salvataggio; la persistenza reale verso backend resta task successivo.
- TASK-046.3 introduce l'integrazione API CRUD foundation su entita semplici mantenendo il perimetro incrementale.
- TASK-046.4 completa la disattivazione logica con conferma ed error handling coerente.
- Filtro `Attivi` / `Inattivi` e azione `Riattiva` restano follow-up dedicati.
- TASK-046.5 chiude il ciclo con QA/stabilizzazione e allineamento documentale.
- TASK-047 introduce la cancellazione fisica sicura dei Master Data come azione distinta da `Disattiva`, consentita solo per record non referenziati.
- TASK-047 e scomposto in tre subtask incrementali: 047.1 backend foundation, 047.2 frontend action, 047.3 QA and hardening.
- Dopo TASK-047 il blocco prioritario passa a Super Admin / utenti / ruoli / permessi (TASK-049..TASK-054), con distinzione esplicita tra scope `PLATFORM` e `TENANT`, ruoli seed non eliminabili, ruoli custom tenant-specific e permessi CRUD Global/Tenant Master Data.
- Il frontend migliora visibilita/UX ma non sostituisce mai i controlli di sicurezza backend.

---

## 5. Backend / API / Configurazione tecnica

Swagger / OpenAPI è integrato nel backend tramite springdoc.

Validazione completata:

- Swagger UI disponibile
- `/v3/api-docs` restituisce JSON OpenAPI
- Gli endpoint applicativi non esplicitamente pubblici restano protetti dalla security

Profili Spring Boot configurati:

- `dev` per sviluppo locale con PostgreSQL Docker
- `test` per esecuzione test automatizzati
- `prod` con variabili ambiente e senza credenziali reali nel repository

---

## 6. Fasi successive

### Fase 2A - Foundation Data

- TASK-012 -> TASK-014

### Fase 2B - Tenant / Company Foundation

- TASK-015 -> TASK-016

### Fase 2C - Employee Core Domain

- TASK-017 -> TASK-019

### Fase 2D - Identity / Security

- TASK-020 -> TASK-021

### Fase 2E - Backend Core HR Foundation

- TASK-022 -> TASK-028

### Fase 2F - API CRUD Master Data

- TASK-030 -> TASK-032

### Fase 2G - Login Foundation

- TASK-034 -> TASK-035

### Fase 2H - Frontend Shell / UI Admin / Operations

- TASK-036 -> TASK-062

### Fase 2I - Platform Operations

- TASK-063 -> TASK-064

### Fase 3 - Stabilization

- TASK-065 -> TASK-066

---

## 7. Regola operativa

Prima struttura, poi integrazione grafica reale, poi business.

Metronic è riferimento UI, non template da copiare integralmente.

---

## 8. Cronologia versioni

| Versione | Data | Descrizione |
|---|---|---|
| 1.92 | 2026-05-09 | TASK-048.10 completato come shell navigation visual review documentale: TEMPLATE-08 e TEMPLATE-09 valutati senza modifiche applicative; inserito TASK-048.11 "Sidebar visual alignment to TEMPLATE-08" e rinumerati i successivi TASK-048.x fino a TASK-048.14. |
| 1.91 | 2026-05-09 | TASK-048.9 aggiornato in roadmap con decisione durevole: oltre alla governance documentale include integrazione/versionamento repository-local della skill approvata `angular-developer` tramite `.agents/` e `skills-lock.json`; `angular-new-app` esclusa, nessuna modifica applicativa/backend/API. |
| 1.90 | 2026-05-09 | Inserito TASK-048.9 "Configure Angular AI skills and project agent integration" nella roadmap: governance documentale per skill Angular `angular-developer`, esclusione di `angular-new-app`, Plan mode e IDE context; rinumerati i successivi TASK-048.x fino a TASK-048.13 e prossimo passo aggiornato, senza modifiche applicative/backend/API. |
| 1.89 | 2026-05-09 | TASK-048.8 final refinement completato in roadmap: aggiunti link visuale password dimenticata e footer legale i18n alla login, ripulito il selettore lingua, nessuna modifica backend/API/routing. |
| 1.88 | 2026-05-09 | TASK-048.8 seconda iterazione completata in roadmap: login visual alignment review approfondita rispetto a TEMPLATE-06 con patch visuale piu incisiva su card, brand cluster, language selector, CTA e responsive; nessuna modifica backend/API. |
| 1.87 | 2026-05-09 | TASK-048.8 completato in roadmap: login visual alignment review su TEMPLATE-06 con patch visuale minima su `/login`, coerenza i18n e nessuna modifica backend/API; prossimo passo aggiornato a TASK-048.9. |
| 1.86 | 2026-05-09 | Rinumerati i subtask TASK-048.x: inserito TASK-048.8 "Login visual alignment review", slittati i successivi (`048.9` shell navigation, `048.10` bulk editor planning, `048.11` shared form controls, `048.12` global typography) e riallineati prossimi passi/riferimenti interni. |
| 1.85 | 2026-05-09 | Aggiunto TASK-048.10 "Shared form controls and form patterns foundation" alla roadmap come TODO e rinumerata la typography foundation a TASK-048.11; aggiornato backlog TASK-048 senza modifiche codice/frontend/backend. |
| 1.84 | 2026-05-09 | TASK-048.5 follow-up completato: riallineati CRUD modal e confirmation dialog footer al mockup HTML validato con modal compatta, spacing/footer actions coerenti e cancel outline; build/test frontend rieseguiti, nessuna modifica backend/API. |
| 1.83 | 2026-05-09 | TASK-048.5 completato: standardizzati footer e action ordering di CRUD modal e confirmation dialog su `/master-data` con `app-button`, `kt-modal-footer` e regola read-only `Chiudi` unico nel footer; build/test frontend OK, nessuna modifica backend/API. |
| 1.82 | 2026-05-09 | TASK-048.7 esteso con wrapper Angular shared `app-button` sopra il design system `kt-btn`, applicato a `/master-data`, `master-data-form` e parti sicure di `DataTableComponent`; build/test frontend rieseguiti, nessuna modifica backend/API. |
| 1.81 | 2026-05-09 | TASK-048.7 completato: introdotta foundation condivisa pulsanti per pagine lista su `/master-data` e `DataTableComponent` con varianti `kt-btn-secondary`, `kt-btn-ghost`, helper icona/list-action; mantenuto `TEMPLATE-11`, nessuna modifica backend/API. |
| 1.80 | 2026-05-09 | TASK-048.6 completato in roadmap: applicati TEMPLATE-07 e TEMPLATE-11 a toast e pulsanti, introdotto pattern shared `NotificationService` + `NotificationHostComponent` con `AlertMessageComponent`, Metronic/Keenicons e i18n `it/fr/en`; build test frontend OK, nessuna modifica backend/API. |
| 1.79 | 2026-05-09 | Introdotta la "Global typography foundation" nella roadmap come step backlog dedicato alla tipografia globale, successivamente rinumerata a TASK-048.12; senza modifiche codice in questa fase. |
| 1.78 | 2026-05-08 | TASK-048.4 completato in roadmap: applicati TEMPLATE-01, TEMPLATE-03 e TEMPLATE-10 al pattern lista `/master-data` e al `DataTableComponent` shared; prossimo passo aggiornato a TASK-048.5, build/test frontend OK e nessuna modifica backend. |
| 1.77 | 2026-05-08 | TASK-048.3 riallinea i sottotask TASK-048 al catalogo template UI validato in TASK-048.2: TASK-048 diventa iniziativa generale HRflow design system/template UI, Master Data resta caso pilota e nessuna modifica Angular/backend è prevista. |
| 1.76 | 2026-05-08 | TASK-048.2 chiuso come completato in roadmap: validato catalogo astratto di UI template Stitch documentato in `docs/design/DESIGN-SYSTEM.md`, screenshot locali ignorati via `.gitignore`, nessuna modifica Angular/backend; prossimo passo aggiornato a TASK-048.3. |
| 1.75 | 2026-05-08 | TASK-048.1 completato come preparation documentale: creato `docs/design/DESIGN-SYSTEM.md`, formalizzate regole iniziali Master Data table/popup e prossimo passo aggiornato a TASK-048.2 Stitch mockup validation. |
| 1.74 | 2026-05-08 | TASK-047.3 segnato completato come QA/hardening del delete fisico Master Data; roadmap riallineata con TASK-047.3 tra i completati, rimosso dai da fare e prossimo passo aggiornato a TASK-048.1. |
| 1.73 | 2026-05-08 | Corretta la rinumerazione dopo TASK-048 e allineati i range roadmap: Fase 2H fino a TASK-062, Fase 2I TASK-063..TASK-064 e Fase 3 TASK-065..TASK-066. |
| 1.72 | 2026-05-08 | Introdotti i sottotask TASK-048.1..TASK-048.4 per preparation, validazione mockup Stitch, documentazione design system e implementazione controllata del design refinement Master Data; confermato blocco permessi su TASK-049..TASK-054. |
| 1.71 | 2026-05-08 | Introdotto TASK-048 (Master Data table and popup design refinement) prima del blocco Super Admin / permessi; blocco permessi slittato a TASK-049..TASK-054 con flusso precondizionato su design. |
| 1.70 | 2026-05-08 | TASK-047.2 completato: azione frontend `Elimina` integrata in `/master-data` con conferma, chiamata `DELETE /{id}/physical`, handling errori/`409` e test frontend dedicati; prossimo step impostato su TASK-047.3 QA/hardening. |
| 1.69 | 2026-05-07 | TASK-047.1 completato con foundation backend delete fisico sicuro su entita HR/business candidate: endpoint `/physical` separati, blocco `409 Conflict` su record referenziati, test backend reali validati e prossimo step aggiornato a TASK-047.2 frontend action. |
| 1.68 | 2026-05-07 | TASK-047 scomposto in subtask incrementali senza rinumerare il backlog successivo: 047.1 backend foundation delete fisico sicuro, 047.2 azione frontend `Elimina`, 047.3 QA/hardening. |
| 1.67 | 2026-05-07 | Introdotto TASK-047 "Master Data physical delete for non-referenced records" come follow-up distinto dalla disattivazione logica: `Disattiva` resta `active=false`, `Elimina` sara delete fisico solo per record non referenziati; blocco Super Admin/RBAC slittato a TASK-048..TASK-053 e range futuri aggiornati fino a TASK-065. |
| 1.66 | 2026-05-07 | TASK-046.4 riallineato alla disattivazione logica `active=false`: UX aggiornata da `Elimina` a `Disattiva`, conferma/feedback/error handling i18n coerenti, refresh lista mantenuto e follow-up filtro attivi/inattivi + riattiva demandati a task successivi. |
| 1.65 | 2026-05-07 | TASK-046.4 completato con delete/disattivazione frontend su `/master-data`, conferma esplicita, feedback successo/errore e refresh coerente della lista; prossimo step aggiornato a TASK-046.5. |
| 1.64 | 2026-05-07 | TASK-046.3 completato con integrazione frontend create/update verso le API CRUD Master Data HR/business esistenti per entita semplici candidate, refresh lista post-save, feedback modal e prossimo step aggiornato a TASK-046.4. |
| 1.63 | 2026-05-07 | Ottimizzata la roadmap del blocco TASK-047..TASK-052: chiarita sequenza strategia -> review -> foundation permessi -> foundation utenti/ruoli -> UX frontend -> enforcement backend, con separazione esplicita frontend UX vs backend security. |
| 1.62 | 2026-05-07 | Aggiornato TASK-047 come "Platform Super Admin and tenant-aware permissions model" nel blocco post-TASK-046, con focus su modello permessi tenant-aware, ruoli seed/custom e impatto frontend/backend security. |
| 1.61 | 2026-05-07 | Backlog riorganizzato dopo TASK-046: subtask 046 riallineati (`046.1`-`046.5`), introdotto blocco authorization/Super Admin con TASK-047..TASK-052 e slittamento coerente dei task successivi/range roadmap fino a TASK-064. |
| 1.60 | 2026-05-07 | TASK-046.2 completato con Master Data CRUD form foundation: form metadata-driven `create`/`edit`/`view` integrato in `/master-data`, validazioni base e hook frontend senza mutazioni backend; prossimo step aggiornato a TASK-046.3. |
| 1.59 | 2026-05-07 | TASK-046.1 completato come CRUD action foundation frontend: `DataTableComponent` supporta azioni riga configurabili e il container `/master-data` riceve gli eventi; il prossimo step passa a TASK-046.2 per analisi form/configurazione entita prima di introdurre create/update reali. |
| 1.58 | 2026-05-07 | TASK-046 ridefinito come "Master Data CRUD standard foundation": prossimo step orientato a standard CRUD frontend riutilizzabile basato su `DataTableComponent`, azioni configurabili, form/modal o pannello laterale, API CRUD backend esistenti e sviluppo incrementale senza editing inline o nuove API backend. |
| 1.57 | 2026-05-06 | TASK-045 completato con componente shared read-only per tabelle Master Data, colonne configurabili, campi nested, stati UI e paginazione tramite eventi integrati in `/master-data`; prossimo passo aggiornato a TASK-046 UI Master Data Admin CRUD. |
| 1.56 | 2026-05-06 | TASK-045 riallineato come contenitore di subtask frontend incrementali (045.1-045.6) per Shared Master Data table component: primo rilascio read-only, filtri lasciati al container, evoluzioni avanzate (inline edit/CRUD dinamico, drag&drop colonne, preferenze utente, lookup dinamiche, validazioni avanzate) separate in backlog futuro. |
| 1.55 | 2026-05-06 | Governance/backlog frontend aggiornati: TASK-044 resta dedicato a import/visualizzazione CAP italiani; refactoring shared della tabella Master Data isolato nel nuovo TASK-045; task successivi rinumerati di +1. |
| 1.54 | 2026-05-06 | TASK-044 completato con import CAP italiani da dataset JSON acquistato normalizzato in CSV (8465 record validi), import idempotente backend su `global_zip_codes`, report import e test backend/frontend di regressione validati; prossimo passo aggiornato a TASK-045 UI Master Data Admin CRUD. |
| 1.53 | 2026-05-06 | TASK-043 completato con paginazione e filtro generico Master Data API/UI (query `page/size/search`, response wrapper paginata, UI `/master-data` con debounce e precedente/successiva), test backend/frontend validati e QA manuale browser superato; prossimo passo aggiornato a TASK-044 Import CAP italiani. |
| 1.52 | 2026-05-06 | TASK-042 completato (country default currency nullable, seed ISO 3166-1 alpha-2 con 249 Paesi/territori, migrazione Flyway V17 PostgreSQL/H2 e test backend validati); backlog futuro riallineato con nuovo TASK-043 su paginazione/filtro generico Master Data API/UI, Import CAP italiani rinumerato a TASK-044 e CRUD UI Master Data rinumerato a TASK-045. |
| 1.51 | 2026-05-06 | TASK-041 completato con UI Master Data Admin foundation/list read-only su `/master-data`, integrazione sidebar `Governance > Dati di base`, categorie Global/HR-business/Governance-security, stati loading/error/empty, refresh manuale, i18n completo e build/test frontend validati; prossimo passo aggiornato a TASK-042 UI Master Data Admin CRUD. |
| 1.50 | 2026-05-05 | TASK-040 completato con frontend i18n foundation runtime custom/minimale: lingua default italiana, dizionario typed, fallback a `it`, `I18nService`, persistenza `localStorage`, selector lingua login, `lang="it"` e testi principali estratti senza nuove dipendenze; prossimo passo aggiornato a TASK-041 UI Master Data Admin foundation/list. |
| 1.49 | 2026-05-05 | TASK-039 rifinito con sidebar collassabile/espandibile, modalita compatta top-level, search/submenu nascosti da collassata e test componente aggiornati; prossimo passo resta TASK-040 Frontend i18n foundation. |
| 1.48 | 2026-05-05 | TASK-039 completato con sidebar navigation tree foundation: dati menu tipizzati, supporto a 3 livelli, expand/collapse, active route highlighting e ricerca/filtro locale; prossimo passo aggiornato a TASK-040 Frontend i18n foundation. |
| 1.47 | 2026-05-05 | Backlog futuro rinumerato in chiusura TASK-036: TASK-039 diventa Frontend sidebar navigation tree foundation, TASK-040 diventa Frontend i18n foundation, Master Data Admin slitta a TASK-041/TASK-042 e prossimo passo aggiornato a TASK-039. |
| 1.46 | 2026-05-05 | Riallineamento documentale intermedio dei task frontend futuri, sostituito dalla rinumerazione definitiva in versione 1.47. |
| 1.45 | 2026-05-05 | TASK-036 completato con home autenticata post-login: route protetta `/` sotto `app-shell`, header/sidebar visibili, `HomeComponent` minimale e placeholder dashboard rimossi dalla shell; nessuna UI Master Data Admin, nessun backend e nessuna modifica a login/JWT; prossimo passo aggiornato a TASK-039. |
| 1.44 | 2026-05-05 | TASK-038 completato con direttive frontend/design basate sui colori del logo documentate in `frontend/AGENTS.md`; roadmap riallineata con Master Data Admin foundation/list a TASK-039, CRUD a TASK-040 e task successivi fino a TASK-052; prossimo passo resta TASK-036 finche la home shell foundation non viene chiusa. |
| 1.43 | 2026-05-05 | TASK-037 completato con integrazione del logo applicativo nella login UI esistente usando `assets/logos/hrm-logo.png`; nessuna modifica a backend, routing, autenticazione, login/logout, sidebar/header/shell o UI Master Data Admin; prossimo passo resta TASK-036 finche la home shell foundation non viene chiusa. |
| 1.42 | 2026-05-05 | Riallineato backlog documentale: TASK-036 diventa frontend authenticated home shell foundation, TASK-037 frontend application logo integration, Master Data Admin foundation/list spostato a TASK-038, Master Data Admin CRUD a TASK-039 e task successivi rinumerati fino a TASK-051; prossimo passo aggiornato a TASK-036. |
| 1.41 | 2026-05-04 | TASK-035 completato con frontend login foundation: route `/login`, LoginComponent, shared email/password fields, alert feedback, AuthService/AuthGuard/AuthInterceptor, token JWT in `sessionStorage`, route principale protetta, build e test frontend validati; prossimo passo aggiornato alla UI Master Data Admin foundation/list, poi riallineata in 1.42. |
| 1.40 | 2026-05-04 | TASK-034 completato con backend login/JWT foundation: endpoint `/api/auth/login` e `/api/auth/me`, JWT stateless, login email-only case-insensitive, BCrypt, password policy, migration V15 email globale case-insensitive e BUILD SUCCESS; prossimo passo aggiornato a TASK-035 frontend login foundation. |
| 1.39 | 2026-05-04 | TASK-033 completato come riorganizzazione documentale backlog: login/JWT foundation backend e frontend spostate prima delle UI amministrative; prossimo passo aggiornato a TASK-034 backend login/JWT foundation e Master Data Admin spostato dopo login foundation. |
| 1.38 | 2026-05-04 | TASK-032 completato con API CRUD backend master data governance/security sotto `/api/master-data/governance-security`, DTO globali e tenant-scoped, service layer applicativo, soft delete, gestione errori 400/404/409, test MockMvc/OpenAPI e BUILD SUCCESS; prossimo passo aggiornato a TASK-033 UI Master Data Admin foundation/list. |
| 1.37 | 2026-05-04 | TASK-031 completato con API CRUD backend master data HR/business sotto `/api/master-data/hr-business`, DTO tenant-scoped, service layer applicativo, soft delete, gestione errori 400/404/409, test MockMvc/OpenAPI e BUILD SUCCESS; prossimo passo aggiornato a TASK-032 API CRUD master data governance/security. |
| 1.36 | 2026-05-03 | TASK-030 completato con API CRUD backend master data globali sotto `/api/master-data/global`, DTO espliciti, service layer applicativo, soft delete, gestione errori 400/404/409, test MockMvc/OpenAPI e BUILD SUCCESS; prossimo passo aggiornato a TASK-031 API CRUD master data HR/business. |
| 1.35 | 2026-05-03 | Backlog riorganizzato: Master Data Admin UI rinviata dopo API CRUD master data globali, HR/business e governance/security; prossimo passo aggiornato a TASK-030 API CRUD master data globali. |
| 1.34 | 2026-05-03 | TASK-029 documentale completato con governance frontend UI/shared components in `frontend/AGENTS.md`; backlog successivo rinumerato e prossimo passo aggiornato a TASK-030. |
| 1.33 | 2026-05-03 | TASK-028 completato con Core HR API readiness backend read-only, controller /api/core-hr, service read-only, DTO corehr e test MockMvc/OpenAPI validati con BUILD SUCCESS; UI Master Data Admin rinumerata successivamente nel backlog. |
| 1.32 | 2026-05-03 | TASK-027 completato con EmployeeDisciplinaryAction backend foundation, EmployeeDisciplinaryAction entity, EmployeeDisciplinaryActionRepository, migration V14 employee_disciplinary_actions e test backend persistence/query/constraint validati con BUILD SUCCESS; prossimo passo aggiornato a TASK-028 Consolidare API readiness backend core HR. |
| 1.31 | 2026-05-03 | TASK-026 completato con AuditLog backend foundation, AuditLog entity, AuditLogRepository, migration V13 audit_logs e test backend persistence/query/constraint validati con BUILD SUCCESS; prossimo passo aggiornato a TASK-027 EmployeeDisciplinaryAction backend foundation. |
| 1.30 | 2026-05-03 | TASK-025 completato con HolidayCalendar backend foundation, HolidayCalendar entity, HolidayCalendarRepository, migration V12 holiday_calendars e test backend persistence/query/constraint validati con BUILD SUCCESS; prossimo passo aggiornato a TASK-026 AuditLog backend foundation. |
| 1.29 | 2026-05-03 | TASK-024 completato con LeaveRequest backend foundation, LeaveRequest entity, LeaveRequestStatus enum, LeaveRequestRepository, migration V11 leave_requests e test backend persistence/query/constraint validati con BUILD SUCCESS; prossimo passo aggiornato a TASK-025 HolidayCalendar backend foundation. |
| 1.28 | 2026-05-03 | TASK-023 completato con PayrollDocument backend foundation, PayrollDocument entity, PayrollDocumentStatus enum, PayrollDocumentRepository, migration V10 payroll_documents e test backend persistence/query validati con BUILD SUCCESS; prossimo passo aggiornato a TASK-024 LeaveRequest backend foundation. |
| 1.27 | 2026-05-02 | TASK-022 completato con Device backend foundation, migration V9, JPA entity/repository e test backend; prossimo passo aggiornato a TASK-023 PayrollDocument backend foundation. |
| 1.26 | 2026-05-02 | TASK-021 completato con RBAC bridge foundation, migration V8, JPA entity/repository e test backend; prossimo passo aggiornato a TASK-022 Device backend foundation. |
| 1.25 | 2026-05-02 | TASK-020 completato con UserAccount identity/security foundation, migration V7, JPA entity/repository e test backend; prossimo passo aggiornato a TASK-021 RBAC bridge foundation. |
| 1.24 | 2026-05-02 | TASK-019 completato come riorganizzazione documentale backend-first; prossimo passo aggiornato a TASK-020 UserAccount identity/security foundation. |
| 1.23 | 2026-05-02 | TASK-018 completato con Contract governance foundation, migration V6, JPA entity/repository e test backend; prossimo passo aggiornato a TASK-019 UI Employee management enterprise. |
| 1.22 | 2026-05-02 | TASK-017 completato con Employee core domain persistence documentata, migration V5, JPA entity/repository e test backend; prossimo passo aggiornato a TASK-018 Contract governance. |
| 1.21 | 2026-05-02 | TASK-016 completato con foundation validation, DTO/service API boundary, endpoint read-only e OpenAPI verification; prossimo passo aggiornato a TASK-017 Employee core domain foundation. |
| 1.20 | 2026-05-02 | TASK-015 completato con Tenant reale, CompanyProfile, OfficeLocation, SmtpConfiguration e FK hardening; prossimo passo aggiornato a TASK-016 validation/API readiness. |
| 1.19 | 2026-05-02 | TASK-014 completato; prossimo passo aggiornato a TASK-015 Tenant + CompanyProfile foundation. |
| 1.18 | 2026-05-02 | Hardening roadmap post TASK-013: fase corrente aggiornata, nota tenant placeholder strategy e prossimo passo confermato su TASK-014. |
| 1.17 | 2026-05-02 | TASK-013 completato con master tables HR/business tenant-scoped, BaseTenantMasterEntity, migration Flyway V2, seed placeholder e test smoke backend. |
| 1.16 | 2026-05-02 | TASK-012 completato con master tables globali foundation, migration Flyway, seed minimo e test smoke backend. |
| 1.15 | 2026-05-01 | Riorganizzazione completa TASK-012+ in fasi 2A-2G e Fase 3 dopo espansione enterprise foundation. |
| 1.14 | 2026-05-01 | TASK-011 esteso con platform operator, super admin, cross-tenant governance, tenant switching e strong authentication obbligatoria per utenti elevati. |
| 1.13 | 2026-05-01 | TASK-011 esteso con email-first authentication, identity governance, authentication governance e MFA readiness. |
| 1.12 | 2026-05-01 | TASK-011 aggiornato a foundation SaaS multi-tenant con tenant/company hierarchy, legal entity, office hierarchy, audit e disciplinary governance. |
| 1.11 | 2026-05-01 | TASK-011 ridefinito come platform data foundation con master/core/bridge architecture, tenant, RBAC, SMTP, geographic, contract e document governance. |
| 1.10 | 2026-05-01 | TASK-011 dettagliato come blueprint dati completo con master/core separation, demographic governance, lifecycle e multi-country governance. |
| 1.9 | 2026-05-01 | TASK-011 esteso con master data governance, employee/device lifecycle e contact standardization. |
| 1.8 | 2026-05-01 | TASK-011 aggiornato a foundation dati enterprise normalizzata con master data architecture, multi-country readiness e HR core domain foundation. |
| 1.7 | 2026-05-01 | TASK-010 completato; profili dev/test/prod configurati e prossimo passo aggiornato al modello dati iniziale. |
| 1.6 | 2026-05-01 | TASK-009 completato; Swagger/OpenAPI integrato, validato e documentato nella roadmap backend/API. |
| 1.5 | 2026-05-01 | TASK-008 completato; roadmap aggiornata con layout reale Metronic completato e Swagger come prossimo step. |
| 1.4 | 2026-05-01 | Riallineata roadmap dopo completamento TASK-006 e TASK-007; introdotto TASK-008 layout-6 reale. |
| 1.3 | 2026-05-01 | Aggiornato avanzamento dopo TASK-005 e aggiunto step Metronic Angular prima di Swagger. |
| 1.2 | 2026-05-01 | Aggiornato avanzamento dopo TASK-004 Docker Compose PostgreSQL. |
| 1.1 | 2026-05-01 | Aggiornato avanzamento dopo TASK-001, TASK-002 e TASK-003. |
| 1.0 | 2026-05-01 | Prima versione roadmap MVP. |

