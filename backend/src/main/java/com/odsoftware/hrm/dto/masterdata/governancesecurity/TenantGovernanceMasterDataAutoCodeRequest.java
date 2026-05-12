package com.odsoftware.hrm.dto.masterdata.governancesecurity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record TenantGovernanceMasterDataAutoCodeRequest(
		@NotNull UUID tenantId,
		@NotBlank @Size(max = 100) String name,
		Boolean active) {
}
