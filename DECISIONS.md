# DECISIONS.md

## Progetto HRM AI-first

Versione: 1.18
Ultimo aggiornamento: 2026-05-04
Stato: Attivo

---

## 1. Obiettivo

Questo documento registra le decisioni importanti del progetto.

Serve a mantenere memoria di:

- cosa è stato deciso;
- perché è stato deciso;
- quali alternative sono state escluse;
- quale impatto ha la decisione sul progetto.

---

## 2. Regola

Ogni decisione importante deve essere aggiunta qui prima o subito dopo l’aggiornamento di:

- `ARCHITECTURE.md`
- `ROADMAP.md`
- `TASKS.md`
- `AGENTS.md`

---

## 3. Decisioni

### DEC-001 - Approccio AI-first con controllo umano

Data: 2026-05-01  
Stato: Approvata

Decisione:

Il progetto sarà sviluppato con approccio AI-first, usando ChatGPT, Codex e agenti AI come supporto operativo.

Motivazione:

L’obiettivo è accelerare analisi, generazione codice, revisione e validazione, mantenendo però il controllo umano sulle decisioni funzionali, tecniche e di rilascio.

Alternative escluse:

- sviluppo completamente manuale;
- sviluppo completamente delegato agli agenti senza controllo umano.

Impatto:

Gli agenti possono aiutare nell’implementazione, ma devono rispettare documentazione, MVP e architettura.

---

### DEC-002 - Sviluppo iniziale orientato a MVP

Data: 2026-05-01  
Stato: Approvata

Decisione:

La prima versione sarà un MVP limitato ai processi HR essenziali.

Motivazione:

Ridurre complessità, rischio e tempi di sviluppo.

Alternative escluse:

- implementare subito tutte le funzionalità enterprise;
- partire da workflow complessi;
- includere integrazioni esterne nella prima fase.

Impatto:

Le funzionalità fuori MVP saranno considerate post-MVP.

---

### DEC-003 - Stack Angular + Spring Boot + PostgreSQL

Data: 2026-05-01  
Stato: Approvata

Decisione:

Lo stack principale sarà:

- Angular per il frontend;
- Spring Boot 4 / Java 21 per il backend;
- PostgreSQL per il database.

Motivazione:

Stack solido, diffuso, adatto a backoffice web, API REST e applicazioni aziendali scalabili.

Alternative escluse:

- frontend non Angular;
- backend non Spring Boot;
- database non relazionale per il core HRM.

Impatto:

Gli agenti non devono introdurre framework alternativi senza approvazione.

---

### DEC-004 - JWT nel MVP invece di Keycloak

Data: 2026-05-01  
Stato: Approvata

Decisione:

Nel MVP sarà usata autenticazione JWT con Spring Security.

Motivazione:

JWT è più semplice da implementare nella prima fase e sufficiente per validare il MVP.

Alternative escluse:

- Keycloak immediato;
- provider esterni di autenticazione.

Impatto:

Keycloak resta possibile evoluzione post-MVP.

---

### DEC-005 - File storage locale nel MVP

Data: 2026-05-01  
Stato: Approvata

Decisione:

Nel MVP i file saranno salvati in repository locale sicuro.

Motivazione:

Soluzione più semplice e rapida per la prima fase.

Alternative escluse:

- S3;
- MinIO;
- storage cloud dedicato immediato.

Impatto:

L’architettura deve restare predisposta per migrazione futura a S3 / MinIO.

---

### DEC-006 - Docker Compose per deploy iniziale

Data: 2026-05-01  
Stato: Approvata

Decisione:

Il deploy iniziale userà Docker Compose.

Motivazione:

Semplifica ambiente locale, staging e prima produzione.

Alternative escluse:

- Kubernetes nella prima fase;
- deploy manuale non containerizzato.

Impatto:

Il progetto deve includere configurazioni Docker chiare e documentate.

---

### DEC-007 - App mobile esclusa dal MVP

Data: 2026-05-01  
Stato: Approvata

Decisione:

L’app mobile non sarà inclusa nel MVP.

Motivazione:

Il primo obiettivo è validare la piattaforma web HRM.

Alternative escluse:

- sviluppo immediato app mobile;
- sviluppo parallelo web + mobile.

