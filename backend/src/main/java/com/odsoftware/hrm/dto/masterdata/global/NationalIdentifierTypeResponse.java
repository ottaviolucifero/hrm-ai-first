package com.odsoftware.hrm.dto.masterdata.global;

import java.time.OffsetDateTime;
import java.util.UUID;

public record NationalIdentifierTypeResponse(
		UUID id,
		GlobalMasterReferenceResponse country,
		String code,
		String name,
		String regexPattern,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
