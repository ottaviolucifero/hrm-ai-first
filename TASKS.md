# TASKS.md

## Progetto HRM AI-first

Versione: 1.1  
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

Validazione:

- Struttura repository creata e pubblicata su GitHub.

---

### TASK-002 - Creare backend Spring Boot

Stato: DONE  
Fase roadmap: Fase 1 - Fondazione tecnica

Obiettivo:

Creare lo scheletro backend.

Attività:

- Creare progetto Spring Boot 3
- Usare Java 21
- Configurare Maven Wrapper
- Creare package base
- Configurare dipendenze backend iniziali

Output atteso:

- Backend avviabile/buildabile

Validazione:

```cmd
mvnw.cmd clean install -DskipTests
```

---

### TASK-003 - Configurare base backend

Stato: DONE  
Fase roadmap: Fase 1 - Fondazione tecnica

Obiettivo:

Configurare la base applicativa backend.

Attività:

- Convertire `application.properties` in `application.yml`
- Configurare datasource PostgreSQL
- Configurare JPA base
- Configurare porta server
- Configurare Actuator health/info
- Documentare decisione `DEC-011`

Output atteso:

- Configurazione backend iniziale pronta

Validazione:

```cmd
mvnw.cmd clean install -DskipTests
```

---

### TASK-004 - Configurare PostgreSQL e Docker Compose

Stato: DONE  
Fase roadmap: Fase 1 - Fondazione tecnica

Obiettivo:

Preparare ambiente locale database.

Attività:

- Creare `docker/docker-compose.yml`
- Configurare servizio PostgreSQL
- Configurare variabili ambiente
- Avviare container PostgreSQL
- Verificare accesso al database

Output atteso:

- Database avviabile
- PostgreSQL disponibile su porta `5432`

Validazione:

```cmd
cd C:\hrm-ai-first\docker
docker compose up -d
docker ps
docker exec -it hrm-postgres psql -U hrm_user -d hrm_db
```

---

### TASK-005 - Creare frontend Angular

Stato: TODO  
Fase roadmap: Fase 1 - Fondazione tecnica

Obiettivo:

Creare lo scheletro frontend.

Attività:

- Creare progetto Angular
- Configurare struttura `/core`, `/shared`, `/features`, `/layout`
- Preparare layout base
- Preparare routing iniziale
- Predisporre uso template Metronic Angular

Output atteso:

- Frontend avviabile
- Struttura coerente con `ARCHITECTURE.md`

---

### TASK-006 - Configurare Swagger / OpenAPI

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

### TASK-007 - Configurare profili dev/test/prod

Stato: TODO  
Fase roadmap: Fase 1 - Fondazione tecnica

Obiettivo:

Preparare configurazioni separate per ambiente.

Attività:

- Creare profilo `dev`
- Creare profilo `test`
- Creare profilo `prod`
- Separare configurazioni sensibili tramite variabili ambiente

Output atteso:

- Configurazioni ambiente ordinate e pronte per sviluppo

---

### TASK-008 - Creare modello dati iniziale

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

### TASK-009 - Implementare sicurezza JWT base

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

### TASK-010 - Implementare ruoli base

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

### TASK-011 - CRUD Employee backend

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

### TASK-012 - UI Employee

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

### TASK-013 - CRUD Device backend

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

### TASK-014 - UI Device

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

### TASK-015 - Upload PayrollDocument backend

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

### TASK-016 - Download PayrollDocument protetto

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

### TASK-017 - UI PayrollDocument

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

### TASK-018 - LeaveRequest backend

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

### TASK-019 - Workflow approvazione congedi

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

### TASK-020 - UI LeaveRequest

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

### TASK-021 - HolidayCalendar backend

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

### TASK-022 - UI HolidayCalendar

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

### TASK-023 - Configurare audit log

Stato: TODO

Attività:

- Creare AuditLog
- Tracciare operazioni critiche
- Tracciare utente, data, azione, entità

Output atteso:

- Audit log base funzionante

---

### TASK-024 - Configurare notifiche email

Stato: TODO

Attività:

- Configurare Spring Mail
- Creare template base
- Inviare notifiche congedi
- Inviare notifiche payroll

Output atteso:

- Email MVP funzionanti

---

### TASK-025 - Configurare logging applicativo

Stato: TODO

Attività:

- Logging strutturato
- Log errori
- Log operazioni principali
- Predisposizione Grafana/Loki

Output atteso:

- Logging coerente

---

### TASK-026 - Test MVP

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
| 1.1 | 2026-05-01 | Aggiornato stato task dopo completamento TASK-001, TASK-002, TASK-003 e TASK-004. |
| 1.0 | 2026-05-01 | Prima versione task operativi MVP. |
