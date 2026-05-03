package com.odsoftware.hrm.dto.masterdata.global;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CountryRequest(
		@NotBlank @Size(max = 100) String name,
		@NotBlank @Size(max = 2) String isoCode,
		@Size(max = 10) String phoneCode,
		@NotNull UUID defaultCurrencyId,
		Boolean active) {
}