Impatto:

Il frontend MVP sarà web Angular.

---

### DEC-008 - Dashboard avanzate escluse dal MVP

Data: 2026-05-01  
Stato: Approvata

Decisione:

Le dashboard avanzate saranno post-MVP.

Motivazione:

Nel MVP servono prima processi core funzionanti: dipendenti, dispositivi, payroll, congedi, festività, ruoli e audit.

Alternative escluse:

- analytics avanzata immediata;
- reportistica complessa nella prima fase.

Impatto:

Nel MVP sono ammesse solo viste semplici e operative.

---

### DEC-009 - Task piccoli per agenti AI

Data: 2026-05-01  
Stato: Approvata

Decisione:

Gli agenti AI lavoreranno su task piccoli, separati e verificabili.

Motivazione:

Riduce errori, regressioni e modifiche non controllate.

Alternative escluse:

- task troppo grandi;
- implementazioni massive in un solo prompt;
- modifiche multi-modulo senza controllo.

Impatto:

Ogni task deve avere obiettivo, file coinvolti, vincoli e output atteso.

---

### DEC-010 - Documentazione come fonte di verità

Data: 2026-05-01  
Stato: Approvata

Decisione:

La documentazione governa implementazione, architettura e priorità.

Motivazione:

Il progetto è AI-first ma non AI-incontrollato.

Alternative escluse:

- sviluppo guidato solo dal codice;
- agenti liberi di decidere architettura o priorità.

Impatto:

Ogni modifica importante deve aggiornare i documenti rilevanti.

---

### DEC-011 - Configurazione backend in YAML

Data: 2026-05-01  
Stato: Approvata

Decisione:

Il backend userà `application.yml` al posto di `application.properties` per la configurazione Spring Boot.

Motivazione:

YAML è più leggibile per configurazioni strutturate come datasource, JPA, server e actuator.

Alternative escluse:

- mantenere `application.properties`;
- distribuire la configurazione iniziale su più file non necessari nel MVP.

Impatto:

Le future configurazioni backend devono essere aggiunte in `backend/src/main/resources/application.yml`, salvo diversa decisione documentata.

---

### DEC-012 - Frontend enterprise con Angular standalone + shell modulare

Data: 2026-05-01  
Stato: Approvata

Decisione:

Il frontend HRM adotterà architettura enterprise basata su Angular standalone components, shell modulare (`app-shell`, `app-header`, `app-sidebar`) e integrazione progressiva del layout Metronic come riferimento grafico, non come copia integrale del template.

Motivazione:

Questa scelta riduce complessità iniziale, mantiene governance architetturale, migliora riuso componenti shared e permette adattamento controllato del design system Metronic senza importare codice superfluo.

Alternative escluse:

- copia integrale di pagine HTML Metronic;
- uso di React/Tailwind template come base tecnica primaria;
- struttura frontend monolitica.

Impatto:

Il frontend dovrà evolvere tramite componenti modulari, shared UI e layout progressivo. Le future integrazioni Metronic dovranno essere adattate al modello Angular esistente.

---

### DEC-013 - Enterprise normalized platform data model with master/core/bridge architecture, multi-country support, tenant governance, RBAC governance and lifecycle governance

Data: 2026-05-01  
Stato: Approvata

Decisione:

Il modello dati HRM sarà progettato come foundation enterprise scalabile e internazionale, con separazione esplicita tra master data, core domain e bridge tables. Employee non sarà limitato a un solo `fiscalCode` locale.

Il dominio userà:

- separazione Master / Core / Bridge;
- `CompanyProfile` come foundation tenant / azienda;
- `UserAccount` separato da `Employee`;
- RBAC con `Role`, `Permission`, `UserRole` e `RolePermission`;
- SMTP governance tramite configurazione dedicata;
- Employee international profile;
- geographic hierarchy;
- `GlobalZipCode`;
- contract governance;
- `PayrollDocument` governance;
- `FINAL_SETTLEMENT` tramite `DocumentType`;
- lifecycle con `hireDate` e `terminationDate`;
- normalized relational governance;
- PK/FK explicit architecture;
- tenant-scoped relational integrity;
- priorità a governance, sicurezza, scalabilità, standardizzazione, reporting e riduzione refactor.

