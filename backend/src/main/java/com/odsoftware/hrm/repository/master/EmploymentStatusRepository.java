package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.EmploymentStatus;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmploymentStatusRepository extends MasterDataRepository<EmploymentStatus> {

	boolean existsByTenantIdAndCode(UUID tenantId, String code);

	boolean existsByTenantIdAndCodeAndIdNot(UUID tenantId, String code, UUID id);
}
