package com.odsoftware.hrm.dto.roleadministration;

import java.util.List;
import java.util.UUID;

public record RolePermissionAssignmentResponse(
		UUID roleId,
		UUID tenantId,
		List<RoleAdministrationPermissionResponse> permissions) {
}
