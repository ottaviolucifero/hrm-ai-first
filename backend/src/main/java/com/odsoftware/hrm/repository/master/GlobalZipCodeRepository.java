package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.GlobalZipCode;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GlobalZipCodeRepository extends JpaRepository<GlobalZipCode, UUID> {

	boolean existsByCountry_IdAndPostalCodeAndCity(UUID countryId, String postalCode, String city);

	boolean existsByCountry_IdAndPostalCodeAndCityAndIdNot(UUID countryId, String postalCode, String city, UUID id);
}
