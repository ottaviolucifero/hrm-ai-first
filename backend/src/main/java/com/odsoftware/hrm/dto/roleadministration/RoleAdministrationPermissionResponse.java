package com.odsoftware.hrm.dto.roleadministration;

import java.util.UUID;

public record RoleAdministrationPermissionResponse(
		UUID id,
		UUID tenantId,
		String code,
		String name,
		Boolean systemPermission,
		Boolean active) {
}
