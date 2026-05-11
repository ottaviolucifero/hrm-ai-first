package com.odsoftware.hrm.dto.useradministration;

import java.util.UUID;

public record UserAdministrationCompanyProfileResponse(
		UUID id,
		String code,
		String legalName,
		String tradeName) {
}
