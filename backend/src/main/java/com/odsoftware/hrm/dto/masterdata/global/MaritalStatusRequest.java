package com.odsoftware.hrm.dto.masterdata.global;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MaritalStatusRequest(
		@NotBlank @Size(max = 50) String code,
		@NotBlank @Size(max = 100) String name,
		Boolean active) {
}
