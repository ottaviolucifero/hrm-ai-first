# Model Selection Guide

Questa guida aiuta a scegliere il modello AI corretto prima di incollare un prompt, con l’obiettivo di ridurre consumo crediti e usare modelli più potenti solo quando servono davvero.

## Regola generale

Usare sempre il modello meno costoso compatibile con il rischio del task.

Passare a un modello più potente solo quando il task richiede:

- analisi architetturale complessa;
- refactoring ampio;
- modifica su molti file;
- alta probabilità di regressioni;
- reasoning profondo su codice, sicurezza o dati;
- review QA finale prima della PR.

---

## Matrice rapida

| Tipo attività | Modello consigliato | Note |
|---|---|---|
| Prompt introduttivo nuova chat | modello economico/standard | Basta riassumere contesto e regole operative. |
| Scrittura descrizione PR | modello economico/standard | Task semplice, basso rischio. |
| Traduzioni, testi, email, messaggi | modello economico/standard | Non usare modelli avanzati. |
| Comandi Git, recupero branch, merge locale | modello economico/standard | Usare output terminale come fonte. |
| Analisi errore build/test semplice | modello standard | Passare a modello avanzato solo se l’errore coinvolge più moduli. |
| Piccolo fix localizzato | modello standard | Un file o pochi file, basso rischio. |
| Implementazione task backend/frontend normale | modello medio/avanzato | Usare analysis first e patch minima. |
| Task con database, migrazioni, sicurezza, JWT, RBAC | modello avanzato | Rischio alto di regressioni o scelte architetturali. |
| Refactoring strutturale | modello avanzato | Richiede comprensione globale. |
| Aggiornamento architettura/decisioni importanti | modello avanzato | Impatta governance del progetto. |
| QA review finale task | modello avanzato | Deve cercare regressioni e incoerenze. |
| Debug complesso con log lunghi | modello avanzato | Solo dopo aver ridotto i log al necessario. |

---

## Regole per risparmiare crediti

1. Prima di usare un modello avanzato, ridurre il prompt al minimo utile.
2. Incollare solo file, log e diff realmente necessari.
3. Chiedere sempre: “analysis first, no code until analysis”.
4. Dividere task grandi in sotto-task piccoli.
5. Usare modello economico per preparare prompt, descrizioni PR e checklist.
6. Usare modello avanzato solo per implementazione critica o QA finale.
7. Evitare di chiedere al modello avanzato attività puramente editoriali.
8. Non incollare l’intero progetto se bastano pochi file.
9. Per log lunghi, chiedere prima una sintesi/estrazione degli errori rilevanti.
10. Per task ripetitivi, riutilizzare prompt template già approvati.

---

## Avviso da usare nei prompt

Prima di incollare un prompt a Codex o a un altro agente, valutare:

```text
Che tipo di task è?
- Documentazione semplice → modello economico/standard
- Fix piccolo → modello standard
- Implementazione con rischio medio → modello medio/avanzato
- Sicurezza, DB, architettura, QA finale → modello avanzato
```

Se il task non è critico, non usare il modello più costoso.

---

## Template richiesta consiglio modello

Usare questo mini-prompt quando si vuole decidere il modello prima di iniziare:

```text
Devo eseguire questo task nel progetto HRM AI-first:

[incolla titolo e breve descrizione task]

Valuta solo quale modello usare per risparmiare crediti.
Rispondi con:
1. modello consigliato
2. motivo
3. quando passare a modello più potente
4. cosa ridurre nel prompt per consumare meno
```

---

## Regola finale

Il modello avanzato va usato come revisore o sviluppatore su task rischiosi, non come assistente generico per ogni passaggio.
