package com.odsoftware.hrm.dto.masterdata.global;

import java.time.OffsetDateTime;
import java.util.UUID;

public record MaritalStatusResponse(
		UUID id,
		String code,
		String name,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
