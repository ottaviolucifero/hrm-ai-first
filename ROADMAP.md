# ROADMAP.md

## Progetto HRM AI-first

Versione: 1.1  
Ultimo aggiornamento: 2026-05-01  
Stato: In avanzamento

---

## 1. Obiettivo

Definire le fasi operative per sviluppare il MVP della piattaforma HRM.

La roadmap deve rispettare:

- il Manifesto AI-first;
- la Macro-Analisi HRM;
- `AGENTS.md`;
- `ARCHITECTURE.md`;
- `TASKS.md`;
- `DECISIONS.md`.

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
- Integrazioni ERP / paghe
- Workflow complessi
- Automazioni AI avanzate
- Multitenancy evoluto

---

## 3. Stato avanzamento

### Completato

- Creata la struttura iniziale del repository Git.
- Creati i documenti principali di governance:
  - `AGENTS.md`
  - `ARCHITECTURE.md`
  - `ROADMAP.md`
  - `TASKS.md`
  - `DECISIONS.md`
- Inseriti i documenti di analisi in `docs/analysis`.
- Creato backend Spring Boot 3 / Java 21 in `backend`.
- Configurato Maven Wrapper per il backend.
- Configurato file backend `application.yml`.
- Configurata base iniziale per:
  - datasource PostgreSQL;
  - JPA;
  - server port;
  - Actuator health/info.
- Aggiunta decisione `DEC-011` sull’uso di YAML per la configurazione backend.
- Validato il backend con:

```cmd
mvnw.cmd clean install -DskipTests
```

### In corso / prossimo passo

- Installazione Docker Desktop.
- Configurazione Docker Compose con PostgreSQL.
- Preparazione ambiente database locale per sviluppo.

---

## 4. Roadmap operativa

### Fase 0 - Governance

Stato: completata

Obiettivo: preparare le regole del progetto.

Attività:

- Validare `AGENTS.md` - completato
- Validare `ARCHITECTURE.md` - completato
- Creare `ROADMAP.md` - completato
- Creare `TASKS.md` - completato
- Creare `DECISIONS.md` - completato

Output: documentazione base pronta.

---

### Fase 1 - Fondazione tecnica

Stato: in corso

Obiettivo: creare lo scheletro tecnico.

Attività:

- Creare repository Git - completato
- Creare backend Spring Boot 3 / Java 21 - completato
- Configurare base backend - completato
- Creare frontend Angular - da fare
- Configurare PostgreSQL - in corso
- Configurare Docker Compose - prossimo passo
- Configurare Swagger / OpenAPI - da fare
- Configurare profili dev, test, prod - da fare

Output: progetto avviabile.

---

### Fase 2 - Modello dati

Stato: da fare

Obiettivo: creare il database iniziale.

Attività:

- Analizzare `Entities_With_Types_v11`
- Creare entità principali
- Usare UUID come chiavi tecniche
- Creare migrazioni database
- Configurare audit base
- Allineare database e documentazione

Output: modello dati MVP pronto.

---

### Fase 3 - Sicurezza

Stato: da fare

Obiettivo: proteggere accessi e dati.

Attività:

- Implementare login JWT
- Implementare Spring Security
- Creare ruoli:
  - HR_ADMIN
  - MANAGER
  - EMPLOYEE
- Proteggere API REST
- Gestire visibilità dati per ruolo

Output: sicurezza base funzionante.

---

### Fase 4 - Modulo Employee

Stato: da fare

Obiettivo: gestire l’anagrafica dipendenti.

Attività:

- CRUD dipendenti
- Collegamento a dipartimento
- Collegamento a manager
- Stato dipendente
- Filtri base
- UI lista, dettaglio e form

Output: gestione dipendenti funzionante.

---

### Fase 5 - Modulo Device

Stato: da fare

Obiettivo: gestire dispositivi aziendali.

Attività:

