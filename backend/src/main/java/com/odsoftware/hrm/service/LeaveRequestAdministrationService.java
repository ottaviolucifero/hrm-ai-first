package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.leaverequestadministration.LeaveRequestAdministrationCreateRequest;
import com.odsoftware.hrm.dto.leaverequestadministration.LeaveRequestAdministrationDetailResponse;
import com.odsoftware.hrm.dto.leaverequestadministration.LeaveRequestAdministrationReferenceResponse;
import com.odsoftware.hrm.dto.leaverequestadministration.LeaveRequestAdministrationUpdateRequest;
import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.leave.LeaveRequest;
import com.odsoftware.hrm.entity.leave.LeaveRequestStatus;
import com.odsoftware.hrm.entity.master.LeaveRequestType;
import com.odsoftware.hrm.exception.InvalidRequestException;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.employee.EmployeeRepository;
import com.odsoftware.hrm.repository.leave.LeaveRequestRepository;
import com.odsoftware.hrm.repository.master.LeaveRequestTypeRepository;
import com.odsoftware.hrm.security.CurrentCaller;
import com.odsoftware.hrm.security.CurrentCallerService;
import java.util.UUID;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class LeaveRequestAdministrationService {

	private final LeaveRequestRepository leaveRequestRepository;
	private final EmployeeRepository employeeRepository;
	private final LeaveRequestTypeRepository leaveRequestTypeRepository;
	private final CurrentCallerService currentCallerService;

	public LeaveRequestAdministrationService(
			LeaveRequestRepository leaveRequestRepository,
			EmployeeRepository employeeRepository,
			LeaveRequestTypeRepository leaveRequestTypeRepository,
			CurrentCallerService currentCallerService) {
		this.leaveRequestRepository = leaveRequestRepository;
		this.employeeRepository = employeeRepository;
		this.leaveRequestTypeRepository = leaveRequestTypeRepository;
		this.currentCallerService = currentCallerService;
	}

	public LeaveRequestAdministrationDetailResponse findLeaveRequestById(UUID leaveRequestId) {
		return toDetailResponse(findLeaveRequestForAdministration(leaveRequestId));
	}

	@Transactional
	public LeaveRequestAdministrationDetailResponse createLeaveRequest(LeaveRequestAdministrationCreateRequest request) {
		assertCallerCanManageTenant(request.tenantId());
		Employee employee = findActiveEmployeeForTenant(request.employeeId(), request.tenantId());
		LeaveRequestType leaveRequestType = findActiveLeaveRequestTypeForTenant(request.leaveRequestTypeId(), request.tenantId());
		LeaveRequestStatus status = resolveCreateStatus(request.status());
		validateDateRange(request.startDate(), request.endDate());
		String urgentReason = validateUrgentReason(request.urgent(), request.urgentReason());

		LeaveRequest leaveRequest = new LeaveRequest();
		leaveRequest.setTenant(employee.getTenant());
		leaveRequest.setCompanyProfile(employee.getCompany());
		leaveRequest.setEmployee(employee);
		leaveRequest.setLeaveRequestType(leaveRequestType);
		leaveRequest.setStartDate(request.startDate());
		leaveRequest.setEndDate(request.endDate());
		leaveRequest.setDurationDays(request.durationDays());
		leaveRequest.setDeductFromBalance(request.deductFromBalance());
		leaveRequest.setDeductedDays(request.deductedDays());
		leaveRequest.setReason(clean(request.reason()));
		leaveRequest.setStatus(status);
		leaveRequest.setComments(clean(request.comments()));
		leaveRequest.setUrgent(request.urgent());
		leaveRequest.setUrgentReason(urgentReason);
		return toDetailResponse(leaveRequestRepository.saveAndFlush(leaveRequest));
	}

	@Transactional
	public LeaveRequestAdministrationDetailResponse updateLeaveRequest(
			UUID leaveRequestId,
			LeaveRequestAdministrationUpdateRequest request) {
		LeaveRequest leaveRequest = lockLeaveRequestForAdministration(leaveRequestId);
		assertLeaveRequestIsMutable(leaveRequest);
		UUID tenantId = leaveRequest.getTenant().getId();
		Employee employee = findActiveEmployeeForTenant(request.employeeId(), tenantId);
		LeaveRequestType leaveRequestType = findActiveLeaveRequestTypeForTenant(request.leaveRequestTypeId(), tenantId);
		LeaveRequestStatus status = validateOpenStatus(request.status());
		validateDateRange(request.startDate(), request.endDate());
		String urgentReason = validateUrgentReason(request.urgent(), request.urgentReason());

		leaveRequest.setCompanyProfile(employee.getCompany());
		leaveRequest.setEmployee(employee);
		leaveRequest.setLeaveRequestType(leaveRequestType);
		leaveRequest.setStartDate(request.startDate());
		leaveRequest.setEndDate(request.endDate());
		leaveRequest.setDurationDays(request.durationDays());
		leaveRequest.setDeductFromBalance(request.deductFromBalance());
		leaveRequest.setDeductedDays(request.deductedDays());
		leaveRequest.setReason(clean(request.reason()));
		leaveRequest.setStatus(status);
		leaveRequest.setComments(clean(request.comments()));
		leaveRequest.setUrgent(request.urgent());
		leaveRequest.setUrgentReason(urgentReason);
		return toDetailResponse(leaveRequestRepository.saveAndFlush(leaveRequest));
	}

	@Transactional
	public LeaveRequestAdministrationDetailResponse approveLeaveRequest(UUID leaveRequestId) {
		LeaveRequest leaveRequest = lockLeaveRequestForAdministration(leaveRequestId);
		assertLeaveRequestIsSubmittedForWorkflow(leaveRequest, "approved");
		leaveRequest.setStatus(LeaveRequestStatus.APPROVED);
		return toDetailResponse(leaveRequestRepository.saveAndFlush(leaveRequest));
	}

	@Transactional
	public LeaveRequestAdministrationDetailResponse rejectLeaveRequest(UUID leaveRequestId) {
		LeaveRequest leaveRequest = lockLeaveRequestForAdministration(leaveRequestId);
		assertLeaveRequestIsSubmittedForWorkflow(leaveRequest, "rejected");
		leaveRequest.setStatus(LeaveRequestStatus.REJECTED);
		return toDetailResponse(leaveRequestRepository.saveAndFlush(leaveRequest));
	}

	@Transactional
	public void cancelLeaveRequest(UUID leaveRequestId) {
		LeaveRequest leaveRequest = lockLeaveRequestForAdministration(leaveRequestId);
		assertLeaveRequestIsMutable(leaveRequest);
		leaveRequest.setStatus(LeaveRequestStatus.CANCELLED);
		leaveRequestRepository.saveAndFlush(leaveRequest);
	}

	private LeaveRequest findLeaveRequestForAdministration(UUID leaveRequestId) {
		LeaveRequest leaveRequest = leaveRequestRepository.findWithAdministrationGraphById(leaveRequestId)
				.orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + leaveRequestId));
		assertCallerCanManageTenant(leaveRequest.getTenant().getId());
		return leaveRequest;
	}

	private LeaveRequest lockLeaveRequestForAdministration(UUID leaveRequestId) {
		LeaveRequest leaveRequest = leaveRequestRepository.findWithAdministrationGraphByIdForUpdate(leaveRequestId)
				.orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + leaveRequestId));
		assertCallerCanManageTenant(leaveRequest.getTenant().getId());
		return leaveRequest;
	}

	private Employee findActiveEmployeeForTenant(UUID employeeId, UUID tenantId) {
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));
		if (!tenantId.equals(employee.getTenant().getId())) {
			throw new InvalidRequestException("Employee does not belong to tenant: " + employeeId);
		}
		if (!Boolean.TRUE.equals(employee.getActive())) {
			throw new InvalidRequestException("Employee is inactive and cannot be used for leave requests: " + employeeId);
		}
		return employee;
	}

	private LeaveRequestType findActiveLeaveRequestTypeForTenant(UUID leaveRequestTypeId, UUID tenantId) {
		LeaveRequestType leaveRequestType = leaveRequestTypeRepository.findById(leaveRequestTypeId)
				.orElseThrow(() -> new ResourceNotFoundException("Leave request type not found: " + leaveRequestTypeId));
		if (!tenantId.equals(leaveRequestType.getTenantId())) {
			throw new InvalidRequestException("Leave request type does not belong to tenant: " + leaveRequestTypeId);
		}
		if (!Boolean.TRUE.equals(leaveRequestType.getActive())) {
			throw new InvalidRequestException("Leave request type is inactive and cannot be used: " + leaveRequestTypeId);
		}
		return leaveRequestType;
	}

	private LeaveRequestStatus resolveCreateStatus(LeaveRequestStatus status) {
		return status == null ? LeaveRequestStatus.DRAFT : validateOpenStatus(status);
	}

	private LeaveRequestStatus validateOpenStatus(LeaveRequestStatus status) {
		if (status == LeaveRequestStatus.DRAFT || status == LeaveRequestStatus.SUBMITTED) {
			return status;
		}
		throw new InvalidRequestException("Leave request status is not allowed for administration CRUD: " + status);
	}

	private void validateDateRange(java.time.LocalDate startDate, java.time.LocalDate endDate) {
		if (endDate.isBefore(startDate)) {
			throw new InvalidRequestException("Leave request end date must be on or after start date");
		}
	}

	private String validateUrgentReason(Boolean urgent, String urgentReason) {
		String cleanedUrgentReason = clean(urgentReason);
		if (Boolean.TRUE.equals(urgent) && cleanedUrgentReason == null) {
			throw new InvalidRequestException("Urgent reason is required when urgent is true");
		}
		return Boolean.TRUE.equals(urgent) ? cleanedUrgentReason : null;
	}

	private void assertLeaveRequestIsMutable(LeaveRequest leaveRequest) {
		if (isClosedStatus(leaveRequest.getStatus())) {
			throw new InvalidRequestException("Leave request is not editable from status: " + leaveRequest.getStatus());
		}
	}

	private void assertLeaveRequestIsSubmittedForWorkflow(LeaveRequest leaveRequest, String action) {
		if (leaveRequest.getStatus() != LeaveRequestStatus.SUBMITTED) {
			throw new InvalidRequestException(
					"Leave request can be " + action + " only from status: SUBMITTED. Current status: "
							+ leaveRequest.getStatus());
		}
	}

	private boolean isClosedStatus(LeaveRequestStatus status) {
		return status == LeaveRequestStatus.APPROVED
				|| status == LeaveRequestStatus.REJECTED
				|| status == LeaveRequestStatus.CANCELLED;
	}

	private LeaveRequestAdministrationDetailResponse toDetailResponse(LeaveRequest leaveRequest) {
		return new LeaveRequestAdministrationDetailResponse(
				leaveRequest.getId(),
				toTenantReference(leaveRequest.getTenant()),
				toCompanyProfileReference(leaveRequest.getCompanyProfile()),
				toEmployeeReference(leaveRequest.getEmployee()),
				toLeaveRequestTypeReference(leaveRequest.getLeaveRequestType()),
				leaveRequest.getStartDate(),
				leaveRequest.getEndDate(),
				leaveRequest.getDurationDays(),
				leaveRequest.getDeductFromBalance(),
				leaveRequest.getDeductedDays(),
				leaveRequest.getReason(),
				leaveRequest.getStatus(),
				toEmployeeReference(leaveRequest.getApprover()),
				leaveRequest.getComments(),
				leaveRequest.getUrgent(),
				leaveRequest.getUrgentReason(),
				leaveRequest.getCreatedAt(),
				leaveRequest.getUpdatedAt());
	}

	private LeaveRequestAdministrationReferenceResponse toTenantReference(Tenant tenant) {
		return new LeaveRequestAdministrationReferenceResponse(tenant.getId(), tenant.getCode(), tenant.getName());
	}

	private LeaveRequestAdministrationReferenceResponse toCompanyProfileReference(CompanyProfile companyProfile) {
		return new LeaveRequestAdministrationReferenceResponse(
				companyProfile.getId(),
				companyProfile.getCode(),
				companyProfile.getLegalName());
	}

	private LeaveRequestAdministrationReferenceResponse toEmployeeReference(Employee employee) {
		if (employee == null) {
			return null;
		}
		return new LeaveRequestAdministrationReferenceResponse(
				employee.getId(),
				employee.getEmployeeCode(),
				employeeDisplayName(employee));
	}

	private LeaveRequestAdministrationReferenceResponse toLeaveRequestTypeReference(LeaveRequestType leaveRequestType) {
		return new LeaveRequestAdministrationReferenceResponse(
				leaveRequestType.getId(),
				leaveRequestType.getCode(),
				leaveRequestType.getName());
	}

	private String employeeDisplayName(Employee employee) {
		String displayName = (safe(employee.getFirstName()) + " " + safe(employee.getLastName())).trim();
		return displayName.isEmpty() ? employee.getEmployeeCode() : displayName;
	}

	private void assertCallerCanManageTenant(UUID tenantId) {
		CurrentCaller caller = currentCaller();
		if (!caller.isPlatformUser() && !caller.tenantId().equals(tenantId)) {
			throw new AccessDeniedException("Cross-tenant leave request administration is not allowed for caller");
		}
	}

	private CurrentCaller currentCaller() {
		return currentCallerService.requireCurrentCaller();
	}

	private String clean(String value) {
		if (value == null) {
			return null;
		}
		String cleaned = value.trim();
		return cleaned.isEmpty() ? null : cleaned;
	}

	private String safe(String value) {
		return value == null ? "" : value.trim();
	}
}
