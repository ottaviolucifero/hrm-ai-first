package com.odsoftware.hrm.dto.companyprofileadministration;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CompanyProfileAdministrationCompanyProfileDetailResponse(
		UUID id,
		CompanyProfileAdministrationReferenceResponse tenant,
		CompanyProfileAdministrationReferenceResponse companyProfileType,
		String code,
		String legalName,
		String tradeName,
		String vatNumber,
		String taxIdentifier,
		String taxNumber,
		String email,
		String pecEmail,
		String phone,
		String sdiCode,
		CompanyProfileAdministrationReferenceResponse country,
		CompanyProfileAdministrationReferenceResponse region,
		CompanyProfileAdministrationReferenceResponse area,
		CompanyProfileAdministrationReferenceResponse globalZipCode,
		String street,
		String streetNumber,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
