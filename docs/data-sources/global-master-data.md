# Global Master Data Sources

## Countries

- Dataset source: `lukes/ISO-3166-Countries-with-Regional-Codes`
- Source file: `slim-2/slim-2.csv`
- Repository URL: `https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes`
- Reference standard: `ISO 3166-1 alpha-2`
- Consulted on: `2026-05-06`
- License: `CC BY-SA 4.0` (Creative Commons Attribution-ShareAlike 4.0 International)

### Technical rationale

This static dataset is suitable for the initial countries seed because it provides a lightweight country list with stable `alpha-2` codes, without forcing geopolitical enrichments or inventing missing operational fields.

The dataset is used only as a source for the initial country seed. It does not imply runtime calls to external APIs.

### Source lineage and caveats

- The repository documents the dataset as derived from publicly available ISO 3166-1 and UN regional-code sources.
- The repository also warns that the data should be checked independently before production use.
- For this task, only the country name and ISO 3166-1 alpha-2 code are used.

### Mapping to `countries`

| Source column | Target column | Mapping |
|---|---|---|
| `name` | `countries.name` | direct |
| `alpha-2` | `countries.iso_code` | direct, uppercase |
| n/a | `countries.active` | constant `TRUE` |
| n/a | `countries.phone_code` | `NULL` |
| n/a | `countries.default_currency_id` | `NULL` |

### Out of scope

- phone code enrichment
- default currency inference for all countries or territories
- CAP italiani import
- ZIP/postal datasets for non-Italian countries
- frontend/UI changes
- runtime integration with external APIs
