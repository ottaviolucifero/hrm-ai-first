package com.odsoftware.hrm.dto.corehr;

import java.util.UUID;

public record HolidayCalendarResponse(
		UUID id,
		CoreHrReferenceResponse country,
		Integer year,
		String name,
		Boolean active) {
}