Motivazione:

- Preparare piattaforma enterprise reale;
- evitare hardcode;
- supportare multi-company futura;
- supportare sicurezza enterprise;
- supportare crescita enterprise internazionale;
- preparare HRM robusto.

Alternative escluse:

- modello Employee basato solo su identificativo fiscale locale;
- company profile non modellato;
- utenze applicative fuse con employee;
- RBAC gestito come stringhe o boolean;
- SMTP non governato a livello dati;
- payroll document non collegato al contratto;
- valori HR core gestiti come stringhe libere;
- stati employee/device/contract gestiti come boolean semplificati;
- telefono employee gestito come singolo campo libero.

Impatto:

Il TASK-011 dovrà creare una foundation dati normalizzata con master/core/bridge architecture, supporto multi-country, tenant governance, RBAC governance, SMTP governance, geographic governance, contract governance, document governance e lifecycle governance coerenti con questa decisione.

---

### DEC-014 - Full SaaS multi-tenant architecture with tenant/company hierarchy, legal entity governance, disciplinary governance and audit governance

Data: 2026-05-01  
Stato: Approvata

Decisione:

La piattaforma HRM adotterà una architettura SaaS full multi-tenant. `Tenant` diventa il root boundary del cliente SaaS e ogni tenant può governare più `CompanyProfile`.

Il modello dati userà:

- `Tenant` come root architecture;
- relazione Tenant 1:N `CompanyProfile`;
- `CompanyProfileType` per distinguere legal entity, subsidiary, business unit, branch company o public entity;
- `OfficeLocationType` per distinguere sede legale, sede operativa, branch, warehouse o remote hub;
- relazione `CompanyProfile` 1:N `OfficeLocation`;
- Employee scoped a tenant e company;
- RBAC full tenant scoped;
- email-first identity model;
- UserAccount as authentication boundary;
- optional strong authentication;
- AuthenticationMethod governance;
- email OTP readiness;
- app OTP readiness;
- MFA policy scalability;
- audit governance tramite `AuditLog` e `AuditActionType`;
- disciplinary governance tramite `EmployeeDisciplinaryAction` e `DisciplinaryActionType`;
- normalized relational governance con primary keys, foreign keys e relationships esplicite;
- integrità relazionale tenant-scoped per tutte le business tables;
- SaaS scalability;
- white-label readiness.

Motivazione:

- Preparare piattaforma SaaS reale;
- supportare gruppi multi-company;
- supportare compliance enterprise;
- supportare audit e sicurezza;
- evitare refactor strutturali futuri.

Alternative escluse:

- single-tenant implicito;
- company unica per installazione;
- sedi aziendali non tipizzate;
- audit logging non tenant-aware;
- disciplinary governance gestita solo come documenti generici.

Impatto:

Il TASK-011 dovrà modellare tenant/company hierarchy, legal entity governance, office hierarchy, audit governance e disciplinary governance come parte della foundation dati iniziale.

---

### DEC-015 - Email-first identity and optional strong authentication governance

Data: 2026-05-01  
Stato: Approvata

Decisione:

L'accesso alla piattaforma HRM avverrà tramite email, non tramite username. `UserAccount` diventa la entity enterprise-ready responsabile di identity e authentication boundary.

Il modello dati userà:

- email come login principale;
- rimozione di `username`;
- `passwordHash` obbligatorio;
- unique constraint `(tenant + email)`;
- `AuthenticationMethod` per governare PASSWORD_ONLY, EMAIL_OTP, APP_OTP e combinazioni future;
- strong authentication opzionale tramite `strongAuthenticationRequired`;
- email OTP readiness tramite `emailOtpEnabled`;
- app OTP readiness tramite `appOtpEnabled` e `otpSecret` per TOTP;
- `employee` nullable per account non-HR;
- `companyProfile` nullable per tenant-level admins;
- campi security per email verification, password change, failed login attempts e account lock;
- campi localization e base audit fields;
- MFA policy scalability.

Motivazione:

- Login moderno basato su email;
- eliminare ambiguità da username;
- supportare sicurezza enterprise e compliance;
- preparare MFA opzionale;
- supportare tenant security policy;
- mantenere scalabilità futura senza introdurre SMS OTP, hardware keys, SSO enterprise o OAuth external IdP nel MVP.

