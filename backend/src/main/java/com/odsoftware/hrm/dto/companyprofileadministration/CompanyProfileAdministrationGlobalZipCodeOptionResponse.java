package com.odsoftware.hrm.dto.companyprofileadministration;

import java.util.UUID;

public record CompanyProfileAdministrationGlobalZipCodeOptionResponse(
		UUID id,
		String code,
		String name,
		UUID tenantId,
		UUID countryId,
		UUID regionId,
		UUID areaId,
		String provinceName,
		String provinceCode) {
}
