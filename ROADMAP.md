# ROADMAP.md

## Progetto HRM AI-first

Versione: 2.69
Ultimo aggiornamento: 2026-05-16
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
- TASK-048.9 Configure Angular AI skills and project agent integration
- TASK-048.10 Shell navigation visual review
- TASK-048.11 Sidebar visual alignment to TEMPLATE-08
- TASK-048.12 CRUD modal and form visual refinement
- TASK-048.13 Header/topbar visual alignment to TEMPLATE-09
- TASK-048.14 Spreadsheet-style bulk editor planning
- TASK-048.15 Shared form controls and form patterns foundation
- TASK-048.16 Global typography foundation
- TASK-050 Configure Spring AI skill and backend agent integration
- TASK-051 User, Role and Permission domain review
- TASK-052 Permission model foundation by scope/resource/action
- TASK-053.1 Backend role administration API foundation
- TASK-053.2 Frontend role permission matrix UI foundation
- TASK-053.4 Tenant user administration read/list/detail foundation
- TASK-053.5 Tenant user role assignment foundation
- TASK-053.6 Tenant user password administration foundation
- TASK-053.7 Tenant user create/edit foundation
- TASK-053.8 Tenant user lifecycle foundation
- TASK-053.9 UserAccount Employee link foundation
- TASK-054 Frontend permission summary and visibility UX foundation
- TASK-055 Backend RBAC enforcement foundation
- TASK-056 Shared confirmation dialog foundation
- TASK-057 Finalize ZIP import foundation and test isolation
- TASK-059 Master Data CRUD completion
- TASK-059.1 Standardizzare code Master Data HR/business
- TASK-059.2 Estendere code automatico ai restanti Master Data
- TASK-060 Autogenerazione codice ruolo custom
- TASK-061 i18n alert/messages consistency check
- TASK-062 Address geography model decision
- TASK-063 Address geography backend foundation
- TASK-064.1 Tenant UI naming and layout refinement
- TASK-064.2 Tenant automatic code generation
- TASK-064.3 Automatic code standard for future entities
- TASK-064.4 Company Profile fiscal fields
- TASK-064.5 Company Profile Administration UI foundation
- TASK-064.6 Shared lookup select and phone field foundation
- TASK-064.7 Supporto CAP manuali nei form indirizzo
- TASK-064.8 Creazione manuale dati geografici esteri da form indirizzo
- TASK-064.9 CompanyProfile phone persistence normalization + compatibility bridge
- TASK-064.10 Apply shared lookup select to existing administration forms
- TASK-064.11 CRUD amministrativo Region e Area nei Dati di base
- TASK-065 Riorganizzazione backlog Core HR UI prima di Employee
- TASK-066.1 Device governance backlog refinement
- TASK-066.2 Device backend administration CRUD
- TASK-066.3 Device asset code and barcode/QR foundation
- TASK-066.4 Device assignment history foundation
- TASK-066.5 Device frontend administration UI
- TASK-066.6 Device assignment UI

### Prossimo passo

- TASK-066.7 completato: label print Device validata con build/test frontend e verifica manuale browser.
- TASK-066.8 completato: `DetailActionBar` consolidato come pattern shared ufficiale delle action bar di dettaglio, applicato solo a Device, con follow-up migrazione completa demandato a `TASK-066.10`.
- Sequenza Device pianificata: `TASK-066.9` QA hardening, `TASK-066.10` applicazione componente shared header dettaglio a User/Company Profile
- Sequenza backlog successiva invariata: `TASK-067` UI HolidayCalendar, `TASK-068` UI disciplinary governance, `TASK-069` UI PayrollDocument foundation, `TASK-070` UI LeaveRequest foundation, `TASK-071` Audit UI / compliance explorer, `TASK-072` Security Admin UI completion/hardening, `TASK-073` UI Employee management enterprise
- Follow-up gia pianificati: tenant switching runtime, impersonation runtime e hardening authorization su future API protette non ancora mappate

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
- TASK-048.13 completed: header/topbar visual alignment refined to TEMPLATE-09 scope, adding contextual page title, centered content balance and lighter avatar/user menu; sidebar unchanged and no backend/API modifications.
- TASK-048.14 completed: spreadsheet-style bulk editor documented as future pattern with bounded use cases, reuse rules, accessibility/i18n/performance constraints and recommendation for a dedicated component separate from the current read-only `DataTableComponent`; no Angular/backend changes.
- TASK-048.15 completed: shared form controls foundation started with control inventory and first shared control `app-checkbox` integrated in Master Data CRUD modal; design/accessibility/i18n patterns formalized in `docs/design/DESIGN-SYSTEM.md`.
- TASK-049 completed: Platform Super Admin and tenant-aware permissions strategy documented, with `PLATFORM_SUPER_ADMIN` global boundary, `TENANT_ADMIN` tenant boundary, protected seed roles, tenant custom roles, CRUD permission separation for Global/Tenant Master Data, default-deny cross-tenant rules and backend-authoritative security model.
- TASK-050 completed: repository-local backend governance skill `spring-backend-developer` approved and versioned with `skills-lock.json`, `backend/AGENTS.md` alignment and prompt-governance documentation, without backend/frontend code changes.
- TASK-051 completed: User/Role/Permission domain review documented current `UserType`, `UserAccount`, `Role`, `Permission`, `UserRole`, `RolePermission`, `UserTenantAccess`, governance-security API and JWT/auth state, with gap analysis toward TASK-049.
- TASK-052 completed: permission model foundation added with backend enum/helper vocabulary for `SCOPE.RESOURCE.ACTION`, Flyway V18 seed matrix for approved platform/tenant resources/actions and `system_permission=true` seed permissions, without runtime enforcement or single Master Data entity granularity.
- TASK-053.1 completed: backend role administration API foundation available under `/api/admin/roles`, with role list/detail, assigned permission read, transactional replace of role-permission assignments, DTO boundaries, tenant consistency validation and targeted backend tests validated.
- TASK-053.4 completed: tenant user administration read/list/detail foundation available under `/api/admin/users`, with frontend `/admin/users` and `/admin/users/:id`, derived Employee names with email fallback, assigned roles and tenant accesses read-only, i18n `it/fr/en` and backend/frontend tests validated.
- TASK-053.5 completed: tenant user role assignment foundation available under `/api/admin/users/{userId}/roles`, with assigned-role read, available-role read, role assign/remove, tenant/access/duplicate validations, minimal UI in user detail, i18n `it/fr/en` and backend/frontend full tests validated.

Nota:

