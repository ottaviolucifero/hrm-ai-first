package com.odsoftware.hrm.dto.roleadministration;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record RolePermissionAssignmentUpdateRequest(
		@NotNull
		List<@NotNull UUID> permissionIds) {
}
