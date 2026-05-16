package com.odsoftware.hrm.dto.holidaycalendaradministration;

import java.time.OffsetDateTime;
import java.util.UUID;

public record HolidayCalendarAdministrationCalendarListItemResponse(
		UUID id,
		HolidayCalendarAdministrationReferenceResponse country,
		Integer year,
		String name,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
