# ROADMAP.md

## Progetto HRM AI-first

Versione: 1.40
Ultimo aggiornamento: 2026-05-04
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
- Backlog governance updated: Master Data Admin UI follows backend CRUD APIs
- Backlog governance updated: Login foundation precedes administrative UI

### Prossimo passo

- TASK-035: Implementare frontend login foundation

---

## 4. Fase 1 - Fondazione tecnica

Stato: Backend login/JWT foundation completata

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
Master Data Admin UI must follow backend CRUD APIs. Existing read-only APIs can support consultation, but they are not sufficient for complete administrative CRUD screens.
UserAccount persistence foundation is available and backend login runtime/JWT foundation is active; frontend login foundation remains deferred to TASK-035.
Global, HR/business and governance/security master data CRUD APIs are available; Master Data Admin UI remains deferred until after login foundation.

Da fare:

- TASK-035 frontend login foundation
- TASK-036 UI Master Data Admin foundation/list
- TASK-037 UI Master Data Admin CRUD

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

### Fase 2H - UI Admin / Operations

- TASK-036 -> TASK-045

### Fase 2I - Platform Operations

- TASK-046 -> TASK-047

### Fase 3 - Stabilization

- TASK-048 -> TASK-049

---

## 7. Regola operativa

Prima struttura, poi integrazione grafica reale, poi business.

Metronic è riferimento UI, non template da copiare integralmente.

---

## 8. Cronologia versioni

| Versione | Data | Descrizione |
|---|---|---|
| 1.40 | 2026-05-04 | TASK-034 completato con backend login/JWT foundation: endpoint `/api/auth/login` e `/api/auth/me`, JWT stateless, login email-only case-insensitive, BCrypt, password policy, migration V15 email globale case-insensitive e BUILD SUCCESS; prossimo passo aggiornato a TASK-035 frontend login foundation. |
| 1.39 | 2026-05-04 | TASK-033 completato come riorganizzazione documentale backlog: login/JWT foundation backend e frontend spostate prima delle UI amministrative; prossimo passo aggiornato a TASK-034 backend login/JWT foundation e Master Data Admin rinumerato a TASK-036/TASK-037. |
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
