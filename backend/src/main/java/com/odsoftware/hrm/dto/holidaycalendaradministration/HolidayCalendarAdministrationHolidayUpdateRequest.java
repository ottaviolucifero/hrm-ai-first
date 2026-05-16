package com.odsoftware.hrm.dto.holidaycalendaradministration;

import com.odsoftware.hrm.entity.calendar.HolidayGenerationRule;
import com.odsoftware.hrm.entity.calendar.HolidayType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record HolidayCalendarAdministrationHolidayUpdateRequest(
		@NotBlank @Size(max = 255) String name,
		@NotNull LocalDate startDate,
		@NotNull LocalDate endDate,
		@NotNull HolidayType type,
		@NotNull HolidayGenerationRule generationRule,
		@Size(max = 1000) String description) {
}
