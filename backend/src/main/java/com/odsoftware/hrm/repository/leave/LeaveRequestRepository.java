package com.odsoftware.hrm.repository.leave;

import com.odsoftware.hrm.entity.leave.LeaveRequest;
import com.odsoftware.hrm.entity.leave.LeaveRequestStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import static jakarta.persistence.LockModeType.PESSIMISTIC_WRITE;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, UUID> {

	List<LeaveRequest> findByTenant_IdAndEmployee_Id(UUID tenantId, UUID employeeId);

	List<LeaveRequest> findByTenant_IdAndEmployee_IdAndStatus(UUID tenantId, UUID employeeId, LeaveRequestStatus status);

	List<LeaveRequest> findByTenant_IdAndCompanyProfile_Id(UUID tenantId, UUID companyProfileId);

	boolean existsByLeaveRequestType_Id(UUID leaveRequestTypeId);

	@EntityGraph(attributePaths = {
			"tenant",
			"companyProfile",
			"employee",
			"leaveRequestType",
			"approver"
	})
	Optional<LeaveRequest> findWithAdministrationGraphById(UUID id);

	@Lock(PESSIMISTIC_WRITE)
	@EntityGraph(attributePaths = {
			"tenant",
			"companyProfile",
			"employee",
			"leaveRequestType",
			"approver"
	})
	@Query("select leaveRequest from LeaveRequest leaveRequest where leaveRequest.id = :id")
	Optional<LeaveRequest> findWithAdministrationGraphByIdForUpdate(UUID id);
}
