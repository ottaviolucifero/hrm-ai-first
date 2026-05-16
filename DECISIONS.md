# DECISIONS.md

## Progetto HRM AI-first

Versione: 1.42
Ultimo aggiornamento: 2026-05-16
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

La UI Master Data Admin resta rinviata dopo le API CRUD master data. La numerazione corrente viene aggiornata da DEC-026:

- TASK-036 UI Master Data Admin foundation/list;
- TASK-037 UI Master Data Admin CRUD.

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

### DEC-026 - Login/JWT foundation before administrative UI

Data: 2026-05-04
Stato: Approvata

Contesto:

La foundation `UserAccount` esiste gia e modella identity/security email-first, ma login runtime, JWT, OTP/MFA, RBAC runtime, tenant switching e impersonation sono ancora deferred.

Decisione:

Backend login/JWT foundation e frontend login foundation devono precedere le UI amministrative.

Il backlog operativo viene ordinato cosi:

1. TASK-034 backend login/JWT foundation
2. TASK-035 frontend login foundation
3. TASK-036 UI Master Data Admin foundation/list
4. TASK-037 UI Master Data Admin CRUD

Motivazione:

- evitare di sviluppare UI amministrative senza una foundation di autenticazione;
- allineare accesso applicativo, shell frontend e protezione delle rotte prima delle schermate operative;
- mantenere separata la foundation login/JWT da RBAC runtime e tenant switching;
- ridurre refactor successivi sulle UI amministrative.

Conseguenze:

Master Data Admin viene spostato dopo login foundation. Le UI amministrative dovranno essere implementate quando backend login/JWT e frontend login foundation sono disponibili.

Non obiettivi:

- non implementare OTP/MFA in questa fase;
- non implementare RBAC runtime in questa fase;
- non implementare tenant switching in questa fase;
- non implementare impersonation in questa fase.

Impatto:

TASKS.md definisce il nuovo ordine operativo dei task. ROADMAP.md espone TASK-034 come prossimo passo. Questa decisione aggiorna la sequenza operativa introdotta da DEC-024 senza modificare il principio: le UI amministrative restano subordinate a foundation e contratti backend stabili.

---

### DEC-027 - Backend login/JWT foundation contract and email identity rules

Data: 2026-05-04
Stato: Approvata

Decisione:

La foundation login backend del MVP usa autenticazione stateless JWT con Spring Security OAuth2 Resource Server / Jose.

La login avviene solo tramite email e password:

- `email` e identificativo globale dell'account utente;
- la login via email e case-insensitive;
- l'email viene normalizzata con trim + lowercase prima del lookup;
- `username` non e una credenziale di login;
- la stessa email non puo esistere su piu tenant, neanche con differenze di maiuscole/minuscole.

Il JWT usa questi claim principali:

- `sub`: email normalizzata lowercase;
- `userId`;
- `tenantId`;
- `userType`.

`USER_TYPE_<userType>` e ammessa come authority tecnica minima derivata dal token, ma non introduce RBAC runtime completo.

Motivazione:

- mantenere un modello login email-first coerente con `UserAccount`;
- evitare ambiguita tra tenant in assenza di tenant switching runtime;
- preparare il frontend login foundation con un contratto token stabile;
- usare componenti Spring Security standard per JWT;
- mantenere il MVP stateless e semplice da validare.

Alternative escluse:

- login tramite username;
- email duplicata tra tenant;
- JWT con claim tenant switching o impersonation;
- RBAC runtime completo in TASK-034;
- refresh token, logout server-side, registrazione, forgot password o change password nel task login foundation.

Impatto:

Il database deve imporre un vincolo globale case-insensitive su `user_accounts.email`. Le future API che creeranno o aggiorneranno account utente dovranno normalizzare e validare email coerentemente con questa decisione e dovranno applicare la password policy backend prima di salvare nuovi hash password.

---

### DEC-028 - Master Data logical deactivation and physical delete policy

Data: 2026-05-07
Stato: Approvata

Decisione:

I Master Data supportano due azioni distinte:

- `Disattiva`: soft-delete tramite `active=false`, mantiene il record nel database e serve per record storici, gia usati o da non rendere piu selezionabili.
- `Elimina`: cancellazione fisica reale, consentita solo per record non referenziati da altre tabelle o processi.

La cancellazione fisica non sostituisce la disattivazione logica e non deve essere usata per mascherare record disattivati.

Quando un record Master Data e referenziato, il backend deve bloccare la cancellazione fisica con errore coerente, preferibilmente `409 Conflict` o gestione equivalente. La UI deve mostrare un messaggio chiaro, ad esempio: `Il record non puo essere eliminato perche e collegato ad altri dati`.

Motivazione:

- distinguere chiaramente lifecycle operativo e rimozione definitiva;
- preservare integrita storica e referenziale;
- consentire pulizia sicura di record creati per errore o mai usati;
- evitare feedback UI falsi su cancellazioni non avvenute;
- mantenere compatibilita con la soft-delete gia introdotta nelle API Master Data.

Alternative escluse:

- sostituire la disattivazione logica con delete fisico;
- usare `active=false` come simulazione della cancellazione fisica;
- nascondere record lato frontend per far sembrare che siano stati eliminati;
- permettere delete fisico di record referenziati;
- ignorare errori di integrita database restituendo successo.

Impatto:

Il backlog introduce TASK-047 come task dedicato alla cancellazione fisica sicura dei Master Data non referenziati. Le future UI Master Data devono trattare `Disattiva` ed `Elimina` come azioni separate, con conferme e messaggi distinti. Le implementazioni backend devono preferire controlli espliciti o gestione controllata dei vincoli FK, restituendo errori leggibili quando il record non puo essere eliminato.

---

### DEC-029 - Repository-local versioning policy for approved AI skills

Data: 2026-05-09
Stato: Approvata

Decisione:

Le AI skills approvate per il progetto possono essere versionate nel repository quando servono a standardizzare il lavoro degli agenti.

Per lo stato corrente e approvata solo la skill Angular `angular-developer`, da integrare anche in forma repository-local sotto `.agents/skills/angular-developer` con lock in `skills-lock.json`.

