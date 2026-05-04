package com.odsoftware.hrm.dto.masterdata.governancesecurity;

import java.time.OffsetDateTime;
import java.util.UUID;

public record PermissionResponse(
		UUID id,
		UUID tenantId,
		String code,
		String name,
		Boolean systemPermission,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
