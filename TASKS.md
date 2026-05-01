# TASKS.md

## Progetto HRM AI-first

Versione: 1.3  
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

## 4. Task iniziali

### TASK-001 - Creare struttura repository

Stato: DONE

### TASK-002 - Creare backend Spring Boot

Stato: DONE

### TASK-003 - Configurare base backend

Stato: DONE

### TASK-004 - Configurare PostgreSQL e Docker Compose

Stato: DONE

### TASK-005 - Creare frontend Angular

Stato: DONE

---

### TASK-006 - Integrare asset base Metronic Tailwind HTML nel frontend Angular

Stato: DONE  
Fase roadmap: Fase 1 - Fondazione tecnica

Obiettivo:

Integrare asset grafici e tecnici base del Metronic Tailwind HTML Starter Kit nel frontend Angular come fondazione UI.

Attività:

- Analizzare pacchetto Metronic disponibile localmente
- Identificare starter kit corretto
- Integrare asset CSS/JS essenziali
- Configurare Angular per usare asset globali
- Aggiornare budget build
- Validare build frontend

Output atteso:

- Base UI Metronic integrata
- Build funzionante

---

### TASK-007 - Creare shell layout Angular modulare

Stato: DONE  
Fase roadmap: Fase 1 - Fondazione tecnica

Obiettivo:

Creare architettura frontend enterprise modulare basata su shell, header e sidebar standalone.

Attività:

- Creare `app-shell`
- Creare `app-header`
- Creare `app-sidebar`
- Aggiornare routing root
- Preparare base shared/layout
- Validare build e test

Output atteso:

- Layout shell enterprise pronto
- Routing strutturale corretto

---

### TASK-008 - Adattare layout-6 Metronic reale alla shell Angular

Stato: TODO  
Fase roadmap: Fase 1 - Fondazione tecnica

Obiettivo:

Adattare progressivamente il layout-6 reale di Metronic dentro `app-shell`, `app-header` e `app-sidebar`.

Attività:

- Estrarre header reale
- Estrarre sidebar reale
- Adattare wrapper principale
- Integrare markup utile senza copia massiva
- Preparare dashboard base HRM
- Mantenere componentizzazione Angular

Output atteso:

- Layout enterprise reale integrato
- Base dashboard HRM pronta

---

### TASK-009 - Configurare Swagger / OpenAPI

Stato: TODO

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
| 1.3 | 2026-05-01 | Riallineati TASK-006 e TASK-007 come completati; introdotto TASK-008 per layout-6 reale. |
| 1.2 | 2026-05-01 | Aggiornato stato dopo TASK-005 e aggiunto TASK-006 per integrazione Metronic Angular. |
| 1.1 | 2026-05-01 | Aggiornato stato task dopo completamento TASK-001, TASK-002, TASK-003 e TASK-004. |
| 1.0 | 2026-05-01 | Prima versione task operativi MVP. |
