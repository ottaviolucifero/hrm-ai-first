package com.odsoftware.hrm.dto.roleadministration;

import java.time.OffsetDateTime;
import java.util.UUID;

public record RoleAdministrationRoleDetailResponse(
		UUID id,
		RoleAdministrationTenantResponse tenant,
		String code,
		String name,
		String description,
		Boolean systemRole,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
