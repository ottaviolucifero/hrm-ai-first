package com.odsoftware.hrm.dto.deviceadministration;

import java.util.UUID;

public record DeviceAdministrationEmployeeOptionResponse(
		UUID id,
		String code,
		String name,
		UUID companyProfileId) {
}
