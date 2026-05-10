package com.odsoftware.hrm.dto.masterdata.governancesecurity;

import java.time.OffsetDateTime;
import java.util.UUID;

public record RoleResponse(
		UUID id,
		UUID tenantId,
		String code,
		String name,
		String description,
		Boolean systemRole,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
