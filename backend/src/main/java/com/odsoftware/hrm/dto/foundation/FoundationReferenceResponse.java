package com.odsoftware.hrm.dto.foundation;

import java.util.UUID;

public record FoundationReferenceResponse(
		UUID id,
		String code,
		String name) {
}
