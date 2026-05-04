package com.odsoftware.hrm.dto.masterdata.governancesecurity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthenticationMethodRequest(
		@NotBlank @Size(max = 50) String code,
		@NotBlank @Size(max = 100) String name,
		Boolean strongAuthRequired,
		Boolean active) {
}
