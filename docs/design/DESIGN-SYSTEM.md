# HRM AI-first Design System

Versione: 0.2
Ultimo aggiornamento: 2026-05-08
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
- usare azioni destructive solo per operazioni irreversibili o rischiose;
- non usare due bottoni con stessa funzione nella stessa action bar;
- disabilitare azioni durante operazioni in corso quando un doppio submit sarebbe rischioso;
- usare label, tooltip o `aria-label` via i18n;
- preferire pattern coerenti tra toolbar, row actions e modali;
- valutare icone solo se migliorano scansione e restano accessibili.

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
- classi Metronic-adapted già presenti nel progetto;
- componenti tabellari condivisi quando applicabile;
- token CSS già usati, ad esempio `--color-border`, `--color-background`, `--color-destructive`, `--color-primary`;
- foundation i18n esistente per `it`, `fr` ed `en`.

Regole specifiche TASK-048:

- TEMPLATE-10 `Generic DataTable` è il riferimento principale per le tabelle gestionali standard;
- TEMPLATE-02 `Spreadsheet-style bulk editor` è un pattern avanzato futuro per inserimento/modifica massiva dati;
- TEMPLATE-01 definisce il pattern pagina lista con toolbar, filtri, tabella e paginazione;
- TEMPLATE-03 definisce gli stati tabella;
- TEMPLATE-04 definisce il pattern form modale CRUD;
- TEMPLATE-05 definisce le conferme azioni;
- TEMPLATE-06 e TEMPLATE-07 definiscono rispettivamente login e toast;
- TEMPLATE-08, TEMPLATE-09 e TEMPLATE-11 sono riferimenti extra da valutare prima dell’applicazione.

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
- Definire se e quando creare un componente dedicato per TEMPLATE-02 `Spreadsheet-style bulk editor`.

---

## 19. Debito tecnico noto

- `DataTableComponent` e generico, ma alcune chiavi i18n sono ancora `masterData.*`.
- Le azioni riga sono testuali e possono occupare troppo spazio con molte azioni.
- Il form Master Data supporta solo tipi `text` e `boolean`.
- Esiste una prima validazione visuale Stitch, ma non è ancora stata applicata al codice Angular.
- I popup non documentano ancora una gestione focus avanzata.
- Non esiste ancora uno standard definitivo per stati inattivi, badge e severity/status.
- La lista puo mostrare record inattivi finche non esiste un filtro dedicato attivi/inattivi.



## 20. Catalogo template UI validati da Stitch

TASK-048.2 ha prodotto un primo catalogo di template visuali astratti per HRflow.

I template Stitch non sono codice da copiare direttamente, ma riferimenti visuali da tradurre in pattern Angular coerenti con il progetto.

| Template | Nome | Uso previsto | Stato |
|---|---|---|---|
| TEMPLATE-01 | Data list page | Pagina standard con titolo, toolbar, filtri, tabella e paginazione | Approvato come riferimento |
| TEMPLATE-02 | Spreadsheet-style bulk editor | Inserimento e modifica massiva dati in stile Excel | Approvato come pattern avanzato futuro |
| TEMPLATE-03 | Table states | Loading, empty, error, no results | Approvato come riferimento |
| TEMPLATE-04 | CRUD modal form | Create, edit, view read-only | Approvato come riferimento |
| TEMPLATE-05 | Action confirmation dialogs | Conferme normali, warning, destructive, irreversibili | Approvato come riferimento |
| TEMPLATE-06 | Login page | Login, branding, lingua, accesso | Approvato come riferimento |
| TEMPLATE-07 | Toast notifications | Success, error, warning, info | Approvato come riferimento |
| TEMPLATE-08 | Sidebar | Navigazione laterale | Extra, da valutare prima di applicare |
| TEMPLATE-09 | Header / topbar | Barra superiore, ricerca, profilo utente | Extra, da valutare prima di applicare |
| TEMPLATE-10 | Generic DataTable | Tabella gestionale standard | Approvato come tabella principale |
| TEMPLATE-11 | Buttons | Stili pulsanti primari, secondari, outline, destructive | Approvato come riferimento |