Tenant placeholder strategy converted into full Tenant domain in TASK-015.
Governance/security split active: global authentication standards are shared, while roles, permissions and operational classifications remain tenant-scoped.
Foundation API readiness active through read-only DTO responses; operational write APIs remain deferred.
Employee persistence foundation is available with documented core fields; Employee REST API, UI and operational workflows remain deferred.
Contract persistence foundation is available with start/end dates and active lifecycle flag; contract APIs, HR workflows and payroll integration remain deferred.
Backlog execution is now backend-first: core technical foundations and API readiness precede operational UI tasks.
UserAccount persistence foundation is available; login runtime, JWT, OTP/MFA execution and API remain deferred.
RBAC bridge persistence foundation is available; TASK-049 strategy and TASK-051 domain gap analysis are documented, while runtime authorization, Spring Security RBAC, tenant switching, impersonation, administrative service layer, API and UI remain deferred.
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
TASK-059 completed the physical delete completion for the requested HR/business master data, keeping logical deactivation distinct and reusing the existing DELETE permission model.
TASK-059.1 completed the code standardization for the 6 requested HR/business master data entities with backend auto-code generation (`PPNNN`), UI non-editable code, and data migration of existing records (including employee employment status mapping).
TASK-059.2 completed the automatic code extension to `Department`, `JobTitle`, `ContractType` and `WorkMode`, reusing the existing backend/UI pattern and applying V22 data normalization with conditional employee-field remapping only when tenant-scoped `old_code` references actually existed.
TASK-059.4 completed the Governance/security Master Data rationalization by removing `Role`, `Permission` and `AuditActionType` from the generic UI, keeping `UserType`, `AuthenticationMethod` and `SmtpEncryptionType` visible without auto-code, adding selective auto-code to `CompanyProfileType`, `OfficeLocationType` and `DisciplinaryActionType`, normalizing existing records with Flyway `V23`, enabling physical delete for the three selective auto-code resources in backend/UI, and hiding generic technical tenant columns in the shared Master Data table flow.
TASK-060 completed the role custom-code decision and implementation by confirming that runtime authorization depends on `permission.code`, keeping semantic seeded system role codes unchanged, generating tenant-scoped custom role codes as `RO###`, removing `code` from create payload/UI, and keeping `code` visible but read-only in edit/view.
TASK-064.3 completed the durable governance standard for future entities with `code`, formalizing in `DEC-039` the default auto-code rule `prime due lettere + progressivo 3 cifre`, backend generation, UI non-editable code and documented exceptions only.
TASK-064.4 completed the Company Profile fiscal fields follow-up by adding nullable `taxNumber`, `pecEmail` and `sdiCode` to `CompanyProfile` only, shipping Flyway `V27` PostgreSQL/H2 migrations, extending foundation response mapping and backend tests, and keeping `taxIdentifier`, `Tenant`, security/RBAC and CRUD/UI scope unchanged.
TASK-064.5 completed the Company Profile Administration UI foundation and pre-commit functional return with backend admin APIs under `/api/admin/company-profiles`, tenant-aware backend auto-code `CP001/CP002`, activate/deactivate/delete lifecycle, `COMPANY_PROFILE` permissions through `READ`/`CREATE`/`UPDATE`/`DELETE`, tenant-aware normalization of existing company profile codes, company profile type seed completion, Angular admin routes/list/detail/form aligned to `/admin/users`, shared DataTable reuse, Italian naming `Profilo aziendale`, minimal local phone handling, refined address order, i18n `it/fr/en` and green backend/frontend validation.
TASK-064.6 completed the shared lookup/phone foundation by reusing the existing paginated master-data contract, adding backend lookup endpoints only for `Country`, `Region`, `Area` and `GlobalZipCode`, introducing shared Angular components `app-lookup-select` and `app-phone-field`, and limiting the pilot to `CompanyProfile` while preserving the current backend `phone: string | null` contract through a compatibility emission mode.
TASK-064.7 completed the ZIP/CAP manual lookup hardening across address forms by extending the existing paginated lookup contract, supporting `GlobalZipCode.areaId` nullable records with `provinceName/provinceCode` fallback, and keeping the approved TASK-062/TASK-063 geography model unchanged.
TASK-064.8 completed the guided foreign geography creation flow on `CompanyProfileAdministrationForm`, extending `app-lookup-select` with an external optional add affordance, keeping Italy on imported ZIP lookup, reusing the existing Region/Area/GlobalZipCode APIs and adding tenant-aware backend auto-code `RE###`/`AR###` for Region/Area create without schema, security or RBAC changes.
TASK-064.9 completed the dedicated `CompanyProfile` phone persistence normalization by introducing `phoneDialCode` and `phoneNationalNumber` at DB/API level, keeping `phone` as a temporary compatibility bridge, applying a conservative legacy backfill strategy and formalizing the reusable standard for future contact entities in `DEC-041`.
TASK-064.10 completed the progressive adoption of `app-lookup-select` on existing admin forms by covering `UserAdministrationForm` (`userTypeId`, `tenantId`, `companyProfileId`), `UserAdministrationDetail` (tenant and assignable role selectors) and `CompanyProfileAdministrationForm` (`tenantId`, `companyProfileTypeId`, `countryId`), while preserving API contracts/security, keeping `TenantAdministration.defaultCurrencyId` local for lack of a compatible lookup endpoint, and leaving `MasterDataAdmin` category/entity as static frontend filters.
TASK-064.11 completed the dedicated `Region` and `Area` administrative CRUD in Master Data by extending the existing `/api/master-data/global` APIs, adding safe physical-delete constraints on references, backend-side auto-code (`RE###`/`AR###`), tenant-aware filters/lookups and Angular CRUD reuse without changes to tenant/security/RBAC or the approved geography model.
TASK-065 completed the Core HR UI backlog reorganization by moving Employee to `TASK-073` and prioritizing smaller CRUD/UI modules first.
TASK-066.1 completed the Device governance backlog refinement by splitting `TASK-066` into backend, frontend, asset-code/barcode, assignment-history, label-print and QA subtask slices without code changes.
TASK-066.2 completed the backend Device administration CRUD by reusing the existing `Device` model, exposing `/api/admin/devices` list/detail/create/update/activate/deactivate/delete plus lookup form-options, enforcing tenant-scoped validations and reusing existing `DEVICE` permissions already seeded in `V18`.
TASK-066.3 completed the backend-only Device asset identity foundation by adding tenant-scoped `assetCode` format `DEV000001`, `barcodeValue = assetCode`, vendor-specific Flyway `V35` backfill/unique constraints, admin API exposure on list/detail only and full backend test validation.
TASK-066.4 completed the backend-only Device assignment history foundation by adding `device_assignments` via Flyway `V36`, backfilling current assignments, extending `/api/admin/devices` with history/assign/return endpoints, enforcing single-open-assignment logic in the service with pessimistic `Device` locking and validating the backend suite end-to-end.
TASK-066.5 completed the frontend Device administration UI by wiring the existing sidebar item `nav.devices` to `/admin/devices`, extending the frontend permission summary with `devices -> DEVICE`, adding Angular list/create/edit/detail routes, reusing `app-data-table`, `app-lookup-select` and the existing admin card/form patterns, keeping current assignment informational only, and validating build/test with full i18n `it/fr/en`.
TASK-066.6 completed the frontend Device assignment UI by extending the admin detail with assignment history, wiring assign/reassign/return only to the existing admin endpoints, reusing `detail-action-bar`, `app-lookup-select`, `app-date-time-field` and current admin card patterns, validating build/test with full i18n `it/fr/en`, and then aligning the dev QA bootstrap role `DEV_PLATFORM_TENANT_ADMIN_QA` with `PLATFORM.DEVICE.READ/CREATE/UPDATE/DELETE` after a manual `403` report on `return`.

