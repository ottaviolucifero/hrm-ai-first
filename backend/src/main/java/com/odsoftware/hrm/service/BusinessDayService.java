package com.odsoftware.hrm.service;

import com.odsoftware.hrm.entity.calendar.HolidayCalendar;
import com.odsoftware.hrm.entity.calendar.HolidayCalendarScope;
import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.exception.InvalidRequestException;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.calendar.HolidayCalendarRepository;
import com.odsoftware.hrm.repository.calendar.HolidayRepository;
import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class BusinessDayService {

	private final HolidayCalendarRepository holidayCalendarRepository;
	private final HolidayRepository holidayRepository;
	private final TenantRepository tenantRepository;
	private final CompanyProfileRepository companyProfileRepository;

	public BusinessDayService(
			HolidayCalendarRepository holidayCalendarRepository,
			HolidayRepository holidayRepository,
			TenantRepository tenantRepository,
			CompanyProfileRepository companyProfileRepository) {
		this.holidayCalendarRepository = holidayCalendarRepository;
		this.holidayRepository = holidayRepository;
		this.tenantRepository = tenantRepository;
		this.companyProfileRepository = companyProfileRepository;
	}

	public boolean isWeekend(LocalDate date) {
		requireDate(date, "Date is required");
		return date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY;
	}

	public boolean isHoliday(LocalDate date, UUID tenantId) {
		return isHoliday(date, tenantId, null);
	}

	public boolean isHoliday(LocalDate date, UUID tenantId, UUID companyProfileId) {
		requireDate(date, "Date is required");
		CalendarResolutionContext context = resolveCalendarContext(tenantId, companyProfileId);
		return isHoliday(date, context);
	}

	public boolean isWorkingDay(LocalDate date, UUID tenantId) {
		return isWorkingDay(date, tenantId, null);
	}

	public boolean isWorkingDay(LocalDate date, UUID tenantId, UUID companyProfileId) {
		requireDate(date, "Date is required");
		CalendarResolutionContext context = resolveCalendarContext(tenantId, companyProfileId);
		return isWorkingDay(date, context);
	}

	public LocalDate nextWorkingDay(LocalDate date, UUID tenantId) {
		return nextWorkingDay(date, tenantId, null);
	}

	public LocalDate nextWorkingDay(LocalDate date, UUID tenantId, UUID companyProfileId) {
		requireDate(date, "Date is required");
		CalendarResolutionContext context = resolveCalendarContext(tenantId, companyProfileId);
		LocalDate candidate = date.plusDays(1);
		while (!isWorkingDay(candidate, context)) {
			candidate = candidate.plusDays(1);
		}
		return candidate;
	}

	public LocalDate addWorkingDays(LocalDate date, int workingDays, UUID tenantId) {
		return addWorkingDays(date, workingDays, tenantId, null);
	}

	public LocalDate addWorkingDays(LocalDate date, int workingDays, UUID tenantId, UUID companyProfileId) {
		requireDate(date, "Date is required");
		if (workingDays < 0) {
			throw new InvalidRequestException("Working days must be zero or positive");
		}
		CalendarResolutionContext context = resolveCalendarContext(tenantId, companyProfileId);
		LocalDate result = date;
		for (int remaining = workingDays; remaining > 0; remaining--) {
			LocalDate candidate = result.plusDays(1);
			while (!isWorkingDay(candidate, context)) {
				candidate = candidate.plusDays(1);
			}
			result = candidate;
		}
		return result;
	}

	public long countWorkingDays(LocalDate startDate, LocalDate endDate, UUID tenantId) {
		return countWorkingDays(startDate, endDate, tenantId, null);
	}

	public long countWorkingDays(LocalDate startDate, LocalDate endDate, UUID tenantId, UUID companyProfileId) {
		requireDate(startDate, "Start date is required");
		requireDate(endDate, "End date is required");
		if (endDate.isBefore(startDate)) {
			throw new InvalidRequestException("End date must be on or after start date");
		}
		CalendarResolutionContext context = resolveCalendarContext(tenantId, companyProfileId);
		long workingDays = 0;
		LocalDate candidate = startDate;
		while (!candidate.isAfter(endDate)) {
			if (isWorkingDay(candidate, context)) {
				workingDays++;
			}
			candidate = candidate.plusDays(1);
		}
		return workingDays;
	}

	private boolean isHoliday(LocalDate date, CalendarResolutionContext context) {
		return resolveActiveCalendar(date, context)
				.map(HolidayCalendar::getId)
				.map(holidayCalendarId -> holidayRepository.existsByHolidayCalendarIdAndDate(holidayCalendarId, date))
				.orElse(false);
	}

	private boolean isWorkingDay(LocalDate date, CalendarResolutionContext context) {
		return !isWeekend(date) && !isHoliday(date, context);
	}

	private CalendarResolutionContext resolveCalendarContext(UUID tenantId, UUID companyProfileId) {
		Tenant tenant = resolveTenant(tenantId);
		if (companyProfileId == null) {
			return new CalendarResolutionContext(tenant, null, tenant.getDefaultCountry());
		}
		CompanyProfile companyProfile = companyProfileRepository.findById(companyProfileId)
				.orElseThrow(() -> new ResourceNotFoundException("Company profile not found: " + companyProfileId));
		if (!tenant.getId().equals(companyProfile.getTenant().getId())) {
			throw new InvalidRequestException("Company profile does not belong to tenant: " + companyProfileId);
		}
		return new CalendarResolutionContext(tenant, companyProfile, companyProfile.getCountry());
	}

	private Optional<HolidayCalendar> resolveActiveCalendar(LocalDate date, CalendarResolutionContext context) {
		UUID countryId = context.country().getId();
		int year = date.getYear();
		if (context.companyProfile() != null) {
			Optional<HolidayCalendar> companyProfileCalendar = holidayCalendarRepository
					.findByCompanyProfile_IdAndCountry_IdAndYearAndActiveTrue(context.companyProfile().getId(), countryId, year);
			if (companyProfileCalendar.isPresent()) {
				return companyProfileCalendar;
			}
		}
		Optional<HolidayCalendar> tenantCalendar = holidayCalendarRepository
				.findByTenant_IdAndCompanyProfileIsNullAndCountry_IdAndYearAndActiveTrue(context.tenant().getId(), countryId, year);
		if (tenantCalendar.isPresent()) {
			return tenantCalendar;
		}
		return holidayCalendarRepository.findByScopeAndCountry_IdAndYearAndActiveTrue(HolidayCalendarScope.GLOBAL, countryId, year);
	}

	private Tenant resolveTenant(UUID tenantId) {
		if (tenantId == null) {
			throw new InvalidRequestException("Tenant is required");
		}
		return tenantRepository.findById(tenantId)
				.orElseThrow(() -> new ResourceNotFoundException("Tenant not found: " + tenantId));
	}

	private void requireDate(LocalDate date, String message) {
		if (date == null) {
			throw new InvalidRequestException(message);
		}
	}

	private record CalendarResolutionContext(
			Tenant tenant,
			CompanyProfile companyProfile,
			Country country) {
	}
}
