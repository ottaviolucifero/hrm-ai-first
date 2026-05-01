# TASKS.md

## Progetto HRM AI-first

Versione: 1.5  
Ultimo aggiornamento: 2026-05-01  
Stato: In avanzamento

---

## 1. Obiettivo

Questo documento contiene i task operativi del progetto HRM.

Ogni task deve essere piccolo, chiaro, verificabile e coerente con:

- `AGENTS.md`
- `ARCHITECTURE.md`
- `ROADMAP.md`
- documenti di analisi del progetto

---

## 2. Regole operative

- Un task alla volta
- Un branch per task
- Una pull request per task
- Nessuna funzionalità fuori MVP
- Prima leggere la documentazione
- Prima riusare, poi creare
- Dopo ogni task eseguire build/test

---

## 3. Stato task

Legenda:

- `TODO`: da fare
- `IN_PROGRESS`: in corso
- `DONE`: completato
- `BLOCKED`: bloccato

---

## 4. Stato attuale

### TASK-001 → TASK-009

Stato: DONE

Completati:

- Creazione repository
- Backend Spring Boot
- Configurazione backend YAML
- PostgreSQL + Docker Compose
- Frontend Angular
- Integrazione asset base Metronic Tailwind HTML
- Shell layout Angular modulare
- Adattamento layout reale Metronic
- Swagger / OpenAPI backend

---

### TASK-009 - Configurare Swagger / OpenAPI

Stato: DONE  
Fase roadmap: Fase 1 - Fondazione tecnica

Obiettivo:

Documentare e validare API REST backend.

Attività:

- Aggiungere dipendenza OpenAPI
- Configurare Swagger UI
- Esporre endpoint documentazione
- Validare accesso locale

Output atteso:

- Swagger UI accessibile
- Base governance API pronta

Validazione:

- springdoc OpenAPI integrato
- Swagger UI disponibile
- `/v3/api-docs` validato
- Security mantenuta attiva sugli altri endpoint

---

### TASK-010 - Configurare profili dev/test/prod

Stato: TODO

### TASK-011 - Creare modello dati iniziale

Stato: TODO

### TASK-012 - Implementare sicurezza JWT base

Stato: TODO

### TASK-013 - Implementare ruoli base

Stato: TODO

### TASK-014 - CRUD Employee backend

Stato: TODO

### TASK-015 - UI Employee

Stato: TODO

### TASK-016 - CRUD Device backend

Stato: TODO

### TASK-017 - UI Device

Stato: TODO

### TASK-018 - Upload PayrollDocument backend

Stato: TODO

### TASK-019 - Download PayrollDocument protetto

Stato: TODO

### TASK-020 - UI PayrollDocument

Stato: TODO

### TASK-021 - LeaveRequest backend

Stato: TODO

### TASK-022 - Workflow approvazione congedi

Stato: TODO

### TASK-023 - UI LeaveRequest

Stato: TODO

### TASK-024 - HolidayCalendar backend

Stato: TODO

### TASK-025 - UI HolidayCalendar

Stato: TODO

### TASK-026 - Configurare audit log

Stato: TODO

### TASK-027 - Configurare notifiche email

Stato: TODO

### TASK-028 - Configurare logging applicativo

Stato: TODO

### TASK-029 - Test MVP

Stato: TODO

---

## 5. Cronologia versioni

| Versione | Data | Descrizione |
|---|---|---|
| 1.5 | 2026-05-01 | TASK-009 completato; Swagger/OpenAPI integrato e validato mantenendo la security attiva sugli altri endpoint. |
| 1.4 | 2026-05-01 | TASK-008 completato; layout reale Metronic adattato; TASK-009 Swagger prossimo step. |
| 1.3 | 2026-05-01 | Riallineati TASK-006 e TASK-007 come completati; introdotto TASK-008 per layout-6 reale. |
| 1.2 | 2026-05-01 | Aggiornato stato dopo TASK-005 e aggiunto TASK-006 per integrazione Metronic Angular. |
| 1.1 | 2026-05-01 | Aggiornato stato task dopo completamento TASK-001, TASK-002, TASK-003 e TASK-004. |
| 1.0 | 2026-05-01 | Prima versione task operativi MVP. |
