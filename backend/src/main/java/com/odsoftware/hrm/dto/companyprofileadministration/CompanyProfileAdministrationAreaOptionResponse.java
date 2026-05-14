package com.odsoftware.hrm.dto.companyprofileadministration;

import java.util.UUID;

public record CompanyProfileAdministrationAreaOptionResponse(
		UUID id,
		String code,
		String name,
		UUID tenantId,
		UUID countryId,
		UUID regionId) {
}
