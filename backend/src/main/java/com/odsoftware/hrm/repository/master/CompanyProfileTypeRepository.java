package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.CompanyProfileType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyProfileTypeRepository extends MasterDataRepository<CompanyProfileType> {

	boolean existsByTenantIdAndCode(UUID tenantId, String code);

	boolean existsByTenantIdAndCodeAndIdNot(UUID tenantId, String code, UUID id);
}
