package com.odsoftware.hrm.repository.device;

import com.odsoftware.hrm.entity.device.Device;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface DeviceRepository extends JpaRepository<Device, UUID>, JpaSpecificationExecutor<Device> {

	List<Device> findByTenant_IdAndCompanyProfile_Id(UUID tenantId, UUID companyProfileId);

	List<Device> findByTenant_IdAndAssignedTo_Id(UUID tenantId, UUID employeeId);

	boolean existsByType_Id(UUID deviceTypeId);

	boolean existsByBrand_Id(UUID deviceBrandId);

	boolean existsByDeviceStatus_Id(UUID deviceStatusId);

	@Query("select device.assetCode from Device device where device.tenant.id = :tenantId order by device.assetCode desc")
	List<String> findAssetCodesByTenantIdOrderByAssetCodeDesc(UUID tenantId);

	@Override
	@EntityGraph(attributePaths = {
			"tenant",
			"companyProfile",
			"type",
			"brand",
			"deviceStatus",
			"assignedTo"
	})
	Page<Device> findAll(Specification<Device> specification, Pageable pageable);

	@EntityGraph(attributePaths = {
			"tenant",
			"companyProfile",
			"type",
			"brand",
			"deviceStatus",
			"assignedTo"
	})
	Optional<Device> findWithAdministrationGraphById(UUID id);
}
