package com.odsoftware.hrm.repository.core;

import com.odsoftware.hrm.entity.core.OfficeLocation;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfficeLocationRepository extends JpaRepository<OfficeLocation, UUID> {

	boolean existsByTenant_IdAndOfficeLocationType_Id(UUID tenantId, UUID officeLocationTypeId);
}
