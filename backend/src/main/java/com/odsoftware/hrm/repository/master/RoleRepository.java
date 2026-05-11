package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.Role;
import java.util.List;
import java.util.UUID;

public interface RoleRepository extends MasterDataRepository<Role> {

	boolean existsByTenantIdAndCode(UUID tenantId, String code);

	boolean existsByTenantIdAndCodeAndIdNot(UUID tenantId, String code, UUID id);

	List<Role> findByTenantIdAndActiveTrueOrderByCodeAsc(UUID tenantId);
}
