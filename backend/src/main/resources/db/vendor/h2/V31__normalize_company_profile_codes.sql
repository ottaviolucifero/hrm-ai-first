MERGE INTO company_profiles AS target
USING (
    WITH valid_codes AS (
        SELECT cp.tenant_id,
               MAX(CAST(SUBSTRING(UPPER(TRIM(cp.code)), 3, 3) AS INTEGER)) AS max_progressive
        FROM company_profiles cp
        WHERE LENGTH(TRIM(cp.code)) = 5
          AND UPPER(TRIM(cp.code)) LIKE 'CP___'
          AND TRANSLATE(SUBSTRING(UPPER(TRIM(cp.code)), 3, 3), '0123456789', '') = ''
        GROUP BY cp.tenant_id
    ),
    invalid_profiles AS (
        SELECT cp.id,
               cp.tenant_id,
               ROW_NUMBER() OVER (
                   PARTITION BY cp.tenant_id
                   ORDER BY cp.created_at, cp.id
               ) AS progressive_offset
        FROM company_profiles cp
        WHERE NOT (
            LENGTH(TRIM(cp.code)) = 5
            AND UPPER(TRIM(cp.code)) LIKE 'CP___'
            AND TRANSLATE(SUBSTRING(UPPER(TRIM(cp.code)), 3, 3), '0123456789', '') = ''
        )
    )
    SELECT invalid_profiles.id,
           'CP' || LPAD(CAST(COALESCE(valid_codes.max_progressive, 0) + invalid_profiles.progressive_offset AS VARCHAR), 3, '0') AS next_code
    FROM invalid_profiles
    LEFT JOIN valid_codes
        ON valid_codes.tenant_id = invalid_profiles.tenant_id
) AS source
ON target.id = source.id
WHEN MATCHED THEN UPDATE
SET target.code = source.next_code,
    target.updated_at = CURRENT_TIMESTAMP;
