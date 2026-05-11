# QA Reports

Registro ufficiale degli esiti QA.

Questo file raccoglie solo QA eseguiti realmente; non includere report fittizi.

## Documentation QA reports

### TASK-053.4 - Tenant user administration backlog split

- Data: 2026-05-10
- Branch: `main`
- Task: TASK-053.4 backlog split - Tenant user administration
- Tipo verifica: aggiornamento documentale/backlog
- Modello consigliato nel prompt operativo: GPT-5.4
- Area verificata: `AGENTS.md`, `TASKS.md`, `ROADMAP.md`, `DECISIONS.md`, `docs/qa/QA-REPORTS.md`
- Attivita eseguite:
  - sostituito il vecchio TASK-053.4 con `Tenant user administration read/list/detail foundation`;
  - aggiunti TASK-053.5, TASK-053.6, TASK-053.7, TASK-053.8 e TASK-053.9 (opzionale/da valutare);
  - riallineata la sezione roadmap del blocco TASK-053 con i nuovi subtask e con il perimetro read-only del TASK-053.4;
  - aggiornate le cronologie versione in `TASKS.md` e `ROADMAP.md`.
- Test automatici eseguiti: non eseguiti; task solo documentale/backlog.
- Modifiche codice: nessuna modifica backend/frontend applicativa, nessuna API, nessuna migration.
- Controlli richiesti:
  - `git diff --check`
  - `git status --short --branch`
- Regressioni trovate: nessuna regressione documentale nota in questa fase.
- Limiti/note:
  - `firstName`/`lastName` restano campi derivati da `Employee` e non sono stati introdotti nuovi campi in `UserAccount`;
  - `TASK-053.9` resta opzionale e dipende dai risultati dei task utenti tenant.
- Stato finale: PASS WITH NOTES

### TASK-053 - Reframe into internal subtasks

- Data: 2026-05-10
- Branch: `main`
- Task: TASK-053 - Tenant user and role administration foundation
- Tipo verifica: reframe documentale/backlog
- Modello consigliato nel prompt operativo: GPT-5.4
- Area verificata: `AGENTS.md`, `ARCHITECTURE.md`, `TASKS.md`, `ROADMAP.md`, `DECISIONS.md`, `docs/qa/QA-REPORTS.md`, `docs/design/DESIGN-SYSTEM.md`
- Attivita eseguite:
  - riorganizzato TASK-053 come epic/contenitore cross-stack;
  - introdotti subtask interni TASK-053.1, TASK-053.2 e TASK-053.3 senza promuoverli a task principali;
  - aggiornato ROADMAP.md indicando TASK-053.1 come prossimo step operativo;
  - mantenuti TASK-054 e TASK-055 come task principali successivi rispettivamente per frontend visibility e backend enforcement;
  - registrata decisione breve DEC-033 sullo split operativo.
- Test automatici eseguiti: non eseguiti; reframe solo documentale/backlog.
- Modifiche codice: nessuna modifica backend/frontend applicativa, nessuna API, nessun componente UI, nessuna migration.
- Controlli richiesti:
  - `git diff --check`
  - `git status --short --branch`
- Regressioni trovate: nessuna regressione documentale nota in questa fase.
- Limiti/note:
  - il mockup frontend resta input per TASK-053.2 e non e stato implementato;
  - enforcement backend completo resta demandato a TASK-055;
  - visibility frontend completa resta demandata a TASK-054.
- Stato finale: PASS WITH NOTES

### TASK-049 - Platform Super Admin and tenant-aware permissions model

- Data: 2026-05-10
- Branch: `task-049-platform-super-admin-tenant-permissions`
- Task: TASK-049 - Platform Super Admin and tenant-aware permissions model
- Agente/Modello usato: GPT-5.5 Thinking
- Area verificata: `TASKS.md`, `ROADMAP.md`, `DECISIONS.md`, `ARCHITECTURE.md`, `docs/qa/QA-REPORTS.md`
- Attivita eseguite:
  - analisi governance esistente su `UserType`, `Role`, `Permission`, `UserTenantAccess`, `UserRole`, `RolePermission`, `UserAccount` e JWT authority minima;
  - formalizzazione confine tra `PLATFORM_SUPER_ADMIN`, `TENANT_ADMIN`, ruoli seed, ruoli custom tenant-specific e permessi CRUD;
  - documentazione regole cross-tenant default deny e separazione backend authoritative / frontend visibility UX;
  - aggiornamento backlog e roadmap verso TASK-051.
- Test automatici eseguiti: non eseguiti; task solo documentale e nessun codice applicativo modificato.
- Controlli richiesti:
  - `git diff`
  - `git status --short --branch`
- Regressioni trovate: nessuna regressione documentale nota in questa fase.
- Limiti/note:
  - non e stato implementato RBAC runtime;
  - non e stata implementata UI amministrazione utenti/ruoli;
  - non sono state create migration;
  - enforcement backend e visibility frontend restano demandati a TASK-054/TASK-055.
- Stato finale: PASS WITH NOTES

### TASK-050 - Configure Spring AI skill and backend agent integration

- Data: 2026-05-10
- Branch: `task-050-spring-backend-skill-governance`
- Task: TASK-050 - Configure Spring AI skill and backend agent integration
- Agente/Modello usato: GPT-5.5 Thinking
- Area verificata: `AGENTS.md`, `backend/AGENTS.md`, `ARCHITECTURE.md`, `TASKS.md`, `ROADMAP.md`, `DECISIONS.md`, `docs/ai-prompts/codex-prompt-governance.md`, `docs/qa/QA-REPORTS.md`, `.agents/skills`, `skills-lock.json`
- Attivita eseguite:
  - verifica della governance skill gia approvata e dello stato repository-local corrente (`angular-developer` come unica skill lockata);
  - conferma che non esisteva una skill Spring/backend gia disponibile o approvata nel repository;
  - creazione di una skill repository-local minima `spring-backend-developer` come supporto di governance, subordinata a `backend/AGENTS.md`;
  - aggiornamento di `skills-lock.json`, `backend/AGENTS.md`, `docs/ai-prompts/codex-prompt-governance.md`, `TASKS.md`, `ROADMAP.md` e `DECISIONS.md`;
  - verifica finale del diff per confermare assenza di modifiche backend/frontend applicative.
- Test automatici eseguiti: non eseguiti; task solo documentale/governance e nessun codice applicativo modificato.
- Controlli richiesti:
  - verifica struttura skill sotto `.agents/skills`;
  - verifica lock/hash in `skills-lock.json`;
  - `git diff --check`
  - `git diff`
  - `git status --short --branch`
- Regressioni trovate: nessuna regressione documentale nota in questa fase.
- Limiti/note:
  - la skill introdotta e minimale e di governance, non una skill tecnica esterna/importata;
  - nessuna modifica backend/frontend, migration, API o runtime security.
- Stato finale: PASS WITH NOTES

### TASK-051 - User, Role and Permission domain review

- Data: 2026-05-10
- Branch: `task-051-user-role-permission-domain-review`
- Task: TASK-051 - User, Role and Permission domain review
- Agente/Modello usato: GPT-5.5 Thinking
- Area verificata: `AGENTS.md`, `backend/AGENTS.md`, `.agents/skills/spring-backend-developer/SKILL.md`, `ARCHITECTURE.md`, `TASKS.md`, `ROADMAP.md`, `DECISIONS.md`, `docs/qa/QA-REPORTS.md`, migration Flyway RBAC/identity/security, entity/repository/service/controller/DTO auth e governance-security.
- Attivita eseguite:
  - ricostruzione stato attuale di `UserAccount`, `UserType`, `Role`, `Permission`, `UserRole`, `RolePermission`, `UserTenantAccess` e `Tenant`;
  - verifica seed iniziali e vincoli DB in V3, V4, V7, V8 e V15;
  - verifica API/DTO esistenti per `/api/master-data/governance-security` e `/api/auth`;
  - confronto con TASK-049/DEC-030 su `PLATFORM_SUPER_ADMIN`, `TENANT_ADMIN`, ruoli seed/custom, permessi CRUD, cross-tenant e backend-authoritative security;
  - documentazione gap analysis e backlog tecnico minimale in `TASKS.md` e riallineamento roadmap.
- Test automatici eseguiti:
  - suite completa `cd backend && .\mvnw.cmd test` avviata ma non completata in modo utile per TASK-051 perche entra anche nei test/import CAP italiani con logging SQL molto verboso;
  - tentativo mirato iniziale fallito per sandbox/network Maven su risoluzione parent POM, poi rieseguito con autorizzazione;
  - `cd backend && .\mvnw.cmd "-Dtest=AuthControllerTests,MasterDataGovernanceSecurityControllerTests,HrmBackendApplicationTests" test`: BUILD SUCCESS, 74 test eseguiti, 0 failure, 0 error, 0 skipped.
- Controlli richiesti:
  - `git status --short --branch`
  - review file/struttura backend e documentazione governance
  - `git diff --check`
  - `git diff --stat`
- Regressioni trovate: nessuna regressione funzionale nei test mirati auth/security/domain eseguiti.
- Limiti/note:
  - non e stato implementato enforcement RBAC runtime;
  - non sono state create API amministrative, migration o modifiche security;
  - la suite backend completa resta rumorosa/lenta per i test CAP italiani e non e stata usata come gate finale del task documentale;
  - rilevato debito tecnico: logging SQL/test ZIP italiani rendono la suite completa poco ergonomica per review documentali mirate.
- Stato finale: PASS WITH NOTES

## Backend QA reports

### TASK-053.9 - UserAccount Employee link foundation

- Data: 2026-05-11
- Branch: `task-053-9-useraccount-employee-link-foundation`
- Task: TASK-053.9 - UserAccount Employee link foundation
- Area verificata: relazione opzionale `UserAccount.employee`, DTO admin `/api/admin/users`, mapping `displayName`/Employee, UI lista/dettaglio utenti, i18n `it/fr/en`, documentazione governance.
- Attivita eseguite:
  - confermata relazione nullable gia esistente `user_accounts.employee_id`;
  - estesi DTO admin utenti con `employeeId`, `employeeDisplayName` e `hasEmployeeLink`;
  - mantenuto fallback email per account senza Employee collegato;
  - aggiornata UI lista/dettaglio per distinguere account collegati e non collegati a Employee;
  - rifiniti i testi frontend su collegamento dipendente e ciclo di vita account, eliminando la parola `Employee` dalla UI italiana visibile all utente;
  - formalizzata DEC-035 sul boundary opzionale `UserAccount`/`Employee`;
  - nessuna migration, nessun campo `firstName`/`lastName` aggiunto a `UserAccount`, nessun profilo HR avanzato.
- Comandi eseguiti:
  - `cd backend && .\mvnw.cmd "-Dtest=UserAdministrationControllerTests" test`
  - `cd frontend && npm.cmd run build`
  - `cd frontend && npm.cmd test`
  - `cd frontend && npm.cmd run build`
  - `cd backend && .\mvnw.cmd test`
  - `git diff --check`
- Esiti reali:
  - test backend mirato OK, `BUILD SUCCESS`, 28 test eseguiti, 0 failure, 0 error;
  - primo `npm.cmd test` KO per assertion test aggiornata sulla label `Collegato`, fixato formatter lista;
  - frontend test rerun OK, 27 file test passed, 172 test passed;
  - frontend build finale OK;
  - build frontend e test frontend rieseguiti dopo la rifinitura testi minima: OK, 27 file test passed, 172 test passed;
  - suite backend completa OK da Surefire, 161 test eseguiti, 0 failure, 0 error;
  - `git diff --check` inizialmente KO per trailing whitespace in `DECISIONS.md`, corretto prima della chiusura.
- Regressioni trovate: nessuna dopo il fix frontend minimo.
- Limiti/note:
  - non esiste ancora un workflow UI/API per collegare o scollegare Employee da UserAccount;
  - i comandi Maven continuano a mostrare warning noti Mockito/ByteBuddy e output SQL/ZIP molto verboso, senza failure;
  - nessun commit eseguito.
- Stato finale: PASS WITH NOTES

### TASK-053.6 - Tenant user password administration foundation

- Data: 2026-05-11
- Branch: `task-053-6-tenant-user-password-admin`
- Task: TASK-053.6 - Tenant user password administration foundation
- Area verificata: controller/service `/api/admin/users`, reset password tenant-aware, riuso validazione accesso tenant, `PasswordPolicy`, encoding password, OpenAPI.
- Attivita eseguite:
  - aggiunti DTO dedicati request/response per reset password amministrativo;
  - introdotto endpoint `PUT /api/admin/users/{userId}/password` nel controller esistente;
  - riusato il controllo tenant-aware gia centralizzato in `UserAdministrationService`;
  - validata la nuova password con `PasswordPolicy`, aggiornati solo `passwordHash` e `passwordChangedAt`;
  - verificato che la response non esponga mai password raw o hash.
- Comandi eseguiti:
  - `cd backend && .\mvnw.cmd "-Dtest=UserAdministrationControllerTests" test`
  - `cd backend && .\mvnw.cmd test`
- Esiti reali:
  - test mirati controller OK, 17 test passed, 0 failure, 0 error;
  - suite backend completa OK, 148 test passed, 0 failure, 0 error.
