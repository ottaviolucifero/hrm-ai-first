package com.odsoftware.hrm.controller;

import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationCalendarCreateRequest;
import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationCalendarDetailResponse;
import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationCalendarListItemResponse;
import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationCalendarUpdateRequest;
import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationHolidayCreateRequest;
import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationHolidayDetailResponse;
import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationHolidayListItemResponse;
import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationHolidayUpdateRequest;
import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.service.HolidayCalendarAdministrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/holiday-calendars")
@Tag(name = "Holiday Calendar Administration", description = "Administrative CRUD API for holiday calendars and holidays")
@Validated
public class HolidayCalendarAdministrationController {

	private final HolidayCalendarAdministrationService holidayCalendarAdministrationService;

	public HolidayCalendarAdministrationController(HolidayCalendarAdministrationService holidayCalendarAdministrationService) {
		this.holidayCalendarAdministrationService = holidayCalendarAdministrationService;
	}

	@GetMapping
	@Operation(summary = "List holiday calendars for administration")
	public MasterDataPageResponse<HolidayCalendarAdministrationCalendarListItemResponse> findHolidayCalendars(
			@RequestParam(required = false) UUID countryId,
			@RequestParam(required = false) Integer year,
			@RequestParam(required = false) Boolean active,
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return holidayCalendarAdministrationService.findHolidayCalendars(countryId, year, active, page, size, search);
	}

	@GetMapping("/{calendarId}")
	@Operation(summary = "Get holiday calendar detail")
	public HolidayCalendarAdministrationCalendarDetailResponse findHolidayCalendarById(@PathVariable UUID calendarId) {
		return holidayCalendarAdministrationService.findHolidayCalendarById(calendarId);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create holiday calendar")
	public HolidayCalendarAdministrationCalendarDetailResponse createHolidayCalendar(
			@Valid @RequestBody HolidayCalendarAdministrationCalendarCreateRequest request) {
		return holidayCalendarAdministrationService.createHolidayCalendar(request);
	}

	@PutMapping("/{calendarId}")
	@Operation(summary = "Update holiday calendar")
	public HolidayCalendarAdministrationCalendarDetailResponse updateHolidayCalendar(
			@PathVariable UUID calendarId,
			@Valid @RequestBody HolidayCalendarAdministrationCalendarUpdateRequest request) {
		return holidayCalendarAdministrationService.updateHolidayCalendar(calendarId, request);
	}

	@PutMapping("/{calendarId}/activate")
	@Operation(summary = "Activate holiday calendar")
	public HolidayCalendarAdministrationCalendarDetailResponse activateHolidayCalendar(@PathVariable UUID calendarId) {
		return holidayCalendarAdministrationService.activateHolidayCalendar(calendarId);
	}

	@PutMapping("/{calendarId}/deactivate")
	@Operation(summary = "Deactivate holiday calendar")
	public HolidayCalendarAdministrationCalendarDetailResponse deactivateHolidayCalendar(@PathVariable UUID calendarId) {
		return holidayCalendarAdministrationService.deactivateHolidayCalendar(calendarId);
	}

	@DeleteMapping("/{calendarId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Delete holiday calendar")
	public void deleteHolidayCalendar(@PathVariable UUID calendarId) {
		holidayCalendarAdministrationService.deleteHolidayCalendar(calendarId);
	}

	@GetMapping("/{calendarId}/holidays")
	@Operation(summary = "List holidays for a holiday calendar")
	public List<HolidayCalendarAdministrationHolidayListItemResponse> findHolidays(@PathVariable UUID calendarId) {
		return holidayCalendarAdministrationService.findHolidays(calendarId);
	}

	@GetMapping("/{calendarId}/holidays/{holidayId}")
	@Operation(summary = "Get holiday detail")
	public HolidayCalendarAdministrationHolidayDetailResponse findHolidayById(
			@PathVariable UUID calendarId,
			@PathVariable UUID holidayId) {
		return holidayCalendarAdministrationService.findHolidayById(calendarId, holidayId);
	}

	@PostMapping("/{calendarId}/holidays")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create holiday")
	public HolidayCalendarAdministrationHolidayDetailResponse createHoliday(
			@PathVariable UUID calendarId,
			@Valid @RequestBody HolidayCalendarAdministrationHolidayCreateRequest request) {
		return holidayCalendarAdministrationService.createHoliday(calendarId, request);
	}

	@PutMapping("/{calendarId}/holidays/{holidayId}")
	@Operation(summary = "Update holiday")
	public HolidayCalendarAdministrationHolidayDetailResponse updateHoliday(
			@PathVariable UUID calendarId,
			@PathVariable UUID holidayId,
			@Valid @RequestBody HolidayCalendarAdministrationHolidayUpdateRequest request) {
		return holidayCalendarAdministrationService.updateHoliday(calendarId, holidayId, request);
	}

	@DeleteMapping("/{calendarId}/holidays/{holidayId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Delete holiday")
	public void deleteHoliday(
			@PathVariable UUID calendarId,
			@PathVariable UUID holidayId) {
		holidayCalendarAdministrationService.deleteHoliday(calendarId, holidayId);
	}
}
