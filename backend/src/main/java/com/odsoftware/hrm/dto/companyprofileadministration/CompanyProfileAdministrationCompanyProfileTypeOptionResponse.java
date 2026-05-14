package com.odsoftware.hrm.dto.companyprofileadministration;

import java.util.UUID;

public record CompanyProfileAdministrationCompanyProfileTypeOptionResponse(
		UUID id,
		String code,
		String name,
		UUID tenantId) {
}
