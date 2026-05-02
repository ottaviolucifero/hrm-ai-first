package com.odsoftware.hrm.dto.foundation;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CompanyProfileResponse(
		UUID id,
		FoundationReferenceResponse tenant,
		FoundationReferenceResponse companyProfileType,
		String code,
		String legalName,
		String tradeName,
		String vatNumber,
		String taxIdentifier,
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
