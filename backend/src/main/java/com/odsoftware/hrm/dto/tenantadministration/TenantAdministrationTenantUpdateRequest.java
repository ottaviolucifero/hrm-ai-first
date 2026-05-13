package com.odsoftware.hrm.dto.tenantadministration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record TenantAdministrationTenantUpdateRequest(
		@NotBlank(message = "Name is required")
		@Size(max = 100, message = "Name must be at most 100 characters")
		String name,
		@NotBlank(message = "Legal name is required")
		@Size(max = 150, message = "Legal name must be at most 150 characters")
		String legalName,
		@NotNull(message = "Default country is required")
		UUID defaultCountryId,
		@NotNull(message = "Default currency is required")
		UUID defaultCurrencyId) {
}
