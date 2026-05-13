package com.odsoftware.hrm.dto.masterdata.global;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record AreaRequest(
		@NotNull UUID tenantId,
		@NotNull UUID countryId,
		@NotNull UUID regionId,
		@NotBlank @Size(max = 100) String name,
		@NotBlank @Size(max = 50) String code,
		Boolean active) {
}