- CRUD dispositivi
- Gestione tipo, marca, modello e seriale
- Gestione stato dispositivo
- Assegnazione a dipendente
- Storico assegnazioni base

Output: gestione dispositivi funzionante.

---

### Fase 6 - Modulo PayrollDocument

Stato: da fare

Obiettivo: gestire documenti payroll.

Attività:

- Upload file
- Salvataggio in repository locale sicuro
- Nome file anonimizzato
- Checksum
- Stato bozza/pubblicato
- Download protetto per ruolo
- Audit upload/download

Output: gestione documenti payroll funzionante.

---

### Fase 7 - Modulo LeaveRequest

Stato: da fare

Obiettivo: gestire richieste di congedo.

Attività:

- Creazione richiesta congedo
- Stati:
  - inviato
  - approvato
  - rifiutato
  - annullato
- Flag urgente
- Motivazione obbligatoria se urgente
- Validazioni base
- Notifiche email

Output: workflow congedi MVP funzionante.

---

### Fase 8 - Calendario festività

Stato: da fare

Obiettivo: gestire festività e giorni lavorativi.

Attività:

- Gestione `HolidayCalendar`
- Gestione `Holiday`
- Festività per paese e anno
- Aggiornamento manuale festività mobili
- Collegamento con richieste di congedo

Output: calendario festività funzionante.

---

### Fase 9 - Notifiche email

Stato: da fare

Obiettivo: inviare notifiche essenziali.

Attività:

- Configurare Spring Mail
- Creare template email base
- Notifica nuova richiesta congedo
- Notifica approvazione/rifiuto
- Notifica pubblicazione documento payroll

Output: notifiche email MVP funzionanti.

---

### Fase 10 - Audit e logging

Stato: da fare

Obiettivo: tracciare operazioni critiche.

Attività:

- Audit upload/download documenti
- Audit approvazioni/rifiuti congedi
- Audit modifiche dati critici
- Logging applicativo strutturato
- Predisposizione Grafana / Loki

Output: tracciabilità MVP.

---

### Fase 11 - UI MVP

Stato: da fare

Obiettivo: creare interfaccia coerente e usabile.

Attività:

- Layout principale
- Menu per ruolo
- Componenti condivisi
- Tabelle riutilizzabili
- Form riutilizzabili
- Rispetto template UI approvato

Output: UI MVP pronta.

---

### Fase 12 - Test e validazione

Stato: da fare

Obiettivo: verificare il MVP.

Attività:

- Build backend
- Build frontend
- Test API principali
- Test permessi
- Test Employee
- Test Device
- Test PayrollDocument
- Test LeaveRequest
- Test notifiche

Output: MVP validato.

---

### Fase 13 - Rilascio MVP

Stato: da fare

Obiettivo: preparare il primo rilascio.

Attività:

- Stabilizzare Docker Compose
- Preparare configurazioni ambiente
- Documentare deploy
- Preparare checklist rilascio
- Verifica finale

Output: MVP pronto al rilascio.

---

## 5. Post-MVP

Da valutare dopo il MVP:

- Keycloak
- S3 / MinIO
- App mobile
- Dashboard avanzate
- Integrazioni ERP / paghe
- Workflow approvativi complessi
- Multitenancy evoluto
- Automazioni AI avanzate
- Reportistica avanzata

---

## 6. Regola operativa

Ogni fase della roadmap deve essere trasformata in task piccoli dentro `TASKS.md`.

Gli agenti AI non devono implementare funzionalità fuori MVP senza istruzione esplicita.

GitHub resta la fonte ufficiale del progetto. Le fonti del progetto ChatGPT servono solo come supporto e contesto operativo.

---

## 7. Cronologia versioni

| Versione | Data | Descrizione |
|---|---|---|
| 1.1 | 2026-05-01 | Aggiornato avanzamento dopo TASK-001, TASK-002 e TASK-003. |
| 1.0 | 2026-05-01 | Prima versione roadmap MVP. |
