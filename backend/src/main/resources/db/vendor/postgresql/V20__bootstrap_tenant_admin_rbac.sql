INSERT INTO role_permissions (id, tenant_id, role_id, permission_id)
SELECT CAST(seed.id AS UUID), role.tenant_id, role.id, permission.id
FROM roles role
CROSS JOIN (
    VALUES
        ('76300000-0000-0000-0000-000000000001', 'TENANT.MASTER_DATA.READ'),
        ('76300000-0000-0000-0000-000000000002', 'TENANT.MASTER_DATA.CREATE'),
        ('76300000-0000-0000-0000-000000000003', 'TENANT.MASTER_DATA.UPDATE'),
        ('76300000-0000-0000-0000-000000000004', 'TENANT.MASTER_DATA.DELETE'),
        ('76300000-0000-0000-0000-000000000005', 'TENANT.USER.READ'),
        ('76300000-0000-0000-0000-000000000006', 'TENANT.USER.CREATE'),
        ('76300000-0000-0000-0000-000000000007', 'TENANT.USER.UPDATE'),
        ('76300000-0000-0000-0000-000000000008', 'TENANT.USER.DELETE'),
        ('76300000-0000-0000-0000-000000000009', 'TENANT.ROLE.READ'),
        ('76300000-0000-0000-0000-000000000010', 'TENANT.ROLE.CREATE'),
        ('76300000-0000-0000-0000-000000000011', 'TENANT.ROLE.UPDATE'),
        ('76300000-0000-0000-0000-000000000012', 'TENANT.ROLE.DELETE'),
        ('76300000-0000-0000-0000-000000000013', 'TENANT.PERMISSION.READ'),
        ('76300000-0000-0000-0000-000000000014', 'TENANT.PERMISSION.CREATE'),
        ('76300000-0000-0000-0000-000000000015', 'TENANT.PERMISSION.UPDATE'),
        ('76300000-0000-0000-0000-000000000016', 'TENANT.PERMISSION.DELETE')
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

INSERT INTO user_tenant_accesses (id, user_account_id, tenant_id, access_role, active, created_at, updated_at)
SELECT (
           substr(md5(user_account.id::text || ':tenant-access'), 1, 8) || '-' ||
           substr(md5(user_account.id::text || ':tenant-access'), 9, 4) || '-' ||
           substr(md5(user_account.id::text || ':tenant-access'), 13, 4) || '-' ||
           substr(md5(user_account.id::text || ':tenant-access'), 17, 4) || '-' ||
           substr(md5(user_account.id::text || ':tenant-access'), 21, 12)
       )::uuid,
       user_account.id,
       user_account.tenant_id,
       'TENANT_ADMIN',
       TRUE,
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
FROM user_accounts user_account
JOIN user_types user_type
  ON user_type.id = user_account.user_type_id
WHERE user_type.code = 'TENANT_ADMIN'
  AND NOT EXISTS (
      SELECT 1
      FROM user_tenant_accesses existing
      WHERE existing.user_account_id = user_account.id
        AND existing.tenant_id = user_account.tenant_id
  );

INSERT INTO user_roles (id, tenant_id, user_account_id, role_id)
SELECT (
           substr(md5(user_account.id::text || ':tenant-role'), 1, 8) || '-' ||
           substr(md5(user_account.id::text || ':tenant-role'), 9, 4) || '-' ||
           substr(md5(user_account.id::text || ':tenant-role'), 13, 4) || '-' ||
           substr(md5(user_account.id::text || ':tenant-role'), 17, 4) || '-' ||
           substr(md5(user_account.id::text || ':tenant-role'), 21, 12)
       )::uuid,
       user_account.tenant_id,
       user_account.id,
       role.id
FROM user_accounts user_account
JOIN user_types user_type
  ON user_type.id = user_account.user_type_id
JOIN roles role
  ON role.tenant_id = user_account.tenant_id
 AND role.code = 'TENANT_ADMIN'
 AND role.active = TRUE
WHERE user_type.code = 'TENANT_ADMIN'
  AND NOT EXISTS (
      SELECT 1
      FROM user_roles existing
      WHERE existing.tenant_id = user_account.tenant_id
        AND existing.user_account_id = user_account.id
        AND existing.role_id = role.id
  );