Alternative escluse:

- username come login principale;
- MFA hardcoded senza master governance;
- SMS OTP nel MVP;
- hardware keys nel MVP;
- SSO enterprise o OAuth external IdP nel MVP.

Impatto:

Il TASK-011 dovrà modellare `UserAccount` come boundary identity/security email-first, includere `AuthenticationMethod`, OTP readiness, policy MFA tenant-ready e integrazione con SMTP per OTP email, password reset e system notifications.

---

### DEC-016 - Platform operator and super admin cross-tenant governance with mandatory strong authentication and auditability

Data: 2026-05-01  
Stato: Approvata

Decisione:

La piattaforma HRM introdurrà una governance esplicita per utenti tenant, tenant admin, platform operator e super admin tramite `UserType`.

Il modello dati userà:

- `UserType` per distinguere TENANT_USER, TENANT_ADMIN, PLATFORM_OPERATOR e SUPER_ADMIN;
- `UserTenantAccess` per accessi multi-tenant espliciti;
- cross-tenant governance;
- tenant switching;
- MFA obbligatoria per account elevati;
- cross-tenant audit;
- impersonation governance;
- `AuditLog` esteso con acting tenant, target tenant e impersonation mode.

Motivazione:

- Preparare una piattaforma SaaS enterprise reale;
- supportare operatori piattaforma;
- garantire sicurezza elevata;
- rendere auditabile ogni accesso cross-tenant;
- evitare refactor futuri su identity, access control e audit.

Alternative escluse:

- super admin implicito senza modello dati;
- accesso cross-tenant non auditato;
- tenant switching non tracciato;
- MFA opzionale per account elevati.

Impatto:

Il TASK-011 dovrà includere `UserType`, `UserTenantAccess`, strong authentication obbligatoria per PLATFORM_OPERATOR e SUPER_ADMIN, e auditabilità cross-tenant tramite `AuditLog`.

---

### DEC-017 - Post-TASK-011 execution slicing and enterprise roadmap restructuring

Data: 2026-05-01  
Stato: Approvata

Decisione:

TASK-011 resta macro-epic documentale per la foundation dati enterprise SaaS. L'implementazione successiva viene riorganizzata in slice incrementali dal TASK-012 in avanti.

Il piano operativo userà:

- backend slicing;
- UI slicing;
- governance slicing;
- incremental implementation;
- domain modularity;
- AI-safe execution planning.

Motivazione:

- Evitare mega-task;
- ridurre rischio;
- migliorare QA;
- facilitare branch management;
- preparare crescita enterprise.

Alternative escluse:

- implementare l'intero blueprint TASK-011 in un unico task;
- mantenere la vecchia sequenza MVP lineare dopo l'espansione enterprise;
- mescolare backend, UI, governance e compliance in branch non focalizzati.

Impatto:

TASK-012+ viene riorganizzato in fasi 2A-2G e Fase 3, mantenendo TASK-001 -> TASK-011 invariati.

---

### DEC-018 - Geographic hierarchy governance with denormalized query-friendly master structure and application-level consistency validation

Data: 2026-05-02  
Stato: Approvata

Decisione:

Si approva una struttura geografica parzialmente denormalizzata per le master tables introdotte con TASK-012:

- `Country`;
- `Region`;
- `Area`;
- `GlobalZipCode`.

Il modello mantiene riferimenti multipli:

- `Region` -> `Country`;
- `Area` -> `Country` + `Region`;
- `GlobalZipCode` -> `Country` + `Region` + `Area`.

Questa ridondanza intenzionale favorisce:

- query più semplici;
- filtri diretti;
- reporting enterprise;
- performance applicativa;
- flessibilità multi-country;
- import di dataset geografici eterogenei, inclusi dataset CAP da Excel.

La consistenza gerarchica, ad esempio `Area` appartenente alla `Region` corretta e `Region` appartenente al `Country` corretto, non sarà forzata esclusivamente tramite schema SQL complesso.

La governance della consistenza sarà gestita tramite:

- validation service layer;
- business rules;
- import validation;
- admin CRUD validation.

Motivazione:

