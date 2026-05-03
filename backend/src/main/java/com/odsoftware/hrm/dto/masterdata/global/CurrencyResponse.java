package com.odsoftware.hrm.dto.masterdata.global;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CurrencyResponse(
		UUID id,
		String code,
		String name,
		String symbol,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
