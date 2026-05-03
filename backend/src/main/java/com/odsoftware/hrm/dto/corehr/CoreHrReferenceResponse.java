package com.odsoftware.hrm.dto.corehr;

import java.util.UUID;

public record CoreHrReferenceResponse(
		UUID id,
		String code,
		String name) {
}
