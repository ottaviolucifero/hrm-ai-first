package com.odsoftware.hrm.dto.masterdata.governancesecurity;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TenantGovernanceMasterDataResponse(
		UUID id,
		UUID tenantId,
		String code,
		String name,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
