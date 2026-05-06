# Model Selection Guide

Questa guida e la fonte operativa centrale per scegliere il modello o agente prima di preparare un prompt nel progetto HRM AI-first.

## Regola generale

- Usare sempre il modello meno costoso compatibile con il rischio del task.
- La scelta deve comparire sempre nel prompt operativo nella sezione obbligatoria `Modello consigliato`.
- Separare sviluppo e QA: prompt distinti.
- I fix post-QA devono essere minimi e mirati.

## Quando usare ciascun modello

- **5.5 / 5.4**: analisi complessa, architettura, planning articolato, task ad alto rischio di regressione, reasoning profondo su sicurezza, dati o refactoring ampio.
- **5.3 Codex**: sviluppo su repository, patch codice, patch documentazione con impatto operativo reale, implementazioni normali frontend/backend, fix post-QA sul codice.
- **5.3 Spark**: patch semplici e localizzate, documentazione leggera, controlli rapidi, task a basso rischio e basso impatto.
- **Gemini AI**: QA e regression test separati quando utile per revisione, controllo regressioni, scope creep, i18n, build/test, coerenza UI/API e verifica finale non implementativa.

## Criteri di scelta

La decisione deve considerare almeno:

- tipo di task
- area di codice coinvolta
- rischio regressione
- complessita attesa
- consumo/costo token

## QA separata e reporting

- Il QA va eseguito con prompt separato dal prompt di sviluppo.
- Il prompt di sviluppo implementa la patch.
- Il prompt QA verifica regressioni, scope creep, i18n, build/test e coerenza generale.
- Il QA non deve introdurre nuove funzionalita.
- I fix emersi dal QA devono essere trattati come patch correttive separate e minime.
- I report QA reali devono essere registrati in `docs/qa/QA-REPORTS.md`.

## Matrice rapida

| Tipo attivita | Modello consigliato | Note |
|---|---|---|
| Prompt introduttivo nuova chat | 5.3 Spark | Basta riassumere contesto e regole operative. |
| Scrittura descrizione PR o nota documentale breve | 5.3 Spark | Basso rischio, nessun reasoning profondo richiesto. |
| Traduzioni, testi, email, messaggi | 5.3 Spark | Evitare modelli piu costosi. |
| Comandi Git, recupero branch, merge locale | 5.3 Spark | Usare l'output terminale come fonte principale. |
| Analisi errore build/test semplice | 5.3 Spark o 5.3 Codex | Passare a 5.4 solo se il problema tocca piu moduli o root cause non ovvia. |
| Piccolo fix localizzato | 5.3 Spark o 5.3 Codex | Uno o pochi file, basso rischio. |
| Implementazione task backend/frontend normale | 5.3 Codex | Analysis first e patch minima. |
| Task con database, migrazioni, sicurezza, JWT, RBAC | 5.4 o 5.5 | Rischio alto di regressioni o scelte architetturali. |
| Refactoring strutturale | 5.4 o 5.5 | Richiede comprensione globale. |
| Aggiornamento architettura o decisioni importanti | 5.4 o 5.5 | Impatta governance del progetto. |
| QA review finale task | Gemini AI o 5.4 | Deve cercare regressioni e incoerenze senza implementare nuove feature. |
| Debug complesso con log lunghi | 5.4 o 5.5 | Ridurre prima i log al minimo utile. |
| Fix post-QA minimo e mirato | 5.3 Codex | Applicare solo la patch correttiva necessaria. |

## Regole per risparmiare crediti

1. Ridurre il prompt al minimo utile prima di usare un modello piu costoso.
2. Incollare solo file, log e diff realmente necessari.
3. Chiedere sempre `analysis first` quando il task non e banale.
4. Dividere task grandi in sotto-task piccoli.
5. Usare 5.3 Spark per preparare prompt, descrizioni PR e checklist.
6. Usare 5.3 Codex per implementazione ordinaria su repository.
7. Usare 5.4 o 5.5 solo per task con rischio o complessita realmente superiori.
8. Evitare di usare modelli avanzati per attivita puramente editoriali.
9. Per log lunghi, chiedere prima una sintesi o estrazione degli errori rilevanti.
10. Riutilizzare prompt template gia approvati quando possibile.

## Template minimo "Modello consigliato"

```text
Modello consigliato: <modello>
Motivazione: <perche e adatto a questo task>
Rischi e trade-off: <regressione, area coinvolta, complessita, costo>
QA separato: <si/no e con quale modello>
```
