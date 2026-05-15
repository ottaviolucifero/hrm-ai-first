package com.odsoftware.hrm.repository.core;

import com.odsoftware.hrm.entity.core.CompanyProfile;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, UUID>, JpaSpecificationExecutor<CompanyProfile> {

	boolean existsByTenant_IdAndCompanyProfileType_Id(UUID tenantId, UUID companyProfileTypeId);

	boolean existsByRegion_Id(UUID regionId);

	boolean existsByArea_Id(UUID areaId);
}
