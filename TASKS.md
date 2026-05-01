# TASKS.md

## Progetto HRM AI-first

Versione: 1.0  
Ultimo aggiornamento: 2026-05-01  
Stato: Bozza

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

Stato: TODO  
Fase roadmap: Fase 1 - Fondazione tecnica

Obiettivo:

Creare la struttura base del repository.

Attività:

- Creare cartelle `/backend`
- Creare cartelle `/frontend`
- Creare cartelle `/docs`
- Creare cartella `/docker`
- Posizionare documenti principali nella root o in `/docs`

Output atteso:

- Repository ordinato secondo `ARCHITECTURE.md`

---

### TASK-002 - Creare backend Spring Boot

Stato: TODO  
Fase roadmap: Fase 1 - Fondazione tecnica

Obiettivo:

Creare lo scheletro backend.

Attività:

- Creare progetto Spring Boot 3
- Usare Java 21
- Configurare Maven o Gradle
- Creare package base
- Creare endpoint `/health`

Output atteso:

- Backend avviabile
- Endpoint health funzionante

---

### TASK-003 - Creare frontend Angular

Stato: TODO  
Fase roadmap: Fase 1 - Fondazione tecnica

Obiettivo:

Creare lo scheletro frontend.

Attività:

- Creare progetto Angular
- Configurare struttura `/core`, `/shared`, `/features`, `/layout`
- Preparare layout base
- Preparare routing iniziale

Output atteso:

- Frontend avviabile
- Struttura coerente con `ARCHITECTURE.md`

---

### TASK-004 - Configurare PostgreSQL e Docker Compose

Stato: TODO  
Fase roadmap: Fase 1 - Fondazione tecnica

Obiettivo:

Preparare ambiente locale.

Attività:

- Creare `docker-compose.yml`
- Configurare servizio PostgreSQL
- Configurare variabili ambiente
- Collegare backend al database

Output atteso:

- Database avviabile
- Backend collegato a PostgreSQL

---

### TASK-005 - Configurare Swagger / OpenAPI

Stato: TODO  
Fase roadmap: Fase 1 - Fondazione tecnica

Obiettivo:

Documentare le API REST.

Attività:

- Aggiungere dipendenza OpenAPI
- Configurare Swagger UI
- Esporre documentazione API

Output atteso:

- Swagger UI accessibile

---

### TASK-006 - Creare modello dati iniziale

Stato: TODO  
Fase roadmap: Fase 2 - Modello dati

Obiettivo:

Creare le entità principali del MVP.

Attività:

- Analizzare `Entities_With_Types_v11`
- Creare entità:
  - Employee
  - Department
  - User
  - Role
  - Device
  - DeviceType
  - PayrollDocument
  - LeaveRequest
  - LeaveType
  - HolidayCalendar
  - Holiday
  - AuditLog
- Usare UUID come chiave tecnica
- Preparare migrazioni database

Output atteso:

- Entità MVP create
- Migrazioni iniziali pronte

---

### TASK-007 - Implementare sicurezza JWT base

Stato: TODO  
Fase roadmap: Fase 3 - Sicurezza

Obiettivo:

Implementare autenticazione base.

Attività:

- Configurare Spring Security
- Creare login API
- Generare JWT
- Validare JWT
- Proteggere API principali

Output atteso:

- Login funzionante
- API protette

---

### TASK-008 - Implementare ruoli base

Stato: TODO  
Fase roadmap: Fase 3 - Sicurezza

Obiettivo:

Gestire i ruoli MVP.

Ruoli:

- HR_ADMIN
- MANAGER
- EMPLOYEE

Attività:

- Creare enum/entità ruoli
- Collegare utenti a ruoli
- Applicare controlli base sulle API

Output atteso:

- Permessi base funzionanti

---

### TASK-009 - CRUD Employee backend

Stato: TODO  
Fase roadmap: Fase 4 - Modulo Employee

Obiettivo:

Creare API backend per i dipendenti.

Attività:

- Repository Employee
- Service Employee
- DTO Employee
- Mapper Employee
- Controller REST Employee
- Validazioni base

Output atteso:

- API CRUD Employee funzionanti

---

### TASK-010 - UI Employee

Stato: TODO  
Fase roadmap: Fase 4 - Modulo Employee

Obiettivo:

Creare interfaccia dipendenti.

Attività:

- Lista dipendenti
- Form creazione
- Form modifica
- Dettaglio dipendente
- Filtri base
- Uso componenti shared

Output atteso:

- UI Employee funzionante

---

### TASK-011 - CRUD Device backend

Stato: TODO  
Fase roadmap: Fase 5 - Modulo Device

Obiettivo:

Creare API backend per dispositivi.

Attività:

- Repository Device
- Service Device
- DTO Device
- Mapper Device
- Controller REST Device
- Gestione stato dispositivo
- Collegamento a Employee

