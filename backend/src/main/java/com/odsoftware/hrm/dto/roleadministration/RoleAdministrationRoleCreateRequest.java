package com.odsoftware.hrm.dto.roleadministration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record RoleAdministrationRoleCreateRequest(
		@NotNull UUID tenantId,
		@NotBlank @Size(max = 100) String name,
		@Size(max = 500) String description,
		Boolean active) {
}
