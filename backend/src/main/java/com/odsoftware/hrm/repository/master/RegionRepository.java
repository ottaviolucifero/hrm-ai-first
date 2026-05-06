package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.Region;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegionRepository extends MasterDataRepository<Region> {

	boolean existsByCountry_IdAndCode(UUID countryId, String code);

	boolean existsByCountry_IdAndCodeAndIdNot(UUID countryId, String code, UUID id);
}
