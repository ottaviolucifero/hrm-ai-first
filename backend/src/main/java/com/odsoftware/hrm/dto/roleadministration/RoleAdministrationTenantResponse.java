package com.odsoftware.hrm.dto.roleadministration;

import java.util.UUID;

public record RoleAdministrationTenantResponse(
		UUID id,
		String code,
		String name) {
}
