package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.DeviceStatus;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceStatusRepository extends MasterDataRepository<DeviceStatus> {

	boolean existsByTenantIdAndCode(UUID tenantId, String code);

	boolean existsByTenantIdAndCodeAndIdNot(UUID tenantId, String code, UUID id);
}
