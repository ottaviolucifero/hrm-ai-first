package com.odsoftware.hrm.dto.companyprofileadministration;

import java.util.UUID;

public record CompanyProfileAdministrationRegionOptionResponse(
		UUID id,
		String code,
		String name,
		UUID tenantId,
		UUID countryId) {
}
