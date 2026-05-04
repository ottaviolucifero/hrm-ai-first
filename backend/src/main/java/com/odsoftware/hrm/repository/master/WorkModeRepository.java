package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.WorkMode;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkModeRepository extends JpaRepository<WorkMode, UUID> {

	boolean existsByTenantIdAndCode(UUID tenantId, String code);

	boolean existsByTenantIdAndCodeAndIdNot(UUID tenantId, String code, UUID id);
}
