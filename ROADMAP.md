# ROADMAP.md

## Progetto HRM AI-first

Versione: 1.20  
Ultimo aggiornamento: 2026-05-02  
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
- Backend Spring Boot 3 / Java 21
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

### Prossimo passo

- TASK-016: Tenant / Company / Office / SMTP validation and API readiness

---

## 4. Fase 1 - Fondazione tecnica

Stato: Foundation dati enterprise + tenant HR/business masters

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

Nota:

Tenant placeholder strategy converted into full Tenant domain in TASK-015.
Governance/security split active: global authentication standards are shared, while roles, permissions and operational classifications remain tenant-scoped.

Da fare:

- Tenant / Company / Office / SMTP validation and API readiness

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

- TASK-020 -> TASK-022

### Fase 2E - Operational HR

- TASK-023 -> TASK-030

### Fase 2F - Governance / Compliance

- TASK-031 -> TASK-034

### Fase 2G - Platform Operations

- TASK-035 -> TASK-036

### Fase 3 - Stabilization

- TASK-037 -> TASK-038

---

## 7. Regola operativa

Prima struttura, poi integrazione grafica reale, poi business.

Metronic è riferimento UI, non template da copiare integralmente.

---

## 8. Cronologia versioni

| Versione | Data | Descrizione |
|---|---|---|
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
