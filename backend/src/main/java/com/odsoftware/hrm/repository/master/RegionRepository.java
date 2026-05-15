package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.Region;
import java.util.UUID;

public interface RegionRepository extends MasterDataRepository<Region> {

	boolean existsByTenantIdAndCountry_IdAndCode(UUID tenantId, UUID countryId, String code);

	boolean existsByTenantIdAndCountry_IdAndCodeAndIdNot(UUID tenantId, UUID countryId, String code, UUID id);

	long countByCountry_Id(UUID countryId);
}