- Regressioni trovate: nessuna nei test backend.
- Limiti/note:
  - il runtime stampa warning noti di Mockito/ByteBuddy dynamic agent su JDK 21, gia presenti nell’ambiente di test e non bloccanti;
  - nessun unlock automatico o reset di `failedLoginAttempts`, coerente con scope approvato del task.
- Stato finale: PASS WITH NOTES

### TASK-053.5 - Tenant user role assignment foundation

- Data: 2026-05-11
- Branch: `task-053-5-tenant-user-role-assignment`
- Task: TASK-053.5 - Tenant user role assignment foundation
- Area verificata: API backend `/api/admin/users/{userId}/roles`, lista ruoli disponibili, DTO request, `UserAdministrationService`, repository `UserRole`/`UserTenantAccess`/`Role`.
- Attivita eseguite:
  - aggiunta lettura ruoli assegnati per utente e tenant;
  - aggiunta lettura ruoli tenant attivi disponibili per assegnazione, escludendo ruoli gia assegnati;
  - aggiunta assegnazione ruolo utente tenant-specific;
  - aggiunta rimozione ruolo utente tenant-specific;
  - validate esistenza utente, tenant e ruolo, coerenza tenant del ruolo, accesso tenant attivo dell utente e anti-duplicato;
  - nessuna migration, nessun cambio JWT/security globale, nessun enforcement RBAC completo.
- Comandi eseguiti:
  - `cd backend && .\mvnw.cmd "-Dtest=UserAdministrationControllerTests" test`
  - `cd backend && .\mvnw.cmd test`
- Esiti reali:
  - test mirato OK, `BUILD SUCCESS`, 11 test eseguiti, 0 failure, 0 error, 0 skipped;
  - suite backend completa OK, `BUILD SUCCESS`, 142 test eseguiti, 0 failure, 0 error, 0 skipped.
- Regressioni trovate: nessuna nei test backend.
- Limiti/note:
  - caller authorization hardening resta demandato a TASK-055.1;
  - enforcement backend completo resta demandato a TASK-055;
  - il comando Maven continua a mostrare warning/rumore preesistenti su Mockito/JDK e output SQL/ZIP verbose, senza failure.
- Stato finale: PASS

### TASK-053.4 - Tenant user administration read/list/detail foundation

- Data: 2026-05-10
- Branch: `main`
- Task: TASK-053.4 - Tenant user administration read/list/detail foundation
- Area verificata: API backend `/api/admin/users`, DTO user administration, `UserAdministrationService`, query repository anti N+1 per UserAccount/UserRole/UserTenantAccess.
- Attivita eseguite:
  - aggiunte API read-only lista/dettaglio utenti tenant;
  - esposti ruoli assegnati e accessi tenant in sola lettura;
  - mantenuto `accessRole` separato dai ruoli RBAC;
  - `displayName` derivato da Employee quando presente, fallback email in assenza di `employee_id`;
  - esclusi `passwordHash` e `otpSecret` dai DTO;
  - usato fetch graph per relazioni singole e query bulk per ruoli/accessi tenant.
- Comandi eseguiti:
  - `cd backend && .\mvnw.cmd -Dtest=UserAdministrationControllerTests test`
- Esiti reali:
  - primo tentativo bloccato da sandbox/network Maven su download parent POM;
  - riesecuzione autorizzata OK, `BUILD SUCCESS`, 5 test eseguiti, 0 failure, 0 error, 0 skipped.
- Regressioni trovate: nessuna nei test backend mirati.
- Limiti/note:
  - enforcement RBAC completo e tenant/caller hardening restano fuori scope;
  - nessuna migration aggiunta;
  - suite backend completa richiesta dal task da registrare dopo esecuzione finale.
- Stato finale: PASS WITH NOTES

### TASK-053.1 - Backend role administration API foundation

- Data: 2026-05-10
- Branch: `task-053-1-backend-role-administration-api`
- Task: TASK-053.1 - Backend role administration API foundation
- Area verificata: API backend `/api/admin/roles`, DTO role administration, `RoleAdministrationService`, `RolePermissionRepository`, Flyway V18 permission seed.
- Attivita eseguite:
  - aggiunta API backend per lista ruoli, dettaglio ruolo, lettura permessi assegnati e update foundation delle assegnazioni ruolo-permesso;
  - introdotti DTO espliciti senza esporre entity JPA;
  - implementato service layer transazionale con semantica replace sulle assegnazioni `RolePermission`;
  - validate esistenza `Role`/`Permission`/`Tenant`, deduplicazione permission id e coerenza tenant tra ruolo e permessi;
  - corretto `V18__seed_permission_model_scope_resource_action.sql` con cast UUID espliciti per evitare errore PostgreSQL UUID/text allo startup;
  - verificata assenza di modifiche a security globale, JWT, tenant resolution, UI e import CAP/ZIP.
- Test eseguiti:
  - `cd backend && .\mvnw.cmd -Dtest=RoleAdministrationControllerTests test` -> PASS, BUILD SUCCESS, 10 test eseguiti, 0 failure, 0 error, 0 skipped;
  - `cd backend && .\mvnw.cmd test` -> interrotta su richiesta perche produce insert/select massivi su `global_zip_codes`.
- Esito: PASS WITH NOTES
- Limiti noti:
  - la suite completa resta non usata come gate finale in questo task per problema preesistente di output/attivita massiva su `global_zip_codes`, da analizzare in task tecnico dedicato;
  - nessuna modifica fatta alla logica di import CAP/ZIP e nessun test esistente rimosso;
  - non e stato introdotto enforcement RBAC completo, nessun cambio JWT/security e nessuna UI;
  - le policy avanzate su ruoli/permessi di sistema restano fuori scope.

### TASK-052 - Permission model foundation by scope/resource/action

- Data: 2026-05-10
- Branch: `task-052-permission-model-foundation`
- Task: TASK-052 - Permission model foundation by scope/resource/action
- Agente/Modello usato: GPT-5.5 Thinking
- File analizzati:
  - `AGENTS.md`, `backend/AGENTS.md`, `.agents/skills/spring-backend-developer/SKILL.md`
  - `ARCHITECTURE.md`, `TASKS.md`, `ROADMAP.md`, `DECISIONS.md`, `docs/qa/QA-REPORTS.md`
  - `Permission`, `Role`, `RolePermission`, `UserRole`, `UserTenantAccess`, `UserType`, repository/DTO/service governance-security
  - migration Flyway `V3`, `V4`, `V8`, vendor `V15`/`V17`
- Attivita eseguite:
  - verificato che `Permission` e tenant-scoped con `tenant_id`, `code`, `name`, `system_permission`, `active` e unique `(tenant_id, code)`;
  - confermata assenza di `description` nel modello attuale e nessun bisogno di schema/DTO aggiuntivi per TASK-052;
  - aggiunti enum/helper backend per il vocabolario `SCOPE.RESOURCE.ACTION`;
  - aggiunta migration Flyway V18 per riallineare i 5 seed legacy e seedare 100 permessi foundation `system_permission=true`;
  - aggiunti test su formato permission code, seed Flyway e assenza di granularita per singola entita Master Data.
- Test eseguiti:
  - primo tentativo mirato fallito per sandbox/network Maven su risoluzione parent POM;
  - riesecuzione autorizzata `cd backend && .\mvnw.cmd "-Dtest=PermissionCodeTests,HrmBackendApplicationTests" test` -> BUILD SUCCESS, 55 test eseguiti, 0 failure, 0 error, 0 skipped.
- Esito: PASS
- Limiti noti:
  - non e stato introdotto enforcement runtime con `@PreAuthorize` o policy service;
  - non sono stati modificati login, JWT o authority runtime;
  - non sono state create API amministrative utenti/ruoli/permessi nuove;
  - i permessi seed non sono assegnati automaticamente ai ruoli per evitare cambi runtime fuori scope;
  - la protezione applicativa di `system_permission` nelle API amministrative resta demandata a TASK-053.
- Conferma Master Data: il task non introduce granularita permission per singola entita Master Data; `TENANT.MASTER_DATA.WORK_MODE.CREATE` e validato come fuori modello iniziale.

### TASK-047.1 - Master Data physical delete backend foundation

- Data: 2026-05-08
- Branch: `task-047-1-master-data-physical-delete-backend`
- Task: TASK-047.1 - Master Data physical delete backend foundation
- Agente/Modello usato: GPT-5 Codex (QA tecnica finale post-fix)
- Area verificata: controller/service/repository Master Data HR/business, endpoint backend `/physical`, gestione `204` / `404` / `409`, mantenimento soft-delete esistente, check referenziali tenant-aware e test MockMvc/OpenAPI
- Comandi eseguiti: `cd backend && .\mvnw.cmd test`
- QA iniziale:
  - verifiche su endpoint e casi `204`/`404`/`409` confermate;
  - identificata criticitÃ : check referenziali non tenant-aware su codice (`EmployeeRepository`) che poteva produrre falsi positivi cross-tenant.
- Fix applicato:
  - aggiornati check referenziali in `MasterDataHrBusinessService` a filtraggio per `tenantId` su `Department`, `JobTitle`, `WorkMode`;
  - mantenuta verifica anche su `ContractType` con query su `ContractRepository` per i riferimenti da `Contract`;
  - esteso test multi-tenant `masterDataHrBusinessPhysicalDeleteIgnoresSameCodeReferencesFromAnotherTenant` includendo `Department`, `JobTitle`, `ContractType`, `WorkMode`.
- Comportamenti verificati:
  - separazione `/physical` da `DELETE /{id}` su `Department`, `JobTitle`, `ContractType`, `WorkMode`;
  - `DELETE /{id}/physical` su record non referenziati ritorna `204` e rimuove il record;
  - `DELETE /{id}/physical` su record mancante ritorna `404`;
  - `DELETE /{id}/physical` su record referenziato ritorna `409`;
  - test MockMvc/OpenAPI e suite Maven verificati end-to-end.
- Esito finale: PASS
- Stato finale: backend test OK (107 test, 0 failure, 0 errori, 0 skipped), fix applicato e validato, nessuna regressione bloccante.

## Frontend QA reports

### TASK-053.7 - User list DataTable alignment and sticky actions patch

- Data: 2026-05-11
- Branch: `task-053-7-tenant-user-create-edit-foundation`
- Task: TASK-053.7 - Tenant user create/edit foundation
- Tipo verifica: patch frontend minima su `DataTableComponent` shared e lista utenti.
- Area verificata: `shared/components/data-table`, `features/user-administration`, regressioni base `features/master-data`, build/test Angular.
- Attivita eseguite:
  - riallineata la card lista utenti al pattern gia usato in Master Data, eliminando padding locale eccessivo senza toccare shell/sidebar/header globali;
  - esteso il modello shared `DataTableColumn` con supporto opt-in `sticky?: 'left' | 'right'`;
  - aggiunto input shared `actionsColumnSticky` per rendere sticky la colonna azioni senza duplicare il DataTable;
  - applicata la colonna `Azioni` sticky right alla lista utenti;
  - rimosso il pulsante `Riprova` visibile dall header della lista utenti;
  - verificata retrocompatibilita: nessuna sticky column di default su Master Data o altre tabelle non configurate.
- Comandi eseguiti:
  - `cd frontend && npm.cmd run build`
  - `cd frontend && npm.cmd test`
- Esiti reali:
  - build frontend OK;
  - suite frontend OK, 27 file passed, 164 test passed.
- Regressioni trovate: nessuna nei test frontend eseguiti.
- Limiti/note:
  - la sticky column e solo opt-in e viene usata in questa patch solo sulla lista utenti;
  - nessuna modifica backend/API e nessuna nuova libreria introdotta.
- Stato finale: PASS WITH NOTES

### TASK-053.7 - Tenant UI simplification patch

- Data: 2026-05-11
- Branch: `task-053-7-tenant-user-create-edit-foundation`
- Task: TASK-053.7 - Tenant user create/edit foundation
- Tipo verifica: patch UX/documentale mirata su form create/edit utenti tenant.
- Area verificata: `user-administration-form.component.*`, i18n `it/fr/en`, `DECISIONS.md`, build/test Angular.
- Attivita eseguite:
  - rimosso dal form create/edit il campo visibile `Tenant predefinito`;
  - mantenuto un solo campo visibile `Tenant`, con `primaryTenant` ancora gestito dal backend senza nuove API;
  - rinominata nel form la company profile in `Azienda / societa`;
  - verificato che `Bloccato` resta informativo/read-only tramite checkbox disabilitata;
  - aggiunta DEC-034 per fissare la regola dominio/UX su tenant membership e default tenant visibility.
- Comandi eseguiti:
  - `cd frontend && npm.cmd run build`
  - `cd frontend && npm.cmd test`
- Esiti reali:
  - build frontend OK;
  - suite frontend OK, 27 file passed, 159 test passed.
- Regressioni trovate: nessuna nei test frontend.
- Limiti/note:
  - nessuna modifica backend, schema DB, API o DTO;
  - scenari platform/multi-tenant restano demandati a task futuri dedicati.
- Stato finale: PASS WITH NOTES

### TASK-053.6 - User detail header/title and mono-tenant selector patch

