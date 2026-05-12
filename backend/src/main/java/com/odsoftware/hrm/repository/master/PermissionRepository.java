package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.Permission;
import java.util.UUID;

public interface PermissionRepository extends MasterDataRepository<Permission> {

	boolean existsByTenantIdAndCode(UUID tenantId, String code);

	boolean existsByTenantIdAndCodeAndIdNot(UUID tenantId, String code, UUID id);
}