Output atteso:

- API CRUD Device funzionanti

---

### TASK-012 - UI Device

Stato: TODO  
Fase roadmap: Fase 5 - Modulo Device

Obiettivo:

Creare interfaccia dispositivi.

Attività:

- Lista dispositivi
- Form creazione/modifica
- Dettaglio dispositivo
- Assegnazione a dipendente
- Filtri base

Output atteso:

- UI Device funzionante

---

### TASK-013 - Upload PayrollDocument backend

Stato: TODO  
Fase roadmap: Fase 6 - Modulo PayrollDocument

Obiettivo:

Gestire upload documenti payroll.

Attività:

- API upload file
- Salvataggio repository locale sicuro
- Nome file anonimizzato
- Checksum
- Collegamento a Employee
- Stato bozza/pubblicato
- Audit upload

Output atteso:

- Upload payroll funzionante

---

### TASK-014 - Download PayrollDocument protetto

Stato: TODO  
Fase roadmap: Fase 6 - Modulo PayrollDocument

Obiettivo:

Permettere download sicuro dei documenti.

Attività:

- API download
- Controllo permessi per ruolo
- Audit download
- Gestione file non trovato

Output atteso:

- Download protetto funzionante

---

### TASK-015 - UI PayrollDocument

Stato: TODO  
Fase roadmap: Fase 6 - Modulo PayrollDocument

Obiettivo:

Creare interfaccia documenti payroll.

Attività:

- Lista documenti
- Upload documento
- Stato documento
- Download documento
- Filtri per dipendente/periodo

Output atteso:

- UI PayrollDocument funzionante

---

### TASK-016 - LeaveRequest backend

Stato: TODO  
Fase roadmap: Fase 7 - Modulo LeaveRequest

Obiettivo:

Gestire richieste di congedo.

Attività:

- CRUD LeaveRequest
- Stati:
  - inviato
  - approvato
  - rifiutato
  - annullato
- Flag urgente
- Motivazione obbligatoria se urgente
- Collegamento a Employee e LeaveType

Output atteso:

- API LeaveRequest funzionanti

---

### TASK-017 - Workflow approvazione congedi

Stato: TODO  
Fase roadmap: Fase 7 - Modulo LeaveRequest

Obiettivo:

Gestire approvazione/rifiuto congedi.

Attività:

- API approvazione
- API rifiuto
- Controllo ruolo Manager/HR
- Audit cambio stato
- Notifica email base

Output atteso:

- Workflow congedi MVP funzionante

---

### TASK-018 - UI LeaveRequest

Stato: TODO  
Fase roadmap: Fase 7 - Modulo LeaveRequest

Obiettivo:

Creare interfaccia congedi.

Attività:

- Lista richieste
- Form nuova richiesta
- Dettaglio richiesta
- Azioni approva/rifiuta
- Evidenza richieste urgenti

Output atteso:

- UI LeaveRequest funzionante

---

### TASK-019 - HolidayCalendar backend

Stato: TODO  
Fase roadmap: Fase 8 - Calendario festività

Obiettivo:

Gestire calendari festivi.

Attività:

- CRUD HolidayCalendar
- CRUD Holiday
- Festività per paese/anno
- Collegamento al calcolo congedi

Output atteso:

- API calendario festività funzionanti

---

### TASK-020 - UI HolidayCalendar

Stato: TODO  
Fase roadmap: Fase 8 - Calendario festività

Obiettivo:

Creare interfaccia festività.

Attività:

- Lista calendari
- Lista festività
- Form creazione/modifica
- Gestione festività mobili

Output atteso:

- UI festività funzionante

---

## 5. Task tecnici trasversali

### TASK-021 - Configurare audit log

Stato: TODO

Attività:

- Creare AuditLog
- Tracciare operazioni critiche
- Tracciare utente, data, azione, entità

Output atteso:

- Audit log base funzionante

---

### TASK-022 - Configurare notifiche email

Stato: TODO

Attività:

- Configurare Spring Mail
- Creare template base
- Inviare notifiche congedi
- Inviare notifiche payroll

Output atteso:

- Email MVP funzionanti

---

### TASK-023 - Configurare logging applicativo

Stato: TODO

Attività:

- Logging strutturato
- Log errori
- Log operazioni principali
- Predisposizione Grafana/Loki

Output atteso:

- Logging coerente

---

### TASK-024 - Test MVP

Stato: TODO

Attività:

- Test build backend
- Test build frontend
- Test API principali
- Test permessi
- Test workflow principali

Output atteso:

- MVP validato

---

## 6. Cronologia versioni

| Versione | Data | Descrizione |
|---|---|---|
| 1.0 | 2026-05-01 | Prima versione task operativi MVP. |