package com.odsoftware.hrm.dto.masterdata.governancesecurity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SeverityMasterDataAutoCodeRequest(
		@NotBlank @Size(max = 100) String name,
		@NotBlank @Size(max = 30) String severityLevel,
		Boolean active) {
}
