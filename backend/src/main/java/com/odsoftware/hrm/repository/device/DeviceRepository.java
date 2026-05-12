package com.odsoftware.hrm.repository.device;

import com.odsoftware.hrm.entity.device.Device;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceRepository extends JpaRepository<Device, UUID> {

	List<Device> findByTenant_IdAndCompanyProfile_Id(UUID tenantId, UUID companyProfileId);

	List<Device> findByTenant_IdAndAssignedTo_Id(UUID tenantId, UUID employeeId);

	boolean existsByType_Id(UUID deviceTypeId);

	boolean existsByBrand_Id(UUID deviceBrandId);

	boolean existsByDeviceStatus_Id(UUID deviceStatusId);
}
