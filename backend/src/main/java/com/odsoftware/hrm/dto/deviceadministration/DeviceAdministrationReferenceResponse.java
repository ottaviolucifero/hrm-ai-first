package com.odsoftware.hrm.dto.deviceadministration;

import java.util.UUID;

public record DeviceAdministrationReferenceResponse(
		UUID id,
		String code,
		String name) {
}
