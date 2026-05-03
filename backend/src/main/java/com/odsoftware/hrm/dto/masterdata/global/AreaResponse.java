package com.odsoftware.hrm.dto.masterdata.global;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AreaResponse(
		UUID id,
		GlobalMasterReferenceResponse country,
		GlobalMasterReferenceResponse region,
		String name,
		String code,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
