package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.DeviceType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceTypeRepository extends MasterDataRepository<DeviceType> {

	boolean existsByTenantIdAndCode(UUID tenantId, String code);

	boolean existsByTenantIdAndCodeAndIdNot(UUID tenantId, String code, UUID id);
}
