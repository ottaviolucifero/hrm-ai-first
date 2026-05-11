package com.odsoftware.hrm.dto.useradministration;

import java.util.List;

public record UserAdministrationFormOptionsResponse(
		List<UserAdministrationReferenceResponse> tenants,
		List<UserAdministrationReferenceResponse> userTypes,
		UserAdministrationReferenceResponse authenticationMethod,
		List<UserAdministrationCompanyProfileOptionResponse> companyProfiles) {
}
