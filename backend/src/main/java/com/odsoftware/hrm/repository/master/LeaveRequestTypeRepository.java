package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.LeaveRequestType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRequestTypeRepository extends MasterDataRepository<LeaveRequestType> {

	boolean existsByTenantIdAndCode(UUID tenantId, String code);

	boolean existsByTenantIdAndCodeAndIdNot(UUID tenantId, String code, UUID id);
}
