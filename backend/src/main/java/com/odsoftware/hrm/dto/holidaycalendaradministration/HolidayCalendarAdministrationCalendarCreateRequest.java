package com.odsoftware.hrm.dto.holidaycalendaradministration;

import com.odsoftware.hrm.entity.calendar.HolidayCalendarScope;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record HolidayCalendarAdministrationCalendarCreateRequest(
		@NotNull UUID countryId,
		@NotNull @Min(1900) @Max(9999) Integer year,
		@NotBlank @Size(max = 255) String name,
		HolidayCalendarScope scope,
		UUID tenantId,
		UUID companyProfileId) {
}