- Data: 2026-05-11
- Branch: `task-053-6-tenant-user-password-admin`
- Task: TASK-053.6 - Tenant user password administration foundation
- Tipo verifica: patch frontend mirata su header dettaglio utente, tenant selector della gestione ruoli e titolo sezione nell'header globale.
- Area verificata: `frontend/src/app/features/user-administration/user-administration-detail.component.*`, `frontend/src/app/layout/header/app-header.component.*`, rendering header dettaglio, gestione ruoli mono-tenant/multi-tenant, titolo header globale, build/test Angular.
- Attivita eseguite:
  - evitata la duplicazione dell'email nell'header del dettaglio utente: se `displayName` coincide con `email`, il sottotitolo email non viene renderizzato;
  - mantenuta invariata la logica interna `selectedTenantId`, cambiando solo il rendering della card ruoli: select nascosta con un solo tenant, testo statico compatto; select mantenuta con piu tenant;
  - corretto il resolver dell'header globale per mostrare `Utenti` su `/admin/users` e `/admin/users/:id`, senza alterare le altre pagine;
  - confermato che non ci sono modifiche backend/API/DTO e nessun cambio di logica su reset password o gestione ruoli.
- Comandi eseguiti:
  - `cd frontend; npm.cmd test -- --include src/app/features/user-administration/user-administration-detail.component.spec.ts`
  - `cd frontend; npm.cmd test -- --include src/app/layout/header/app-header.component.spec.ts`
  - `cd frontend; npm.cmd test`
  - `cd frontend; npm.cmd run build`
- Esiti reali:
  - test mirati detail component OK, 1 file test passed, 10 test passed;
  - test mirati header component OK, 1 file test passed, 5 test passed;
  - suite frontend completa OK, 26 file test passed, 148 test passed;
  - build Angular OK, output generato in `frontend/dist/frontend`.
- Regressioni trovate: nessuna nei test automatici eseguiti.
- Limiti/note:
  - validazione manuale browser non eseguita in questa sessione CLI;
  - il titolo globale continua a dipendere dal path corrente e non introduce un sistema breadcrumb nuovo.
- Stato finale: PASS

### TASK-053.6 - User detail card-by-card UX refinement

- Data: 2026-05-11
- Branch: `task-053-6-tenant-user-password-admin`
- Task: TASK-053.6 - Tenant user password administration foundation
- Tipo verifica: patch UX card-by-card della pagina dettaglio utente, usando il mockup HTML solo come riferimento visuale e di gerarchia.
- Area verificata: `frontend/src/app/features/user-administration/user-administration-detail.component.*`, `frontend/src/app/core/i18n/i18n.messages.ts`, card header/identita/tenant/sicurezza/reset password/gestione ruoli, build/test Angular.
- Attivita eseguite:
  - header mantenuto compatto con H1 `displayName`, email come sottotitolo, descrizione breve senza accessi tenant e metadati audit secondari;
  - card `Identita` e `Tenant e azienda` mantenute come contesto sinistro della griglia desktop, senza `Nome visualizzato`, accessi tenant, lingua o fuso orario;
  - card `Sicurezza` riallineata al mockup con metodo autenticazione in alto, griglia compatta di stati, secondari OTP/strong auth meno prominenti e reset password come sottosezione separata;
  - reset password mantenuto con due `app-password-field`, `autocomplete="new-password"`, validazione required/mismatch, saving state, notifiche e reset form invariati;
  - `Gestione ruoli utente` mantenuta full width sotto le card principali, con tenant selector, ruoli assegnati, ruoli disponibili, azioni assegna/rimuovi e logica invariata;
  - non introdotti Tailwind, Material Symbols, nuovi componenti shared o codice HTML/CSS copiato 1:1 dal mockup.
- Conferme scope:
  - mockup usato solo come riferimento visuale/gerarchico;
  - nessun cambio backend/API/DTO;
  - nessun cambio funzionale a reset password o gestione ruoli.
- Comandi eseguiti:
  - `cd frontend; npm.cmd test -- --include src/app/features/user-administration/user-administration-detail.component.spec.ts`
  - `cd frontend; npm.cmd test`
  - `cd frontend; npm.cmd run build`
- Esiti reali:
  - test mirati detail component OK, 1 file test passed, 8 test passed;
  - suite frontend completa OK, 26 file test passed, 144 test passed;
  - build Angular OK, output generato in `frontend/dist/frontend`.
- Regressioni trovate: nessuna nei test automatici eseguiti.
- Limiti/note:
  - validazione manuale browser non eseguita in questa sessione CLI;
  - le evidenze visuali di stato sono SCSS locali del componente e non introducono un nuovo pattern shared.
- Stato finale: PASS

### TASK-053.6 - User detail UX mockup alignment patch

- Data: 2026-05-11
- Branch: `task-053-6-tenant-user-password-admin`
- Task: TASK-053.6 - Tenant user password administration foundation
- Tipo verifica: patch frontend mirata su layout/gerarchia UX del dettaglio utente usando mockup HTML solo come riferimento visuale.
- Area verificata: `frontend/src/app/features/user-administration/user-administration-detail.component.*`, `frontend/src/app/core/i18n/i18n.messages.ts`, rendering header, layout due colonne desktop, reset password inline, gestione ruoli full width, build/test Angular.
- Attivita eseguite:
  - mostrata l'email utente come sottotitolo del dettaglio quando il record e caricato, mantenendo `displayName` come H1 senza ricalcolo frontend;
  - aggiornata la microcopy `userAdministration.detail.subtitle` in `it/fr/en` rimuovendo riferimenti alla sezione accessi tenant;
  - riallineato il layout desktop in due colonne: `Identita` e `Tenant e azienda` a sinistra, `Sicurezza` a destra, con `Gestione ruoli utente` sotto a tutta larghezza;
  - mantenuti `Reset password` dentro `Sicurezza` con due `app-password-field` e `autocomplete="new-password"`;
  - mantenuta completa la gestione ruoli esistente con tenant selector, ruoli assegnati, ruoli disponibili, assegnazione e rimozione;
  - non introdotti Tailwind, Material Symbols, nuovi componenti shared o codice HTML/CSS copiato 1:1 dal mockup.
- Conferme scope:
  - mockup usato solo come riferimento layout/gerarchia;
  - nessun cambio backend/API/DTO;
  - nessun cambio funzionale a reset password o gestione ruoli.
- Comandi eseguiti:
  - `cd frontend; npm.cmd test -- --include src/app/features/user-administration/user-administration-detail.component.spec.ts`
  - `cd frontend; npm.cmd test`
  - `cd frontend; npm.cmd run build`
- Esiti reali:
  - test mirati detail component OK, 1 file test passed, 8 test passed;
  - suite frontend completa OK, 26 file test passed, 144 test passed;
  - build Angular OK, output generato in `frontend/dist/frontend`.
- Regressioni trovate: nessuna nei test automatici eseguiti.
- Limiti/note:
  - validazione manuale browser non eseguita in questa sessione CLI;
  - la pagina resta coerente con i componenti esistenti `app-button` e `app-password-field`, senza redesign generale.
- Stato finale: PASS

### TASK-053.6 - Hide preferred language and time zone on user detail

- Data: 2026-05-11
- Branch: `task-053-6-tenant-user-password-admin`
- Task: TASK-053.6 - Tenant user password administration foundation
- Tipo verifica: patch minima frontend sulla sola visibilita dei campi `Lingua preferita` e `Fuso orario`
- Area verificata: `frontend/src/app/features/user-administration/user-administration-detail.component.ts`, `frontend/src/app/features/user-administration/user-administration-detail.component.spec.ts`, `frontend/src/app/core/i18n/i18n.messages.ts`, rendering sezione `Sicurezza`, build/test Angular.
- Attivita eseguite:
  - rimossi dal rendering della sezione `Sicurezza` i campi `Lingua preferita` e `Fuso orario`;
  - rimosso il mapper frontend della lingua, non piu necessario dopo la semplificazione UI;
  - mantenuti invariati DTO, modelli frontend e contratto API/backend, lasciando i dati disponibili per utilizzi futuri.
- Comandi eseguiti:
  - `cd frontend && npm.cmd test -- --include src/app/features/user-administration/user-administration-detail.component.spec.ts`
  - `cd frontend && npm.cmd test`
  - `cd frontend && npm.cmd run build`
- Esiti reali:
  - test mirati detail component OK, 1 file test passed, 7 test passed;
  - suite frontend completa OK, 26 file test passed, 143 test passed;
  - build Angular OK, output generato in `frontend/dist/frontend`.
- Regressioni trovate: nessuna nei test automatici eseguiti.
- Limiti/note:
  - `preferredLanguage` e `timeZone` restano presenti nei DTO/API e nei modelli frontend, ma non sono piu mostrati nella UI corrente;
  - nessuna modifica a reset password, gestione ruoli, backend o API.
- Stato finale: PASS

### TASK-053.6 - Hide tenant accesses section on user detail

- Data: 2026-05-11
- Branch: `task-053-6-tenant-user-password-admin`
- Task: TASK-053.6 - Tenant user password administration foundation
- Tipo verifica: patch minima frontend locale alla sola sezione `Accessi tenant` del dettaglio utente
- Area verificata: `frontend/src/app/features/user-administration/user-administration-detail.component.html`, `frontend/src/app/features/user-administration/user-administration-detail.component.spec.ts`, rendering pagina dettaglio utente, build/test Angular.
- Attivita eseguite:
  - rimossa dal template la sezione `Accessi tenant` / `Tenant abilitati` della pagina dettaglio utente;
  - lasciati invariati DTO, modelli frontend e logica dati, mantenendo il dato disponibile lato API per future evoluzioni multi-tenant;
  - aggiornati i test del detail component per verificare che la sezione non venga piu renderizzata.
- Comandi eseguiti:
  - `cd frontend && npm.cmd test -- --include src/app/features/user-administration/user-administration-detail.component.spec.ts`
  - `cd frontend && npm.cmd test`
  - `cd frontend && npm.cmd run build`
- Esiti reali:
  - test mirati detail component OK, 1 file test passed, 7 test passed;
  - suite frontend completa OK, 26 file test passed, 143 test passed;
  - build Angular OK, output generato in `frontend/dist/frontend`.
- Regressioni trovate: nessuna nei test automatici eseguiti.
- Limiti/note:
  - il dato `tenantAccesses` resta disponibile in DTO/API e nei modelli frontend, ma non viene piu mostrato nella UI principale del dettaglio utente;
  - nessuna modifica a reset password, gestione ruoli, backend o permessi.
- Stato finale: PASS

### TASK-053.6 - User detail clarity and header actions patch

- Data: 2026-05-11
- Branch: `task-053-6-tenant-user-password-admin`
- Task: TASK-053.6 - Tenant user password administration foundation
- Tipo verifica: patch minima frontend su chiarezza campi, gerarchia identita/tenant/security e visibilita azione retry
- Area verificata: `frontend/src/app/features/user-administration/user-administration-detail.component.*`, `frontend/src/app/core/i18n/i18n.messages.ts`, rendering header actions, identity/tenant/security cards, build/test Angular.
- Attivita eseguite:
  - mantenuto `Torna alla lista` come `app-button` shared secondary e reso `Riprova` visibile solo nello stato errore;
  - rimossa la riga `Nome visualizzato` dalla card `Identità`, lasciando l'H1 come unico punto primario del `displayName`;
  - introdotti mapping frontend leggibili per `TENANT_ADMIN`, `PLATFORM_SUPER_ADMIN`, `PASSWORD_ONLY` e codici lingua `it/fr/en`;
  - nascosto `Tenant predefinito` quando coincide con il tenant di appartenenza, senza cambiare DTO o API;
  - mantenuti invariati reset password e gestione ruoli, inclusi form state, validazioni e chiamate API.
- Comandi eseguiti:
  - `cd frontend && npm.cmd test -- --include src/app/features/user-administration/user-administration-detail.component.spec.ts`
  - `cd frontend && npm.cmd test`
  - `cd frontend && npm.cmd run build`
- Esiti reali:
  - test mirati detail component OK, 1 file test passed, 7 test passed;
  - suite frontend completa OK, 26 file test passed, 143 test passed;
  - build Angular OK, output generato in `frontend/dist/frontend`.
- Regressioni trovate: nessuna nei test automatici eseguiti.
- Limiti/note:
  - i mapping leggibili frontend coprono i codici esplicitamente gestiti dalla patch; eventuali nuovi codici backend non mappati continuano a usare `name` o `code` come fallback;
  - la sezione `Tenant abilitati` resta foundation e non espone ancora un testo descrittivo del tipo di accesso tenant-specific.
- Stato finale: PASS

### TASK-053.6 - User detail field readability patch

- Data: 2026-05-11
- Branch: `task-053-6-tenant-user-password-admin`
- Task: TASK-053.6 - Tenant user password administration foundation
- Tipo verifica: patch minima frontend presentazionale su label e valori leggibili del dettaglio utente
- Area verificata: `frontend/src/app/features/user-administration/user-administration-detail.component.*`, `frontend/src/app/core/i18n/i18n.messages.ts`, rendering valori user type / authentication method / language / tenant accesses, build/test Angular.
- Attivita eseguite:
  - corrette le label `Identità`, `Ultimo cambio password` e `Tenant abilitati`;
  - resa piu leggibile la presentazione di `userType`, `authenticationMethod`, `preferredLanguage`, `timeZone`, tenant/company context e tenant accesses senza toccare API o logica backend;
  - introdotto fallback piu naturale `Mai` per campi data security non valorizzati come `Ultimo accesso` ed `Email verificata`;
  - lasciati invariati comportamento e wiring di reset password, gestione ruoli e navigazione.