- Ridurre complessità query;
- facilitare data import;
- supportare dataset incompleti o eterogenei;
- evitare over-engineering prematuro;
- migliorare performance su filtri geografici;
- consentire futura estensione globale.

Alternative escluse:

- modello geografico strettamente normalizzato con sole dipendenze transitive;
- enforcement completo della coerenza geografica tramite vincoli SQL complessi;
- hardcode geografico applicativo;
- blocco degli import in presenza di dataset parziali.

Trade-off:

Pro:

- simplicity;
- reporting;
- import practicality;
- scalability.

Contro:

- possibile incoerenza se la validation applicativa è assente;
- governance applicativa obbligatoria;
- maggiore responsabilità lato backend.

Mitigazioni:

- service validation obbligatoria;
- DTO validation;
- import validator;
- admin UI controlled selects;
- future integrity audits.

Note future:

Possibili evoluzioni:

- stricter normalized mode;
- geo consistency audit jobs;
- external geo datasets;
- advanced geolocation.

Impatto:

Le future implementazioni backend e UI che modificano dati geografici dovranno applicare validazioni esplicite di consistenza gerarchica e non potranno assumere che la coerenza sia garantita solo dal database.

---

### DEC-019 - Temporary tenant foundation strategy for tenant-scoped master data before Tenant entity implementation

Data: 2026-05-02  
Stato: Approvata

Decisione:

Le master tables HR/business introdotte con TASK-013 saranno tenant-scoped tramite campo strutturale `tenant_id UUID NOT NULL`, ma senza foreign key reale verso `Tenant` fino all'implementazione di TASK-015.

Il modello userà:

- `BaseTenantMasterEntity` come base JPA per master tenant-scoped;
- `tenant_id` obbligatorio;
- `code` obbligatorio;
- `name` obbligatorio;
- unique constraint `(tenant_id, code)` per ogni master table tenant-scoped;
- seed iniziali associati al tenant placeholder tecnico `00000000-0000-0000-0000-000000000001`.

Motivazione:

- Tenant non è ancora implementato nel database;
- TASK-013 deve preparare dati tenant-scoped senza anticipare TASK-015;
- evitare FK verso tabella inesistente;
- mantenere una struttura future-proof per la futura introduzione della FK reale;
- garantire fin da subito isolamento logico dei master business per tenant.

Alternative escluse:

- creare subito la tabella `Tenant` fuori scope TASK-013;
- rendere le master HR/business globali;
- usare code globalmente univoci senza tenant;
- introdurre FK fittizie o placeholder table non governate.

Impatto:

Quando TASK-015 introdurrà `Tenant`, le migration successive dovranno convertire `tenant_id` da campo strutturale a relazione governata tramite foreign key reale, preservando i dati seed e le unique constraint tenant-scoped.

---

### DEC-020 - Governance/security split between global authentication standards and tenant operational governance

Data: 2026-05-02  
Stato: Approvata

Decisione:

Il foundation governance/security introdotto con TASK-014 separa esplicitamente:

- standard globali di autenticazione, audit, disciplina e SMTP;
- governance operativa tenant-scoped per ruoli, permessi e tipologie organizzative.

Il modello usa master globali per:

- `UserType`;
- `AuthenticationMethod`;
- `AuditActionType`;
- `DisciplinaryActionType`;
- `SmtpEncryptionType`.

Il modello usa master tenant-scoped per:

- `Role`;
- `Permission`;
- `CompanyProfileType`;
- `OfficeLocationType`.

I pattern globali di autenticazione restano shared e governati a livello piattaforma, mentre ruoli, permessi e classificazioni operative restano isolati per tenant tramite `tenant_id` e unique constraint `(tenant_id, code)`.

Motivazione:

- mantenere coerenti gli standard di sicurezza piattaforma;
- permettere governance operativa specifica per tenant;
- evitare hardcode di ruoli e permessi;
- preparare RBAC enterprise senza anticipare bridge tables;
- preservare la temporary tenant placeholder strategy fino all'introduzione del dominio `Tenant`.

Alternative escluse:

- rendere tutti i master governance globali;
- rendere i pattern di autenticazione tenant-specific già nel foundation;
- creare subito `UserAccount`, `UserRole`, `RolePermission` o `Tenant`;
- introdurre RBAC operativo prima della foundation dati.

