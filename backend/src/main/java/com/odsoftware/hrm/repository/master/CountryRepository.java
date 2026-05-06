package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.Country;
import java.util.Optional;
import java.util.UUID;

public interface CountryRepository extends MasterDataRepository<Country> {

	boolean existsByIsoCode(String isoCode);

	boolean existsByIsoCodeAndIdNot(String isoCode, UUID id);

	Optional<Country> findByIsoCode(String isoCode);
}