- Comandi eseguiti:
  - `cd frontend && npm.cmd test -- --include src/app/features/user-administration/user-administration-detail.component.spec.ts`
  - `cd frontend && npm.cmd test`
  - `cd frontend && npm.cmd run build`
- Esiti reali:
  - test mirati detail component OK, 1 file test passed, 7 test passed;
  - suite frontend completa OK, 26 file test passed, 143 test passed;
  - build Angular OK, output generato in `frontend/dist/frontend`.
- Regressioni trovate: nessuna nei test automatici eseguiti.
- Limiti/note:
  - i valori descrittivi di `userType` e `authenticationMethod` dipendono dal `name` gia esposto dal backend; la patch non introduce una localizzazione completa dei master data backend;
  - la sezione `Tenant abilitati` privilegia il nome tenant rispetto al codice e non espone ulteriori dettagli di `accessRole`, rimandati a eventuale refinement dedicato.
- Stato finale: PASS

### TASK-053.6 - User detail layout hierarchy patch

- Data: 2026-05-11
- Branch: `task-053-6-tenant-user-password-admin`
- Task: TASK-053.6 - Tenant user password administration foundation
- Tipo verifica: patch minima frontend layout/reuse/gerarchia UI su pagina dettaglio utente
- Area verificata: `frontend/src/app/features/user-administration/user-administration-detail.component.*`, `frontend/src/app/shared/form-fields/password-field.component.*`, runtime i18n frontend, build/test Angular.
- Attivita eseguite:
  - rimossa la card autonoma finale `Audit` e spostati `Creato` / `Aggiornato` come metadati compatti nell'header pagina;
  - rimossa la card autonoma riepilogativa `Ruoli assegnati`, lasciando `Gestione ruoli utente` come unica sezione principale per ruoli assegnati/disponibili e azioni;
  - spostato `Reset password` dentro la sezione `Sicurezza` senza cambiare validazioni, form state, loading, feedback o API;
  - mantenuto il layout identity/tenant separato per restare su patch minima a basso rischio senza introdurre nuove label o cambiare troppo i test.
- Comandi eseguiti:
  - `cd frontend && npm.cmd test -- --include src/app/features/user-administration/user-administration-detail.component.spec.ts`
  - `cd frontend && npm.cmd test`
  - `cd frontend && npm.cmd run build`
- Esiti reali:
  - test mirati detail component OK, 1 file test passed, 7 test passed;
  - suite frontend completa OK, 26 file test passed, 143 test passed;
  - build Angular OK, output generato in `frontend/dist/frontend`.
- Regressioni trovate: nessuna nei test automatici eseguiti.
- Limiti/note:
  - nessuna modifica backend, nessuna API nuova o aggiornata, nessun cambio di comportamento su reset password o gestione ruoli;
  - `Identita` e `Tenant e azienda` restano separate per evitare una patch piu invasiva del necessario;
  - il `password-field` shared resta riusato senza introdurre nuovi shared component.
- Stato finale: PASS

### TASK-053.6 - Tenant user password administration foundation

- Data: 2026-05-11
- Branch: `task-053-6-tenant-user-password-admin`
- Task: TASK-053.6 - Tenant user password administration foundation
- Area verificata: dettaglio utente `/admin/users/:id`, sezione inline reset password, `UserAdministrationService`, i18n `it/fr/en`, stato security gia esposto dal DTO utente.
- Attivita eseguite:
  - aggiunta sezione inline "Reset password" nel dettaglio utente esistente;
  - introdotti due campi locali `newPassword` e `confirmPassword` con validazioni `required` e mismatch;
  - riusati `app-button`, `NotificationService`, route/layout esistenti e nessun nuovo componente shared;
  - aggiornato il dettaglio utente dopo reset riuscito riflettendo `passwordChangedAt`, `locked` e `failedLoginAttempts`;
  - nessun redesign, nessun self-service, nessun flow email/MFA runtime o `must_change_password`.
- Comandi eseguiti:
  - `cd frontend && npm.cmd test -- --include src/app/features/user-administration/user-administration.service.spec.ts`
  - `cd frontend && npm.cmd test -- --include src/app/features/user-administration/user-administration-detail.component.spec.ts`
  - `cd frontend && npm.cmd run build`
  - `cd frontend && npm.cmd test`
- Esiti reali:
  - test mirati service OK, 1 file test passed, 7 test passed;
  - test mirati detail component OK, 1 file test passed, 7 test passed;
  - build frontend OK;
  - suite frontend completa OK, 25 file test passed, 138 test passed.
- Regressioni trovate: nessuna nei test frontend/build.
- Limiti/note:
  - QA manuale browser autenticata non eseguita in questa sessione CLI;
  - la password policy resta validata in modo autorevole dal backend e la UI non replica le regole in modo completo lato client.
- Stato finale: PASS WITH NOTES

### TASK-053.6 - Reuse-first corrective patch on shared password field

- Data: 2026-05-11
- Branch: `task-053-6-tenant-user-password-admin`
- Task: TASK-053.6 - Tenant user password administration foundation
- Area verificata: `app-password-field` shared, login `/login`, dettaglio utente `/admin/users/:id`, riuso reset password admin, compatibilita test/build frontend.
- Attivita eseguite:
  - generalizzato `app-password-field` con `id`, `autocomplete` ed errore contestuale configurabile, rimuovendo l'assunzione login-specifica sull'input;
  - sostituiti i due input password custom del dettaglio utente con due istanze di `app-password-field`;
  - mantenute nel dettaglio utente solo le regole di contesto: `required`, mismatch, saving state e chiamata API reset password;
  - rimosso HTML/CSS duplicato del reset password admin;
  - aggiunti/aggiornati test su `password-field`, login e user detail per coprire il riuso shared.
- Comandi eseguiti:
  - `cd frontend && npm.cmd test -- --include src/app/features/user-administration/user-administration-detail.component.spec.ts`
  - `cd frontend && npm.cmd test`
  - `cd frontend && npm.cmd run build`
- Esiti reali:
  - test mirati detail component OK, 1 file test passed, 7 test passed;
  - suite frontend completa OK, 26 file test passed, 143 test passed;
  - build frontend OK.
- Regressioni trovate:
  - corretto il rilievo reuse-first della review globale: il reset password admin ora riusa il componente shared `app-password-field` e non mantiene piu input password duplicati nel feature template.
- Limiti/note:
  - il componente shared espone solo la superficie minima necessaria al riuso corrente; non sono stati introdotti refactor ulteriori fuori scope.
- Stato finale: PASS

### TASK-053.5 - Tenant user role assignment foundation

- Data: 2026-05-11
- Branch: `task-053-5-tenant-user-role-assignment`
- Task: TASK-053.5 - Tenant user role assignment foundation
- Area verificata: dettaglio utente `/admin/users/:id`, `UserAdministrationService`, gestione ruoli utente tenant-specific, i18n `it/fr/en`, feedback `NotificationService`.
- Attivita eseguite:
  - aggiunta sezione minimale "Gestione ruoli utente" nel dettaglio utente esistente;
  - riusati `app-button`, shell/header/sidebar, i18n runtime e `NotificationService`;
  - aggiunti selettore tenant da accessi attivi, lista ruoli assegnati, select ruoli disponibili, azione assegna e azione rimuovi;
  - gestiti loading/error/success coerenti con pattern esistenti;
  - nessun nuovo componente shared e nessun redesign globale.
- Comandi eseguiti:
  - `cd frontend && npm.cmd test -- --include src/app/features/user-administration/user-administration.service.spec.ts --include src/app/features/user-administration/user-administration-detail.component.spec.ts`
  - `cd frontend && npm.cmd run build`
  - `cd frontend && npm.cmd test`
- Esiti reali:
  - test mirati OK, 2 file test passed, 9 test passed;
  - build frontend OK;
  - suite frontend completa OK, 25 file test passed, 133 test passed.
- Regressioni trovate: nessuna nei test frontend/build.
- Limiti/note:
  - QA manuale browser autenticata non eseguita in questa sessione CLI;
  - visibility frontend completa basata su permessi resta fuori scope e demandata a TASK-054.
- Stato finale: PASS WITH NOTES

### TASK-053.4 - Tenant user administration read/list/detail foundation

- Data: 2026-05-10
- Branch: `main`
- Task: TASK-053.4 - Tenant user administration read/list/detail foundation
- Area verificata: route `/admin/users`, dettaglio `/admin/users/:id`, sidebar `Governance > Sicurezza > Utenti`, i18n `it/fr/en`, riuso `DataTableComponent` e `app-button`.
- Attivita eseguite:
  - aggiunta UI lista utenti tenant read-only con filtro, paginazione e azione dettaglio;
  - aggiunta UI dettaglio utente read-only con identita, tenant/company, security flags, ruoli assegnati e accessi tenant;
  - integrata distinzione vista tenant/platform basata sul `userType` autenticato;
  - aggiunte chiavi i18n `it/fr/en`;
  - non creati nuovi componenti shared; dettaglio read-only implementato localmente per assenza di un read-only field/card shared.
- Comandi eseguiti:
  - `cd frontend && npm.cmd test -- --include src/app/features/user-administration/user-administration.service.spec.ts --include src/app/features/user-administration/user-administration.component.spec.ts --include src/app/features/user-administration/user-administration-detail.component.spec.ts`
- Esiti reali:
  - test mirati OK, 3 file passed, 9 test passed.
- Regressioni trovate: nessuna nei test frontend mirati.
- Limiti/note:
  - QA manuale browser non ancora eseguita in questa sessione CLI;
  - suite build/test frontend completa richiesta dal task da registrare dopo esecuzione finale.
- Stato finale: PASS WITH NOTES

### TASK-053.3 - Sidebar hierarchy stability and role actions layout

- Data: 2026-05-10
- Branch: `main`
- Task: TASK-053.3 - Tenant custom role CRUD foundation
- Tipo verifica: bugfix frontend localizzato su sidebar/navigation e `DataTableComponent` shared
- Ambito QA:
  - stabilita gerarchia `Governance > Sicurezza > Ruoli|Permessi`;
  - layout colonna azioni nella tabella Ruoli;
  - conferma riuso componenti shared del CRUD Ruoli;
  - regressioni frontend minime su routing/sidebar/DataTable.
- File analizzati:
  - `frontend/src/app/layout/sidebar/app-sidebar.component.ts`
  - `frontend/src/app/layout/sidebar/app-sidebar.component.html`
  - `frontend/src/app/layout/sidebar/app-sidebar.component.spec.ts`
  - `frontend/src/app/app.routes.ts`
  - `frontend/src/app/features/role-administration/role-administration.component.ts`
  - `frontend/src/app/features/role-administration/role-administration.component.html`
  - `frontend/src/app/features/role-administration/role-administration.component.scss`
  - `frontend/src/app/shared/components/data-table/data-table.component.ts`
  - `frontend/src/app/shared/components/data-table/data-table.component.html`
  - `frontend/src/app/shared/components/data-table/data-table.component.scss`
  - `frontend/src/app/shared/components/data-table/data-table.component.spec.ts`
  - `frontend/src/app/features/master-data/master-data-form.component.ts`
  - `frontend/src/app/shared/components/button/app-button.component.ts`
  - `frontend/src/app/shared/components/input/app-input.component.ts`
  - `frontend/src/app/shared/components/checkbox/app-checkbox.component.ts`
- Bug rilevati:
  - sidebar: dopo la navigazione i wrapper `kt-menu-item` ricevevano classi di stato `active/here/show` insieme alle classi custom del componente; il tema base applicava styling addizionale ai wrapper attivi, alterando l'indentazione percepita di `Ruoli` e `Permessi`;
  - layout azioni: la `DataTableComponent` shared usava `flex-wrap: wrap` sulle row actions, quindi in una colonna stretta le icone andavano a capo e si impilavano verticalmente.
- Fix applicato:
  - rimossi dal template sidebar i binding di stato `active/here/show` sui wrapper `kt-menu-item`, lasciando la gestione visuale alle classi custom dei link e all'espansione calcolata dal componente;
  - resa stabile l'indentazione dei link nested/deep con margine costante, non solo nello stato attivo;
  - aggiornato il test sidebar per verificare che `Ruoli` e `Permessi` restino sibling sotto `Sicurezza` dopo la navigazione;
  - resa la toolbar azioni della `DataTableComponent` shared `inline-flex`, `nowrap`, con gap coerente e cella azioni a larghezza minima, cosi le icone restano orizzontali anche nella pagina Ruoli;
  - nessun markup custom dedicato alla pagina Ruoli introdotto.
- Verifica riuso componenti shared:
  - confermato riuso di `DataTableComponent` per la tabella ruoli;
  - confermato riuso di `MasterDataFormComponent` per il form/modale ruoli;
  - confermato uso di `app-button`, `app-input`, `app-checkbox` tramite la foundation gia adottata per Master Data;
  - nessun componente parallelo creato per Ruoli.
- Comandi eseguiti:
  - `cd frontend && npm.cmd run build`
  - `cd frontend && npm.cmd test`
- Esiti reali:
  - build frontend OK;
  - test frontend OK, 22 file di test passed, 118 test passed.