Sul lato backend/Spring non esiste ancora una skill repository-local approvata. Ogni futura skill Spring/backend dovra esplicitare fonte, perimetro operativo, relazione con `backend/AGENTS.md` e lock dedicato prima dell'integrazione nel repository.

La skill `angular-new-app` e esplicitamente esclusa dal progetto `hrm-ai-first` perche il frontend Angular esiste gia e il lavoro deve evolvere la codebase corrente.

Nuove skill future possono essere aggiunte solo tramite decisione dedicata in `DECISIONS.md` e task dedicato in `TASKS.md`/`ROADMAP.md`.

Motivazione:

- standardizzare il comportamento operativo degli agenti su task Angular;
- rendere riproducibile e verificabile il set di skill approvate;
- evitare uso opportunistico di skill non allineate alla governance repository;
- mantenere controllo esplicito sul perimetro AI operativo.

Alternative escluse:

- usare skill non versionate/locali come riferimento primario;
- approvare implicitamente tutte le skill disponibili;
- usare `angular-new-app` in un repository con frontend gia esistente;
- introdurre nuove skill senza decisione e task dedicati.

Impatto:

`TASK-048.9` include governance piu integrazione repository-local della skill approvata (`.agents/` + `skills-lock.json`).

`TASK-050` prepara la valutazione e l'eventuale integrazione di una skill Spring/backend approvata; finche non viene approvata esplicitamente, `skills-lock.json` continua a tracciare solo la skill Angular corrente.

`docs/ai-prompts/codex-prompt-governance.md` deve chiarire uso della skill locale quando presente e subordinazione alle fonti di governance.

`AGENTS.md` e `frontend/AGENTS.md` restano le fonti operative principali; le skill sono complementari e non sostitutive.

---

### DEC-030 - Tenant-aware authorization model with global Platform Super Admin and tenant-scoped RBAC

Data: 2026-05-10
Stato: Approvata

Decisione:

La piattaforma HRM adotta un modello autorizzativo tenant-aware con separazione esplicita tra:

- `PLATFORM_SUPER_ADMIN` come tipo utente globale di piattaforma;
- `TENANT_ADMIN` come ruolo operativo limitato al tenant;
- ruoli base seed tenant-scoped e protetti;
- ruoli custom tenant-specific;
- permessi CRUD tecnici separati per Global Master Data e Tenant Master Data;
- regole cross-tenant default deny.

`PLATFORM_SUPER_ADMIN` non e un normale ruolo tenant e non deve essere modellato come ruolo custom. Puo amministrare configurazioni globali e tenant solo secondo policy backend esplicite, con audit cross-tenant quando accede o opera su tenant diversi.

`TENANT_ADMIN` opera solo nel tenant autorizzato. Puo gestire utenti, ruoli e configurazioni del proprio tenant, ma non puo accedere ad altri tenant, modificare Master Data globali o elevare utenti a privilegi piattaforma senza permessi globali espliciti definiti dalla piattaforma.

I ruoli seed con `system_role=true` e i permessi seed con `system_permission=true` sono asset di bootstrap/governance. Non devono essere cancellabili tramite normale amministrazione tenant e possono essere modificati solo entro limiti governati.

I ruoli custom creati dal tenant sono validi solo nel tenant di appartenenza, non sono visibili cross-tenant e non possono concedere privilegi piattaforma o cross-tenant.

I permessi devono evolvere verso il formato `SCOPE.RESOURCE.ACTION`, coerente con TASK-052. Le azioni CRUD minime da distinguere sono `READ` / `LIST`, `CREATE`, `UPDATE` e `DELETE`.

Regole Global Master Data:

- gestione completa riservata alla piattaforma;
- `PLATFORM_SUPER_ADMIN` autorizzabile secondo policy esplicita;
- `TENANT_ADMIN` read-only per default quando il dato globale serve a configurazioni tenant;
- create/update/delete tenant su dati globali negati per default.

Regole Tenant Master Data:

- scope limitato al tenant;
- create/update/delete autorizzati solo con tenant coerente e permessi espliciti;
- cancellazione fisica bloccata per record referenziati secondo DEC-028;
- nessun payload frontend puo aggirare il tenant autorizzato.

Regole cross-tenant:

- default deny;
- accesso ammesso solo per `PLATFORM_SUPER_ADMIN` o policy/permessi piattaforma espliciti;
- ogni accesso cross-tenant deve essere auditabile;
- ruoli custom tenant-specific non possono produrre escalation cross-tenant.

Il backend e la fonte autorevole dell'autorizzazione. Il frontend puo mostrare, nascondere o disabilitare menu, route, bottoni e azioni in base ai permessi, ma questo e solo supporto UX e non sostituisce enforcement backend.

Motivazione:

- evitare ambiguita tra privilegi di piattaforma e privilegi tenant;
- prevenire escalation tramite ruoli custom tenant;
- rendere chiaro il confine tra visibility frontend e sicurezza reale;
- preparare TASK-051, TASK-052, TASK-053, TASK-054 e TASK-055 con una direzione stabile;
- preservare coerenza con DEC-016, DEC-020, DEC-027 e DEC-028.

Alternative escluse:

- modellare `PLATFORM_SUPER_ADMIN` come ruolo tenant custom;
- rendere `TENANT_ADMIN` implicitamente cross-tenant;
- affidare la sicurezza a pulsanti nascosti nel frontend;
- usare permessi generici `WRITE` senza distinguere create/update/delete;
- permettere a ruoli custom tenant di modificare Master Data globali o concedere privilegi piattaforma;
- introdurre enforcement runtime completo dentro TASK-049.

Impatto:

`ARCHITECTURE.md` documenta il modello strategico. TASK-049 resta documentale e non modifica codice, migration o runtime security. TASK-050 prepara la governance della skill Spring/backend per i prossimi task backend/security; TASK-051 dovra verificare il dominio esistente e i gap tecnici; TASK-052 dovra definire la foundation dei codici permesso; TASK-054 e TASK-055 applicheranno rispettivamente visibility frontend ed enforcement backend.

---

### DEC-031 - Repository-local Spring backend governance skill approval

Data: 2026-05-10
Stato: Approvata

Decisione:

