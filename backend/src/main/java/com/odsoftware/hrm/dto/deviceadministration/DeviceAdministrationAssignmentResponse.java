package com.odsoftware.hrm.dto.deviceadministration;

import java.time.OffsetDateTime;
import java.util.UUID;

public record DeviceAdministrationAssignmentResponse(
		UUID id,
		UUID deviceId,
		UUID employeeId,
		DeviceAdministrationReferenceResponse employee,
		UUID assignedByUserId,
		String assignedByUserEmail,
		OffsetDateTime assignedFrom,
		OffsetDateTime assignedTo,
		OffsetDateTime returnedAt,
		String returnNote,
		String conditionOnAssign,
		String conditionOnReturn,
		String notes,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
