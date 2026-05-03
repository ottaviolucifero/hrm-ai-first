package com.odsoftware.hrm.dto.corehr;

import java.time.LocalDate;
import java.util.UUID;

public record HolidayCalendarResponse(
		UUID id,
		CoreHrReferenceResponse country,
		CoreHrReferenceResponse region,
		CoreHrReferenceResponse area,
		LocalDate startDate,
		LocalDate endDate,
		String name,
		Boolean active) {
}
