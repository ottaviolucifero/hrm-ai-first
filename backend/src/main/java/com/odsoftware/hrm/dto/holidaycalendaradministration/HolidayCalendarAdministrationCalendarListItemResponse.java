package com.odsoftware.hrm.dto.holidaycalendaradministration;

import com.odsoftware.hrm.entity.calendar.HolidayCalendarScope;
import java.time.OffsetDateTime;
import java.util.UUID;

public record HolidayCalendarAdministrationCalendarListItemResponse(
		UUID id,
		HolidayCalendarAdministrationReferenceResponse country,
		Integer year,
		String name,
		HolidayCalendarScope scope,
		HolidayCalendarAdministrationReferenceResponse tenant,
		HolidayCalendarAdministrationReferenceResponse companyProfile,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
