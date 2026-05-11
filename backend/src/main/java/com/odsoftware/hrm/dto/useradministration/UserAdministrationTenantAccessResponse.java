package com.odsoftware.hrm.dto.useradministration;

import java.time.OffsetDateTime;
import java.util.UUID;

public record UserAdministrationTenantAccessResponse(
		UUID id,
		UUID tenantId,
		String tenantCode,
		String tenantName,
		String accessRole,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