- QA manuale browser:
  - non eseguita in questa sessione CLI.
- Limiti/noti:
  - la stabilita visuale del sidebar e verificata via code review e test Angular, non con browser interattivo in questa sessione;
  - il fix azioni e generico sulla `DataTableComponent` shared ed e stato validato solo tramite suite frontend corrente; resta consigliata una rapida verifica visiva su una pagina Master Data.
- Stato finale: PASS WITH NOTES

### TASK-053.3 - Sicurezza / Ruoli menu access fix

- Data: 2026-05-10
- Branch: `main`
- Task: TASK-053.3 - Tenant custom role CRUD foundation
- Tipo verifica: fix minimo frontend su accesso sidebar/navigation alla pagina `/admin/roles`
- Area verificata: `app-sidebar`, routing `/admin/roles`, spec Angular correlate a sidebar/role administration/master data
- Attivita eseguite:
  - verificata la configurazione esistente della sidebar per `Governance > Sicurezza > Ruoli`;
  - confermato il collegamento della voce menu verso `/admin/roles` senza introdurre una nuova area UI;
  - corretti solo punti minimi emersi dai test frontend sul wiring della pagina ruoli e sulle spec Angular correlate;
  - mantenuto fuori scope ogni visibility frontend basata su permessi.
- Comandi eseguiti:
  - `cd frontend && npm.cmd run build`
  - `cd frontend && npm.cmd test`
- Esiti reali:
  - build frontend OK
  - test frontend OK, 22 file di test passed, 117 test passed
- QA manuale browser eseguita/non eseguita:
  - non eseguita in questa sessione CLI
- Limiti/note:
  - la verifica manuale visiva della sidebar e del click su `Sicurezza > Ruoli` resta raccomandata in browser;
  - nessun test backend eseguito, coerente con scope frontend-only del fix.
- Stato finale: PASS WITH NOTES

### TASK-053.2 - Frontend role permission matrix UI foundation (QA regression pass 2)

- Data: 2026-05-10
- Branch: `main`
- Task: TASK-053.2 - Frontend role permission matrix UI foundation
- Modello consigliato nel prompt operativo: GPT-5.3 Codex
- Area verificata: scope frontend `/admin/permissions`, integrazione AppShell/sidebar/header, i18n `it/fr/en`, componente shared `app-checkbox`, filtro permessi Master Data, stati UI, routing/menu, regressioni frontend.
- File controllati:
  - `frontend/src/app/features/role-permissions/role-permission-matrix.component.ts`
  - `frontend/src/app/features/role-permissions/role-permission-matrix.component.html`
  - `frontend/src/app/features/role-permissions/role-permission-matrix.service.ts`
  - `frontend/src/app/features/role-permissions/role-permission-matrix.component.spec.ts`
  - `frontend/src/app/features/role-permissions/role-permission-matrix.service.spec.ts`
  - `frontend/src/app/app.routes.ts`
  - `frontend/src/app/layout/sidebar/app-sidebar.component.ts`
  - `frontend/src/app/layout/sidebar/app-sidebar.component.spec.ts`
  - `frontend/src/app/layout/header/app-header.component.ts`
  - `frontend/src/app/layout/header/app-header.component.spec.ts`
  - `frontend/src/app/shared/components/checkbox/app-checkbox.component.ts`
  - `frontend/src/app/shared/components/checkbox/app-checkbox.component.html`
  - `frontend/src/app/shared/components/checkbox/app-checkbox.component.scss`
  - `frontend/src/app/shared/components/checkbox/app-checkbox.component.spec.ts`
  - `frontend/src/app/core/i18n/i18n.messages.ts`
- Verifiche eseguite:
  - scope rispettato: nessun CRUD ruoli, nessuna gestione utenti, nessun enforcement completo frontend/backend aggiunto;
  - route/menu coerenti: nuova route protetta `/admin/permissions`, voce sidebar `Governance > Sicurezza > Permessi`, title header coerente su route permessi;
  - riuso shell confermato: nessuna duplicazione `AppShell`, header o sidebar;
  - shared components: nessuna duplicazione inutile; estensione minima di `app-checkbox` con retrocompatibilita coperta da test unitari (`ReactiveForms` + nuovo scenario compact/aria);
  - filtro catalogo permessi confermato nel componente: solo `TENANT.MASTER_DATA.(READ|CREATE|UPDATE|DELETE)` e solo tenant del ruolo selezionato; esclusi placeholder e `MANAGE`;
  - i18n verificato: chiavi `rolePermissions.*` presenti in `it`, `fr`, `en`; nessun nuovo testo UI hardcoded nel template della feature;
  - loading/error/empty state verificati nel template e nei test (`foundationLoad`, `roleLoad`, empty list, empty matrix, loading list/matrix);
  - nessuna nuova libreria UI introdotta (nessuna modifica a `frontend/package.json` o `frontend/package-lock.json`);
  - compatibilita Manrope: componente eredita il font globale (`font-family: inherit`) senza override globali;
  - responsive base: layout con stacking sotto breakpoint e tabella in wrapper con `overflow-x: auto`.
- Classificazione problemi:
  - BLOCKER: nessuno
  - MAJOR: nessuno
  - MINOR: nessuno
  - NOTE:
    - review manuale browser interattiva non eseguita in questa sessione CLI;
    - con `PLATFORM_SUPER_ADMIN` la validazione manuale completa puo risultare parziale senza tenant corrente valido (limite noto non bloccante).
- Comandi QA eseguiti:
  - `cd frontend && npm.cmd run build`
  - `cd frontend && npm.cmd test`
- Esiti reali:
  - build frontend OK
  - test frontend OK, 20 file di test passed, 107 test passed
- Stato finale: PASS WITH NOTES

### TASK-053.2 - Frontend role permission matrix UI foundation

- Data: 2026-05-10
- Branch: `main`
- Task: TASK-053.2 - Frontend role permission matrix UI foundation
- Agente/Modello usato: GPT-5.5
- Area verificata: nuova route `/admin/permissions`, feature Angular role permission matrix, riuso shell/sidebar/header, i18n `it/fr/en`, `app-checkbox`, integrazione con `/api/admin/roles` e catalogo `/api/master-data/governance-security/permissions`, aggiornamenti `TASKS.md`, `ROADMAP.md`, `DECISIONS.md`, `docs/qa/QA-REPORTS.md`
- File modificati:
  - `frontend/src/app/features/role-permissions/*`
  - `frontend/src/app/app.routes.ts`
  - `frontend/src/app/layout/sidebar/app-sidebar.component.ts`
  - `frontend/src/app/layout/header/app-header.component.ts`
  - `frontend/src/app/shared/components/checkbox/*`
  - `frontend/src/app/core/i18n/i18n.messages.ts`
  - `TASKS.md`
  - `ROADMAP.md`
  - `DECISIONS.md`
  - `docs/qa/QA-REPORTS.md`
- Attivita eseguite:
  - verificata la presenza reale e la compatibilita delle API backend `/api/admin/roles`, `/api/admin/roles/{roleId}`, `/api/admin/roles/{roleId}/permissions` e `PUT /api/admin/roles/{roleId}/permissions`;
  - implementata schermata frontend tenant-aware per lista ruoli, selezione ruolo, matrice permessi per modulo e azioni `Ripristina` / `Salva modifiche`;
  - riallineati menu, naming e page title su `Governance > Sicurezza > Permessi` con route frontend `/admin/permissions`;
  - riusato il catalogo permessi esistente via `/api/master-data/governance-security/permissions`, con raccolta multipagina lato frontend;
  - filtrata la matrice per mostrare solo permessi Master Data realmente presenti nel catalogo tenant (`TENANT.MASTER_DATA.READ|CREATE|UPDATE|DELETE`), escludendo moduli placeholder/futuri e `MANAGE`;
  - mantenuta estensione minima e retrocompatibile di `app-checkbox` per uso compatto nella matrice;
  - non implementati CRUD ruoli, gestione utenti, enforcement frontend completo o modifiche backend/API.
- Comandi eseguiti:
  - `cd frontend && npm.cmd run build`
  - `cd frontend && npm.cmd test`
- Esiti reali:
  - build frontend OK
  - test frontend OK, 20 file di test passed, 107 test passed
- QA manuale browser eseguita/non eseguita:
  - non eseguita in questa sessione CLI
- Limiti/note:
  - il catalogo completo dei permessi viene ancora letto dall endpoint Master Data governance/security, non da un endpoint dedicato alla matrice;
  - il pulsante `+` del mockup non e stato implementato perche il CRUD ruoli custom tenant e stato esplicitamente rinviato al nuovo TASK-053.3;
  - la validazione manuale completa richiede un utente tenant-aware con `tenantId` valido, ad esempio `TENANT_ADMIN`; con `PLATFORM_SUPER_ADMIN` la schermata puo non essere completamente esercitabile se non esiste un tenant corrente selezionato;
  - aggiunto task tecnico dedicato TASK-056 per la finalizzazione/isolation della foundation import ZIP, separato da TASK-053.2.
- Stato finale: PASS

### TASK-048.16 - Global typography foundation

- Data: 2026-05-10
- Branch: `task-048-16-global-typography-foundation`
- Task: TASK-048.16 - Global typography foundation
- Agente/Modello usato: GPT-5.5 Thinking
- Area verificata: `frontend/angular.json`, `frontend/src/typography.scss`, `frontend/src/styles.scss`, `docs/design/DESIGN-SYSTEM.md`, `TASKS.md`, `ROADMAP.md`
- Attività eseguite:
  - analisi della catena attuale degli stili globali Angular/Metronic e identificazione di `public/assets/css/styles.css` come layer tipografico dominante;
  - introduzione di `src/typography.scss` come layer finale, senza spostare `src/styles.scss`;
  - definizione di Manrope come font applicativo globale tramite token CSS e fallback sicuri, senza font remoti;
  - esclusione esplicita dei font iconografici Keenicons dalla normalizzazione tipografica.
- Test eseguiti:
  - `cd frontend && npm.cmd run build` -> OK
  - `cd frontend && npm.cmd test` -> OK
- Esiti reali:
  - build frontend OK
  - test frontend OK, 17 file di test passed, 96 test passed
- QA manuale browser:
  - non eseguita in questa sessione CLI; consigliata verifica visiva su `/login`, shell autenticata, sidebar, header e `/master-data`
- Regressioni trovate:
  - nessuna regressione automatica rilevata
- Limiti/note:
  - in questa fase non è stato introdotto self-hosting dei file font Manrope; la foundation prepara solo lo stack applicativo e il punto finale di override;
  - alcuni plugin vendor, ad esempio `pickr`, mantengono stack tipografici locali hardcoded e non sono stati modificati per evitare scope creep.
- Stato finale: PASS

### TASK-048.15 - Shared form controls and form patterns foundation (phase 2)

- Data: 2026-05-10
- Branch: `task-048-15-shared-form-controls-phase-2`
- Task: TASK-048.15 - Shared form controls and form patterns foundation - phase 2
- Agente/Modello usato: GPT-5.5 Thinking
- Area verificata: `master-data-form`, `app-checkbox`, `app-input`, `TASKS.md`, `ROADMAP.md`, `docs/design/DESIGN-SYSTEM.md`, `docs/qa/QA-REPORTS.md`
- AttivitÃ  eseguite:
  - analisi componenti form già presenti (`master-data-form`, `master-data-admin`, `login`, checkbox precedente);
  - confronto con codice allegato `code.html` come riferimento visivo non copiante;
  - implementato `app-input` shared con CVA, help/error/required, id/accessibilità, focus;
  - integrazione `app-input` nella modal CRUD Master Data per campi non booleani;
  - valutazione `app-select` formalizzata e rimandata a task dedicato per rischio di scope creep nella fase attuale.
- Test eseguiti in questa fase:
  - `cd frontend && npm.cmd run build`
  - `cd frontend && npm.cmd test`
- QA manuale browser:
  - consigliata esecuzione: verifica label/placeholder/error/disabled/focus su campi convertiti, checkbox già presente e comportamenti modale save/cancel/close.
- Regressioni trovate:
  - stato verificato in questa esecuzione; risultato riportato dopo i comandi frontend.
- Limiti/note:
  - `app-select` non Ã¨ stato implementato in questa fase per mantenere un rollout incrementale e sicuro;
  - non sono stati introdotti nuovi testi hardcoded nei template.
- Stato finale: PASS

### TASK-048.15 - Shared form controls and form patterns foundation

- Data: 2026-05-10
- Branch: `main`
- Task: TASK-048.15 - Shared form controls and form patterns foundation
- Agente/Modello usato: GPT-5.5 Thinking
- Area verificata: `master-data-form`, `app-checkbox`, `TASKS.md`, `ROADMAP.md`, `docs/design/DESIGN-SYSTEM.md`, inventario form su login/master-data
- Analisi e implementazione:
  - censimento controlli form reali in uso (`master-data-form`, `master-data-admin`, `login`, `select` list/filters, checkbox custom);
  - confronto pattern con `DataTableComponent` + shared component policy;
  - identificazione `app-checkbox` come primo controllo shared utile e safe;
  - integrazione `app-checkbox` nel form CRUD Master Data con `ControlValueAccessor`.
- Test e verifica:
  - `cd frontend && npm.cmd run build` -> OK
  - `cd frontend && npm.cmd test` -> OK
