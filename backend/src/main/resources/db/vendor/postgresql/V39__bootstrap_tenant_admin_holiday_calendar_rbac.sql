INSERT INTO role_permissions (id, tenant_id, role_id, permission_id)
SELECT CAST(seed.id AS UUID), role.tenant_id, role.id, permission.id
FROM roles role
CROSS JOIN (
    VALUES
        ('76300000-0000-0000-0000-000000000025', 'TENANT.HOLIDAY_CALENDAR.READ'),
        ('76300000-0000-0000-0000-000000000026', 'TENANT.HOLIDAY_CALENDAR.CREATE'),
        ('76300000-0000-0000-0000-000000000027', 'TENANT.HOLIDAY_CALENDAR.UPDATE'),
        ('76300000-0000-0000-0000-000000000028', 'TENANT.HOLIDAY_CALENDAR.DELETE')
) seed(id, permission_code)
JOIN permissions permission
  ON permission.tenant_id = role.tenant_id
 AND permission.code = seed.permission_code
WHERE role.tenant_id = CAST('00000000-0000-0000-0000-000000000001' AS UUID)
  AND role.code = 'TENANT_ADMIN'
  AND NOT EXISTS (
      SELECT 1
      FROM role_permissions existing
      WHERE existing.tenant_id = role.tenant_id
        AND existing.role_id = role.id
        AND existing.permission_id = permission.id
  );
