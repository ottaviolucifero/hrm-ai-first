package com.odsoftware.hrm.dto.leaverequestadministration;

import com.odsoftware.hrm.entity.leave.LeaveRequestStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record LeaveRequestAdministrationCreateRequest(
		@NotNull UUID tenantId,
		@NotNull UUID employeeId,
		@NotNull UUID leaveRequestTypeId,
		@NotNull LocalDate startDate,
		@NotNull LocalDate endDate,
		@DecimalMin("0.00") BigDecimal durationDays,
		@NotNull Boolean deductFromBalance,
		@DecimalMin("0.000") BigDecimal deductedDays,
		@Size(max = 1000) String reason,
		LeaveRequestStatus status,
		@Size(max = 1000) String comments,
		@NotNull Boolean urgent,
		@Size(max = 1000) String urgentReason) {
}
