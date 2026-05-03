package com.odsoftware.hrm.dto.masterdata.global;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record NationalIdentifierTypeRequest(
		@NotNull UUID countryId,
		@NotBlank @Size(max = 50) String code,
		@NotBlank @Size(max = 100) String name,
		@Size(max = 500) String regexPattern,
		Boolean active) {
}
