package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.GlobalZipCode;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GlobalZipCodeRepository extends MasterDataRepository<GlobalZipCode> {

	boolean existsByTenantIdIsNullAndCountry_IdAndPostalCodeAndCity(UUID countryId, String postalCode, String city);

	boolean existsByTenantIdIsNullAndCountry_IdAndPostalCodeAndCityAndIdNot(UUID countryId, String postalCode, String city, UUID id);

	boolean existsByTenantIdAndCountry_IdAndPostalCodeAndCity(UUID tenantId, UUID countryId, String postalCode, String city);

	boolean existsByTenantIdAndCountry_IdAndPostalCodeAndCityAndIdNot(UUID tenantId, UUID countryId, String postalCode, String city, UUID id);

	Optional<GlobalZipCode> findByTenantIdIsNullAndCountry_IdAndPostalCodeAndCity(UUID countryId, String postalCode, String city);

	Optional<GlobalZipCode> findByTenantIdAndCountry_IdAndPostalCodeAndCity(UUID tenantId, UUID countryId, String postalCode, String city);

	long countByCountry_Id(UUID countryId);

	List<GlobalZipCode> findByCountry_IdAndCity(UUID countryId, String city);
}
