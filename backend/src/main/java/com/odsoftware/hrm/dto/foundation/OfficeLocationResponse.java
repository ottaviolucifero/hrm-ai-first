package com.odsoftware.hrm.dto.foundation;

import java.time.OffsetDateTime;
import java.util.UUID;

public record OfficeLocationResponse(
		UUID id,
		FoundationReferenceResponse tenant,
		FoundationReferenceResponse companyProfile,
		FoundationReferenceResponse officeLocationType,
		String code,
		String name,
		String email,
		String phone,
		FoundationReferenceResponse country,
		FoundationReferenceResponse region,
		FoundationReferenceResponse area,
		FoundationReferenceResponse globalZipCode,
		String street,
		String streetNumber,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