Prossimo passo:

- TASK-066.9 Device governance QA hardening
- Follow-up gia pianificati: tenant switching runtime, impersonation runtime e hardening authorization su future API protette non ancora mappate

Sequenza immediata Core HR UI post-TASK-064.11:

- TASK-062: decisione documentale sul modello geografico indirizzi completata tramite `DEC-038`;
- TASK-063: foundation backend geography con tenant scope Region/Area e modello ZIP/CAP ibrido completata;
- TASK-065: riorganizzazione backlog Core HR UI completata come task documentale;
- TASK-066: UI Device governance, raffinato in subtask `TASK-066.1`..`TASK-066.10`;
- TASK-066.2: Device backend administration CRUD completato;
- TASK-066.3: Device asset code and barcode/QR foundation completato;
- TASK-066.4: Device assignment history foundation completato;
- TASK-066.5: Device frontend administration UI completato;
- TASK-066.6: Device assignment UI completato;
- TASK-066.7: Device label print UI completato;
- TASK-066.8: shared entity detail header/actions pattern completato;
- TASK-066.9 e TASK-066.10: QA hardening e applicazione shared detail action bar a User/Company Profile;
- TASK-067 -> TASK-072: blocco UI/CRUD piu circoscritto per consolidare pattern e verifiche permessi prima di Employee;
- TASK-073: UI Employee management enterprise, posticipata dopo il consolidamento dei task precedenti.

Sequenza funzionale prevista per il blocco Super Admin / permessi:

- TASK-048: iniziativa generale HRflow design system/template UI basata sul catalogo Stitch validato, con Master Data come caso pilota prima del blocco permessi;
- TASK-049: strategia e modello Super Admin / tenant-aware permissions completati;
- TASK-050: configurazione governance + integrazione skill Spring/backend approvata, completata come skill repository-local minima e complemento a `backend/AGENTS.md`;
- TASK-051: review dominio esistente e gap analysis completata;
- TASK-052: foundation modello permessi (`SCOPE.RESOURCE.ACTION`) completata;
- TASK-053: epic/contenitore per foundation utenti, ruoli e permessi tenant-aware, da completare tramite subtask interni;
  - TASK-053.1: backend role administration API foundation completata;
  - TASK-053.2: frontend role permission matrix UI foundation completata;
  - TASK-053.3: tenant custom role CRUD foundation;
  - TASK-053.4: tenant user administration read/list/detail foundation completata;
- TASK-053.5: tenant user role assignment foundation completata;
- TASK-053.6: tenant user password administration foundation completata;
- TASK-053.7: tenant user create/edit foundation completata;
- TASK-053.8: tenant user lifecycle foundation completata;
- TASK-053.9: UserAccount Employee link foundation completata con link opzionale, fallback email e nessuna duplicazione anagrafica su `UserAccount`;
- TASK-054: permission summary frontend e visibility UX foundation completata (solo UX, non sicurezza reale);
- TASK-055: enforcement RBAC reale lato backend completato con default deny, mapping endpoint/permesso/azione, authority runtime risolte da DB, `DELETE /api/admin/users/{userId}` come hard delete controllato e `PATCH /api/admin/users/{userId}/deactivate` come disattivazione logica;
- TASK-055.1: hardening tenant/caller completato e assorbito dentro TASK-055.
- TASK-056: foundation frontend shared per conferme si/no su azioni critiche completata con `ConfirmDialogComponent`, estensione dichiarativa del `DataTableComponent`, applicazione a Master Data / Ruoli / Utenti e suite frontend verde.
- TASK-057: debito tecnico dedicato alla finalizzazione della foundation import ZIP e all isolamento dei side effect in test.

Nota roadmap TASK-048:

