package com.odsoftware.hrm.dto.companyprofileadministration;

import java.util.UUID;

public record CompanyProfileAdministrationReferenceResponse(
		UUID id,
		String code,
		String name) {
}
