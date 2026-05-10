package com.odsoftware.hrm.dto.roleadministration;

import java.time.OffsetDateTime;
import java.util.UUID;

public record RoleAdministrationRoleListItemResponse(
		UUID id,
		UUID tenantId,
		String code,
		String name,
		String description,
		Boolean systemRole,
		Boolean active,
		OffsetDateTime updatedAt) {
}
