package com.odsoftware.hrm.dto.leaverequestadministration;

import java.util.UUID;

public record LeaveRequestAdministrationReferenceResponse(
		UUID id,
		String code,
		String name) {
}
