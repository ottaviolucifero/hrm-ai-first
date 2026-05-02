package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.Country;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryRepository extends JpaRepository<Country, UUID> {
}