Impatto:

Le bridge RBAC operative saranno introdotte in task successivi, mantenendo continuità con il tenant placeholder tecnico `00000000-0000-0000-0000-000000000001` finché TASK-015 non introdurrà il dominio `Tenant` e il relativo FK hardening.

---

### DEC-021 - Tenant domain activation and placeholder-to-real SaaS hardening strategy

Data: 2026-05-02  
Stato: Approvata

Decisione:

TASK-015 attiva il dominio `Tenant` reale e converte la foundation tenant placeholder in struttura SaaS governata.

Il tenant placeholder tecnico `00000000-0000-0000-0000-000000000001` diventa record reale `FOUNDATION_TENANT`, preservando la continuita dei seed e dei dati tenant-scoped creati nei task precedenti.

Il modello usa:

- `Tenant` come root boundary SaaS reale;
- foreign key reali da tutte le tabelle tenant-scoped V2/V3 verso `tenants.id`;
- `CompanyProfile` come legal/business entity del tenant;
- `OfficeLocation` come rappresentazione delle sedi legali e operative della company;
- `SmtpConfiguration` come configurazione SMTP tenant-scoped.

Le credenziali SMTP, in particolare `username` e `passwordEncrypted`, sono opzionali per supportare relay interni, test mode, autenticazione non basata su username/password e provider futuri.

Motivazione:

- trasformare il tenant placeholder in dominio operativo reale;
- rafforzare l'integrita relazionale tenant-scoped;
- preservare compatibilita con i seed esistenti;
- preparare governance multi-company e multi-office;
- evitare vincoli SMTP eccessivi nella foundation dati.

Alternative escluse:

- mantenere `tenant_id` come UUID strutturale senza FK oltre TASK-015;
- creare un nuovo tenant seed diverso dal placeholder esistente;
- rendere obbligatorie credenziali SMTP username/password a livello schema;
- anticipare UserAccount, Employee, bridge RBAC o configurazioni SMTP operative avanzate.

Impatto:

Le future implementazioni tenant-scoped dovranno referenziare `tenants.id` con FK reale. Le validazioni applicative gestiranno eventuali regole SMTP specifiche senza imporre credenziali obbligatorie nello schema dati.

---

### DEC-022 - Read-only foundation API boundary with DTO projection and service-layer mapping

Data: 2026-05-02  
Stato: Approvata

Decisione:

TASK-016 introduce una boundary API foundation read-only per esporre `Tenant`, `CompanyProfile`, `OfficeLocation` e `SmtpConfiguration` senza serializzare direttamente le entity JPA.

Il modello API usa:

- DTO response espliciti per la foundation;
- service layer read-only transazionale per mapping e lettura dati;
- controller REST dedicato sotto `/api/foundation`;
- error handling standard per not found, validation error e constraint violation;
- esclusione di `passwordEncrypted` dalle response SMTP.

Motivazione:

- evitare accoppiamento diretto tra API pubbliche ed entity persistence;
- prevenire leak di campi sensibili SMTP;
- preparare Swagger/OpenAPI con contratti stabili;
- mantenere TASK-016 limitato alla readiness API senza anticipare CRUD, Employee, UserAccount o RBAC operativo.

Alternative escluse:

- esporre direttamente entity JPA dai controller;
- introdurre API write/admin CRUD in TASK-016;
- esporre credenziali SMTP cifrate nelle response;
- creare nuove macro-entita domain fuori scope.

Impatto:

Le future API foundation dovranno preferire DTO espliciti e service-layer mapping. Le entity JPA restano modello persistence, non contratto REST pubblico.

---

### DEC-023 - Backend-first execution strategy before enterprise UI implementation

Data: 2026-05-02  
Stato: Approvata

Decisione:

Il backlog futuro della piattaforma HRM sarà eseguito con strategia backend-first.

L'ordine di implementazione approvato è:

- completare prima backend entities, persistence, repository, migration Flyway e test per le entità core e bridge tables rimanenti;
- consolidare poi API readiness tramite DTO, service layer, controller REST e validazioni applicative;
- implementare solo dopo le UI enterprise operative;
- evitare che le UI anticipino entità, relazioni, migration o backend foundation non ancora presenti;
- introdurre la UI Master Data Admin dopo API readiness, come interfaccia di gestione delle master/lookup tables già fondate.

