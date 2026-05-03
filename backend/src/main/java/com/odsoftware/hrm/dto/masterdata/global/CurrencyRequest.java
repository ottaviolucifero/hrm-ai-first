package com.odsoftware.hrm.dto.masterdata.global;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CurrencyRequest(
		@NotBlank @Size(max = 3) String code,
		@NotBlank @Size(max = 100) String name,
		@NotBlank @Size(max = 10) String symbol,
		Boolean active) {
}