- TASK-048 non e piu un task solo Master Data: diventa iniziativa generale per design system e template UI HRflow.
- Master Data resta la prima applicazione concreta/caso pilota per evitare lavoro doppio sui prossimi CRUD e UI amministrative.
- TASK-048.1 ha creato `docs/design/DESIGN-SYSTEM.md` come draft preparatorio.
- TASK-048.2 ha validato il catalogo astratto di UI template Stitch documentato in `docs/design/DESIGN-SYSTEM.md`.
- Gli screenshot Stitch locali non sono versionati e sono ignorati via `.gitignore`.
- TASK-048.4 ha applicato TEMPLATE-01, TEMPLATE-03 e TEMPLATE-10 a `/master-data` e al `DataTableComponent` shared senza creare componenti tabellari paralleli.
- TASK-048.5 completa il pattern modal/dialog su `/master-data` con footer standard condiviso, ordine azioni coerente, spacing allineato al mockup HTML validato e rimozione del doppio `Annulla`/`Chiudi` nel read-only footer.
- Sequenza aggiornata: TASK-048.3 reframe sottotask, TASK-048.4 Data list/Generic DataTable, TASK-048.5 CRUD modal/action confirmations, TASK-048.6 buttons/toast, TASK-048.7 shared list button foundation, TASK-048.8 login visual alignment review, TASK-048.9 Angular AI skills/project agent integration, TASK-048.10 shell navigation review, TASK-048.11 sidebar visual alignment to TEMPLATE-08, TASK-048.12 CRUD modal/form refinement, TASK-048.13 header/topbar visual alignment to TEMPLATE-09, TASK-048.14 bulk editor planning, TASK-048.15 shared form controls foundation, TASK-048.16 global typography foundation.
- TEMPLATE-01, TEMPLATE-03 e TEMPLATE-10 guidano lista dati, stati tabella e DataTable principale.
- TEMPLATE-04 e TEMPLATE-05 guidano modali CRUD e conferme azione.
- TEMPLATE-07 e TEMPLATE-11 guidano toast e pulsanti.
- TASK-048.6 applica TEMPLATE-07 e TEMPLATE-11 a feedback toast e pulsanti condivisi, senza introdurre nuove librerie UI o modifiche backend/API.
- TEMPLATE-06 guida solo la review visuale della login esistente, senza redesign non richiesto.
- TASK-048.9 introduce governance documentale e integrazione repository-local per usare la skill Angular `angular-developer` come supporto complementare a `AGENTS.md`, `frontend/AGENTS.md`, `TASKS.md`, `ROADMAP.md`, `DECISIONS.md` e design system; `angular-new-app` resta esclusa perche il frontend Angular esiste gia.
- TASK-048.9 include `.agents/skills/angular-developer` e `skills-lock.json` come asset versionabili del repository per standardizzare il lavoro agentico sul frontend Angular.
- TASK-048.9 e completato come governance + integrazione repository-local della skill Angular approvata, senza modifiche applicative/backend/API.
- TASK-048.10 valuta TEMPLATE-08 e TEMPLATE-09 come riferimenti extra senza modifiche Angular/backend/API; la sidebar verra riallineata a TEMPLATE-08 solo nel task dedicato TASK-048.11.
- TASK-048.11 completa il riallineamento visuale della sidebar esistente a TEMPLATE-08 con patch locale al componente Angular, mantenendo routing, i18n, ricerca, collapse desktop e active state.
- il refinement finale TASK-048.11 privilegia contrasto, densita e leggibilita enterprise rispetto a glow/effetti aggressivi, inclusi submenu tree e scrollbar integrata.
- il pass finale di TASK-048.11 chiude anche la parte UX/layout della sidebar: niente scrollbar orizzontale, area menu con scroll verticale interno, search piu compatta e navigazione piu densa in chiave enterprise.
- l'ultimo polish TASK-048.11 corregge l'aderenza degli active state al bordo destro e ricentra verticalmente la search box nella propria sezione.
- TASK-048.12 completa il refinement dedicato di popup CRUD e form esistenti su TEMPLATE-04: rimossa la duplicazione di `Chiudi` nel footer CRUD, footer azioni riallineato a destra, spacing piu coerenti e checkbox `Attivo` migliorata localmente senza shared framework prematuro o backend/API.
- TASK-048.13 allineamento visuale dell'header/topbar esistente a TEMPLATE-09 eseguito in modalità refinement, senza modificare sidebar o backend/API.
- TEMPLATE-09 resta non applicato in TASK-048.10 e viene demandato al task dedicato TASK-048.13.
- TEMPLATE-02 resta pattern avanzato futuro; TASK-048.14 ne completa la pianificazione documentale, ma l'implementazione resta demandata a task tecnici dedicati successivi.
- TASK-048.8 e completato come login visual alignment review: consolidato l'allineamento visuale login rispetto al template validato con seconda iterazione piu profonda su layout/card/brand/language selector/CTA e final refinement su password link/footer legale, senza modifiche funzionali.
- TASK-048.15 completato con foundation progressiva dei form controls condivisi: inventario operativo, regole base in `docs/design/DESIGN-SYSTEM.md`, nuovo controllo `app-input` integrato nel `master-data-form`; `app-select` valutato e rinviato a task dedicato.
- TASK-048.16 completato con foundation tipografica globale minima: nuovo layer finale `src/typography.scss`, Manrope definito come font applicativo globale con fallback locali, `styles.scss` lasciato invariato come layer di override applicativi e nessun font remoto introdotto.
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
- Dopo TASK-047 il blocco prioritario passa a Super Admin / utenti / ruoli / permessi (TASK-049..TASK-055), con distinzione esplicita tra scope `PLATFORM` e `TENANT`, ruoli seed non eliminabili, ruoli custom tenant-specific e permessi CRUD Global/Tenant Master Data. TASK-053 resta un contenitore cross-stack e i suoi subtask TASK-053.1..TASK-053.9 non sono milestone principali indipendenti.
- Prima dei task applicativi successivi viene inserito TASK-056 come foundation shared frontend per le conferme di azioni critiche; l ex task tecnico ZIP slitta a TASK-057 e i task successivi vengono rinumerati di conseguenza.
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

### Fase 2H - Geography / Frontend Shell / UI Admin / Operations

- TASK-036 -> TASK-073

### Fase 2I - Platform Operations

- TASK-074 -> TASK-075

### Fase 3 - Stabilization

- TASK-076 -> TASK-077

---

## 7. Regola operativa

Prima struttura, poi integrazione grafica reale, poi business.

Metronic è riferimento UI, non template da copiare integralmente.

---

## 8. Cronologia versioni