- QA manuale browser:
  - eseguita/non eseguita: non eseguita in questa sessione CLI (ambiente non interattivo), consigliata verifica visiva di stato checked/unchecked, focus e annullamento/salvataggio.
- Regressioni trovate:
  - nessuna regressione automatica rilevata nel test suite.
- Limiti/note:
  - non sono stati introdotti i componenti future (`textarea`, `radio`, `select`, `date`, `number`, `search`) in mancanza di casi reali aggiuntivi nel task.
- Stato finale: PASS

### TASK-048.12 - CRUD modal and form visual refinement

- Data: 2026-05-09
- Branch: `task-048-12-crud-modal-form-visual-refinement`
- Task: TASK-048.12 - CRUD modal and form visual refinement
- Agente/Modello usato: GPT-5.5
- Area verificata: `master-data-form.component.html/.scss/.spec.ts` nella CRUD modal Master Data, con focus su header/footer actions, spacing form e resa checkbox `Attivo`, senza modifiche a logica CRUD, backend o routing
- Refinement visuali confermati: rimosso `Chiudi` duplicato dal footer, mantenuta la chiusura nell'header, footer azioni separato visivamente dal body e allineato a destra, ordine coerente `Annulla`/`Salva`, spacing campi piu puliti e checkbox `Attivo` resa piu coerente con il design system tramite stile locale accessibile
- Comandi eseguiti: `cd frontend && npm.cmd run build` -> OK; `cd frontend && npm.cmd test` -> OK
- Esiti reali: build frontend OK; test frontend OK, 15 file di test passed, 84 test passed
- Regressioni trovate: nessuna regressione automatica rilevata; aggiunto test sul fatto che `Chiudi` resti solo nell'header e non nel footer operativo
- QA manuale browser eseguita/non eseguita: non eseguita in questa sessione CLI
- Limiti/note: resta consigliata validazione manuale su create/edit/view modal in browser per confermare bilanciamento visivo, checkbox focus state e assenza di regressioni su annullamento/salvataggio/chiusura
- Stato finale: PASS WITH NOTES

### TASK-048.11 - Sidebar visual alignment to TEMPLATE-08

- Data: 2026-05-09
- Branch: `task-048-11-sidebar-visual-alignment`
- Task: TASK-048.11 - Sidebar visual alignment to TEMPLATE-08
- Agente/Modello usato: GPT-5.5 Thinking
- Area verificata: `app-sidebar` e shell/sidebar esistente, resa visuale rispetto a TEMPLATE-08, preservazione di routing, i18n, ricerca menu, collapse desktop e active state
- Refinement visuali confermati: submenu tree piu leggibile, active state meno aggressivo e non aderente al bordo destro, densita piu compatta in chiave enterprise, marker alleggeriti, search box piu compatta e centrata verticalmente nella propria sezione, scrollbar dark integrata, rimozione overflow orizzontale e scroll verticale interno sidebar
- Comandi eseguiti: `cd frontend && npm.cmd run build` -> OK; `cd frontend && npm.cmd test` -> OK
- Esiti reali: build frontend OK; test frontend OK, 15 file di test passed, 83 test passed
- Regressioni trovate: nessuna regressione automatica rilevata; aggiunto test sulla route attiva evidenziata
- QA manuale browser eseguita/non eseguita: non eseguita in questa sessione CLI
- Limiti/note: il toggle mobile dell'header non e stato esteso in questo task e resta fuori scope; la resa scroll/overflow e stata verificata solo tramite review statica e non con browser interattivo, quindi resta consigliata validazione manuale della sidebar su viewport desktop/mobile
- Stato finale: PASS WITH NOTES

### TASK-048.8 - Login visual alignment review

- Data: 2026-05-09
- Branch: `task-048-5-modal-footer-actions-refinement`
- Task: TASK-048.8 - Login visual alignment review
- Agente/Modello usato: GPT-5 Codex
- Area verificata: `/login` (`login.component.html/.scss`), i18n `it/fr/en`, riuso `app-email-field` e `app-password-field`, coerenza TEMPLATE-06 senza modifiche funzionali; seconda iterazione su layout/card/brand/language selector/CTA/responsive e final refinement su forgot-password/footer legale
- Stati visuali verificati: idle (layout/gerarchia card), loading (CTA disabled + label submitting + `aria-busy`), error (toast credenziali errate invariato), disabled CTA, selettore lingua `it/fr/en` senza icona decorativa, link visuale password dimenticata sotto il campo password, footer legale responsive, decorazione bassa resa piu discreta
- Comandi eseguiti: `cd frontend && npm.cmd run build` -> OK; `cd frontend && npm.cmd test` -> OK
- Esiti reali: build frontend OK; test frontend OK, 15 file di test passed, 82 test passed
- QA manuale browser eseguita/non eseguita: non eseguita in questo passaggio (ambiente CLI senza sessione browser interattiva)
- Regressioni trovate: nessuna regressione automatica rilevata
- Limiti/note: validazione manuale live su `/login` (desktop/mobile, credenziali errate, cambio lingua, login reale) resta raccomandata in sessione browser dedicata
- Stato finale: PASS WITH NOTES

### TASK-048.5 - Modal/footer actions refinement follow-up

- Data: 2026-05-09
- Branch: `task-048-5-modal-footer-actions-refinement`
- Task: TASK-048.5 - Modal/footer actions refinement
- Agente/Modello usato: GPT-5.3 Codex
- Area verificata: footer CRUD modal e confirmation dialog `/master-data`, confronto con mockup HTML validato, `app-button` sopra `kt-btn`, spacing/allineamento/ordine azioni, documentazione `TASKS.md`, `ROADMAP.md`, `docs/design/DESIGN-SYSTEM.md`
- Comandi eseguiti: `cd frontend && npm.cmd run build` -> OK; `cd frontend && npm.cmd test` -> OK
- Esiti reali: build frontend OK; test frontend OK, 15 file di test passed, 85 test passed
- QA manuale browser eseguita/non eseguita: non eseguita in questo passaggio
- Regressioni trovate: nessuna regressione rilevata dai test automatici
- Limiti/note: `Codex-Prompt-Governancev2.txt` non e stato localizzato nei percorsi disponibili; applicate le regole operative gia presenti nel prompt e nei documenti di governance letti. Nessuna modifica backend/API/security e nessuna nuova libreria.
- Stato finale: PASS WITH NOTES

### TASK-048.4 - Data list and Generic DataTable refinement

- Data: 2026-05-08
- Branch: `task-048-3-reframe-ui-template-subtasks`
- Task: TASK-048.4 - Data list and Generic DataTable refinement
- Agente/Modello usato: GPT-5.5 Thinking (sviluppo e verifica tecnica)
- Area verificata: pagina `/master-data`, `DataTableComponent` shared, stati tabella, paginazione, azioni riga, filtro/ricerca, i18n `it/fr/en`, aggiornamenti documentali `TASKS.md` e `ROADMAP.md`
- Template applicati: TEMPLATE-01 Data list page, TEMPLATE-03 Table states, TEMPLATE-10 Generic DataTable
- Comandi eseguiti: `cd frontend && npm.cmd run build` -> OK; `cd frontend && npm.cmd test` -> OK
- Esiti reali: build frontend OK; test frontend OK, 11 file di test passed, 55 test passed
- QA manuale browser eseguita/non eseguita: non eseguita in questo passaggio
- Regressioni trovate: nessuna regressione rilevata dai test automatici
- Limiti/note: nessuna modifica backend/API/security/auth; validazione manuale `/master-data` ancora consigliata per rendering, responsive base e stati simulabili
- Stato finale: PASS

### TASK-041 - UI Master Data Admin

- Data: 2026-05-06
- Task: TASK-041 - UI Master Data Admin
- Agente/Modello usato: QA separato, revisione assistita AI
- Area verificata: route protetta `/master-data`, sidebar `Governance > Dati di base`, i18n `it/fr/en`, UI read-only master data, documentazione `TASKS.md` e `ROADMAP.md`
- Comandi eseguiti: `npm.cmd run build`, `npm.cmd test`, `git status --short --branch`
- Esito: PASS WITH NOTES
- Regressioni trovate: nessuna regressione funzionale confermata; controllo manuale UI eseguito successivamente con esito positivo
- Fix richiesti: cleanup della subscription in `MasterDataAdminComponent`, applicato con patch post-QA; test aggiuntivo su destroy/subscription aggiunto
- Stato finale: build e test verdi, 24 test passed, scope read-only rispettato, nessuna modifica backend/auth/dipendenze rilevata

## Full-stack / integration QA reports

### TASK-053.8 - Tenant user lifecycle foundation

- Data: 2026-05-11
- Branch: `task-053-8-tenant-user-lifecycle-foundation`
- Task: TASK-053.8 - Tenant user lifecycle foundation
- Area verificata: backend `/api/admin/users/{userId}/activate|deactivate|lock|unlock`, backend auth `/api/auth/login`, `UserAdministrationService`, `AuthService`, dettaglio Angular `/admin/users/:id`, login Angular `/login`, i18n `it/fr/en`, test backend/frontend e rispetto del limite su `tenant access`.
- Attivita eseguite:
  - aggiunti endpoint amministrativi idempotenti per attivazione/disattivazione e blocco/sblocco utente;
  - mantenuto il perimetro limitato ai flag `UserAccount.active` e `UserAccount.locked`, senza migration e senza policy aggiuntive di unlock;
  - esteso il login backend con codici errore stabili `AUTH_ACCOUNT_INACTIVE` e `AUTH_ACCOUNT_LOCKED`, emessi solo dopo lookup email valido e match corretto della password;
  - mantenuto messaggio/codice generico per email inesistente, password errata e account inactive/locked con password errata, evitando disclosure sull esistenza dell email;
  - aggiornato il login Angular per mostrare i messaggi i18n `Account disattivato` e `Account bloccato`, lasciando invariato il messaggio generico per credenziali errate;
  - aggiunta sezione lifecycle nella card Sicurezza del dettaglio utente, con CTA chiare, conferma solo per `disattiva`/`blocca` e feedback tramite `NotificationService`;
  - verificato il contratto corrente: `UserAdministrationUserDetailResponse` espone `tenantAccesses`, ma non distingue in modo sicuro accesso primario implicito via `UserAccount.tenant` da accesso bridge `UserTenantAccess`;
  - revoca `tenant access` non implementata e documentata come limite del modello/DTO corrente;
  - nessun audit applicativo nuovo introdotto, per assenza di un pattern service amministrativo consolidato sopra `AuditLog`.
- Comandi eseguiti:
  - `cd backend && .\mvnw.cmd "-Dtest=AuthControllerTests,UserAdministrationControllerTests" test`
  - `cd frontend && npm.cmd test -- --include src/app/features/login/login.component.spec.ts`
  - `cd frontend && npm.cmd test -- --include src/app/features/user-administration/user-administration.service.spec.ts --include src/app/features/user-administration/user-administration.component.spec.ts --include src/app/features/user-administration/user-administration-detail.component.spec.ts`
  - `cd backend && .\mvnw.cmd test`
  - `cd frontend && npm.cmd run build`
  - `cd frontend && npm.cmd test`
- Esiti reali:
  - test backend mirato OK, 43 test passed, 0 failure, 0 error;
  - test frontend login mirato OK, 1 file passed, 6 test passed;
  - test frontend mirati OK, 3 file passed, 30 test passed;
  - suite backend completa OK, 161 test passed, 0 failure, 0 error, 0 skipped;
  - build frontend OK;
  - suite frontend completa OK, 27 file passed, 171 test passed.
- Regressioni trovate: nessuna nei test automatici eseguiti.
- Limiti/note:
  - revoca `tenant access` rinviata: il contratto corrente non espone un discriminante affidabile tra accesso primario e accesso bridge;
  - nessun audit applicativo nuovo per lifecycle utente: esistono entity/repository `AuditLog`, ma non un helper/service amministrativo riusabile gia validato;
  - i test backend continuano a mostrare warning noti Mockito/ByteBuddy su JDK 21 e output SQL molto verbosi, non bloccanti;
  - il comando Maven mirato con `-Dtest=AuthControllerTests,UserAdministrationControllerTests` chiude con `BUILD SUCCESS`, ma il terminale Windows stampa in coda un rumore non bloccante (`'D' ... non reconnu`) dovuto al quoting del comando invocato via PowerShell; i report Surefire confermano comunque l esito verde.
- Stato finale: PASS WITH NOTES

### TASK-053.7 - Tenant user create/edit foundation

- Data: 2026-05-11
- Branch: `task-053-7-tenant-user-create-edit-foundation`
- Task: TASK-053.7 - Tenant user create/edit foundation
- Area verificata: backend `/api/admin/users` form-options/create/update, DTO request/response, service tenant-aware, UI Angular lista/dettaglio/form create-edit, routing, i18n `it/fr/en`, test backend/frontend.
- Attivita eseguite:
  - aggiunti DTO backend per create/update e form-options, incluse company profile option con `tenantId`;
  - introdotti endpoint `GET /api/admin/users/form-options`, `POST /api/admin/users`, `PUT /api/admin/users/{userId}`;
  - implementata create con email normalizzata, controllo duplicati case-insensitive, `PASSWORD_ONLY`, password iniziale validata da `PasswordPolicy`, `primaryTenant` uguale al tenant iniziale, `active=true`, `locked=false` e `UserTenantAccess` automatico;
  - implementato update limitato a email e company profile opzionale/azzerabile;
  - aggiunte route `/admin/users/new` e `/admin/users/:id/edit`, CTA `Nuovo utente`/`Modifica`, form feature locale standalone con card e riuso di `app-button`, `app-input`, `app-checkbox`, `app-email-field` e `app-password-field`;
  - mantenuti fuori dal form ruoli, reset password in modifica, lifecycle `active/locked`, employee link editabile, preferred language e timezone.
