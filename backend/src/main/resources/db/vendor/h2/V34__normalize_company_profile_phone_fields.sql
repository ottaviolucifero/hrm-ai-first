ALTER TABLE company_profiles
    ADD COLUMN phone_dial_code VARCHAR(10);

ALTER TABLE company_profiles
    ADD COLUMN phone_national_number VARCHAR(50);

ALTER TABLE company_profiles
    ALTER COLUMN phone VARCHAR(70);

MERGE INTO company_profiles AS target
USING (
    WITH normalized AS (
        SELECT cp.id,
               TRIM(cp.phone) AS trimmed_phone,
               POSITION(' ' IN TRIM(cp.phone)) AS first_space
        FROM company_profiles cp
        WHERE cp.phone IS NOT NULL
    ),
    parsed AS (
        SELECT normalized.id,
               normalized.trimmed_phone,
               CASE
                   WHEN normalized.first_space > 1
                   THEN SUBSTRING(normalized.trimmed_phone, 1, normalized.first_space - 1)
                   ELSE NULL
               END AS prefix,
               CASE
                   WHEN normalized.first_space > 1
                   THEN NULLIF(TRIM(SUBSTRING(normalized.trimmed_phone, normalized.first_space + 1)), '')
                   ELSE NULL
               END AS remainder
        FROM normalized
    )
    SELECT parsed.id,
           NULLIF(parsed.trimmed_phone, '') AS next_phone,
           CASE
               WHEN parsed.trimmed_phone LIKE '+%'
                   AND parsed.prefix IS NOT NULL
                   AND LENGTH(parsed.prefix) > 1
                   AND TRANSLATE(parsed.prefix, '+0123456789', '+') = '+'
                   AND parsed.remainder IS NOT NULL
               THEN parsed.prefix
               ELSE NULL
           END AS next_phone_dial_code,
           CASE
               WHEN NULLIF(parsed.trimmed_phone, '') IS NULL THEN NULL
               WHEN parsed.trimmed_phone LIKE '+%'
                   AND parsed.prefix IS NOT NULL
                   AND LENGTH(parsed.prefix) > 1
                   AND TRANSLATE(parsed.prefix, '+0123456789', '+') = '+'
                   AND parsed.remainder IS NOT NULL
               THEN parsed.remainder
               ELSE parsed.trimmed_phone
           END AS next_phone_national_number
    FROM parsed
) AS source
ON target.id = source.id
WHEN MATCHED THEN UPDATE
SET target.phone = source.next_phone,
    target.phone_dial_code = source.next_phone_dial_code,
    target.phone_national_number = source.next_phone_national_number,
    target.updated_at = CURRENT_TIMESTAMP;
