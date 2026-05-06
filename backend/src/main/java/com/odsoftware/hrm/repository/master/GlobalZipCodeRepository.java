package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.GlobalZipCode;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GlobalZipCodeRepository extends MasterDataRepository<GlobalZipCode> {

	boolean existsByCountry_IdAndPostalCodeAndCity(UUID countryId, String postalCode, String city);

	boolean existsByCountry_IdAndPostalCodeAndCityAndIdNot(UUID countryId, String postalCode, String city, UUID id);

	Optional<GlobalZipCode> findByCountry_IdAndPostalCodeAndCity(UUID countryId, String postalCode, String city);

	long countByCountry_Id(UUID countryId);

	List<GlobalZipCode> findByCountry_IdAndCity(UUID countryId, String city);
}
