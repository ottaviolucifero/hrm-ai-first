package com.odsoftware.hrm.dto.companyprofileadministration;

import java.util.List;

public record CompanyProfileAdministrationFormOptionsResponse(
		List<CompanyProfileAdministrationReferenceResponse> tenants,
		List<CompanyProfileAdministrationCompanyProfileTypeOptionResponse> companyProfileTypes,
		List<CompanyProfileAdministrationReferenceResponse> countries,
		List<CompanyProfileAdministrationRegionOptionResponse> regions,
		List<CompanyProfileAdministrationAreaOptionResponse> areas,
		List<CompanyProfileAdministrationGlobalZipCodeOptionResponse> globalZipCodes) {
}
