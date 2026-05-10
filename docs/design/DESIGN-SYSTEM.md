# HRM AI-first Design System

Versione: 0.9
Ultimo aggiornamento: 2026-05-09
Stato: Draft preparatorio

---

## 1. Obiettivo

Questo documento definisce le regole UI riusabili per la piattaforma HRM AI-first.

Serve a mantenere coerenza tra schermate operative, tabelle, filtri, form, modali, stati UI e pattern di interazione. Non sostituisce `frontend/AGENTS.md`, che resta la fonte operativa principale per le regole frontend; lo integra con linee guida visuali e UX applicabili ai task UI.

Il documento non autorizza redesign massivi, nuove librerie UI o modifiche funzionali automatiche. Ogni applicazione concreta deve restare incrementale, tracciata da task dedicato e coerente con l'architettura Angular esistente.

---

## 2. Scope iniziale

Lo scope generale copre:

- layout pagina;
- card e contenitori;
- toolbar, filtri e azioni principali;
- tabelle dati;
- azioni riga e azioni destructive;
- form create, edit e view;
- modali e pop-up;
- empty, loading, error e success state;
- i18n;
- responsive;
- accessibilita base;
- processo di analisi e integrazione mockup Google Stitch.

Fuori scope:

- redesign completo della shell;
- cambio framework o librerie UI;
- duplicazione di componenti gia esistenti;
- modifiche backend o API;
- cambiamenti funzionali non richiesti dal task;
- applicazione diretta di codice generato da Google Stitch.

---

## 3. Principi UI

- Riusare prima di creare: estendere componenti, layout e pattern esistenti.
- Coerenza prima dell'estetica: ogni scelta visuale deve diventare una regola riusabile.
- Design operativo: le schermate devono favorire scansione, confronto e azione ripetuta.
- Densita controllata: interfacce compatte, ma leggibili e accessibili.
- Gerarchia chiara: titolo, filtri, contenuto, azioni e feedback devono avere priorita visiva comprensibile.
- Feedback immediato: loading, errori, successi e disabled state devono essere espliciti.
- Incrementalita: nessun redesign massivo senza task, acceptance criteria e QA frontend.
- Metronic e riferimento visuale approvato, non codice da copiare.

---

## 4. Layout pagina

Le pagine applicative devono riusare shell, header, sidebar e struttura approvata.

Regole:

- usare container coerenti con il layout esistente, ad esempio `kt-container-fixed` quando gia adottato;
- mantenere titolo pagina visibile e associabile al contenuto principale;
- organizzare la pagina in blocchi leggibili: header/toolbar, filtri, contenuto, feedback;
- evitare sezioni decorative o marketing-style nelle aree operative;
- mantenere spaziature costanti tra blocchi principali;
- evitare card annidate se non necessarie;
- non introdurre wrapper generici nuovi senza motivazione e task esplicito.

---

## 5. Card e contenitori

Card e contenitori devono servire a raggruppare contenuto operativo, non a decorare la pagina.

Regole:

- usare card per modali, pannelli form, riepiloghi e gruppi ripetuti;
- evitare card dentro card quando un semplice layout a sezioni e sufficiente;
- mantenere bordi, radius e ombre coerenti con i pattern Metronic-adapted esistenti;
- usare superfici neutre e brand accent solo dove serve a chiarire stato o priorita;
- non introdurre palette parallele per singole schermate.

---

## 6. Toolbar e filtri

Toolbar e filtri devono rendere chiaro cosa l'utente puo fare e quale dataset sta osservando.

Regole:

- toolbar con titolo/contesto a sinistra e azioni principali a destra, salvo vincoli responsive;
- azione primaria visivamente distinta e usata con parsimonia;
- azioni secondarie come refresh, export o reset devono restare meno enfatizzate;
- filtri sempre etichettati, non solo placeholder;
- filtri complessi restano nella pagina/container, non dentro componenti tabellari generici;
- ricerca debounced quando interroga API o dataset remoto;
- cambio filtro che altera dataset deve resettare la paginazione quando applicabile;
- su mobile toolbar e filtri possono andare in colonna, mantenendo ordine e leggibilita.

