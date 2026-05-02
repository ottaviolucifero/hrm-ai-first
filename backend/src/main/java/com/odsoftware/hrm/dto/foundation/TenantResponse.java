package com.odsoftware.hrm.dto.foundation;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TenantResponse(
		UUID id,
		String code,
		String name,
		String legalName,
		FoundationReferenceResponse defaultCountry,
		FoundationReferenceResponse defaultCurrency,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
