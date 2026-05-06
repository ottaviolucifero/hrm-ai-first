package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.NationalIdentifierType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NationalIdentifierTypeRepository extends MasterDataRepository<NationalIdentifierType> {

	boolean existsByCountry_IdAndCode(UUID countryId, String code);

	boolean existsByCountry_IdAndCodeAndIdNot(UUID countryId, String code, UUID id);
}
