package com.odsoftware.hrm.dto.leaverequestadministration;

import com.odsoftware.hrm.entity.leave.LeaveRequestStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record LeaveRequestAdministrationDetailResponse(
		UUID id,
		LeaveRequestAdministrationReferenceResponse tenant,
		LeaveRequestAdministrationReferenceResponse companyProfile,
		LeaveRequestAdministrationReferenceResponse employee,
		LeaveRequestAdministrationReferenceResponse leaveRequestType,
		LocalDate startDate,
		LocalDate endDate,
		BigDecimal durationDays,
		Boolean deductFromBalance,
		BigDecimal deductedDays,
		String reason,
		LeaveRequestStatus status,
		LeaveRequestAdministrationReferenceResponse approver,
		String comments,
		Boolean urgent,
		String urgentReason,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
