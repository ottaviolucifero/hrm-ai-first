# QA Reports

Registro ufficiale degli esiti QA.

Questo file raccoglie solo QA eseguiti realmente; non includere report fittizi.

## Backend QA reports

### TASK-047.1 - Master Data physical delete backend foundation

- Data: 2026-05-08
- Branch: `task-047-1-master-data-physical-delete-backend`
- Task: TASK-047.1 - Master Data physical delete backend foundation
- Agente/Modello usato: GPT-5 Codex (QA tecnica finale post-fix)
- Area verificata: controller/service/repository Master Data HR/business, endpoint backend `/physical`, gestione `204` / `404` / `409`, mantenimento soft-delete esistente, check referenziali tenant-aware e test MockMvc/OpenAPI
- Comandi eseguiti: `cd backend && .\mvnw.cmd test`
- QA iniziale:
  - verifiche su endpoint e casi `204`/`404`/`409` confermate;
  - identificata criticità: check referenziali non tenant-aware su codice (`EmployeeRepository`) che poteva produrre falsi positivi cross-tenant.
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

### TASK-043 - Master Data API/UI pagination and generic filters

- Data: 2026-05-06
- Branch: `task-043-master-data-pagination-filters`
- Scope QA: review tecnica/regressiva cross-stack su API paginate Master Data, filtro generico, UI `/master-data`, i18n `it/fr/en`, test backend/frontend e rispetto del fuori scope
- Test backend eseguiti con esito reale: `cd backend && $env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot'; .\mvnw.cmd test` -> BUILD SUCCESS, 95 test, 0 failure, 0 errori
- Test frontend eseguiti con esito reale: `cd frontend && npm.cmd run build` -> OK; `cd frontend && npm.cmd test` -> OK, 9 file di test passed, 27 test passed
- QA manuale browser eseguito/non eseguito: eseguito manualmente con successo su `/master-data` (apertura pagina, categoria Global, entita Paesi/Countries, filtro testuale, paginazione precedente/successivo, refresh, cambio entita e ritorno su Paesi)
- Problemi trovati: nessun blocker confermato; osservazioni minori su copertura test non esplicita per `page` negativo e `search` solo spazi, anche se la normalizzazione è presente in `MasterDataQuerySupport`
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
