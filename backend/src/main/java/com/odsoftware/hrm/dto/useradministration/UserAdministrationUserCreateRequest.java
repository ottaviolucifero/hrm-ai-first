package com.odsoftware.hrm.dto.useradministration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record UserAdministrationUserCreateRequest(
		@NotBlank @Size(max = 150) String email,
		@NotNull UUID userTypeId,
		@NotNull UUID tenantId,
		UUID companyProfileId,
		@NotBlank @Size(max = 255) String initialPassword) {
}
