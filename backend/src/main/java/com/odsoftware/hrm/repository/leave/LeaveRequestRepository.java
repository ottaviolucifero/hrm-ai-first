package com.odsoftware.hrm.repository.leave;

import com.odsoftware.hrm.entity.leave.LeaveRequest;
import com.odsoftware.hrm.entity.leave.LeaveRequestStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, UUID> {

	List<LeaveRequest> findByTenant_IdAndEmployee_Id(UUID tenantId, UUID employeeId);

	List<LeaveRequest> findByTenant_IdAndEmployee_IdAndStatus(UUID tenantId, UUID employeeId, LeaveRequestStatus status);

	List<LeaveRequest> findByTenant_IdAndCompanyProfile_Id(UUID tenantId, UUID companyProfileId);
}
