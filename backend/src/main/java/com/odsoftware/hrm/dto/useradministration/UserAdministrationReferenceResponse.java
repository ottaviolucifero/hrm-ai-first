package com.odsoftware.hrm.dto.useradministration;

import java.util.UUID;

public record UserAdministrationReferenceResponse(
		UUID id,
		String code,
		String name) {
}