La UI Master Data Admin dovrà essere progettata per governare master e lookup tables già introdotte nella foundation, inclusi master geografici, HR/business, governance/security e tenant-scoped classifications.

Motivazione:

- ridurre refactor tra dominio, API e frontend;
- evitare UI mock premature non allineate al modello dati reale;
- mantenere coerenza tra persistence model, API contract e interfacce enterprise;
- proteggere la qualità della foundation backend prima di esporre operazioni utente;
- semplificare test, regressione e avanzamento incrementale del backlog;
- mantenere disciplina AI-safe con task piccoli e verificabili.

Alternative escluse:

- implementare UI operative prima delle rispettive entità backend;
- costruire schermate basate su mock come scope principale dei task;
- introdurre API o frontend senza migration e repository coerenti;
- mescolare backend foundation, API readiness e UI nello stesso task;
- anticipare master data admin UI prima della disponibilità delle API necessarie.

Impatto:

Da TASK-019 in avanti, le implementazioni tecniche dovranno privilegiare prima la foundation backend, poi API readiness e infine UI enterprise. Le UI future dovranno consumare contratti API stabili e non definire autonomamente il modello di dominio.

---

### DEC-024 - Master Data Admin requires backend CRUD API before operational UI

Data: 2026-05-03  
Stato: Approvata

Decisione:

Le UI CRUD operative non devono essere implementate prima delle API CRUD backend corrispondenti.

Le API read-only esistenti, incluse `/api/foundation` e `/api/core-hr`, non sono sufficienti per una UI amministrativa completa.

Master Data Admin sarà implementato in questa sequenza:

1. API CRUD master data globali
2. API CRUD master data HR/business
3. API CRUD master data governance/security
4. UI foundation/list
5. UI CRUD

I task UI possono riusare API read-only solo per consultazione, non per CRUD completo.

Motivazione:

- evitare mock UI non durevoli;
- evitare refactor successivi tra UI e backend;
- mantenere coerenza tra contratti API, service validation e interfacce amministrative;
- rendere OpenAPI verificabile prima dello sviluppo UI CRUD;
- preservare la strategia backend-first.

Alternative escluse:

- implementare UI CRUD Master Data Admin basata solo su API read-only;
- introdurre mock UI come sostituto dei contratti API backend;
- implementare schermate CRUD prima di DTO request/response, service layer, controller REST, validazioni e test backend;
- mescolare API CRUD e UI CRUD nello stesso task.

Impatto:

Il backlog viene riorganizzato introducendo prima:

- TASK-030 API CRUD master data globali;
- TASK-031 API CRUD master data HR/business;
- TASK-032 API CRUD master data governance/security.

La UI Master Data Admin viene rinviata a:

- TASK-033 UI Master Data Admin foundation/list;
- TASK-034 UI Master Data Admin CRUD.

---

### DEC-025 - Agent governance split and historical analysis source precedence

Data: 2026-05-04
Stato: Approvata

Decisione:

La governance operativa degli agenti viene strutturata su piu livelli:

- `AGENTS.md` resta la governance globale del progetto;
- `backend/AGENTS.md` contiene le istruzioni specifiche per il backend Spring Boot;
- `frontend/AGENTS.md`, quando presente, contiene le istruzioni specifiche per il frontend Angular.

Il repository non usera una cartella `/skills` o un file `SKILLS.md` come fonte di governance interna. Eventuali skill esterne possono essere consultate solo come ispirazione operativa, ma non vengono installate, copiate o rese fonte autoritativa automaticamente.

I file in `docs/analysis` sono classificati come materiale storico e supportivo. Possono essere consultati per contesto, ma non prevalgono su istruzioni umane esplicite, `DECISIONS.md`, `ARCHITECTURE.md`, `TASKS.md`, `ROADMAP.md`, `AGENTS.md`, istruzioni area-specific o codice gia implementato.

Motivazione:

- Chiarire la separazione tra governance globale e regole operative per area;
- evitare che analisi storiche sovrascrivano decisioni, task, roadmap o codice consolidato;
- mantenere il repository privo di sistemi paralleli di skill governance;
- ridurre ambiguita per gli agenti AI durante task backend-only o frontend-only.