Si approva una skill repository-local minima `spring-backend-developer` sotto `.agents/skills/spring-backend-developer` come supporto operativo per i task backend del progetto HRM AI-first.

La skill e intenzionalmente minimale e di governance: non introduce un catalogo tecnico esterno come fonte primaria, non sostituisce la documentazione del repository e non ridefinisce l'architettura backend.

La skill approvata si applica a:

- Spring Boot 4;
- Java 21;
- Spring Security;
- JWT/security foundation;
- User/Role/Permission domain review;
- permission model foundation;
- backend authorization enforcement;
- JPA/Flyway;
- service layer;
- DTO/controller;
- backend tests.

Il lock della skill deve essere tracciato in `skills-lock.json`.

Motivazione:

- standardizzare il lavoro degli agenti sui prossimi task backend/security;
- mantenere una guida riusabile ma subordinata alla governance repository;
- evitare uso implicito di skill Spring/backend generiche o non approvate;
- chiarire il perimetro operativo prima dei task TASK-051..TASK-055.

Alternative escluse:

- trattare skill esterne o non versionate come riferimento backend primario;
- introdurre una skill Spring/backend ampia o vendor-driven senza approvazione documentata;
- lasciare i task backend/security successivi senza una guida operativa comune repository-local.

Impatto:

`backend/AGENTS.md` puo riferire la skill come supporto operativo approvato.

`docs/ai-prompts/codex-prompt-governance.md` puo documentarne l'uso nei prompt/task backend.

`skills-lock.json` non traccia piu solo Angular, ma anche la skill backend approvata.

La skill non autorizza nuove architetture parallele, nuove librerie/framework non approvati, migration fuori scope, API non richieste, RBAC enforcement fuori task o refactor security non richiesto.

---

### DEC-032 - Stable permission code format by scope resource and action

Data: 2026-05-10
Stato: Approvata

Decisione:

I permessi tecnici della piattaforma usano il formato stabile `SCOPE.RESOURCE.ACTION`.

Gli scope iniziali ammessi sono:

- `PLATFORM`;
- `TENANT`.

Le resource iniziali ammesse sono:

- `TENANT`;
- `USER`;
- `ROLE`;
- `PERMISSION`;
- `MASTER_DATA`;
- `EMPLOYEE`;
- `CONTRACT`;
- `DEVICE`;
- `PAYROLL_DOCUMENT`;
- `LEAVE_REQUEST`.

Le action iniziali ammesse sono:

- `READ`;
- `CREATE`;
- `UPDATE`;
- `DELETE`;
- `MANAGE`.

Il modello iniziale resta a livello modulo/risorsa. Non introduce codici per singola entita Master Data, quindi un codice come `TENANT.MASTER_DATA.WORK_MODE.CREATE` resta fuori modello.

I permessi seed di foundation sono marcati `system_permission=true` e non devono essere cancellabili tramite amministrazione ordinaria quando i task successivi introdurranno API/policy amministrative complete.

Motivazione:

- rendere leggibile e stabile il vocabolario autorizzativo;
- fornire una base comune a visibility frontend e enforcement backend futuro;
- evitare granularita prematura sui singoli Master Data;
- mantenere separati vocabolario e enforcement runtime.

Alternative escluse:

- mantenere codici legacy come `EMPLOYEE_READ` o `SETTINGS_MANAGE`;
- introdurre permessi per singola entita Master Data nel task foundation;
- derivare sicurezza reale dalla sola visibility frontend;
- introdurre enforcement completo in TASK-052.

Impatto:

`TASK-052` introduce il vocabolario backend e il seed dati. `TASK-053` dovra proteggere ruoli/permessi seed e contratti amministrativi. `TASK-054` e `TASK-055` useranno questi codici rispettivamente per visibility frontend e enforcement backend reale.

---

### DEC-033 - TASK-053 execution split before frontend visibility and backend enforcement

Data: 2026-05-10
Stato: Approvata

Decisione:

TASK-053 resta un epic/contenitore per la foundation amministrativa tenant-aware e viene eseguito tramite quattro subtask interni:

- TASK-053.1 backend role administration API foundation;
- TASK-053.2 frontend role permission matrix UI foundation;
- TASK-053.3 tenant custom role CRUD foundation;
- TASK-053.4 tenant user administration UI/API foundation.

TASK-054 resta il task principale dedicato alla visibility frontend basata sui permessi. TASK-055 resta il task principale dedicato all'enforcement backend reale.

Motivazione:

Separare contratti backend ruoli/permessi, UI matrice permessi e amministrazione utenti tenant riduce il rischio cross-stack e impedisce di anticipare enforcement o visibility completa dentro un task troppo ampio.

Alternative escluse:

- trattare TASK-053 come unico task full-stack indivisibile;
- promuovere TASK-053.1, TASK-053.2, TASK-053.3 e TASK-053.4 a milestone principali indipendenti;
- introdurre visibility frontend completa o enforcement backend reale dentro TASK-053.

Impatto:

TASKS.md e ROADMAP.md devono mostrare TASK-053 come contenitore; il prossimo step operativo va aggiornato progressivamente sul primo subtask non completato. Le implementazioni future devono mantenere fuori da TASK-053 enforcement backend completo, visibility frontend completa e permessi granulari per singola entita Master Data.

---

### DEC-034 - Tenant membership and default tenant visibility in user administration

Data: 2026-05-11
Stato: Approvata

Decisione:

Per gli utenti tenant standard, il tenant di appartenenza coincide con il tenant predefinito e la UI non deve mostrare due campi distinti. La distinzione tra tenant assegnato e tenant predefinito e riservata a scenari platform o multi-tenant futuri, come `PLATFORM_SUPER_ADMIN`, `PLATFORM_OPERATOR` e altri eventuali utenti platform/multi-tenant. Nei form di amministrazione utenti tenant si mostra un solo campo `Tenant`; `primaryTenant` resta un dettaglio tecnico/backend valorizzato coerentemente dal servizio.

Motivazione:

Evitare confusione UX e mantenere il form utente orientato ai concetti realmente utili per tenant admin e utenti standard.

Alternative escluse:

