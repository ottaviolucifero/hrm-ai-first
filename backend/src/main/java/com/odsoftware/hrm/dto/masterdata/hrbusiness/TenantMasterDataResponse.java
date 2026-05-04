package com.odsoftware.hrm.dto.masterdata.hrbusiness;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TenantMasterDataResponse(
		UUID id,
		UUID tenantId,
		String code,
		String name,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
