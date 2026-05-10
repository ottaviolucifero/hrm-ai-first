package com.odsoftware.hrm.dto.roleadministration;

import java.util.UUID;

public record RoleAdministrationRoleListItemResponse(
		UUID id,
		UUID tenantId,
		String code,
		String name,
		Boolean systemRole,
		Boolean active) {
}