- mostrare sempre `Tenant di appartenenza` e `Tenant predefinito` come due campi separati nei form utenti;
- introdurre logica multi-tenant o tenant switching dentro TASK-053.7;
- modificare schema dati o contratto API per nascondere `primaryTenant` lato backend.

Impatto:

Nessun cambio schema e nessuna nuova API. La UI create/edit utenti tenant mostra un solo campo `Tenant`; `primaryTenant` resta gestito dal backend e valorizzato uguale al tenant iniziale in create. Gli scenari platform/multi-tenant saranno trattati in task futuri dedicati.

---

### DEC-035 - Optional UserAccount to Employee link boundary

Data: 2026-05-11
Stato: Approvata

Decisione:

`UserAccount` e `Employee` restano domini separati. `UserAccount` rappresenta identita applicativa, login email-first, stato account, ruoli e tenant access. `Employee` rappresenta l anagrafica HR.

Il collegamento `UserAccount.employee` e opzionale. Gli account senza Employee collegato sono validi e devono usare fallback email e tipo account nelle API/UI amministrative. `firstName` e `lastName` restano derivati da Employee quando il link esiste e non vengono duplicati su `UserAccount`.

Motivazione:

La piattaforma deve supportare account amministrativi, tecnici o platform che non corrispondono a una anagrafica HR, evitando duplicazione dei dati personali e mantenendo chiaro il boundary tra identity/security e HR core.

Alternative escluse:

- rendere obbligatorio `employee_id` su `user_accounts`;
- aggiungere automaticamente `firstName` e `lastName` a `UserAccount`;
- creare migration o refactoring strutturali per collegare retroattivamente account ed Employee;
- introdurre un profilo HR avanzato dentro il task di amministrazione utenti.

Impatto:

Le API amministrative utenti espongono lo stato del link in modo esplicito tramite `employeeId`, `employeeDisplayName` e `hasEmployeeLink`. La UI deve distinguere account collegati e non collegati senza assumere che ogni utente applicativo sia anche Employee. Eventuali workflow futuri per creare, cercare o collegare Employee richiederanno task dedicato e policy tenant-aware esplicite.

---

### DEC-036 - Frontend permission visibility uses centralized CRUD summary with frozen modules by default

Data: 2026-05-11
Stato: Approvata

Decisione:

Il frontend HRM usa una foundation centralizzata di visibility UX basata solo sui quattro permessi CRUD standard `view`, `create`, `update`, `delete`, derivati dai codici backend `SCOPE.RESOURCE.ACTION`.

Le entry sidebar dei moduli applicativi restano visibili anche quando l utente non ha alcun permesso CRUD sul modulo. In quel caso devono apparire disabled/frozen. Le route principali dei moduli richiedono `view`; le route di create/edit richiedono rispettivamente `create` e `update`. Se il frontend non riceve alcun permission summary utilizzabile da `/api/auth/me` o dal payload auth disponibile, il modulo viene trattato come frozen per default.

Motivazione:

Uniformare menu, route e azioni CRUD senza introdurre enforcement backend, evitare logiche sparse nei componenti e rendere esplicito che l assenza di dati autorizzativi completi non deve produrre una UX permissiva implicita.

Alternative escluse:

- nascondere completamente le voci sidebar senza permessi;
- dedurre permessi CRUD da `userType` o da `USER_TYPE_*`;
- lasciare i moduli navigabili in assenza di permission summary reale;
- introdurre enforcement di sicurezza reale lato frontend.

Impatto:

Il frontend introduce un servizio centralizzato di summary autorizzativo, una guard dedicata per le route protette e uno stato sidebar frozen per i moduli senza permessi CRUD. L esperienza resta UX-only: il backend continua a essere la fonte autorevole dell autorizzazione. Finche `/api/auth/me` non espone permission codes reali, i moduli protetti restano frozen e richiedono follow-up backend in TASK-055 o task dedicato.

---

### DEC-037 - Shared confirmation dialog for critical UI actions

Data: 2026-05-12
Stato: Approvata

Decisione:

Le azioni UI critiche o distruttive, come cancellazione definitiva e disattivazione record, devono usare un componente shared di conferma si/no.

Motivazione:

Evitare conferme duplicate per feature, mantenere coerenza UX e centralizzare testi, varianti visuali e comportamento delle conferme.

Alternative escluse:

- popup di conferma locali duplicati per singola feature;
- conferme distruttive eseguite senza passaggio esplicito di validazione utente;
- introduzione di pattern diversi per ogni tabella o modulo quando il caso e coperto dal componente shared.

Impatto:

Le tabelle basate su shared DataTable devono poter richiedere conferma prima di eseguire una row action critica.

Le nuove feature non devono creare popup di conferma locali se il componente shared copre il caso.

Il componente dovra rispettare i18n e linee guida UX gia documentate.

---

### DEC-038 - Tenant-aware address geography model with hybrid ZIP/CAP governance

Data: 2026-05-13
Stato: Approvata

Decisione:

Il modello geografico indirizzi viene raffinato prima della UI Employee e della nuova foundation backend geography.

Il modello approvato e:

- `Country` resta globale;
- `Region` e `Area` restano due tabelle distinte;
- `Area` continua a dipendere da `Region`;
- `Region` diventa tenant-scoped e collegata a `Country`;
- `Area` diventa tenant-scoped e collegata a `Country` + `Region`;
- ZIP/CAP usa un modello ibrido:
  - Italia: record globali/importati con `tenant_id` NULL;
  - Paesi diversi da Italia: record creati manualmente dal tenant con `tenant_id` valorizzato;
- `City` non diventa tabella separata per ora;
- `City` resta attributo del record ZIP/CAP;
- deve essere possibile avere piu city per lo stesso CAP;
- la chiave unica non deve essere solo `postal_code`;
- unique suggerite:
  - record globali: `country_id + postal_code + city` con `tenant_id` NULL;
  - record tenant: `tenant_id + country_id + postal_code + city`.

Per l'Italia:

- l'utente seleziona il CAP dal dataset globale;
- city, area/provincia e region/regione sono ricavate dal CAP;
- i campi derivati vengono visualizzati readonly/freeze nella UI.

Per paesi diversi da Italia:

