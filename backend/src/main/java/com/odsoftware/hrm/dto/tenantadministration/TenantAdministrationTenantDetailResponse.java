package com.odsoftware.hrm.dto.tenantadministration;

import com.odsoftware.hrm.dto.foundation.FoundationReferenceResponse;
import java.time.OffsetDateTime;
import java.util.UUID;

public record TenantAdministrationTenantDetailResponse(
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
