# DECISIONS.md

## Progetto HRM AI-first

Versione: 1.0  
Ultimo aggiornamento: 2026-05-01  
Stato: Bozza

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
- Spring Boot 3 / Java 21 per il backend;
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

## 4. Template per nuove decisioni

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