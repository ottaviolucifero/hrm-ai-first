package com.odsoftware.hrm.dto.masterdata.global;

import java.time.OffsetDateTime;
import java.util.UUID;

public record RegionResponse(
		UUID id,
		GlobalMasterReferenceResponse country,
		String name,
		String code,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
