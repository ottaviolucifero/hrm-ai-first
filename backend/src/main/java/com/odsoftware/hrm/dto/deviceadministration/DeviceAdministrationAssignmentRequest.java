package com.odsoftware.hrm.dto.deviceadministration;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;

public record DeviceAdministrationAssignmentRequest(
		@NotNull UUID employeeId,
		OffsetDateTime assignedFrom,
		@Size(max = 255) String conditionOnAssign,
		@Size(max = 1000) String notes) {
}
