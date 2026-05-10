package com.odsoftware.hrm.dto.roleadministration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RoleAdministrationRoleUpdateRequest(
		@NotBlank @Size(max = 100) String name,
		@Size(max = 500) String description) {
}