- il tenant crea manualmente `Region`, `Area` e ZIP/CAP;
- ZIP/CAP contiene city e riferimenti a `Country`, `Region` e `Area`;
- i dati sono riutilizzabili nei successivi Employee e OfficeLocation.

Motivazione:

- preservare il dataset italiano globale gia importato;
- evitare una tabella `City` prematura;
- supportare indirizzi multi-country senza obbligare la piattaforma a mantenere dataset globali completi per ogni paese;
- consentire ai tenant di creare dati geografici locali riusabili;
- evitare vincoli univoci errati su solo `postal_code`, dato che un CAP puo riferirsi a piu city;
- mantenere coerenza con DEC-018 sulla gerarchia geografica query-friendly e con validation applicativa.

Alternative escluse:

- rendere `Region` e `Area` globali per tutti i paesi;
- fondere `Region` e `Area` in una sola tabella;
- introdurre subito `City` come tabella separata;
- usare `postal_code` come chiave unica autonoma;
- imporre dataset globali/importati per tutti i paesi nel MVP;
- rendere i CAP italiani tenant-scoped duplicandoli per ogni tenant.

Impatto:

TASK-062 resta il task documentale/decisionale dedicato a questa scelta.

TASK-063 dovra implementare la foundation backend con migration DB, aggiornamento entity/repository/service/API, tenant scope per `Region` e `Area`, eventuale `tenant_id` nullable sui CAP se viene confermata la tabella ibrida, test backend e verifica impatti su Employee, OfficeLocation, HolidayCalendar e Master Data globali.

TASK-073 Employee UI potra partire solo dopo TASK-062, TASK-063 e TASK-064, in modo da usare select, readonly/freeze fields e riuso dati geografici su un contratto backend stabilizzato.

La decisione non introduce codice, migration o test in questa fase.

---

### DEC-039 - Automatic code standard for future entities with `code` field

Data: 2026-05-13
Stato: Approvata

Decisione:

Ogni nuova entita che introduce un campo `code` deve adottare, come regola di default, un codice generato automaticamente.

Lo standard approvato e:

- prefisso composto dalle prime due lettere del nome entita;
- progressivo numerico a 3 cifre;
- formato finale `PPNNN`;
- esempio: `Tenant` -> `TE001`;
- il `code` deve essere generato lato backend quando la gestione e automatica;
- il `code` non deve essere editabile da UI quando e gestito automaticamente.

Le eccezioni sono ammesse solo se motivate e documentate esplicitamente in `DECISIONS.md` o nel task dedicato che introduce l entita.

La decisione vale per nuove entita o nuovi task che introducono un campo `code`; non forza la riscrittura retroattiva delle entita esistenti gia governate da decisioni e task precedenti.

Motivazione:

- rendere durevole e coerente il pattern gia introdotto nei task `TASK-059.1`, `TASK-059.2`, `TASK-059.4`, `TASK-060` e `TASK-064.2`;
- evitare nuovi `code` manuali incoerenti tra backend, UI e dati seed;
- ridurre ambiguita nei futuri task documentali e implementativi;
- mantenere centralizzata la governance delle eccezioni.

Alternative escluse:

- lasciare la scelta manuale task per task senza regola durevole;
- consentire per default `code` editabile da UI anche quando il codice e automatico;
- imporre una migrazione retroattiva immediata di tutte le entita esistenti fuori dallo scope del task.

Impatto:

I futuri task che introducono nuove entita con campo `code` devono partire da questo standard come default. `AGENTS.md`, `TASKS.md` e `ROADMAP.md` possono richiamare la regola in forma sintetica per guidare l esecuzione operativa. Eventuali eccezioni devono essere motivate e tracciate, evitando regole implicite o differenze non documentate tra backend e frontend.

---

### DEC-040 - Shared lookup foundation reuses the standard paginated contract and a common frontend lookup component

Data: 2026-05-14
Stato: Approvata

Decisione:

I nuovi lookup backend destinati a select/autocomplete riusabili devono riusare il contratto paginato standard gia presente nel repository, evitando endpoint dedicati che caricano liste complete.

Lo standard approvato per questa foundation e:

- response paginata basata su `MasterDataPageResponse<T>`;
- query paginata/search basata sui pattern di `MasterDataQuerySupport`;
- DTO lookup esplicito con struttura `id`, `code`, `name`, `extraLabel`, `metadata`;
- ordinamento coerente e ricerca testuale lato backend;
- riuso lato frontend tramite il componente shared `app-lookup-select`, compatibile con Reactive Forms e `ControlValueAccessor`.

Questa decisione formalizza il pattern introdotto in `TASK-064.6` per i lookup `Country`, `Region`, `Area` e `GlobalZipCode` e lo rende il riferimento di default per lookup futuri su entita grandi o potenzialmente grandi.

Motivazione:

- evitare select locali non scalabili e caricamenti completi di dataset ampi;
- mantenere un solo pattern backend/frontend per lookup paginati e autocomplete;
- ridurre duplicazioni tra feature amministrative e futuri form HR;
- preservare coerenza con i contratti di paginazione e i componenti shared gia presenti nel repository.

Alternative escluse:

- creare endpoint lookup ad hoc non paginati per ogni feature;
- usare DTO lookup non uniformi tra entita diverse;
- mantenere componenti select/autocomplete locali separati quando il caso d uso e un lookup remoto standard.

Impatto:

I futuri task che richiedono lookup remoti devono partire da questo pattern come default. Nuovi endpoint lookup dovranno motivare eventuali eccezioni su shape, paginazione o UX. La normalizzazione persistente dei telefoni non e coperta da questa decisione ed e stata formalizzata successivamente in `DEC-041` tramite l implementazione di `TASK-064.9`.

---

### DEC-041 - Normalized phone persistence standard for CompanyProfile and future contact entities

Data: 2026-05-15
Stato: Approvata

Decisione:

Lo standard durevole per la persistenza dei telefoni applicativi viene formalizzato a partire da `CompanyProfile` e deve essere riusato progressivamente, con task dedicati, per future entita di contatto come `OfficeLocation`, `Employee`, `UserAccount` e altre entita che esporranno un recapito telefonico.

Lo standard approvato e:

