# ROADMAP.md

## Progetto HRM AI-first

Versione: 1.53
Ultimo aggiornamento: 2026-05-06
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
- Backlog governance updated: Master Data Admin UI follows backend CRUD APIs
- Backlog governance updated: Login foundation precedes administrative UI
- Backlog governance updated: authenticated home shell, logo integration and frontend design guidelines precede Master Data Admin UI
- Backlog governance updated: sidebar navigation tree foundation and frontend i18n foundation immediately follow authenticated home shell before Master Data Admin UI

### Prossimo passo

- TASK-044: Import CAP italiani

---

## 4. Fase 1 - Fondazione tecnica

Stato: Frontend login foundation, authenticated home shell foundation, sidebar navigation tree foundation, frontend i18n foundation, logo integration, design guidelines, Master Data Admin foundation/list e seed dati globali iniziali completati

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
Global, HR/business and governance/security master data CRUD APIs are available; the read-only Master Data Admin foundation/list is active and TASK-043 pagination and generic filters are completed before proceeding to full CRUD UI.

Da fare:

- TASK-044 Import CAP italiani
- TASK-045 UI Master Data Admin CRUD

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

- TASK-036 -> TASK-053

### Fase 2I - Platform Operations

- TASK-054 -> TASK-055

### Fase 3 - Stabilization

- TASK-056 -> TASK-057

---

## 7. Regola operativa

Prima struttura, poi integrazione grafica reale, poi business.

Metronic è riferimento UI, non template da copiare integralmente.

---

## 8. Cronologia versioni

| Versione | Data | Descrizione |
|---|---|---|
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
