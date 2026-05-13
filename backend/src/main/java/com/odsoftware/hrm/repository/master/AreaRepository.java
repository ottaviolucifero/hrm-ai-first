package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.Area;
import java.util.UUID;

public interface AreaRepository extends MasterDataRepository<Area> {

	boolean existsByTenantIdAndRegion_IdAndCode(UUID tenantId, UUID regionId, String code);

	boolean existsByTenantIdAndRegion_IdAndCodeAndIdNot(UUID tenantId, UUID regionId, String code, UUID id);
}