---

## 7. Tabelle dati

Le tabelle sono pattern centrale delle UI amministrative HRM.

Regole generali:

- usare componenti tabellari condivisi quando struttura, paginazione, loading/error state e azioni sono simili;
- evitare tabelle custom duplicate;
- colonne configurabili e dichiarative;
- supporto a campi nested quando previsto dal modello dati;
- allineamento coerente: testo a sinistra, numeri a destra, date/boolean/status al centro;
- overflow orizzontale controllato su viewport stretti;
- header chiaro e stabile;
- celle essenziali scansionabili;
- paginazione visibile vicino alla tabella;
- empty, loading ed error state gestiti nello stesso pattern della tabella.

Da decidere nei task futuri:

- header sticky;
- densita righe finale;
- badge per boolean/status;
- trattamento visuale di record inattivi o locked.

---

## 8. Azioni

Le azioni devono rendere evidente impatto, priorita e rischio.

Regole:

- distinguere primary, secondary, outline/ghost e destructive;
- primary: una sola azione dominante per area operativa, preferibilmente associata a creazione/salvataggio o conferma positiva;
- outline/secondary: azioni reversibili o di supporto, come annullamento, chiusura, reset o navigazione;
- destructive: azioni rischiose o irreversibili, con colore e icona coerenti con il rischio;
- usare azioni destructive solo per operazioni irreversibili o rischiose;
- non usare due bottoni con stessa funzione nella stessa action bar;
- disabilitare azioni durante operazioni in corso quando un doppio submit sarebbe rischioso;
- usare label, tooltip o `aria-label` via i18n;
- preferire pattern coerenti tra toolbar, row actions e modali;
- valutare icone solo se migliorano scansione e restano accessibili.
- non introdurre nuove librerie icone: usare icone disponibili nel bundle Keenicons/Metronic gia caricato.
- In codice, il pattern shared per pagine lista deve usare `kt-btn` con varianti `kt-btn-primary`, `kt-btn-secondary`, `kt-btn-outline`, `kt-btn-ghost`, `kt-btn-destructive` e helper `kt-btn-sm`, `kt-btn-icon`, `kt-btn-list-action`.
- Quando conviene ridurre duplicazioni nei template Angular, il wrapper shared `app-button` puo essere usato sopra `kt-btn`, senza duplicare lo stile nel componente e senza sostituire il design system CSS come fonte ufficiale.
- Per i pulsanti `iconOnly`, il nome accessibile deve essere esplicito: il wrapper Angular shared richiede `ariaLabel` non vuoto e non deve affidarsi a fallback impliciti.

---

## 9. Form

I form devono essere prevedibili, validabili e coerenti tra create, edit e view.

Regole:

- create, edit e view devono condividere struttura quando rappresentano lo stesso oggetto;
- view e read-only non devono cambiare layout senza motivo;
- campi required con indicatore visivo e messaggio di validazione;
- errori vicino al contesto del form, non solo a livello pagina;
- salvataggio con stato submitting e disabled state;
- primary action per salvataggio, secondary action per annullamento o chiusura;
- evitare `Annulla` e `Chiudi` insieme nella bottom action bar quando sono equivalenti;
- testi, label, placeholder, tooltip e messaggi sempre via i18n.

### 9.1. Foundation form controls (TASK-048.15)

Inventario pratico dei controlli disponibili nel frontend attuale:

- presenti oggi:
  - text input nativi in form con classe `kt-input` (es. `master-data-form`);
  - checkbox nel form `master-data-form` (prima custom locale, ora shared `app-checkbox` + supporto `formControlName`);
  - select nativi nei filtri/lista e nel selettore lingua login;
  - search input nativo tipo `search` nel filtro Master Data;
  - pulsanti condivisi `app-button` per azioni principali;
  - campi shared specialistici `app-email-field` e `app-password-field` in login.