- persistere `phoneDialCode` come prefisso internazionale, comprensivo del simbolo `+`, quando noto e affidabile;
- persistere `phoneNationalNumber` come numero nazionale/locale o, nei casi legacy non deducibili, come contenitore conservativo dell intero valore telefono esistente;
- non persistere `phoneFullNumber` come colonna separata quando non serve a query o integrazioni specifiche; il full number deve essere derivato applicativamente da `phoneDialCode + " " + phoneNationalNumber` oppure dal solo `phoneNationalNumber` se il prefisso non e disponibile;
- mantenere temporaneamente il campo legacy `phone` come bridge di compatibilita per lettura e fallback di write durante la transizione, evitando rotture immediate dei contratti esistenti;
- per i nuovi payload strutturati richiedere `phoneNationalNumber`; `phoneDialCode` puo restare `null` solo nei casi di compatibilita legacy o quando il prefisso non e deducibile con confidenza.

Per i dati legacy gia presenti, la strategia approvata e conservativa:

- eseguire lo split solo quando il valore trim inizia con `+`, contiene almeno uno spazio dopo il prefisso e il prefisso contiene solo `+` e cifre;
- in tutti gli altri casi copiare l intero valore legacy in `phoneNationalNumber` e lasciare `phoneDialCode = null`;
- evitare parsing aggressivi o inferenze implicite non verificabili sui numeri storici.

Motivazione:

- allineare DB, API e frontend al modello strutturato gia introdotto nel componente shared `app-phone-field`;
- preservare compatibilita temporanea con dati e client legacy senza bloccare il refactoring progressivo;
- evitare nuove divergenze tra entita di contatto che oggi usano pattern eterogenei;
- mantenere esplicita la semantica del prefisso internazionale rispetto al numero nazionale/locale.

Alternative escluse:

- continuare a persistere una sola stringa `phone` senza campi strutturati;
- introdurre subito una nuova entita telefono cross-domain fuori scope;
- persistere sempre anche `phoneFullNumber` senza una necessita reale di query o integrazione;
- applicare parsing aggressivi ai dati legacy per dedurre prefissi non affidabili.

Impatto:

I futuri task che introdurranno o normalizzeranno campi telefono devono partire da questo standard come default. L adozione su altre entita resta progressiva e deve avvenire con task dedicati, evitando rollout impliciti fuori scope.

---

### DEC-042 - Device asset code and barcode identifier standard

Data: 2026-05-15
Stato: Approvata

Decisione:

Per il dominio `Device`, l identificatore patrimoniale operativo viene formalizzato tramite due campi dedicati:

- `assetCode` come identificatore automatico del bene;
- `barcodeValue` come payload testuale da usare in barcode/QR futuri.

Lo standard approvato e:

- `assetCode` usa formato `DEV000001`;
- il progressivo e tenant-scoped;
- il prossimo valore deve essere calcolato dal massimo progressivo valido gia presente per lo stesso tenant, non dal numero di record;
- `assetCode` non e editabile da API/UI operative;
- `barcodeValue` coincide con `assetCode`;
- il payload barcode/QR non deve includere dati variabili come dipendente assegnato, marca, modello o seriale.

Questa scelta costituisce una eccezione motivata rispetto a `DEC-039`: non introduce un generico campo `code`, ma un identificatore asset dedicato, con prefisso esplicito `DEV` e progressivo a 6 cifre per supportare una numerazione piu ampia del parco dispositivi.

Motivazione:

- garantire un identificatore stabile e leggibile per i beni `Device`;
- evitare collisioni o riuso improprio dopo delete, backfill o dati storici preesistenti;
- mantenere `barcodeValue` semplice, deterministico e compatibile sia con CODE 128 sia con QR code futuri;
- evitare payload fragili o soggetti a variazione nel tempo.

Alternative escluse:

- usare `count(device) + 1` per generare il prossimo codice;
- usare EAN come standard principale, non adatto a codici alfanumerici;
- includere nel barcode dati variabili del dispositivo o dell assegnazione;
- usare direttamente lo standard `PPNNN` di `DEC-039` per questo identificatore dedicato.

Impatto:

I task `Device` futuri devono trattare `assetCode` come identificatore patrimoniale immutabile e `barcodeValue` come suo alias operativo fino a nuova decisione. Eventuali evoluzioni su rendering grafico barcode/QR, stampa etichetta o payload piu ricchi devono partire da questa baseline ed essere documentate con task o decisioni dedicate.

---

### DEC-043 - Device assignment open-row uniqueness enforced in service layer

Data: 2026-05-15
Stato: Approvata

Decisione:

Per la foundation storica `DeviceAssignment`, la regola "al massimo una assegnazione aperta per `Device`" viene garantita lato service, non tramite vincoli DB parziali.

Lo standard approvato e:

- `Device.assignedTo` e `Device.assignedAt` restano lo stato operativo corrente;
- `device_assignments` e la fonte storica delle assegnazioni;
- una riga storica aperta e definita da `assigned_to IS NULL`;
- le operazioni di assign, reassign e return serializzano il punto critico con lock pessimista sul `Device`;
- in presenza di piu righe aperte incoerenti, il backend deve fallire con `409 Conflict` invece di scegliere implicitamente una riga;
- non vengono introdotti unique index parziali o altri vincoli vendor-specific non portabili tra PostgreSQL e H2.

Motivazione:

- mantenere coerenza tra PostgreSQL di produzione e H2 di test;
- evitare divergenze di comportamento tra database per una regola critica del dominio Device;
- preservare una foundation incrementale che riusa il service admin `Device` esistente senza architetture parallele;
- tenere il `Device` come stato operativo corrente e `DeviceAssignment` come storico consistente.

Alternative escluse:

- unique index parziale PostgreSQL-only su assegnazioni aperte;
- logica implicita che tollera piu righe aperte e ne sceglie una automaticamente;
- spostare lo stato corrente fuori da `Device` su una architettura parallela basata solo sullo storico.

Impatto:

`TASK-066.4` e i futuri task `Device` devono riusare questa regola come baseline: mutate assignment history solo tramite service transazionale con lock del `Device`, mantenendo `Device.assignedTo` / `assignedAt` allineati e lasciando lo storico nel namespace admin `Device`.

---

