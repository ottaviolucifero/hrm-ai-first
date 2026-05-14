package com.odsoftware.hrm.dto.companyprofileadministration;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CompanyProfileAdministrationCompanyProfileListItemResponse(
		UUID id,
		CompanyProfileAdministrationReferenceResponse tenant,
		CompanyProfileAdministrationReferenceResponse companyProfileType,
		String code,
		String legalName,
		String tradeName,
		String vatNumber,
		String taxNumber,
		CompanyProfileAdministrationReferenceResponse country,
		Boolean active,
		OffsetDateTime updatedAt) {
}