Alternative escluse:

- usare `/skills` o `SKILLS.md` come governance interna del repository;
- trattare `docs/analysis` come fonte autoritativa corrente in caso di conflitto;
- copiare o installare skill esterne automaticamente;
- mantenere tutte le regole backend/frontend solo nel root `AGENTS.md`.

Impatto:

Gli agenti devono seguire prima la governance corrente e le decisioni documentate, poi il codice implementato, e usare `docs/analysis` solo come contesto storico/supportivo. Le modifiche backend e frontend devono rispettare i rispettivi file area-specific quando presenti.

---

## 4. Cronologia versioni

| Versione | Data | Descrizione |
|---|---|---|
| 1.18 | 2026-05-04 | Aggiunta DEC-025 per separare governance globale e area-specific con `backend/AGENTS.md` e `frontend/AGENTS.md`, escludere `/skills` e `SKILLS.md`, e chiarire che `docs/analysis` e materiale storico/supportivo non prevalente su governance corrente o codice implementato. |
| 1.17 | 2026-05-03 | Aggiunta DEC-024 per imporre API CRUD backend master data prima della UI Master Data Admin operativa. |
| 1.16 | 2026-05-02 | Aggiunta DEC-023 per strategia backend-first: foundation persistence e API readiness prima delle UI enterprise. |
| 1.15 | 2026-05-02 | Aggiunta DEC-022 per boundary API foundation read-only con DTO, service layer e protezione campi SMTP sensibili. |
| 1.14 | 2026-05-02 | Aggiunta DEC-021 per attivazione dominio Tenant reale, FK hardening SaaS e credenziali SMTP opzionali. |
| 1.13 | 2026-05-02 | Aggiunta DEC-020 per split governance/security tra standard globali e governance operativa tenant-scoped. |
| 1.12 | 2026-05-02 | Aggiunta DEC-019 per strategia temporanea tenant foundation su master data tenant-scoped prima della tabella Tenant. |
| 1.11 | 2026-05-02 | Aggiunta DEC-018 per governance geografica parzialmente denormalizzata con validation applicativa obbligatoria. |
| 1.10 | 2026-05-01 | Aggiunta DEC-017 per riorganizzazione completa TASK-012+ in slicing enterprise SaaS post TASK-011. |
| 1.9 | 2026-05-01 | Aggiunta DEC-016 per platform operator, super admin, cross-tenant governance, mandatory MFA e auditability. |
| 1.8 | 2026-05-01 | Aggiunta DEC-015 per identity email-first, UserAccount authentication boundary, AuthenticationMethod, OTP readiness e MFA policy scalability. |
| 1.7 | 2026-05-01 | DEC-013 e DEC-014 integrate con normalized relational governance, PK/FK explicit architecture e tenant-scoped relational integrity. |
| 1.6 | 2026-05-01 | Aggiunta DEC-014 per architettura SaaS full multi-tenant con tenant/company hierarchy, legal entity, audit e disciplinary governance. |
| 1.5 | 2026-05-01 | DEC-013 aggiornata a platform data model con master/core/bridge architecture, tenant, RBAC, SMTP, geographic, contract e document governance. |
| 1.4 | 2026-05-01 | DEC-013 aggiornata con master/core separation, demographic governance, contact governance e blueprint HR-ready. |
| 1.3 | 2026-05-01 | DEC-013 estesa con lifecycle governance, status lookup, contract type e standard employee contact fields. |
| 1.2 | 2026-05-01 | Aggiunta DEC-013 per modello dati enterprise normalizzato con master tables e supporto multi-country. |
| 1.1 | 2026-05-01 | Registrate decisioni iniziali di fondazione tecnica e frontend enterprise. |

---

## 5. Template per nuove decisioni

```markdown
### DEC-XXX - Titolo decisione

Data: YYYY-MM-DD  
Stato: Proposta / Approvata / Superata

Decisione:

Descrivere la decisione.

Motivazione:

Spiegare perché è stata presa.

Alternative escluse:

- alternativa 1;
- alternativa 2.

Impatto:

Descrivere conseguenze tecniche, funzionali o operative.
```