### DEC-044 - DetailActionBar as the official shared pattern for entity detail action bars

Data: 2026-05-16
Stato: Approvata

Decisione:

Il componente frontend shared esistente `frontend/src/app/shared/components/detail-action-bar/` viene formalizzato come pattern ufficiale per le action bar delle pagine dettaglio entita.

Lo standard approvato e:

- nessun componente parallelo o alternativa locale per la sola barra azioni di dettaglio;
- supporto ai gruppi `back`, azioni secondarie, azione primaria e azioni distruttive;
- supporto ai casi standard `back`, `edit`, `save`, `cancel`, `activate`, `deactivate`, `deletePhysical`;
- supporto a `id` custom per azioni specifiche del dominio, ad esempio `assign`, `reassign`, `return`;
- testi, icone, loading, disabled, visible e varianti bottone governati dal container chiamante;
- conferme distruttive o di lifecycle gestite dal container/feature, non inglobate nel componente shared.

Motivazione:

- evitare duplicazioni gia presenti o imminenti tra `Device`, `Company Profile`, `User Administration` e futuri detail amministrativi;
- mantenere un pattern shared piccolo, stabile e riusabile senza generalizzare layout, card o logica di dominio;
- preservare coerenza con `app-button`, i18n runtime e design system Metronic/HRflow gia approvati.

Alternative escluse:

- creare un nuovo componente shared parallelo per detail header/actions;
- mantenere action bar locali duplicate per ogni dettaglio senza formalizzare il pattern esistente;
- inglobare nel componente shared logiche di conferma, routing o mutazione specifiche di singola feature.

Impatto:

I task frontend futuri che introducono o rifiniscono detail amministrativi devono partire da `DetailActionBar` come baseline per la barra azioni. La migrazione completa di `User Detail` e `Company Profile Detail` resta follow-up dedicato in `TASK-066.10`, mentre i form create/edit continuano a usare i propri pattern di salvataggio/annullamento gia approvati finche non esiste un task specifico di convergenza.

---

### DEC-045 - Holiday Calendar model and BusinessDayService boundary

Data: 2026-05-16
Stato: Approvata

Decisione:

Il modulo Holiday Calendar del MVP gestisce calendari festivita per paese e anno.

Lo standard approvato e:

- `HolidayCalendar` e associato a `Country + Year`;
- `Holiday` rappresenta una festivita dentro un calendario;
- `Holiday.startDate` e `Holiday.endDate` sono sempre persistite;
- una festivita di un solo giorno usa `startDate = endDate`;
- una festivita multi-giorno usa un intervallo `startDate` / `endDate`;
- `HolidayType` ha valori iniziali `FIXED` e `MOBILE`;
- `HolidayGenerationRule` ha valori iniziali `FIXED_DATE`, `MANUAL`, `EASTER_BASED`;
- le date finali salvate nel DB restano fonte operativa, anche quando in futuro un algoritmo precompila o genera il calendario;
- Aid al-Fitr e Aid al-Adha sono festivita mobili multi-giorno;
- nel MVP Aid resta manuale e non viene calcolato con algoritmo lunare;
- `BusinessDayService` e un servizio backend separato che usa `holiday_calendars` e `holidays`;
- `BusinessDayService` non introduce nuove tabelle nello step foundation;
- Leave Request non viene integrato nel blocco Holiday Calendar e resta fuori scope o follow-up futuro.

Motivazione:

- supportare calendari festivita multi-country senza hardcode applicativo;
- gestire correttamente festivita mobili e multi-giorno salvando comunque date esplicite e verificabili;
- evitare over-engineering nel MVP, in particolare per il calcolo lunare di Aid;
- preparare una foundation riusabile per futuri calcoli di giorni lavorativi senza accoppiare subito Holiday Calendar a Leave Request;
- mantenere piccoli e verificabili i task successivi, separando backend CRUD, BusinessDayService, frontend e QA.

Alternative escluse:

- rappresentare una festivita multi-giorno con piu record singoli obbligatori;
- salvare solo una regola di generazione senza date finali persistite;
- automatizzare nel MVP il calcolo lunare di Aid;
- integrare subito Holiday Calendar con Leave Request;
- introdurre nuove tabelle dedicate al BusinessDayService nello step foundation;
- usare API esterne per festivita ufficiali nel MVP.

Impatto:

`TASK-067` governa la numerazione attiva del blocco Holiday Calendar. Il refinement richiesto come `TASK-019.1` viene tracciato come `TASK-067.1` per non modificare i task storici gia completati `TASK-019` e `TASK-020`.

I task `TASK-067.2`, `TASK-067.3`, `TASK-067.4` e `TASK-067.5` dovranno rispettare questa decisione e mantenere fuori scope Leave Request, calcolo ferie/assenze, payroll, turni, calendari per singolo dipendente, assegnazione calendario a sede/dipartimento/dipendente, generazione automatica Aid, import/export massivo e API esterne.

---

## 4. Cronologia versioni

