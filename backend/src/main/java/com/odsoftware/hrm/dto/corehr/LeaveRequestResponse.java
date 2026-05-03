package com.odsoftware.hrm.dto.corehr;

import com.odsoftware.hrm.entity.leave.LeaveRequestStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record LeaveRequestResponse(
		UUID id,
		CoreHrReferenceResponse tenant,
		CoreHrReferenceResponse companyProfile,
		CoreHrReferenceResponse employee,
		CoreHrReferenceResponse leaveRequestType,
		LocalDate startDate,
		LocalDate endDate,
		BigDecimal durationDays,
		Boolean deductFromBalance,
		BigDecimal deductedDays,
		String reason,
		LeaveRequestStatus status,
		CoreHrReferenceResponse approver,
		Boolean urgent) {
}
