package com.odsoftware.hrm.dto.holidaycalendaradministration;

import com.odsoftware.hrm.entity.calendar.HolidayGenerationRule;
import com.odsoftware.hrm.entity.calendar.HolidayType;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record HolidayCalendarAdministrationHolidayDetailResponse(
		UUID id,
		UUID holidayCalendarId,
		String name,
		LocalDate startDate,
		LocalDate endDate,
		HolidayType type,
		HolidayGenerationRule generationRule,
		String description,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
