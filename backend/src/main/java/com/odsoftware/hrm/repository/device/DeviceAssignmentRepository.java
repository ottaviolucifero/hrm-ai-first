package com.odsoftware.hrm.repository.device;

import com.odsoftware.hrm.entity.device.DeviceAssignment;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceAssignmentRepository extends JpaRepository<DeviceAssignment, UUID> {

	@EntityGraph(attributePaths = {"employee", "assignedByUser"})
	List<DeviceAssignment> findByTenant_IdAndDevice_IdOrderByAssignedFromDescCreatedAtDesc(UUID tenantId, UUID deviceId);

	@EntityGraph(attributePaths = {"employee", "assignedByUser"})
	List<DeviceAssignment> findByTenant_IdAndDevice_IdAndAssignedToIsNullOrderByAssignedFromAsc(UUID tenantId, UUID deviceId);
}