- non presenti come shared component:
  - textarea shared;
  - radio shared;
  - switch/toggle shared;
  - date input/date picker dedicated;
  - number input shared;
  - search wrapper shared;
  - pattern globale error/help shared.

Pattern base da applicare in modo incrementale:

- label, stato e messaggio devono essere logicamente associati e localizzati via i18n;
- errori e hint devono rimanere vicini al controllo, non globali;
- stato disabled sempre visibile e coerente con la severity visiva;
- focus visibile sui controlli interattivi;
- checkbox non deve usare styling browser-default, deve usare componente condiviso con stato checked/unchecked/disabled;
- ogni nuovo shared control deve nascere da caso reale e riusabilità comprovata, non da inventario astratto;
- `app-input` e `app-checkbox` sono controlli shared generici e riusabili cross-feature, quindi appartengono a `frontend/src/app/shared/components/`;
- campi o wrapper con UX/logica specialistica, ad esempio `app-email-field` e `app-password-field` della login, non definiscono da soli uno standard shared generico e possono restare in `frontend/src/app/shared/form-fields/` o nella feature di appartenenza;
- `app-password-field` resta separato finché mantiene comportamento specifico, ad esempio toggle visibilità password; `app-email-field` potrà essere razionalizzato in futuro come wrapper/adattatore di `app-input`, ma non rientra in questa phase 2.

- Phase 2 aggiornamenti:
  - introdotto `app-input` come primo controllo shared aggiuntivo nel `master-data-form`;
  - `app-input` supporta label, required, placeholder, help text, error text, id/accessibilità e type (`text`/`email`/`number`);
  - `app-select` è stato valutato in questa fase e rimandato a un task dedicato per non allargare il perimetro oltre il safe point del modal.

---

## 10. Modali e pop-up

Le modali devono concentrare un'azione o una decisione senza introdurre navigazioni parallele.

Regole:

- usare `role="dialog"` per form o viste informative;
- usare `role="alertdialog"` per conferme destructive;
- ogni modale deve avere `aria-modal="true"` e titolo collegato con `aria-labelledby`;
- larghezza massima coerente con complessita del contenuto;
- `max-height` e scroll interno per evitare overflow viewport;
- overlay neutro e non decorativo;
- chiusura e annullamento devono essere semanticamente chiari;
- gestione focus avanzata da definire nei task futuri se non gia coperta dal pattern esistente.

---

## 11. Conferme destructive

Le conferme destructive proteggono da azioni ad alto impatto.

Regole:

- titolo esplicito sul tipo di azione;
- messaggio chiaro, non ambiguo;
- target record mostrato quando disponibile;
- bottone destructive con label specifica, ad esempio `Elimina`, non generica;
- azione secondaria di annullamento;
- errore applicativo mostrato dentro la modale;
- nessun falso successo: la UI deve confermare solo dopo risposta reale.

---

## 12. Empty, loading, error e success state

Gli stati UI devono essere consistenti in tutta la piattaforma.

Regole:

- loading: messaggio breve, stato non ambiguo, no blocchi permanenti;
- empty: messaggio neutro, senza suggerire errore;
- error: tono destructive e messaggio comprensibile;
- success: feedback breve e non invasivo;
- toast/alert: superficie chiara, bordo e barra/accento semantico, icona visibile, titolo breve e descrizione leggibile;
- varianti toast standard: success verde, error rosso, warning arancione, info blu;
- pattern condiviso consigliato: `NotificationService` + `NotificationHostComponent` + `AlertMessageComponent` per renderizzare feedback toast centralizzati;
- toast dismissible solo quando la chiusura manuale migliora l'esperienza e senza perdere informazioni critiche;
- stati HTTP o API devono apparire appena disponibili;
- con Angular signals o OnPush, verificare che lo stato si aggiorni immediatamente quando si modifica codice UI;
- non usare solo colore per comunicare stato.

---

## 13. i18n

La piattaforma usa la foundation i18n custom esistente.

Regole:

- nessun testo UI hardcoded nei componenti Angular;
- ogni nuova label, tooltip, placeholder, title, messaggio o `aria-label` deve avere chiave in `i18n.messages.ts`;
- lingue supportate: `it`, `fr`, `en`;
- italiano (`it`) baseline e fallback;
- non tradurre dati dinamici provenienti da backend, database, tenant o utente;
- i mockup possono avere microcopy indicativa, ma l'implementazione finale deve usare chiavi i18n.

---

## 14. Responsive

Le UI operative devono restare usabili su desktop, tablet e mobile.

Regole:

- layout pagina con blocchi che possono impilarsi su viewport stretti;
- toolbar e filtri devono restare leggibili senza overflow;
- tabelle con overflow orizzontale controllato o variante approvata;
- modali con `width: min(100%, ...)`, padding viewport e `max-height`;
- azioni raggiungibili anche su mobile;
- testo e bottoni non devono sovrapporsi o uscire dai contenitori.

---

## 15. Accessibilita base

Regole minime:

- titolo pagina o sezione associabile al contenuto;
- label visibili per campi input/select;
- `aria-label` per azioni non autoesplicative;
- ruoli modali corretti;
- disabled state visibile;
- focus visibile e navigazione da tastiera da preservare;
- contrasto sufficiente per testo, bordi e stati;
- non comunicare informazioni critiche solo tramite colore.

---

## 16. Integrazione mockup Stitch

Google Stitch puo fornire screenshot o codice generato. Entrambi sono input di analisi, non implementazione automatica.

Processo obbligatorio:

1. Analizzare il mockup rispetto alla UI corrente.
2. Separare layout, gerarchia visiva, microcopy, componenti e pura decorazione.
3. Scartare codice Stitch non coerente con Angular, Metronic-adapted patterns, i18n o riuso componenti.
4. Tradurre le parti approvate in regole riusabili.
5. Aggiornare questo documento solo quando una regola diventa standard.
6. Applicare modifiche incrementali in task dedicato.
7. Eseguire build/test frontend se viene toccato codice Angular.

Prompt Stitch generici consigliati:

- "Design an enterprise HR SaaS backoffice page for operational users. Prioritize dense but readable information, clear toolbar actions, accessible filters, neutral surfaces, restrained HRflow brand accents, and responsive behavior."
- "Design a reusable data table pattern for an HR admin platform. Include configurable columns, row actions, pagination, empty/loading/error states, compact density, and accessible labels."
- "Design a reusable CRUD modal pattern for create, edit and view modes. Preserve layout consistency, required field validation, error feedback, primary and secondary actions, and mobile responsiveness."
- "Design destructive confirmation dialogs for an HR backoffice. Make the risk level clear, show the target record, use distinct destructive action styling, and keep cancellation secondary."

Regola centrale:

- Nessun redesign massivo senza task dedicato, acceptance criteria e QA frontend.

---

## 17. Applicazione iniziale: UI template catalog / TASK-048

TASK-048 usa i template Stitch come riferimento visuale astratto per definire pattern UI riusabili nella piattaforma HRflow.

I template non sono collegati a una singola feature e non autorizzano implementazioni automatiche. Ogni applicazione concreta deve avvenire tramite task dedicato, patch incrementale e validazione frontend.

Obiettivo TASK-048:

- definire un catalogo iniziale di pattern UI riusabili;
- distinguere template approvati, template extra e pattern futuri;
- separare la tabella gestionale standard dal bulk editor stile Excel;
- evitare redesign massivi o duplicazione di componenti esistenti;
- tradurre le parti approvate in regole applicabili ad Angular, Metronic-adapted patterns e i18n.

Pattern da riusare:

- layout shell, header e sidebar esistenti;
- classi Metronic-adapted giÃ  presenti nel progetto;
- componenti tabellari condivisi quando applicabile;
- token CSS giÃ  usati, ad esempio `--color-border`, `--color-background`, `--color-destructive`, `--color-primary`;
- foundation i18n esistente per `it`, `fr` ed `en`.

