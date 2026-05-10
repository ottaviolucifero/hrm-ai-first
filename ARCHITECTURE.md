# ARCHITECTURE.md

## Progetto HRM AI-first

Versione: 1.2
Ultimo aggiornamento: 2026-05-10
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

---

## 4. Modello autorizzativo tenant-aware

La piattaforma usa una separazione esplicita tra identita applicativa, tipo utente, ruoli tenant-scoped e permessi tecnici.

Fonti gia presenti:

- `UserAccount` e il boundary identity/security email-first;
- `UserType` e un master globale per classificare account di piattaforma e account tenant;
- `Role` e `Permission` sono master tenant-scoped con `tenant_id`, unique constraint `(tenant_id, code)` e flag di sistema;
- `UserTenantAccess` dichiara accessi espliciti di un utente verso un tenant;
- `UserRole` collega utenti e ruoli dentro un tenant;
- `RolePermission` collega ruoli e permessi dentro un tenant;
- il JWT corrente espone `userId`, `tenantId` e `userType`, con authority tecnica minima `USER_TYPE_<userType>`;
- RBAC runtime completo, tenant switching e impersonation restano demandati a task successivi.

### 4.1 PLATFORM_SUPER_ADMIN

`PLATFORM_SUPER_ADMIN` e un tipo utente globale di piattaforma, non un normale ruolo applicativo tenant.

Regole:

- non appartiene semanticamente a un singolo tenant operativo, anche se l'account puo avere riferimenti tecnici minimi richiesti dallo schema corrente;
- puo amministrare configurazioni globali e tenant secondo policy esplicite;
- puo vedere o gestire dati tenant solo tramite regole cross-tenant esplicite, auditate e non implicite;
- non deve essere confuso con `TENANT_ADMIN`;
- non deve ottenere privilegi attraverso ruoli custom creati da un tenant;
- richiede controlli piu forti rispetto agli utenti tenant, coerenti con la governance MFA/strong authentication gia approvata.

### 4.2 TENANT_ADMIN

`TENANT_ADMIN` e un ruolo operativo limitato al tenant.

Regole:

- gestisce utenti, ruoli e configurazioni del proprio tenant;
- opera solo sui tenant presenti in `UserTenantAccess` e nei ruoli assegnati per quel tenant;
- non accede ad altri tenant per default;
- non modifica Master Data globali, salvo permessi globali espliciti definiti dalla piattaforma;
- non puo elevare se stesso o altri account a `PLATFORM_SUPER_ADMIN`;
- non puo rendere cross-tenant un ruolo custom.

### 4.3 Ruoli base seed e ruoli custom

I ruoli base seed sono ruoli di sistema creati per bootstrap e standardizzazione.

Regole:

- `system_role=true` identifica ruoli protetti;
- i ruoli base seed non devono essere cancellabili da normali operazioni tenant;
- eventuali modifiche devono essere limitate e governate, evitando rotture del bootstrap;
- i ruoli base non devono diventare un canale di escalation cross-tenant.

I ruoli custom sono creati dal tenant.

Regole:

- validi solo nel tenant di appartenenza;
- non visibili e non riutilizzabili cross-tenant;
- non possono modificare ruoli base globali o seed di altri tenant;
- possono aggregare solo permessi compatibili con lo scope del tenant.

### 4.4 Permessi CRUD Global Master Data

I Master Data globali richiedono permessi separati per operazione:

- `READ` / `LIST`;
- `CREATE`;
- `UPDATE`;
- `DELETE`.

Regole:

- la gestione completa dei Global Master Data appartiene alla piattaforma;
- `PLATFORM_SUPER_ADMIN` puo amministrarli secondo policy backend esplicite;
- `TENANT_ADMIN` puo leggerli quando servono alle configurazioni tenant;
- create/update/delete da parte di `TENANT_ADMIN` sono negati per default e richiedono una decisione futura specifica, ad esempio proposta o workflow di richiesta modifica;
- delete fisico resta subordinato alla policy Master Data esistente su record non referenziati.

### 4.5 Permessi CRUD Tenant Master Data

I Master Data tenant-scoped restano confinati al tenant.

Regole:

- `READ` / `LIST`, `CREATE`, `UPDATE` e `DELETE` devono essere autorizzati separatamente;
- create/update/delete richiedono tenant corrente coerente con token, accesso tenant e permessi assegnati;
- i record referenziati non devono essere cancellati fisicamente;
- disattivazione logica e delete fisico restano azioni distinte;
- nessun payload frontend puo imporre un `tenantId` diverso da quello autorizzato senza controllo backend.

### 4.6 Regole cross-tenant

Default: deny.

Regole:

- nessun accesso cross-tenant e implicito;
- accesso cross-tenant ammesso solo per `PLATFORM_SUPER_ADMIN` o permessi/platform policy espliciti;
- ogni accesso cross-tenant deve essere auditabile con tenant attore e tenant target;
- ruoli custom tenant-specific non possono concedere privilegi cross-tenant;
- `UserTenantAccess` e il punto dati per accessi multi-tenant espliciti, ma non sostituisce il controllo permessi runtime.

### 4.7 Impatto backend security

Il backend e l'unica fonte autorevole dell'autorizzazione.

Regole:

- Spring Security/JWT autentica l'utente, ma i service/controller devono applicare policy autorizzative quando TASK-055 introdurra enforcement reale;
- il naming futuro dei permessi deve restare coerente con il modello `SCOPE.RESOURCE.ACTION`, ad esempio `PLATFORM.TENANT.MANAGE`, `TENANT.MASTER_DATA.READ`, `TENANT.MASTER_DATA.CREATE`;
- le authority derivate da JWT non devono essere trattate come RBAC completo finche non esiste caricamento controllato di ruoli/permessi;
- tenant isolation deve essere verificata lato backend su ogni API tenant-scoped;
- il backend non deve fidarsi della sola visibilita frontend.

### 4.8 Impatto frontend visibility

La visibilita frontend e supporto UX, non sicurezza.

Regole:

- menu, route, bottoni e azioni devono essere mostrati, nascosti o disabilitati in base ai permessi disponibili;
- quando manca `CREATE`, `UPDATE` o `DELETE`, la UI deve degradare in read-only o disabilitare l'azione con feedback chiaro;
- la UI non deve mostrare funzioni cross-tenant a utenti tenant normali;
- nessuna nuova UI amministrativa completa viene introdotta da questa decisione;
- eventuali implementazioni Angular future devono riusare shell, sidebar, componenti shared, i18n e design system esistenti.

### 4.9 Gap intenzionali

Restano fuori da questa architettura documentale e sono demandati al backlog:

- review tecnica dettagliata del dominio User/Role/Permission in TASK-051;
- foundation stabile dei codici permesso in TASK-052;
- amministrazione tenant di utenti e ruoli in TASK-053;
- visibility frontend autorizzativa in TASK-054;
- enforcement backend API in TASK-055;
- tenant switching runtime, impersonation runtime e MFA operativa.
