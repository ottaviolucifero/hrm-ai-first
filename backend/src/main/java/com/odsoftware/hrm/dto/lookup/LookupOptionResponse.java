package com.odsoftware.hrm.dto.lookup;

import java.util.Map;
import java.util.UUID;

public record LookupOptionResponse(
		UUID id,
		String code,
		String name,
		String extraLabel,
		Map<String, String> metadata) {
}