Regole specifiche TASK-048:

- TEMPLATE-10 `Generic DataTable` Ã¨ il riferimento principale per le tabelle gestionali standard;
- TEMPLATE-02 `Spreadsheet-style bulk editor` Ã¨ un pattern avanzato futuro per inserimento/modifica massiva dati;
- TEMPLATE-01 definisce il pattern pagina lista con toolbar, filtri, tabella e paginazione;
- TEMPLATE-03 definisce gli stati tabella;
- TEMPLATE-04 definisce il pattern form modale CRUD;
- TEMPLATE-05 definisce le conferme azioni;
- TEMPLATE-06 e TEMPLATE-07 definiscono rispettivamente login e toast;
- TEMPLATE-08 e TEMPLATE-09 sono riferimenti extra da valutare prima dell'applicazione;
- TEMPLATE-11 e stato applicato come riferimento pulsanti nei task dedicati a buttons/list actions.

Fuori scope TASK-048.2:

- applicare direttamente codice Stitch;
- modificare componenti Angular;
- cambiare backend o API;
- rifare la shell;
- introdurre nuove librerie UI;
- trasformare tutti i template in componenti condivisi senza task dedicato.

---

## 18. Decisioni aperte

- Confermare se le row actions devono diventare icon-only, text-only o icon+text.
- Definire se le tabelle dati devono avere header sticky.
- Definire stile definitivo per badge booleani e status.
- Definire trattamento visuale per record inattivi, locked o system.
- Definire se il close button in header modale resta sempre visibile.
- Definire pattern finale per `Annulla` vs `Chiudi` nelle form modal.
- Definire se empty/error state devono diventare componenti condivisi generici.
- Definire eventuali token spacing dedicati o riuso dei token esistenti.
- Definire quando un pattern passa da feature-specific a shared.
- Definire in quale task applicare TEMPLATE-10 `Generic DataTable` al componente tabellare esistente.
- TASK-048.14 chiarisce che TEMPLATE-02 richiedera un componente futuro dedicato, distinto dal `DataTableComponent` read-only; resta da decidere solo quando introdurlo e su quale prima feature reale.

---

## 19. Debito tecnico noto

- `DataTableComponent` e generico, ma alcune chiavi i18n sono ancora `masterData.*`.
- Le azioni riga sono testuali e possono occupare troppo spazio con molte azioni.
- Il form Master Data supporta solo tipi `text` e `boolean`.
- Esiste una prima validazione visuale Stitch, ma non Ã¨ ancora stata applicata al codice Angular.
- I popup non documentano ancora una gestione focus avanzata.
- Non esiste ancora uno standard definitivo per stati inattivi, badge e severity/status.
- La lista puo mostrare record inattivi finche non esiste un filtro dedicato attivi/inattivi.



## 20. Catalogo template UI validati da Stitch

TASK-048.2 ha prodotto un primo catalogo di template visuali astratti per HRflow.

I template Stitch non sono codice da copiare direttamente, ma riferimenti visuali da tradurre in pattern Angular coerenti con il progetto.

| Template | Nome | Uso previsto | Stato |
|---|---|---|---|
| TEMPLATE-01 | Data list page | Pagina standard con titolo, toolbar, filtri, tabella e paginazione | Approvato come riferimento |
| TEMPLATE-02 | Spreadsheet-style bulk editor | Inserimento e modifica massiva dati in stile Excel | Approvato come pattern avanzato futuro; planning documentale completato in TASK-048.14 |
| TEMPLATE-03 | Table states | Loading, empty, error, no results | Approvato come riferimento |
| TEMPLATE-04 | CRUD modal form | Create, edit, view read-only | Approvato come riferimento; refinement dedicato pianificato in TASK-048.12 |
| TEMPLATE-05 | Action confirmation dialogs | Conferme normali, warning, destructive, irreversibili | Approvato come riferimento |
| TEMPLATE-06 | Login page | Login, branding, lingua, accesso | Approvato come riferimento |
| TEMPLATE-07 | Toast notifications | Success, error, warning, info | Applicato in TASK-048.6 come riferimento feedback toast |
| TEMPLATE-08 | Sidebar | Navigazione laterale | Valutato in TASK-048.10; candidato a TASK-048.11 dedicato |
| TEMPLATE-09 | Header / topbar | Barra superiore, ricerca, profilo utente | Valutato in TASK-048.10; refinement dedicato pianificato in TASK-048.13 |
| TEMPLATE-10 | Generic DataTable | Tabella gestionale standard | Approvato come tabella principale |
| TEMPLATE-11 | Buttons | Stili pulsanti primari, secondari, outline, destructive | Applicato in TASK-048.6 come riferimento pulsanti |