- Comandi eseguiti:
  - `cd backend && .\mvnw.cmd "-Dtest=UserAdministrationControllerTests" test`
  - `cd frontend && npm.cmd test -- --include src/app/features/user-administration/user-administration.service.spec.ts --include src/app/features/user-administration/user-administration.component.spec.ts --include src/app/features/user-administration/user-administration-detail.component.spec.ts --include src/app/features/user-administration/user-administration-form.component.spec.ts`
  - `cd backend && .\mvnw.cmd test`
  - `cd frontend && npm.cmd run build`
  - `cd frontend && npm.cmd test`
- Esiti reali:
  - test backend mirato OK, 25 test passed, 0 failure, 0 error;
  - test frontend mirati OK, 4 file passed, 32 test passed;
  - suite backend completa OK, `BUILD SUCCESS`;
  - build frontend OK;
  - suite frontend completa OK, 27 file passed, 159 test passed.
- Regressioni trovate: nessuna nei test automatici eseguiti.
- Limiti/note:
  - accessRole di `UserTenantAccess` resta un default foundation derivato da `userType.code`, non un ruolo RBAC applicativo;
  - non sono state introdotte migration o enforcement RBAC completo;
  - i test backend continuano a stampare warning noti Mockito/ByteBuddy su JDK 21 e log SQL molto verbosi, non bloccanti.
- Stato finale: PASS WITH NOTES

### TASK-053.3 - API contract, UI polish and Security menu structure

- Data: 2026-05-10
- Branch: `main`
- Task: TASK-053.3 - Tenant custom role CRUD foundation
- Agente/Modello usato: GPT-5.5 Thinking
- Area verificata: backend `/api/admin/roles`, write-path legacy `/api/master-data/governance-security/roles`, frontend `/admin/roles`, sidebar `Governance > Sicurezza > Ruoli|Permessi`, i18n `it/fr/en`, shared `DataTableComponent`
- Bug rilevato:
  - durante QA manuale precedente la creazione ruolo restituiva `POST /api/admin/roles -> 405 Method Not Allowed`
- Causa individuata:
  - nel sorgente attuale backend e frontend risultano gia allineati su `/api/admin/roles`;
  - `RoleAdministrationController` espone realmente `@PostMapping` su `/api/admin/roles`;
  - il `405` non era dovuto a un mismatch di path nel repository ma a un backend runtime non allineato al codice corrente / istanza stale durante il test manuale precedente.
- Fix applicati:
  - rafforzata la copertura backend OpenAPI per verificare esplicitamente `GET` e `POST` su `/api/admin/roles` e `GET`/`PUT` su `/api/admin/roles/{roleId}`;
  - confermato e mantenuto il blocco dei bypass write legacy su `/api/master-data/governance-security/roles`;
  - corretta la pagina Angular ruoli per passare la signal `columns()` al `DataTableComponent`;
  - rifinite le traduzioni `it/fr/en` per `Sicurezza`, `Ruoli`, `Permessi`, `Sistema`, `Rôles`, `Sécurité`, `Mis à jour`, `Données de base`, `Nouveau rôle`;
  - accorciato il messaggio informativo sui ruoli `systemRole`;
  - uniformato il placeholder celle vuote a `—`;
  - stabilizzato un test backend preesistente e nondeterministico sull'ordinamento default dei ruoli in Master Data governance/security.
- Sidebar/menu:
  - verificata la struttura corretta nel sorgente: `Governance > Sicurezza > Ruoli` e `Governance > Sicurezza > Permessi` come voci paritetiche;
  - nessuna nuova area UI introdotta.
- Comandi eseguiti:
  - `cd backend && .\mvnw.cmd test`
  - `cd frontend && npm.cmd run build`
  - `cd frontend && npm.cmd test`
- Esiti reali:
  - backend test OK, `BUILD SUCCESS`, 128 test passed, 0 failure, 0 error;
  - frontend build OK;
  - frontend test OK, 22 file di test passed, 117 test passed.
- Note backend:
  - durante la suite completa restano presenti log/warning molto verbosi su `global_zip_codes` e warning Mockito/JDK; non hanno causato `BUILD FAILURE`.
- QA manuale browser:
  - non eseguita in questa sessione CLI;
  - non erano disponibili nel thread corrente credenziali QA riusabili per una verifica autenticata end-to-end;
  - resta raccomandata una verifica manuale su sidebar, apertura `/admin/roles`, create/update/activate/deactivate/delete ruolo custom e read-only della matrice permessi su `systemRole`.
- Stato finale: PASS WITH NOTES

### TASK-053.3 - QA CRUD ruoli e verifica sidebar Sicurezza

- Data: 2026-05-10
- Branch: `main`
- Task: TASK-053.3 - Tenant custom role CRUD foundation
- Agente/Modello usato: GPT-5.3 Codex
- Ambito QA:
  - contratto API backend/frontend per CRUD ruoli tenant custom;
  - protezione `system_role`;
  - route `/admin/roles` e `/admin/permissions`;
  - sidebar `Governance > Sicurezza > Ruoli|Permessi`;
  - riuso pattern shared `DataTableComponent`, `MasterDataFormComponent`, `app-button`, `app-input`, `app-checkbox`;
  - regressioni evidenti su TASK-053.2 matrice ruolo/permessi.
- File analizzati:
  - `backend/src/main/java/com/odsoftware/hrm/controller/RoleAdministrationController.java`
  - `backend/src/main/java/com/odsoftware/hrm/service/RoleAdministrationService.java`
  - `backend/src/main/java/com/odsoftware/hrm/service/MasterDataGovernanceSecurityService.java`
  - `backend/src/test/java/com/odsoftware/hrm/RoleAdministrationControllerTests.java`
  - `backend/src/test/java/com/odsoftware/hrm/MasterDataGovernanceSecurityControllerTests.java`
  - `frontend/src/app/features/role-administration/role-administration.service.ts`
  - `frontend/src/app/features/role-administration/role-administration.component.ts`
  - `frontend/src/app/features/role-permissions/role-permission-matrix.component.ts`
  - `frontend/src/app/layout/sidebar/app-sidebar.component.ts`
  - `frontend/src/app/app.routes.ts`
  - `frontend/src/app/shared/components/data-table/data-table.component.ts`
  - `frontend/src/app/features/master-data/master-data-form.component.ts`
  - `frontend/src/app/core/i18n/i18n.messages.ts`
- Verifiche tecniche eseguite:
  - confermato `@PostMapping` su `/api/admin/roles` e allineamento del service Angular sullo stesso path;
  - verificati endpoint lista, dettaglio, create, update, activate, deactivate, delete e role-permissions;
  - verificati test backend per duplicate code, tenant mancante, delete con assegnazioni utente e blocco `system_role`;
  - verificato che i write path legacy `/api/master-data/governance-security/roles` siano chiusi con errore esplicito;
  - verificato che la pagina Ruoli riusi shared table/form/button/input/checkbox e che le azioni su `systemRole=true` siano nascoste lato UI;
  - verificato che la matrice permessi sia read-only per `systemRole=true`;
  - verificata la sidebar con `Ruoli` e `Permessi` come voci paritetiche sotto `Sicurezza`, non annidate tra loro;
  - verificato placeholder coerente per celle vuote e presenza i18n `it/fr/en`.
- Comandi eseguiti:
  - `cd backend && .\mvnw.cmd test`
  - `cd frontend && npm.cmd run build`
  - `cd frontend && npm.cmd test`
- Esiti reali:
  - backend test OK, `BUILD SUCCESS`, 128 test eseguiti, 0 failure, 0 error, 0 skipped;
  - frontend build OK;
  - frontend test OK, 22 file di test passed, 117 test passed.
- Esito CRUD ruoli:
  - PASS su base code review + test automatici;
  - create/update/activate/deactivate/delete custom risultano coperti e allineati al contratto `/api/admin/roles`;
  - nessuna evidenza di mismatch `POST /api/admin/roles` vs backend.
- Esito protezione `system_role`:
  - PASS;
  - backend blocca update/activate/deactivate/delete/update permissions con messaggio chiaro `System roles cannot be modified through tenant role administration`;
  - frontend nasconde le azioni non consentite e la matrice permessi resta in sola lettura.
- Esito sidebar Ruoli/Permessi:
  - PASS;
  - struttura verificata nel codice: `Governance > Sicurezza > Ruoli` e `Governance > Sicurezza > Permessi` allo stesso livello;
  - nessuna evidenza che `Permessi` sia figlio di `Ruoli`.
- Conferma fix 405:
  - dal codice e dai test risulta confermato il contratto corretto `POST /api/admin/roles`;
  - nessuna evidenza di `405 Method Not Allowed` nello stato corrente del repository.
- Bug trovati:
  - nessun bug bloccante trovato in questo pass QA.
- Regressioni:
  - nessuna regressione automatica rilevata su TASK-053.2/TASK-053.3.
- Limiti noti:
  - QA manuale browser autenticata non eseguita in questa sessione CLI;
  - non erano disponibili nel thread corrente credenziali QA utilizzabili e non era presente un browser interattivo per validare end-to-end create/edit/delete dal vivo;
  - la suite backend continua a produrre log/warning molto verbosi su `global_zip_codes` e warning Mockito/JDK, senza causare failure.
- Stato finale: PASS WITH NOTES

### TASK-043 - Master Data API/UI pagination and generic filters

- Data: 2026-05-06
- Branch: `task-043-master-data-pagination-filters`
- Scope QA: review tecnica/regressiva cross-stack su API paginate Master Data, filtro generico, UI `/master-data`, i18n `it/fr/en`, test backend/frontend e rispetto del fuori scope
- Test backend eseguiti con esito reale: `cd backend && $env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot'; .\mvnw.cmd test` -> BUILD SUCCESS, 95 test, 0 failure, 0 errori
- Test frontend eseguiti con esito reale: `cd frontend && npm.cmd run build` -> OK; `cd frontend && npm.cmd test` -> OK, 9 file di test passed, 27 test passed
- QA manuale browser eseguito/non eseguito: eseguito manualmente con successo su `/master-data` (apertura pagina, categoria Global, entita Paesi/Countries, filtro testuale, paginazione precedente/successivo, refresh, cambio entita e ritorno su Paesi)
- Problemi trovati: nessun blocker confermato; osservazioni minori su copertura test non esplicita per `page` negativo e `search` solo spazi, anche se la normalizzazione Ã¨ presente in `MasterDataQuerySupport`
- Esito finale: PASS CON OSSERVAZIONI


---

Nota operativa:

- Le sezioni devono contenere solo report riferiti a task reali.
- Mantenere ogni report sintetico ma verificabile.


### TASK-046.1 - Master Data CRUD action foundation

- Data: 2026-05-07
- Branch: `task-046-1-master-data-crud-analysis-config`
- Task: TASK-046.1 - Master Data CRUD action foundation
- Agente/Modello usato: GPT-5 Codex (QA tecnica regressiva)
- Area verificata: componente shared `DataTableComponent`, integrazione container `/master-data`, i18n `it/fr/en`, aggiornamenti documentali `TASKS.md` e `ROADMAP.md`
- Comandi eseguiti: `git diff --stat`, `git diff -- frontend/src/app/shared/components/data-table`, `git diff -- frontend/src/app/features/master-data`, `npm.cmd run build`, `npm.cmd test`, `git status --short --branch`
- Esito: PASS CON OSSERVAZIONI
- Regressioni trovate: nessuna regressione bloccante; nessuna mutazione CRUD reale introdotta
- Osservazioni: `DataTableComponent` resta generico come contratto, ma usa chiavi i18n `masterData.*` (accoppiamento semantico leggero, non bloccante in TASK-046.1)
- Fix richiesti: nessun fix obbligatorio per chiusura TASK-046.1; eventuale disaccoppiamento i18n da pianificare in task dedicato
- Stato finale: build frontend OK, test frontend OK (10 file, 37 test passed), scope frontend-only rispettato, nessuna modifica backend

### TASK-046.2 - Master Data CRUD form foundation