| Versione | Data | Descrizione |
|---|---|---|
| 2.69 | 2026-05-16 | Allineamento documentale stato Device governance: `TASK-066.7` e `TASK-066.8` confermati completati su `main`; roadmap aggiornata spostando il prossimo passo a `TASK-066.9` e mantenendo `TASK-066.10` come follow-up di migrazione User/Company Profile. |
| 2.68 | 2026-05-16 | TASK-066.8 completato lato frontend: consolidato `DetailActionBar` come pattern shared ufficiale per i dettagli entita, applicato solo a Device con id azione standardizzati `activate` / `deactivate`, test shared estesi e fix prerequisiti build minimi su i18n label Device e timer `AlertMessageComponent`; `TASK-066.7` resta aperto solo per validazione manuale browser e la migrazione completa di User/Company Profile resta demandata a `TASK-066.10`. |
| 2.67 | 2026-05-16 | TASK-066.7 implementato lato frontend come MVP label print Device: nuova card `Etichetta dispositivo` nel dettaglio admin, QR reale browser-side con libreria `qrcode`, stampa single-label `60 x 40 mm` via CSS print senza Zebra/ZPL o PDF complesso, build/test frontend verdi e chiusura task subordinata alla validazione manuale browser. |
| 2.66 | 2026-05-16 | QA fix su `TASK-066.6`: verificato che gli endpoint admin Device `assign` e `return` richiedono entrambi `DEVICE.UPDATE`, nessuna correzione necessaria a controller/frontend gating, e riallineato il bootstrap dev `DEV_PLATFORM_TENANT_ADMIN_QA` ai permessi `PLATFORM.DEVICE.READ/CREATE/UPDATE/DELETE` per evitare `403` ambientali nel test manuale. |
| 2.65 | 2026-05-16 | TASK-066.6 completato con UI frontend dello storico assegnazioni Device: dettaglio admin esteso con card `Storico assegnazioni`, azioni `Assegna` / `Restituisci` / `Riassegna` sui soli endpoint backend gia esistenti, i18n `it/fr/en`, build/test frontend verdi e prossimo passo aggiornato a `TASK-066.7`. |
| 2.64 | 2026-05-16 | Aggiornamento documentale post-validazione manuale positiva di `TASK-066.5`: roadmap Device estesa con nuovo follow-up `TASK-066.10` per applicare il componente shared detail action/header bar a User Detail e Company Profile Detail, mantenendo invariato il prossimo passo immediato `TASK-066.6`. |
| 2.63 | 2026-05-15 | TASK-066.5 completato con UI frontend amministrativa Device: rotte `/admin/devices`, collegamento sidebar `Asset aziendali -> Dispositivi`, mapping permessi frontend `devices -> DEVICE`, lista/form/dettaglio riusando `app-data-table`, `app-lookup-select` e pattern admin esistenti, i18n `it/fr/en`, build/test frontend verdi e prossimo passo aggiornato a `TASK-066.6`. |
| 2.62 | 2026-05-15 | TASK-066.4 completato come backend-only foundation dello storico assegnazioni `Device`: `device_assignments` via Flyway `V36` PostgreSQL/H2 con backfill, endpoint admin history/assign/return, lock pessimista sul `Device`, nessun cambio Core HR/frontend e prossimo passo spostato a `TASK-066.5`. |
| 2.61 | 2026-05-15 | TASK-066.3 completato come backend-only foundation per identificazione `Device`: `assetCode` tenant-scoped `DEV000001`, `barcodeValue = assetCode`, migration Flyway `V35` PostgreSQL/H2 con backfill e unique composti, esposizione sui soli DTO/API admin `Device`, nessun cambio Core HR/frontend e prossimo passo spostato a `TASK-066.4`. |
| 2.60 | 2026-05-15 | TASK-066.2 completato con API amministrative backend `Device` sotto `/api/admin/devices`, filtri/lookup coerenti, endpoint dedicati `activate`/`deactivate`, validazioni tenant-scoped, riuso dei permessi `DEVICE` esistenti in `V18`, test backend reali verdi e prossimo passo spostato a `TASK-066.3`. |
| 2.59 | 2026-05-15 | TASK-066 raffinato in subtask `TASK-066.1`..`TASK-066.9` per Device governance: `TASK-066.1` documentale completato, prossimo passo spostato a `TASK-066.2` backend administration CRUD, sequenza Device pianificata fino a QA hardening e `TASK-067` HolidayCalendar mantenuto invariato. |
| 2.58 | 2026-05-15 | TASK-065 completato come riorganizzazione documentale del backlog Core HR UI: prossimo passo riallineato a `TASK-066` Device governance, blocco operativo immediato portato a `TASK-067`..`TASK-072`, UI Employee rinviata a `TASK-073` e blocco Platform/Cross-tenant/Stabilization rinumerato coerentemente fino a `TASK-077`, senza modifiche applicative. |
| 2.57 | 2026-05-15 | TASK-064.11 completato con CRUD amministrativo `Region`/`Area` in Master Data, estensione API/lookup esistenti, delete fisico protetto da referenze, filtri geografici UI e validazione reale backend/frontend senza modifiche security/RBAC. |
| 2.56 | 2026-05-15 | TASK-064.10 completato/corretto in roadmap: estesa l'adozione di `app-lookup-select` alle select residue di `UserAdministrationForm`, `UserAdministrationDetail` e `CompanyProfileAdministrationForm`, verificata la coerenza visuale shared senza fix CSS locali, mantenuti locali `MasterDataAdmin` categoria/entita e `TenantAdministration.defaultCurrencyId`, test frontend reali verdi e nessun cambio backend/API. |
| 2.55 | 2026-05-15 | TASK-064.9 completato: `CompanyProfile` ora persiste il telefono in modo strutturato con `phoneDialCode` e `phoneNationalNumber`, bridge legacy temporaneo `phone`, migration `V34` con backfill conservativo e standard durevole demandato a `DEC-041` per future entita di contatto. |
| 2.54 | 2026-05-15 | Aggiornato backlog con il nuovo follow-up `TASK-064.11 - CRUD amministrativo Region e Area nei Dati di base`, mantenendo `TASK-064.9` come follow-up telefono separato e senza introdurre modifiche runtime/backend/frontend. |
| 2.53 | 2026-05-15 | TASK-064.8 completato in roadmap nel working tree del branch dedicato: `CompanyProfileAdministrationForm` supporta la creazione guidata estera di `Region`, `Area` e `GlobalZipCode` tramite `app-lookup-select` con `+` esterno, popup locali e auto-code backend tenant-aware `RE###`/`AR###`, mantenendo il flusso Italia su CAP importati/lookup e senza modifiche schema/security/RBAC. |
| 2.52 | 2026-05-14 | Inserito il nuovo follow-up `TASK-064.8 - Creazione manuale dati geografici esteri da form indirizzo` subito dopo `TASK-064.7`, con rinumerazione coerente di `TASK-064.9` (telefono) e `TASK-064.10` (adozione progressiva di `app-lookup-select`) e riallineamento dei riferimenti roadmap. |
| 2.51 | 2026-05-14 | TASK-064.7 completato in roadmap: lookup ZIP/CAP esistente esteso con filtri `countryId/regionId/areaId`, supporto record manuali con `areaId` nullable e fallback `provinceName/provinceCode`, migrazione CAP Company Profile a `app-lookup-select`, test backend/frontend reali verdi e nessuna modifica al modello geografico approvato. |
| 2.50 | 2026-05-14 | TASK-064.10 completato in roadmap con migrazione progressiva di select amministrative a `app-lookup-select` (User Administration tenant/company profile + Tenant Administration default country), test frontend reali verdi e rinvio documentato dei casi geografici piu complessi a follow-up dedicati. |
| 2.49 | 2026-05-14 | TASK-064.6 completato in roadmap: foundation shared lookup/phone chiusa con endpoint backend paginati per `Country/Region/Area/GlobalZipCode`, componenti Angular `app-lookup-select` e `app-phone-field`, pilot limitato a `CompanyProfile` senza cambiare il contratto backend `phone: string | null`, test backend/frontend reali verdi e nuovo follow-up `TASK-064.9` per la normalizzazione futura dei telefoni. |
| 2.48 | 2026-05-14 | Aggiunto il follow-up `TASK-064.7 - Supporto CAP manuali nei form indirizzo` nel backlog/next step con focus su `GlobalZipCode.areaId` nullable, fallback `provinceName/provinceCode`, copertura lookup CAP importati/manuali e test backend/frontend dedicati, senza introdurre nuova tabella City o redesign fuori scope. |
| 2.47 | 2026-05-13 | TASK-064.5 rifinito prima del commit: aggiunti activate/deactivate e delete fisico protetto per `CompanyProfile`, permesso `DELETE`, normalizzazione tenant-aware dei codici esistenti `CP001/CP002`, seed minimi `CompanyProfileType`, naming italiano `Profilo aziendale`, patch telefono/indirizzo lato UI, test backend/frontend reali verdi e backlog aggiornato con `TASK-064.6` shared lookup select/phone field foundation. |
| 2.46 | 2026-05-13 | TASK-064.5 completato: introdotte API admin `CompanyProfile`, permessi `COMPANY_PROFILE` (`READ`/`CREATE`/`UPDATE`), auto-code backend tenant-aware `CP001/CP002`, UI amministrativa Angular `/admin/company-profiles` allineata ai pattern Users/Tenant, i18n `it/fr/en`, test backend/frontend verdi e report QA aggiornato. |
| 2.45 | 2026-05-13 | TASK-064.4 completato: aggiunti i campi fiscali nullable `taxNumber`, `pecEmail` e `sdiCode` su `CompanyProfile` con Flyway `V27` PostgreSQL/H2, mapping foundation response, test backend e chiavi i18n catalog-only `it/fr/en`; `taxIdentifier` e `Tenant` restano invariati e la UI CRUD `CompanyProfile` resta demandata a `TASK-064.5`. |
| 2.44 | 2026-05-13 | TASK-064.3 completato in roadmap: formalizzata in `DEC-039` la regola durevole per i nuovi campi `code` con auto-code `prime due lettere + progressivo 3 cifre`, UI non editabile quando automatico e prossimi follow-up portati a `TASK-064.4` e `TASK-064.5`. |
| 2.43 | 2026-05-13 | TASK-064.2 completato in roadmap: `Tenant.code` autogenerato lato backend con formato `TE###`, UI Tenant senza editing manuale del codice, test backend/frontend reali verdi e prossimo follow-up operativo portato a `TASK-064.3`. |
| 2.42 | 2026-05-13 | TASK-064.1 completato in roadmap: naming utente `legalName` riallineato lato frontend/i18n e layout Tenant Administration allineato ai pattern amministrativi esistenti; prossimo follow-up operativo portato a `TASK-064.2`. |
| 2.41 | 2026-05-13 | Aggiornato TASK-064 in roadmap con follow-up subtask pianificati `TASK-064.1`..`TASK-064.5` (Tenant UI naming/layout, auto-code Tenant, standard auto-code futuro, campi fiscali `CompanyProfile`, foundation UI `CompanyProfile`) mantenendo TASK-064 corrente focalizzato sul CRUD Tenant. |
| 2.40 | 2026-05-13 | TASK-063 completato: foundation backend geography chiusa in coerenza con `DEC-038` tramite migration `V24`/`V25`, tenant scope su `Region`/`Area`, modello ZIP/CAP ibrido e test backend completi verdi; prossimo passo aggiornato a `TASK-065` Employee UI. |
| 2.39 | 2026-05-13 | TASK-062 chiuso come decisione documentale completata tramite `DEC-038`; prossimo passo riallineato a `TASK-063 Address geography backend foundation`, `TASK-062` aggiunto tra i completati e confermata la sequenza `TASK-063` -> `TASK-065`. |
| 2.38 | 2026-05-13 | Inseriti TASK-062 Address geography model decision e TASK-063 Address geography backend foundation prima della UI Employee; l Employee UI slitta a `TASK-065`, viene introdotto il nuovo `TASK-064` Tenant CRUD Administration and backlog reorganization e i range fase vengono riallineati (`2H: 036-072`, `2I: 073-074`, `3: 075-076`). |
| 2.37 | 2026-05-12 | TASK-060 completato: confermato che le autorizzazioni runtime dipendono da `permission.code`, mantenuti i codici semantici dei ruoli seed, introdotto auto-code tenant-scoped `RO###` per i ruoli custom con create senza `code` e edit/view read-only; prossimo passo riallineato a `TASK-062`. |
| 2.36 | 2026-05-12 | Ricostruito `TASK-060` come task documentale separato tra `TASK-059.4` e `TASK-061`, dedicato alla verifica cross-stack dell'uso tecnico di `Role.code` e alla scelta tra codice tecnico, auto-code business/UI o separazione dei due concetti; prossimo passo riallineato a `TASK-060` senza modifiche runtime. |
| 2.35 | 2026-05-12 | TASK-061 completato: consolidata la consistenza i18n di alert/messages frontend con build/test OK, frontend locale avviato OK, QA manuale browser completata con cambio lingua `it/fr/en` e nessuna regressione rilevata; prossimo passo aggiornato a TASK-062. |
| 2.34 | 2026-05-12 | TASK-061 avanzato senza chiusura: normalizzati i fallback notifiche frontend per evitare messaggi raw backend fuori i18n, spostati nelle risorse `it/fr/en` gli `aria-label` hardcoded del footer login, build/test frontend verdi e frontend locale avviato con HTTP `200`; prossimo passo resta TASK-061 per completare la QA manuale browser/login/cambio lingua. |
| 2.33 | 2026-05-12 | TASK-059.4 completato e rifinito dopo test manuale: razionalizzata la Master Data UI Governance/security rimuovendo `Role`, `Permission` e `AuditActionType` dal selettore generico, mantenendo visibili `UserType`/`AuthenticationMethod`/`SmtpEncryptionType`, estendendo auto-code backend/UI a `CompanyProfileType`, `OfficeLocationType` e `DisciplinaryActionType`, aggiungendo migration `V23` per il riallineamento deterministico dei record esistenti, abilitando la cancellazione fisica con icona delete UI per le tre entita e nascondendo le colonne tecniche tenant; test backend/frontend reali verdi, prossimo passo invariato su TASK-061. |
| 2.32 | 2026-05-12 | TASK-059.2 completato: auto-code esteso a `Department`, `JobTitle`, `ContractType` e `WorkMode`, aggiunta migration V22 PostgreSQL/H2 con remapping condizionale dei campi `employees.*` solo su match reali `old_code` per tenant, prossimo passo aggiornato a TASK-061. |
| 2.31 | 2026-05-12 | Inserito TASK-059.2 `Estendere code automatico ai restanti Master Data`; prossimo passo riallineato a TASK-059.2 e backlog successivo rinumerato da TASK-060..TASK-072 a TASK-061..TASK-073, con range fasi aggiornati (`2H: 036-069`, `2I: 070-071`, `3: 072-073`). |
| 2.30 | 2026-05-12 | TASK-059.1 completato: standardizzati i code delle 6 entita HR/business con auto-generazione backend `prefisso+progressivo`, `code` non editabile da UI, migration V21 su PostgreSQL/H2 con aggiornamento dati esistenti e mapping `employees.employment_status`; test backend/frontend reali completati con esito verde. |
| 2.29 | 2026-05-12 | TASK-059 completato nel perimetro chiarito: aggiunti endpoint `/physical`, reference checks e azione UI di eliminazione fisica per EmploymentStatus, LeaveRequestType, DocumentType, DeviceType, DeviceBrand e DeviceStatus, mantenendo la disattivazione logica e pianificando TASK-059.1 per la futura standardizzazione dei code. |
| 2.28 | 2026-05-12 | TASK-059 completato: CRUD soft-delete Master Data abilitato in UI per EmploymentStatus, LeaveRequestType, DocumentType, DeviceType, DeviceBrand e DeviceStatus, backend CRUD esistente confermato con test mirato e suite completa; prossimo passo aggiornato a TASK-060. |
| 2.27 | 2026-05-12 | Backlog riallineato da TASK-058: TASK-058 mantenuto documentale, aggiunti TASK-059 (Master Data CRUD completion) e TASK-060 (i18n alert/messages consistency check), task successivi rinumerati fino a TASK-072 e range fasi aggiornati (`2H: 036-068`, `2I: 069-070`, `3: 071-072`). |
| 2.26 | 2026-05-12 | TASK-057 chiuso come completato senza patch runtime: verificato che il commit `f9963b9` aveva gia reso lightweight i test import ZIP/CAP, isolando `ItalianZipCodeImportServiceTests` dal CSV completo e `MasterDataGlobalControllerTests` dall import reale; nessun bootstrap massivo residuo rilevato su `global_zip_codes`, test backend mirati verdi e prossimo passo riallineato a TASK-058. |
| 2.25 | 2026-05-12 | TASK-056 completato: aggiunto `ConfirmDialogComponent` shared, esteso `DataTableComponent` con conferme dichiarative e target dinamico, migrate le conferme tabellari di Master Data / Ruoli / Utenti, aggiornati i18n `it`/`fr`/`en`, test frontend verdi e prossimo passo riallineato a TASK-057. |
| 2.24 | 2026-05-12 | Inserito nuovo TASK-056 `Shared confirmation dialog foundation` prima del backlog applicativo successivo; l ex TASK-056 ZIP slitta a TASK-057, i range roadmap vengono riallineati fino a TASK-072 e il prossimo passo viene aggiornato di conseguenza. |
| 2.23 | 2026-05-12 | TASK-055 completato: enforcement RBAC backend reale attivato con authority risolte da DB per request JWT, `default deny`, mapping esplicito endpoint/permessi, hardening tenant/caller su `/api/admin/users` e `/api/admin/roles`, `DELETE /api/admin/users/{userId}` riallineato a hard delete controllato, nuovo `PATCH /api/admin/users/{userId}/deactivate` per disattivazione logica e suite backend/frontend verde; prossimo passo riallineato a TASK-056. |
| 2.22 | 2026-05-11 | TASK-054 completato: aggiunta foundation frontend centralizzata per permission summary e visibility UX, con parsing `SCOPE.RESOURCE.ACTION`, sidebar dei moduli sempre visibile ma frozen senza permessi CRUD, guard frontend sulle route protette e applicazione ai moduli amministrativi attivi; prossimo passo riallineato a TASK-055. |
| 2.21 | 2026-05-11 | TASK-053.9 completato: formalizzato link opzionale `UserAccount` -> `Employee`, DTO admin espliciti per `employeeId`/`employeeDisplayName`/`hasEmployeeLink`, UI lista/dettaglio con stato collegato/non collegato e nessuna migration o duplicazione anagrafica su `UserAccount`; prossimo passo riallineato a TASK-054. |
| 2.20 | 2026-05-11 | TASK-053.8 esteso con patch minima UX login: backend auth con codici errore stabili per account inactive/locked solo dopo credenziali corrette, login Angular con messaggi i18n specifici `Account disattivato` / `Account bloccato`, errore generico mantenuto per email inesistente o password errata, test completi verdi. |
| 2.19 | 2026-05-11 | TASK-053.8 completato: aggiunta foundation lifecycle utenti tenant con endpoint `PUT /api/admin/users/{userId}/activate`, `PATCH /api/admin/users/{userId}/deactivate`, `PUT /api/admin/users/{userId}/lock|unlock`, UI Angular nel dettaglio utente con conferma per `disattiva`/`blocca`, i18n `it/fr/en`, test backend/frontend completi verdi; revoca `tenant access` rinviata per assenza di distinzione sicura tra accesso primario e bridge nel contratto corrente. |
| 2.18 | 2026-05-11 | TASK-053.7 completato: foundation create/edit utenti tenant con endpoint form-options/create/update, email normalizzata, password iniziale validata, `PASSWORD_ONLY`, `UserTenantAccess` automatico, update limitato a email/company profile, UI Angular create/edit con componenti shared e test backend/frontend verdi; prossimo passo riallineato a TASK-053.8. |
| 2.17 | 2026-05-11 | TASK-053.6 completato: foundation reset password amministrativo tenant-aware con endpoint `PUT /api/admin/users/{userId}/password`, validazione `PasswordPolicy`, update di `passwordHash` e `passwordChangedAt`, UI inline nel dettaglio utente, i18n `it/fr/en`, test/backend build frontend verdi e prossimo passo riallineato a TASK-053.7. |
| 2.16 | 2026-05-11 | TASK-053.5 completato: assegnazione/rimozione ruoli utente tenant con API dedicate, UI minimale nel dettaglio utente, validazioni tenant/accesso/duplicato, build/test backend/frontend verdi e prossimo passo aggiornato a TASK-053.6. |
| 2.15 | 2026-05-10 | TASK-053.4 completato: foundation read/list/detail amministrazione utenti tenant con API `/api/admin/users`, UI `/admin/users`, dettaglio `/admin/users/:id`, ruoli/accessi tenant read-only, display name derivato da Employee con fallback email, test backend/frontend e prossimo passo riallineato a TASK-053.5. |
| 2.14 | 2026-05-10 | Backlog TASK-053.4 splittato su user administration tenant: TASK-053.4 ridefinito come read/list/detail foundation (ruoli e accessi read-only, nome/cognome derivati da Employee con fallback email), introdotti TASK-053.5/053.6/053.7/053.8 e aggiunto TASK-053.9 opzionale per UserAccount-Employee link foundation; roadmap/prossimi passi riallineati senza modifiche codice applicativo. |
| 2.13 | 2026-05-10 | Backlog RBAC follow-up riallineato pre-commit TASK-053.3: confermato limite foundation di TASK-053.3, aggiornati target di TASK-054 (permission summary + visibility UX) e TASK-055 (enforcement backend con default deny e mapping endpoint/permesso/azione), aggiunto TASK-055.1 per hardening tenant/caller sugli endpoint admin `/api/admin/roles`, senza rinumerare i task principali. |
| 2.12 | 2026-05-10 | TASK-053.2 riallineato dopo review: route frontend rinominata in `/admin/permissions`, voce menu `Governance > Sicurezza > Permessi`, matrice limitata ai soli permessi Master Data reali e nota QA esplicita sulla necessita di un utente tenant-aware per la validazione manuale completa. |
| 2.11 | 2026-05-10 | TASK-053.2 completato: introdotta UI frontend `/admin/permissions` per matrice permessi ruolo tenant-aware con route/shell/sidebar coerenti, riuso API backend gia presenti `/api/admin/roles`, build/test frontend verdi; prossimo passo aggiornato a TASK-053.3 e backlog raffinato con nuovo TASK-057 dedicato al debito tecnico import ZIP. |
| 2.10 | 2026-05-10 | TASK-053.1 completato: introdotta API backend `/api/admin/roles` per lista/dettaglio ruoli, lettura permessi assegnati e replace transazionale delle assegnazioni ruolo-permesso; prossimo passo aggiornato a TASK-053.2, suite mirata backend verde e suite completa interrotta per output massivo preesistente su `global_zip_codes`. |
| 2.09 | 2026-05-10 | TASK-053 riorganizzato come epic/contenitore con subtask interni 053.1 backend role administration API, 053.2 frontend role permission matrix UI e 053.3 tenant user administration; prossimo passo operativo aggiornato a TASK-053.1 senza promuovere i subtask a milestone principali e mantenendo TASK-054/TASK-055 come task principali successivi. |
| 2.08 | 2026-05-10 | TASK-052 completato: introdotta foundation permessi `SCOPE.RESOURCE.ACTION` con enum/helper backend, migration Flyway V18 e 100 permessi seed `system_permission=true`; prossimo passo aggiornato a TASK-053. |
| 2.07 | 2026-05-10 | TASK-051 completato come domain review User/Role/Permission: confermati `UserType` globale, `Role`/`Permission` tenant-scoped, bridge RBAC esistenti, lacune API/DTO/auth/JWT e backlog minimo verso TASK-052..TASK-055; prossimo passo spostato a TASK-052. |
| 2.06 | 2026-05-10 | TASK-050 completato come integrazione governance backend agent: approvata e versionata la skill repository-local minima `spring-backend-developer`, aggiornato `skills-lock.json`, riallineati `backend/AGENTS.md` e prompt governance, prossimo passo spostato a TASK-051. |
| 2.05 | 2026-05-10 | Inserito TASK-050 come task documentale/TODO per configurazione della skill Spring/backend approvata; prossimo passo aggiornato a TASK-050, sequenza Super Admin / permessi rinumerata a TASK-050..TASK-055 e range futuri riallineati fino a TASK-067. |
| 2.04 | 2026-05-10 | TASK-049 completato come passaggio strategico/documentale: modello `PLATFORM_SUPER_ADMIN` vs `TENANT_ADMIN`, ruoli seed/custom tenant-specific, CRUD Global/Tenant Master Data, default deny cross-tenant, backend authoritative e frontend visibility solo UX; prossimo passo aggiornato a TASK-050. |
| 2.03 | 2026-05-10 | TASK-048.16 completato: introdotto `src/typography.scss` come layer finale della tipografia globale frontend, Manrope definito via token CSS con fallback locali, nessun font remoto introdotto e build/test frontend verificati. |
| 2.02 | 2026-05-10 | TASK-048.15 phase 2 completato: introdotto app-input come secondo controllo shared, integrato nel master-data-form (campi non booleani), build/test frontend verificati, app-select rinviato per evitare scope creep. |
| 2.01 | 2026-05-10 | TASK-048.15 completato come foundation iniziale dei form controls condivisi con inventario controlli, regole form base in `docs/design/DESIGN-SYSTEM.md`, primo shared control `app-checkbox` integrato in `master-data-form` e aggiornamento task/QA. |
| 2.00 | 2026-05-09 | TASK-048.14 completato come planning documentale del bulk editor spreadsheet: definito perimetro bounded, raccomandato componente futuro dedicato separato dal `DataTableComponent` read-only e prossimo passo aggiornato a TASK-048.15, senza modifiche Angular/backend. |
| 1.99 | 2026-05-09 | TASK-048.13 completato: header/topbar visual refinement a TEMPLATE-09 con titolo pagina corrente, area centrale bilanciata e menu utente più sobrio; sidebar non modificata; prossimo passo aggiornato a TASK-048.14. |
| 1.98 | 2026-05-09 | TASK-048.12 completato in roadmap: raffinata la CRUD modal/form Master Data su TEMPLATE-04 con `Chiudi` rimosso dal footer, action bar allineata a destra, checkbox locale migliorata e build/test frontend OK; prossimo passo aggiornato a TASK-048.13. |
| 1.97 | 2026-05-09 | Backlog TASK-048 riordinato dopo TASK-048.11: inseriti TASK-048.12 CRUD modal/form visual refinement e TASK-048.13 Header/topbar visual alignment to TEMPLATE-09; bulk editor, shared form controls e typography slittati a TASK-048.14, TASK-048.15 e TASK-048.16; prossimo passo aggiornato a TASK-048.12. |
| 1.96 | 2026-05-09 | TASK-048.11 alignment polish in roadmap: active state parent/submenu non aderenti al bordo destro e search box ricentrata verticalmente, con build/test frontend OK e prossimo passo invariato su TASK-048.12. |
| 1.95 | 2026-05-09 | TASK-048.11 refinement finale in roadmap su densita e scrolling sidebar: eliminato overflow orizzontale, resa scrollabile internamente l'area menu, compattati header/search/item e confermato il prossimo passo su TASK-048.12. |
| 1.94 | 2026-05-09 | TASK-048.11 rifinito ulteriormente in roadmap: migliorati submenu, active state, densita, search box e scrollbar della sidebar con seconda patch visuale locale; build/test frontend rieseguiti OK, prossimo passo invariato su TASK-048.12. |
| 1.93 | 2026-05-09 | TASK-048.11 completato in roadmap: sidebar esistente riallineata visivamente a TEMPLATE-08 con patch frontend mirata e nessuna modifica backend/API/header; prossimo passo aggiornato a TASK-048.12. |
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