---

## 21. TASK-048.10 - Review shell navigation

TASK-048.10 ha valutato TEMPLATE-08 Sidebar e TEMPLATE-09 Header/topbar come riferimenti extra per la shell esistente, senza autorizzare modifiche applicative.

Stato attuale sidebar:

- la sidebar Angular esistente usa `app-sidebar`, base Metronic-adapted `kt-sidebar` / `kt-menu`, routing Angular, i18n, ricerca menu, collapse desktop e stato active;
- il pattern e gia funzionale e va preservato durante futuri riallineamenti visuali;
- TEMPLATE-08 e coerente come direzione visuale per una sidebar piu marcata, con fondo navy, active state primario e gerarchia link piu chiara.

Stato attuale header/topbar:

- l'header esistente usa `app-header`, area brand/riservata, toggle mobile sidebar e menu profilo/logout;
- TEMPLATE-09 introduce pattern piu ampi come ricerca globale, notifiche, help e profilo utente dettagliato;
- questi elementi non vanno introdotti senza task dedicato per evitare funzionalita e UI fuori scope.

Decisione:

- TASK-048.10 non applica modifiche concrete alla shell;
- la sidebar verra riallineata visualmente a TEMPLATE-08 solo in TASK-048.11 dedicato;
- TEMPLATE-09 resta riferimento extra non applicato in TASK-048.10 e viene demandato al task dedicato TASK-048.13;
- eventuali applicazioni devono preservare routing, i18n, accessibilita, responsive/collapse e componenti Angular esistenti.

Note backlog post TASK-048.11:

- TEMPLATE-04 sara oggetto di refinement dedicato in TASK-048.12 su CRUD modal e form esistenti, senza introdurre shared modal/form framework prematuro;
- TEMPLATE-09 sara oggetto di refinement dedicato in TASK-048.13 su header/topbar esistente, senza modificare sidebar o introdurre funzionalita fuori scope.

Regole applicate in TASK-048.11:

- la sidebar puo usare una superficie dark/navy come eccezione controllata della shell, senza estendere automaticamente la palette a header o contenuto;
- i top-level navigation items possono usare un trattamento a pill con marker compatto e active state primario pieno;
- i parent nodes con route attiva discendente possono usare uno stato intermedio branch-active, distinto dall'active pieno della voce finale;
- la ricerca nella sidebar dark puo usare una superficie translucida con contrasto alto, senza cambiare la logica del filtro locale;
- il trattamento active/sidebar deve privilegiare contrasto e struttura rispetto a glow o blur aggressivi;
- il tree annidato puo aumentare leggermente contrasto della linea verticale, migliorare l'ancoraggio bullet -> label e ridurre gli sbilanciamenti di indent;
- la scrollbar della sidebar puo essere integrata con styling CSS leggero e dark, senza librerie esterne o componenti custom;
- la sidebar deve evitare overflow orizzontale e mantenere lo scroll verticale confinato all'area menu, lasciando header/logo sempre accessibili;
- nella sidebar amministrativa la densita dei menu puo essere leggermente piu compatta rispetto a pattern dashboard/showcase, pur mantenendo focus states e leggibilita accessibili;
- gli active state della sidebar devono restare inset rispetto ai bordi laterali, con padding/margine destro visivamente coerente con il lato sinistro;
- la search box della sidebar deve essere centrata verticalmente nella propria sezione, evitando padding superiore/inferiore sbilanciato;
- il riallineamento visuale deve restare locale al componente sidebar e non modificare header/topbar o creare una shell parallela.

