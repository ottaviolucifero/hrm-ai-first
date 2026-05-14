# Global Master Data Sources

## Countries

- Name / ISO seed source: `lukes/ISO-3166-Countries-with-Regional-Codes`
- Name / ISO source file: `slim-2/slim-2.csv`
- Name / ISO repository URL: `https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes`
- Name / ISO reference standard: `ISO 3166-1 alpha-2`
- Name / ISO consulted on: `2026-05-06`
- Name / ISO license: `CC BY-SA 4.0` (Creative Commons Attribution-ShareAlike 4.0 International)
- Phone code enrichment source: `DataHub core/country-codes`
- Phone code dataset URL: `https://datahub.io/core/country-codes`
- Phone code CSV URL: `https://datahub.io/core/country-codes/_r/-/data/country-codes.csv`
- Phone code reference field: `Dial`
- Phone code consulted on: `2026-05-14`
- Phone code published license: `ODC-PDDL-1.0` (Open Data Commons Public Domain Dedication and License v1.0)

### Technical rationale

This static dataset is suitable for the initial countries seed because it provides a lightweight country list with stable `alpha-2` codes, without forcing geopolitical enrichments or inventing missing operational fields.

The datasets are used only as offline sources for seed and enrichment migrations. They do not imply runtime calls to external APIs.

### Source lineage and caveats

- The repository documents the dataset as derived from publicly available ISO 3166-1 and UN regional-code sources.
- The repository also warns that the data should be checked independently before production use.
- For the initial country seed, only the country name and ISO 3166-1 alpha-2 code are used.
- For phone code enrichment, the DataHub dataset exposes an aggregated `Dial` field sourced from multiple international standards/reference bodies, including ITU-related dialing code references.
- The DataHub dataset page notes that the dataset is published under `ODC-PDDL-1.0`, but also warns that some underlying source rights may be unclear and should be checked for public/commercial redistribution.

### Mapping to `countries`

| Source column | Target column | Mapping |
|---|---|---|
| `name` | `countries.name` | direct |
| `alpha-2` | `countries.iso_code` | direct, uppercase |
| n/a | `countries.active` | constant `TRUE` |
| `Dial` | `countries.phone_code` | normalized to primary/base E.164 code with leading `+` |
| n/a | `countries.default_currency_id` | `NULL` |

### Phone code normalization rules

- `Dial` values like `33`, `39`, `216`, `49`, `34` become `+33`, `+39`, `+216`, `+49`, `+34`.
- Multi-value or suffixed values are reduced to the primary/base country code:
  - `1-809,1-829,1-849` -> `+1`
  - `39-06` -> `+39`
  - `1-684` -> `+1`
- Shared calling codes are preserved as shared base codes when the source uses them, for example `+1`, `+44`, `+39`.
- Expected enrichment coverage for the current ISO seed is `248 / 249` countries.
- Current safe skip: `UM` (`United States Minor Outlying Islands`) because the source `Dial` field is blank.

### Out of scope

- default currency inference for all countries or territories
- CAP italiani import
- ZIP/postal datasets for non-Italian countries
- frontend/UI changes
- runtime integration with external APIs
