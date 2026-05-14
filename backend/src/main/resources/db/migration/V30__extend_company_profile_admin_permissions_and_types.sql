INSERT INTO permissions (id, tenant_id, code, name, system_permission, active, created_at, updated_at)
SELECT CAST(seed.id AS UUID),
       CAST('00000000-0000-0000-0000-000000000001' AS UUID),
       seed.code,
       seed.name,
       TRUE,
       TRUE,
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
FROM (VALUES
    ('76100000-0000-0000-0000-000000000054', 'PLATFORM.COMPANY_PROFILE.DELETE', 'Platform Company Profile Delete'),
    ('76200000-0000-0000-0000-000000000099', 'TENANT.COMPANY_PROFILE.DELETE', 'Tenant Company Profile Delete')
) AS seed(id, code, name)
WHERE NOT EXISTS (
    SELECT 1
    FROM permissions existing
    WHERE existing.tenant_id = CAST('00000000-0000-0000-0000-000000000001' AS UUID)
      AND existing.code = seed.code
);

UPDATE company_profile_types
SET name = 'Business unit',
    updated_at = CURRENT_TIMESTAMP
WHERE id = CAST('77000000-0000-0000-0000-000000000002' AS UUID)
  AND tenant_id = CAST('00000000-0000-0000-0000-000000000001' AS UUID);

INSERT INTO company_profile_types (id, tenant_id, code, name, active, created_at, updated_at)
SELECT CAST(seed.id AS UUID),
       CAST('00000000-0000-0000-0000-000000000001' AS UUID),
       seed.code,
       seed.name,
       TRUE,
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
FROM (VALUES
    ('77000000-0000-0000-0000-000000000003', 'CP003', 'Branch'),
    ('77000000-0000-0000-0000-000000000004', 'CP004', 'Subsidiary'),
    ('77000000-0000-0000-0000-000000000005', 'CP005', 'Public entity')
) AS seed(id, code, name)
WHERE NOT EXISTS (
    SELECT 1
    FROM company_profile_types existing
    WHERE existing.tenant_id = CAST('00000000-0000-0000-0000-000000000001' AS UUID)
      AND existing.id = CAST(seed.id AS UUID)
);