---

## 22. TASK-048.14 - Planning del TEMPLATE-02 Spreadsheet-style bulk editor

TASK-048.14 formalizza TEMPLATE-02 come pattern futuro per inserimento e modifica massiva di record tabellari omogenei, senza implementazione Angular in questo passaggio.

### 22.1 Obiettivo del pattern

Il bulk editor stile spreadsheet serve quando l'utente deve creare o modificare piu record simili nella stessa sessione, con confronto rapido tra righe e salvataggio massivo esplicito.

Il pattern non sostituisce:

- la pagina lista standard con `DataTableComponent`;
- il CRUD modale per modifica puntuale;
- i flussi operativi complessi con validazioni multi-step o relazioni pesanti.

Nel progetto HRM questo pattern va trattato come modalita specialistica e bounded, non come default universale delle tabelle amministrative.

### 22.2 Casi d'uso iniziali candidati

Primo perimetro consigliato:

- master data tenant-scoped a schema semplice, ad esempio `Department`, `JobTitle`, `ContractType`, `WorkMode`;
- sessioni di manutenzione rapida con molte righe `code` / `name` / `active`;
- dataset gia filtrato e contestualizzato prima di entrare in modalita bulk.

Casi candidati solo dopo un primo MVP riuscito:

- altri lookup semplici con campi omogenei e CRUD gia stabile;
- operazioni di pulizia o attivazione/disattivazione massiva su insiemi limitati.

### 22.3 Casi da escludere dal primo rilascio

Da escludere nel primo rilascio:

- geografie nidificate o record con relazioni `country/region/area` complesse;
- ruoli, permessi e matrici sicurezza;
- employee, contract, device, payroll, leave request, holiday calendar, audit log;
- file upload, allegati, editor multi-tab, formule, drag-fill, multi-sheet, collaborazione realtime;
- dataset troppo grandi o non bounded;
- editing distribuito su piu pagine server-side durante la stessa sessione di modifica.

### 22.4 Comportamento atteso

Comportamenti minimi del pattern:

- righe editabili con stato locale `pristine`, `new`, `modified`, `invalid`, `saving`, `error`;
- celle editabili con editor coerenti col tipo campo, almeno `text`, `select` e `boolean` quando la feature reale lo richiede;
- validazione inline immediata per required, formato e regole locali semplici;
- errori per cella e per riga visibili senza dipendere solo dal colore;
- salvataggio massivo esplicito con azione primaria unica, senza autosave nel primo rilascio;
- annullamento modifiche che ripristina il draft all'ultimo dataset confermato dal server;
- gestione righe nuove solo lato client finche non vengono salvate;
- gestione righe modificate con evidenza chiara del delta locale;
- gestione righe invalide con blocco del save massivo o con esclusione esplicita e motivata, da decidere per la feature concreta;
- feedback finale con conteggio righe salvate, righe rifiutate e errori residui.

### 22.5 Relazione con i pattern esistenti

Elementi da riusare:

- shell esistente (`app-shell`, `app-header`, `app-sidebar`);
- pattern pagina lista di TEMPLATE-01 per contesto, titolo, toolbar e filtri;
- `DataTableComponent` come riferimento visuale di colonne, densita, paginazione e stati, non come base diretta per l'editing;
- `app-button` e varianti `kt-btn` per toolbar, save, discard, add row;
- pattern `AlertMessageComponent` / `NotificationService` per feedback e summary error;
- modali di conferma gia presenti per uscita con modifiche non salvate o operazioni distruttive sul draft;
- pattern loading/empty/error gia documentati in TEMPLATE-03.

Elementi che richiedono una foundation dedicata:

- stato draft per riga/cella;
- mappa errori per cella;
- navigazione tastiera tra celle;
- focus management da griglia editabile;
- tracking delle modifiche locali;
- merge tra validazione client e risposta server;
- eventuale incollaggio multi-cella o import testuale strutturato.

