package com.odsoftware.hrm.controller;

import com.odsoftware.hrm.dto.leaverequestadministration.LeaveRequestAdministrationCreateRequest;
import com.odsoftware.hrm.dto.leaverequestadministration.LeaveRequestAdministrationDetailResponse;
import com.odsoftware.hrm.dto.leaverequestadministration.LeaveRequestAdministrationUpdateRequest;
import com.odsoftware.hrm.service.LeaveRequestAdministrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/leave-requests")
@Tag(name = "Leave Request Administration", description = "Administrative CRUD API for leave requests")
@Validated
public class LeaveRequestAdministrationController {

	private final LeaveRequestAdministrationService leaveRequestAdministrationService;

	public LeaveRequestAdministrationController(LeaveRequestAdministrationService leaveRequestAdministrationService) {
		this.leaveRequestAdministrationService = leaveRequestAdministrationService;
	}

	@GetMapping("/{leaveRequestId}")
	@Operation(summary = "Get leave request administration detail")
	public LeaveRequestAdministrationDetailResponse findLeaveRequestById(@PathVariable UUID leaveRequestId) {
		return leaveRequestAdministrationService.findLeaveRequestById(leaveRequestId);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create leave request")
	public LeaveRequestAdministrationDetailResponse createLeaveRequest(
			@Valid @RequestBody LeaveRequestAdministrationCreateRequest request) {
		return leaveRequestAdministrationService.createLeaveRequest(request);
	}

	@PostMapping("/{leaveRequestId}/approve")
	@Operation(summary = "Approve leave request from status SUBMITTED")
	public LeaveRequestAdministrationDetailResponse approveLeaveRequest(@PathVariable UUID leaveRequestId) {
		return leaveRequestAdministrationService.approveLeaveRequest(leaveRequestId);
	}

	@PostMapping("/{leaveRequestId}/reject")
	@Operation(summary = "Reject leave request from status SUBMITTED")
	public LeaveRequestAdministrationDetailResponse rejectLeaveRequest(@PathVariable UUID leaveRequestId) {
		return leaveRequestAdministrationService.rejectLeaveRequest(leaveRequestId);
	}

	@PutMapping("/{leaveRequestId}")
	@Operation(summary = "Update leave request")
	public LeaveRequestAdministrationDetailResponse updateLeaveRequest(
			@PathVariable UUID leaveRequestId,
			@Valid @RequestBody LeaveRequestAdministrationUpdateRequest request) {
		return leaveRequestAdministrationService.updateLeaveRequest(leaveRequestId, request);
	}

	@DeleteMapping("/{leaveRequestId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Cancel leave request by setting status CANCELLED")
	public void deleteLeaveRequest(@PathVariable UUID leaveRequestId) {
		leaveRequestAdministrationService.cancelLeaveRequest(leaveRequestId);
	}
}