| Versione | Data | Descrizione |
|---|---|---|
| 1.42 | 2026-05-16 | Aggiunta DEC-045 per formalizzare il modello Holiday Calendar: `Country + Year`, festivita con `startDate`/`endDate`, `HolidayType` `FIXED`/`MOBILE`, `HolidayGenerationRule`, Aid manuale nel MVP, `BusinessDayService` separato e Leave Request fuori scope. |
| 1.41 | 2026-05-16 | Aggiunta DEC-044 per formalizzare `DetailActionBar` come pattern frontend shared ufficiale delle action bar dei dettagli entita: gruppi `back`/secondary/primary/destructive, set standard di action id (`edit`, `save`, `cancel`, `activate`, `deactivate`, `deletePhysical`) e apertura a id custom di dominio senza introdurre componenti paralleli o logiche feature-specific nel shared component. |
| 1.40 | 2026-05-15 | Aggiunta DEC-043 per formalizzare la regola durevole dello storico assegnazioni `Device`: `device_assignments` come fonte storica, `Device.assignedTo` / `assignedAt` come stato operativo corrente, unicita della riga aperta gestita lato service con lock pessimista sul `Device` e nessun vincolo DB parziale PostgreSQL-only. |
| 1.39 | 2026-05-15 | Aggiunta DEC-042 per formalizzare lo standard durevole dei beni `Device`: `assetCode` tenant-scoped `DEV000001`, progressivo calcolato dal massimo esistente per tenant, `barcodeValue = assetCode`, esclusione di dati variabili dal payload barcode/QR ed eccezione motivata rispetto al default `DEC-039`. |
| 1.38 | 2026-05-15 | Riallineato il riferimento attivo di `DEC-038` alla nuova numerazione backlog post `TASK-065`: la UI Employee futura passa da `TASK-065` a `TASK-073` senza modificare la decisione architetturale sul modello geografico tenant-aware. |
| 1.37 | 2026-05-15 | Aggiunta DEC-041 per formalizzare lo standard durevole di persistenza telefono normalizzata: `phoneDialCode`, `phoneNationalNumber`, `phoneFullNumber` derivato, bridge legacy temporaneo `phone`, migrazione conservativa dei dati storici e riuso progressivo sulle future entita di contatto. |
| 1.36 | 2026-05-14 | Allineato il riferimento backlog della decisione `DEC-040` alla nuova numerazione `TASK-064.9` per la normalizzazione telefono, dopo l'inserimento del nuovo `TASK-064.8` dedicato alla creazione guidata dei dati geografici esteri da form indirizzo. |
| 1.35 | 2026-05-14 | Aggiunta DEC-040 per rendere durevole la foundation shared dei lookup: response paginata standard, DTO lookup uniforme `id/code/name/extraLabel/metadata`, riuso di `MasterDataQuerySupport` lato backend e `app-lookup-select` lato frontend come pattern di default per lookup remoti futuri. |
| 1.34 | 2026-05-13 | Aggiunta DEC-039 per rendere durevole lo standard dei nuovi campi `code`: auto-code `prime due lettere + progressivo 3 cifre`, generazione backend, UI non editabile ed eccezioni solo se documentate. |
| 1.33 | 2026-05-13 | Aggiunta DEC-038 per formalizzare il modello geografico indirizzi tenant-aware: Country globale, Region/Area tenant-scoped, ZIP/CAP ibrido globale Italia e tenant per altri paesi, City come attributo ZIP/CAP e prerequisito per TASK-063/TASK-065. |
| 1.32 | 2026-05-12 | Aggiunta DEC-037 per formalizzare il pattern shared di conferma per azioni UI critiche/distruttive, con riuso obbligatorio, coerenza UX, i18n e integrazione attesa con il shared DataTable. |
| 1.31 | 2026-05-11 | Aggiunta DEC-036 per formalizzare la visibility frontend centralizzata su summary CRUD, sidebar visibile ma frozen senza permessi, route guardate su `view/create/update` e default frozen quando `/api/auth/me` non espone permission summary reale. |
| 1.30 | 2026-05-11 | Aggiunta DEC-035 per formalizzare il link opzionale `UserAccount.employee`, account validi senza Employee, fallback email/tipo account e divieto di duplicare dati anagrafici su `UserAccount`. |
| 1.29 | 2026-05-11 | Aggiunta DEC-034 per chiarire che nei form amministrazione utenti tenant si mostra un solo campo `Tenant`; `primaryTenant` resta dettaglio backend e la distinzione tenant/default tenant e rinviata agli scenari platform o multi-tenant futuri. |
| 1.28 | 2026-05-10 | Raffinata DEC-033: aggiunto TASK-053.3 dedicato al CRUD ruoli custom tenant, rinumerato TASK-053.4 per la tenant user administration e riallineato il principio di aggiornare il prossimo subtask operativo non completato. |
| 1.27 | 2026-05-10 | Aggiunta DEC-033 per fissare lo split operativo di TASK-053 in subtask interni 053.1/053.2/053.3 e mantenere TASK-054 frontend visibility e TASK-055 backend enforcement come task principali successivi. |
| 1.26 | 2026-05-10 | Aggiunta DEC-032 per stabilizzare il formato permission code `SCOPE.RESOURCE.ACTION`, scope/resource/action iniziali, seed system permission e divieto di granularita per singola entita Master Data in TASK-052. |
| 1.25 | 2026-05-10 | Aggiunta DEC-031 per approvare la skill repository-local minima `spring-backend-developer` come supporto operativo backend governato; aggiornati impatto su `backend/AGENTS.md`, prompt governance e `skills-lock.json`. |
| 1.24 | 2026-05-10 | Estesa DEC-029 per chiarire che lato backend/Spring non esiste ancora una skill repository-local approvata e che TASK-050 ne prepara l'eventuale integrazione futura; riallineati anche i riferimenti numerici del blocco TASK-051..TASK-055 in DEC-030. |
| 1.23 | 2026-05-10 | Aggiunta DEC-030 per formalizzare il modello autorizzativo tenant-aware con `PLATFORM_SUPER_ADMIN` globale, `TENANT_ADMIN` tenant-scoped, ruoli seed/custom, CRUD Global/Tenant Master Data, default deny cross-tenant, backend authoritative e frontend visibility solo UX. |
| 1.22 | 2026-05-09 | Aggiunta DEC-029: policy durevole per versionamento repository-local delle AI skills approvate; al momento approvata solo `angular-developer` con `.agents/skills` e `skills-lock.json`, `angular-new-app` esclusa e nuove skill ammesse solo con decisione/task dedicati. |
| 1.21 | 2026-05-07 | Aggiunta DEC-028 per definire la doppia policy Master Data: `Disattiva` come soft-delete `active=false` e `Elimina` come delete fisico solo per record non referenziati, con blocco coerente dei record collegati e messaggi UI distinti. |
| 1.20 | 2026-05-04 | Aggiunta DEC-027 per definire backend login/JWT foundation: email globale case-insensitive come identificativo login, JWT stateless con Spring Security OAuth2 Resource Server / Jose e claim principali `sub`, `userId`, `tenantId`, `userType`. |
| 1.19 | 2026-05-04 | Aggiunta DEC-026 per introdurre backend login/JWT foundation e frontend login foundation prima delle UI amministrative, spostando Master Data Admin dopo login foundation e mantenendo fuori scope OTP/MFA, RBAC runtime, tenant switching e impersonation. |
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
