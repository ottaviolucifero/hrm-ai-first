ALTER TABLE company_profiles
    ADD COLUMN phone_dial_code VARCHAR(10),
    ADD COLUMN phone_national_number VARCHAR(50);

ALTER TABLE company_profiles
    ALTER COLUMN phone TYPE VARCHAR(70);

WITH normalized AS (
    SELECT cp.id,
           BTRIM(cp.phone) AS trimmed_phone,
           POSITION(' ' IN BTRIM(cp.phone)) AS first_space
    FROM company_profiles cp
    WHERE cp.phone IS NOT NULL
),
parsed AS (
    SELECT normalized.id,
           normalized.trimmed_phone,
           CASE
               WHEN normalized.first_space > 1
               THEN SUBSTRING(normalized.trimmed_phone FROM 1 FOR normalized.first_space - 1)
               ELSE NULL
           END AS prefix,
           CASE
               WHEN normalized.first_space > 1
               THEN NULLIF(BTRIM(SUBSTRING(normalized.trimmed_phone FROM normalized.first_space + 1)), '')
               ELSE NULL
           END AS remainder
    FROM normalized
)
UPDATE company_profiles cp
SET phone = NULLIF(parsed.trimmed_phone, ''),
    phone_dial_code = CASE
        WHEN parsed.trimmed_phone LIKE '+%'
            AND parsed.prefix IS NOT NULL
            AND LENGTH(parsed.prefix) > 1
            AND TRANSLATE(parsed.prefix, '+0123456789', '+') = '+'
            AND parsed.remainder IS NOT NULL
        THEN parsed.prefix
        ELSE NULL
    END,
    phone_national_number = CASE
        WHEN NULLIF(parsed.trimmed_phone, '') IS NULL THEN NULL
        WHEN parsed.trimmed_phone LIKE '+%'
            AND parsed.prefix IS NOT NULL
            AND LENGTH(parsed.prefix) > 1
            AND TRANSLATE(parsed.prefix, '+0123456789', '+') = '+'
            AND parsed.remainder IS NOT NULL
        THEN parsed.remainder
        ELSE parsed.trimmed_phone
    END,
    updated_at = CURRENT_TIMESTAMP
FROM parsed
WHERE cp.id = parsed.id;