- Data: 2026-05-07
- Branch: `task-046-2-master-data-crud-form-foundation`
- Task: TASK-046.2 - Master Data CRUD form foundation
- Agente/Modello usato: GPT-5 Codex (verifica tecnica)
- Area verificata: form foundation frontend Master Data (`create/edit/view`) e test Angular associati
- Comandi eseguiti: `cd frontend && npm.cmd run build`, `cd frontend && npm.cmd test`
- Esito: FAIL
- Regressioni trovate: test unitari KO su `MasterDataFormComponent` (3 test falliti)
- Dettaglio errore principale: `Cannot find control with unspecified name attribute` in `master-data-form.component.spec.ts`
- Fix richiesti: correggere binding dei controlli nel template/form setup del componente, poi rieseguire `npm.cmd test`
- QA manuale browser eseguito/non eseguito: non eseguito manualmente in questo passaggio
- Stato finale: build frontend OK; test frontend KO (1 file test fallito, 3 test falliti)
- Verifica successiva post-fix (2026-05-07): `cd frontend && npm.cmd run build` -> OK; `cd frontend && npm.cmd test` -> OK (11 file test passed, 41 test passed)
- Nota fix applicato: inizializzazione form in `ngOnInit`, normalizzazione chiavi campo e binding template con `formControlName` su campi validi
- Esito aggiornato dopo fix: PASS
- Miglioria UX post-QA (2026-05-07): apertura form Master Data aggiornata da sezione inline a modal/popup con overlay sopra la pagina, mantenendo invariata la logica funzionale (`create/edit/view`, filtri/paginazione/tabella)
- Verifica post-miglioria UX: `cd frontend && npm.cmd run build` -> OK; `cd frontend && npm.cmd test` -> OK (11 file test passed, 41 test passed)

### TASK-046.3 - Master Data CRUD API integration foundation

- Data: 2026-05-07
- Branch: `task-046-2-master-data-crud-form-foundation`
- Task: TASK-046.3 - Master Data CRUD API integration foundation
- Agente/Modello usato: GPT-5 Codex (sviluppo e verifica tecnica)
- Area verificata: integrazione frontend reale `create` / `update` su `/master-data` per entita HR/business semplici (`Department`, `JobTitle`, `ContractType`, `WorkMode`), feedback modal, refresh lista e i18n `it/fr/en`
- Comandi eseguiti: `cd frontend && npm.cmd run build`, `cd frontend && npm.cmd test`
- Esito: PASS
- Regressioni trovate: nessuna regressione automatica rilevata; filtri, paginazione, tabella shared e view read-only preservati
- Fix richiesti: nessuno in questo passaggio
- QA manuale browser eseguito/non eseguito: non eseguito manualmente in questo passaggio
- Stato finale: build frontend OK; test frontend OK (11 file test passed, 46 test passed); nessuna modifica backend eseguita

### TASK-046.3 - Second QA pass / regression review

- Data: 2026-05-07
- Branch: `task-046-3-master-data-crud-api-integration`
- Task: TASK-046.3 - Master Data CRUD API integration foundation
- Tipo verifica: seconda verifica indipendente regressiva
- Agente/Modello usato: GPT-5 Codex (QA pass 2)
- Area verificata: integrazione create/update reale su `/master-data`, entita candidate vs non candidate, assenza mutazioni delete, riuso form metadata-driven, i18n `it/fr/en`, coerenza `TASKS.md`/`ROADMAP.md`, assenza modifiche backend
- Comandi eseguiti: `git status --short --branch`, `git diff --stat`, `npm.cmd run build`, `npm.cmd test`
- Esito: PASS con osservazioni
- Regressioni trovate: nessuna regressione bloccante rilevata nei test automatici; create/update restano limitati alle entita candidate (`Department`, `JobTitle`, `ContractType`, `WorkMode`); entita non candidate restano senza azioni CRUD
- Osservazioni: la action `delete` e visibile sulle entita candidate (foundation introdotta in TASK-046.1) ma non e ancora integrata a mutazioni backend in TASK-046.3; allineato con roadmap che delega delete/disattivazione a TASK-046.4
- Differenze rispetto al primo report TASK-046.3: il primo report segnava `PASS`; questo secondo pass conferma il `PASS` e aggiunge esplicitazione del comportamento `delete` demandato a TASK-046.4
- Fix richiesti: nessun fix bloccante richiesto in questo pass
- Backend test eseguiti/non eseguiti: non eseguiti, perche non risultano file backend modificati nel working tree
- QA manuale browser eseguita/non eseguita: non eseguita in questo pass
- Stato finale: build frontend OK; test frontend OK (11 file test passed, 46 test passed); scope TASK-046.3 confermato

### TASK-046.4 - Master Data CRUD delete, confirmation and error handling foundation

- Data: 2026-05-07
- Branch: `task-046-4-master-data-delete-deactivation`
- Task: TASK-046.4 - Master Data CRUD delete, confirmation and error handling foundation
- Agente/Modello usato: GPT-5 Codex (sviluppo e verifica tecnica)
- Area verificata: disattivazione logica backend+frontend su `/master-data` per entita HR/business candidate, conferma esplicita, feedback successo/errore, refresh lista, i18n `it/fr/en`, mantenimento filtro/paginazione/tabella shared
- Comandi eseguiti: `cd backend && .\mvnw.cmd test`, `cd frontend && npm.cmd run build`, `cd frontend && npm.cmd test`, `git status --short --branch`
- Esito: PASS
- Regressioni trovate: nessuna regressione automatica rilevata; `create` / `edit` / `view`, filtro, paginazione e DataTable shared preservati
- Fix richiesti: nessuno in questo passaggio
- Backend test eseguiti/non eseguiti: eseguiti (`mvnw.cmd test`), esito verde (100 test, 0 failure, 0 errori)
- QA manuale browser eseguita/non eseguita: non eseguita in questo passaggio
- Limiti noti: la lista continua a mostrare anche record inattivi perche le API attuali non filtrano `active=true`; filtro `Attivi` / `Inattivi`, azione `Riattiva` e gestione permessi runtime RBAC restano fuori scope in TASK-046.4

### TASK-048.6 - Buttons and toast feedback refinement

- Data: 2026-05-09
- Branch: `task-048-4-data-list-datatable-refinement`
- Task: TASK-048.6 - Buttons and toast feedback refinement
- Agente/Modello usato: GPT-5 Codex
- Area verificata: pulsanti globali `kt-btn`, feedback toast `AlertMessageComponent`, i18n `it/fr/en`, integrazione Master Data, riuso Metronic/Keenicons, assenza modifiche backend/API
- Template applicati: TEMPLATE-07 Toast notifications; TEMPLATE-11 Buttons
- Comandi eseguiti: `cd frontend && npm.cmd run build`; `cd frontend && npm.cmd test`
- Esito build frontend: OK
- Esito test frontend: OK, 12 file di test passed, 60 test passed
- Regressioni trovate: nessuna regressione automatica rilevata
- Fix richiesti: nessuno in questo passaggio
- QA manuale browser eseguita/non eseguita: non eseguita in questo passaggio
- Limiti/note: validazione visuale manuale consigliata su `/master-data` per confermare resa finale di toast, pulsanti e responsive; nessuna nuova libreria UI introdotta
- Stato finale: PASS

### TASK-048.6 - Buttons and toast feedback refinement (shared toast pattern fix)

- Data: 2026-05-09
- Branch: `task-048-4-data-list-datatable-refinement`
- Task: TASK-048.6 - Buttons and toast feedback refinement
- Agente/Modello usato: Codex
- Area verificata: `NotificationService`, `NotificationHostComponent`, integrazione login/master-data con toast via `NotificationService`, coerenza `TEMPLATE-07` e `TEMPLATE-11`
- Comandi eseguiti: `cd frontend && npm.cmd run build`
- Esito build frontend: OK
- Regressioni trovate: nessuna dopo correzione `NotificationHostComponent` (`@for track` e type binding `titleKey`);
- Fix richiesti: nessuno dopo la correzione applicata nel prompt corrente.
- QA manuale browser eseguita/non eseguita: non eseguita in questo passaggio
- Stato finale: PASS

### TASK-048.7 - Shared list buttons pattern foundation

- Data: 2026-05-09
- Branch: `task-048-7-shared-button-list-pages`
- Task: TASK-048.7 - Shared list buttons pattern foundation
- Agente/Modello usato: GPT-5.5 Thinking
- Area verificata: toolbar/pagine lista `/master-data`, `DataTableComponent` actions e `master-data-form`, varianti `kt-btn` globali e documentazione Task/Roadmap
- Template applicato: TEMPLATE-11 Buttons
- Comandi eseguiti: `cd frontend && npm.cmd run build`; `cd frontend && npm.cmd test`
- Esito build frontend: OK
- Esito test frontend: OK (valutazione suite corrente)
- Regressioni trovate: nessuna regressione bloccante rilevata; riduzione duplicazioni classi locali su pulsanti lista
- QA manuale browser eseguita/non eseguita: non eseguita in questo passaggio
- Limiti/note: manual test su `/master-data` consigliato (toolbar, azioni inline, paginazione) per conferma resa responsive/aria
- Stato finale: PASS

### TASK-048.7 - Shared Button Angular component patch

- Data: 2026-05-09
- Branch: `task-048-7-shared-button-list-pages`
- Task: TASK-048.7 - Shared list buttons pattern foundation
- Agente/Modello usato: GPT-5.5 Thinking
- Area verificata: nuovo wrapper Angular shared `app-button`, integrazione su `master-data-admin`, `master-data-form` e porzioni sicure di `DataTableComponent`
- Template applicato: TEMPLATE-11 Buttons
- Comandi eseguiti: `cd frontend && npm.cmd run build`; `cd frontend && npm.cmd test`
- Esito build frontend: OK
- Esito test frontend: OK
- Regressioni trovate: nessuna regressione bloccante automatica; il design system CSS `kt-btn` resta la base ufficiale
- QA manuale browser eseguita/non eseguita: non eseguita in questo passaggio
- Limiti/note: `DataTableComponent` non e stato convertito integralmente oltre row actions e paginazione; eventuale estensione futura ad altre feature resta follow-up separato
- Stato finale: PASS

### TASK-048.7 - Shared Button review findings patch

- Data: 2026-05-09
- Branch: `task-048-7-shared-button-list-pages`
- Task: TASK-048.7 - Shared list buttons pattern foundation
- Agente/Modello usato: GPT-5.3 Codex
- Area verificata: contratto accessibile `iconOnly` del wrapper `app-button` e copertura test minima del componente shared
- Comandi eseguiti: `cd frontend && npm.cmd run build`; `cd frontend && npm.cmd test`
- Esito build frontend: OK
- Esito test frontend: OK
- Fix applicati: `iconOnly` ora richiede `ariaLabel` esplicito con errore runtime chiaro su configurazione invalida; aggiunti test per `submit`, `reset`, `disabled`, `outline`, `destructive` e caso invalido `iconOnly` senza `ariaLabel`
- QA manuale browser eseguita/non eseguita: non eseguita in questo passaggio
- Stato finale: PASS

### TASK-048.5 - CRUD modal and action confirmation refinement

- Data: 2026-05-09
- Branch: `task-048-5-modal-footer-actions-refinement`
- Task: TASK-048.5 - CRUD modal and action confirmation refinement
- Agente/Modello usato: GPT-5.3 Codex
- Area verificata: footer azioni modali/dialog `/master-data`, `master-data-form`, confirmation dialog, shared `app-button`, pattern globale `kt-modal-footer`
- Template applicati: TEMPLATE-04 CRUD modal form; TEMPLATE-05 Action confirmation dialogs
- Comandi eseguiti: `cd frontend && npm.cmd run build`; `cd frontend && npm.cmd test`
- Esito build frontend: OK
- Esito test frontend: OK, 15 file di test passed, 84 test passed
- Regressioni trovate: nessuna regressione automatica rilevata
- Fix applicati: footer CRUD separato dal body, ordine `Annulla` -> `Salva` in create/edit, `Chiudi` unico nel footer view, ordine `Annulla` -> azione destructive nei confirmation dialog
- QA manuale browser eseguita/non eseguita: non eseguita in questo passaggio
- Limiti/note: il pattern e applicato solo alle modali/dialog attualmente presenti nel frontend; eventuali future modali fuori `/master-data` dovranno adottare lo stesso footer standard
- Stato finale: PASS

### TASK-048.13 - Header/topbar visual alignment to TEMPLATE-09

- Data: 2026-05-09
- Branch: task-048-13-header-topbar-visual-alignment
- Task: TASK-048.13 - Header/topbar visual alignment to TEMPLATE-09
- Agente/Modello usato: GPT-5.4 / GPT-5.5 (sviluppo + QA)
- Area verificata: `frontend/src/app/layout/header/app-header.component.html/.ts`, template topbar, separazione visuale, menu utente, i18n e resa layout.
- Comandi eseguiti: `cd frontend && npm.cmd run build` -> OK; `cd frontend && npm.cmd test` -> OK
- Esiti reali: build frontend OK; test frontend OK, 15 file di test passed, 84 test passed.
- QA manuale browser: richiesta da task (desktop/mobile/avatar/sidebar/hover): non eseguita in questa sessione (ambiente CLI senza UI interattiva). Verificata solo coerenza statica del codice e logica template.
- Rispetto acceptance:
  - quadratino sinistro non funzionale rimosso ?
  - area centrale non più vuota e contenuta dal titolo pagina corrente ?
  - avatar meno invadente e area user menu più leggera ?
  - separazione header/contenuto tramite `border` e `shadow` leggeri ?
  - responsive desktop/mobile mantenuto (layout con area centrale nascosta su mobile) ?
  - sidebar non modificata ?
- Regressioni rilevate: nessuna regressione automatica rilevata nei test presenti.
- Limiti note: il controllo toggle mobile sidebar non è stato introdotto, coerente con vincoli del task e stato attuale della shell (sidebar desktop/mobile gestita separatamente).
- Stato finale: PASS WITH NOTES