### 22.6 DataTableComponent: estendere o separare

Raccomandazione di TASK-048.14:

- non estendere `DataTableComponent` corrente fino a trasformarlo in spreadsheet editor;
- creare un componente futuro dedicato, inizialmente feature-local, da promuovere a shared solo dopo una seconda adozione reale.

Motivazione:

- `DataTableComponent` attuale e read-only, event-driven e paginato;
- il bulk editor richiede stato locale ricco, editor per cella, dirty tracking, validazione inline e comportamento tastiera molto diverso;
- forzare tutto nello stesso componente aumenterebbe accoppiamento e rischio regressione sulle liste esistenti;
- il principio `extend before create` resta rispettato riusando layout, modelli colonna e feedback, ma non fondendo due pattern con semantica differente.

### 22.7 Vincoli i18n

Vincoli obbligatori:

- nessun testo hardcoded in template o componenti futuri;
- titoli colonna, placeholder, help text, errori, summary di salvataggio e `aria-label` via i18n;
- supporto minimo `it`, `fr`, `en`;
- eventuali messaggi server devono essere mappati in modo coerente con la UX i18n del frontend.

### 22.8 Vincoli accessibilita

Vincoli minimi:

- focus visibile su cella attiva e controlli inline;
- navigazione tastiera prevedibile tra righe, celle e action bar;
- errori annunciabili e associati al contesto di riga/cella;
- nessuna informazione critica affidata solo a colore o icona;
- eventuale uso di semantica `grid` o equivalente solo se supportato con interazioni tastiera coerenti.

### 22.9 Vincoli responsive

Il pattern e desktop-first.

Regole consigliate:

- viewport desktop/laptop come target primario del primo rilascio;
- tablet supportato solo se la densita resta usabile;
- su mobile stretto il bulk editor non deve degradare in una pseudo-spreadsheet ingestibile;
- per il primo rilascio e accettabile prevedere fallback read-only o indisponibilita del bulk editing sotto una soglia di viewport.

### 22.10 Vincoli performance

Per evitare complessita prematura:

- dataset bounded, con limite iniziale esplicito consigliato tra 50 e 100 righe;
- evitare editing distribuito su paginazione server-side attiva;
- preferire payload di salvataggio basati solo sulle righe nuove o modificate;
- evitare rerender completi della griglia a ogni battitura;
- nessuna nuova libreria di virtualizzazione o grid enterprise senza task e decisione dedicati.

### 22.11 Rischi e debito tecnico

Rischi principali:

- complessita dello stato locale e dei conflitti tra draft e server;
- mapping affidabile degli errori backend a livello riga/cella;
- rischio UX su dataset grandi o con molti campi;
- accessibilita tastiera facile da degradare;
- gestione di unsaved changes, refresh e uscita dalla pagina;
- possibile pressione a duplicare logiche tabellari gia presenti.

Debito tecnico rilevante gia visibile:

- `DataTableComponent` nasce come tabella read-only, non editabile;
- `MasterDataFormComponent` supporta oggi solo campi `text` e `boolean`;
- alcune chiavi i18n shared della tabella sono ancora accoppiate al dominio `masterData.*`;
- manca una foundation condivisa per editor di cella, error summary e dirty state.

### 22.12 Futuri task tecnici suggeriti

Futuri task consigliati prima di una implementazione reale:

- task di scope funzionale per scegliere la prima feature candidata e fissare limite righe/campi;
- task di foundation form controls shared, coerente con TASK-048.15, per editor cella riusabili;
- task dedicato al modello dati frontend del draft bulk (`new/modified/invalid/error`);
- task di implementazione MVP feature-local su una sola entita semplice tenant-scoped;
- task separato di QA/regression/accessibilita/performance sul bulk editor;
- eventuale task backend solo se i contratti CRUD esistenti risultassero insufficienti a gestire save massivo in modo accettabile.

