package com.odsoftware.hrm.dto.useradministration;

import java.util.UUID;

public record UserAdministrationCompanyProfileOptionResponse(
		UUID id,
		UUID tenantId,
		String code,
		String legalName,
		String tradeName) {
}
