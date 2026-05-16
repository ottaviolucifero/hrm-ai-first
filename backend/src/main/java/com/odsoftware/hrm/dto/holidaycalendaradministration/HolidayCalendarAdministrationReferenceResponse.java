package com.odsoftware.hrm.dto.holidaycalendaradministration;

import java.util.UUID;

public record HolidayCalendarAdministrationReferenceResponse(
		UUID id,
		String code,
		String name) {
}
