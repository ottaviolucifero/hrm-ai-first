package com.odsoftware.hrm.dto.useradministration;

import java.util.UUID;

public record UserAdministrationRoleResponse(
		UUID id,
		UUID tenantId,
		String tenantCode,
		String tenantName,
		String code,
		String name,
		Boolean systemRole,
		Boolean active) {
}
