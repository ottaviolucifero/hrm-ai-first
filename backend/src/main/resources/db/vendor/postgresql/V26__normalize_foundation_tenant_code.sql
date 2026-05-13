DROP TABLE IF EXISTS tmp_foundation_tenant_code;
CREATE TEMP TABLE tmp_foundation_tenant_code AS
WITH digits AS (
    SELECT 0 AS digit
    UNION ALL SELECT 1
    UNION ALL SELECT 2
    UNION ALL SELECT 3
    UNION ALL SELECT 4
    UNION ALL SELECT 5
    UNION ALL SELECT 6
    UNION ALL SELECT 7
    UNION ALL SELECT 8
    UNION ALL SELECT 9
),
candidate_codes AS (
    SELECT 'TE' || LPAD(CAST((hundreds.digit * 100 + tens.digit * 10 + ones.digit + 1) AS VARCHAR), 3, '0') AS code
    FROM digits hundreds
    CROSS JOIN digits tens
    CROSS JOIN digits ones
    WHERE hundreds.digit * 100 + tens.digit * 10 + ones.digit < 999
),
available_codes AS (
    SELECT candidate_codes.code
    FROM candidate_codes
    WHERE NOT EXISTS (
        SELECT 1
        FROM tenants
        WHERE tenants.code = candidate_codes.code
    )
    ORDER BY candidate_codes.code
    FETCH FIRST 1 ROW ONLY
)
SELECT code
FROM available_codes;

UPDATE tenants
SET code = (SELECT code FROM tmp_foundation_tenant_code)
WHERE id = '00000000-0000-0000-0000-000000000001'
  AND code = 'FOUNDATION_TENANT'
  AND EXISTS (SELECT 1 FROM tmp_foundation_tenant_code);

DROP TABLE IF EXISTS tmp_foundation_tenant_code;
