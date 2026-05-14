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
    ('76100000-0000-0000-0000-000000000051', 'PLATFORM.COMPANY_PROFILE.READ', 'Platform Company Profile Read'),
    ('76100000-0000-0000-0000-000000000052', 'PLATFORM.COMPANY_PROFILE.CREATE', 'Platform Company Profile Create'),
    ('76100000-0000-0000-0000-000000000053', 'PLATFORM.COMPANY_PROFILE.UPDATE', 'Platform Company Profile Update'),
    ('76200000-0000-0000-0000-000000000096', 'TENANT.COMPANY_PROFILE.READ', 'Tenant Company Profile Read'),
    ('76200000-0000-0000-0000-000000000097', 'TENANT.COMPANY_PROFILE.CREATE', 'Tenant Company Profile Create'),
    ('76200000-0000-0000-0000-000000000098', 'TENANT.COMPANY_PROFILE.UPDATE', 'Tenant Company Profile Update')
) AS seed(id, code, name)
WHERE NOT EXISTS (
    SELECT 1
    FROM permissions existing
    WHERE existing.tenant_id = CAST('00000000-0000-0000-0000-000000000001' AS UUID)
      AND existing.code = seed.code
);
