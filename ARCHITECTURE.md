# ARCHITECTURE.md

## Progetto HRM AI-first

Versione: 1.0  
Ultimo aggiornamento: 2026-05-01  
Stato: Bozza

---

## 1. Obiettivo

Questo documento definisce l’architettura tecnica del progetto HRM.

Tutti gli agenti AI devono rispettare questa architettura e non introdurre strutture alternative senza approvazione.

---

## 2. Stack tecnologico

### Frontend

- Angular
- Template UI approvato
- Componenti condivisi riutilizzabili
- Architettura modulare

### Backend

- Spring Boot 4
- Java 21
- API REST
- Spring Security
- JWT per autenticazione MVP

### Database

- PostgreSQL
- UUID come chiavi tecniche
- Migrazioni database versionate
- Audit sulle entità critiche

### File storage

- Repository file locale sicuro per MVP
- Nomi file anonimizzati
- Checksum per integrità
- Predisposizione futura per S3 / MinIO

### Deploy

- Docker Compose
- Profili ambiente:
  - dev
  - test
  - prod

### Documentazione API

- OpenAPI
- Swagger UI

### Logging e monitoraggio

- Logging applicativo strutturato
- Predisposizione Grafana / Loki

---

## 3. Struttura repository proposta

```text
/project-root
  /backend
  /frontend
  /docs
    /analysis
    /architecture
    /decisions
  /docker
  AGENTS.md
  ARCHITECTURE.md
  ROADMAP.md
  TASKS.md
  DECISIONS.md
```