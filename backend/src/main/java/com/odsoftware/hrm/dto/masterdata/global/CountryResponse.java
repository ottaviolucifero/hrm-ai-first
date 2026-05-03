package com.odsoftware.hrm.dto.masterdata.global;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CountryResponse(
		UUID id,
		String name,
		String isoCode,
		String phoneCode,
		GlobalMasterReferenceResponse defaultCurrency,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
