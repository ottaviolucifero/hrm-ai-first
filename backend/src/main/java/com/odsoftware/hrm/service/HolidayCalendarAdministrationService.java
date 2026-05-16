package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationCalendarCreateRequest;
import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationCalendarDetailResponse;
import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationCalendarListItemResponse;
import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationCalendarUpdateRequest;
import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationHolidayCreateRequest;
import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationHolidayDetailResponse;
import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationHolidayListItemResponse;
import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationHolidayUpdateRequest;
import com.odsoftware.hrm.dto.holidaycalendaradministration.HolidayCalendarAdministrationReferenceResponse;
import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.entity.calendar.Holiday;
import com.odsoftware.hrm.entity.calendar.HolidayCalendar;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.exception.InvalidRequestException;
import com.odsoftware.hrm.exception.ResourceConflictException;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.calendar.HolidayCalendarRepository;
import com.odsoftware.hrm.repository.calendar.HolidayRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class HolidayCalendarAdministrationService {

	private final HolidayCalendarRepository holidayCalendarRepository;
	private final HolidayRepository holidayRepository;
	private final CountryRepository countryRepository;

	public HolidayCalendarAdministrationService(
			HolidayCalendarRepository holidayCalendarRepository,
			HolidayRepository holidayRepository,
			CountryRepository countryRepository) {
		this.holidayCalendarRepository = holidayCalendarRepository;
		this.holidayRepository = holidayRepository;
		this.countryRepository = countryRepository;
	}

	public MasterDataPageResponse<HolidayCalendarAdministrationCalendarListItemResponse> findHolidayCalendars(
			UUID countryId,
			Integer year,
			Boolean active,
			Integer page,
			Integer size,
			String search) {
		Page<HolidayCalendar> holidayCalendars = holidayCalendarRepository.findAll(
				holidayCalendarSpecification(countryId, year, active, search),
				MasterDataQuerySupport.buildPageable(
						page,
						size,
						MasterDataQuerySupport.defaultNewestFirstSort(Sort.by(Sort.Order.desc("year"), Sort.Order.asc("name")))));
		return MasterDataQuerySupport.toPageResponse(holidayCalendars, this::toCalendarListItemResponse);
	}

	public HolidayCalendarAdministrationCalendarDetailResponse findHolidayCalendarById(UUID calendarId) {
		return toCalendarDetailResponse(findHolidayCalendar(calendarId));
	}

	public List<HolidayCalendarAdministrationHolidayListItemResponse> findHolidays(UUID calendarId) {
		findHolidayCalendar(calendarId);
		return holidayRepository.findByHolidayCalendar_IdOrderByStartDateAscNameAsc(calendarId).stream()
				.map(this::toHolidayListItemResponse)
				.toList();
	}

	public HolidayCalendarAdministrationHolidayDetailResponse findHolidayById(UUID calendarId, UUID holidayId) {
		return toHolidayDetailResponse(findHoliday(calendarId, holidayId));
	}

	@Transactional
	public HolidayCalendarAdministrationCalendarDetailResponse createHolidayCalendar(
			HolidayCalendarAdministrationCalendarCreateRequest request) {
		Country country = findCountry(request.countryId());
		validateYear(request.year());
		assertCountryYearUnique(country.getId(), request.year(), null);

		HolidayCalendar holidayCalendar = new HolidayCalendar();
		holidayCalendar.setCountry(country);
		holidayCalendar.setYear(request.year());
		holidayCalendar.setName(cleanRequired(request.name(), "Holiday calendar name is required"));
		holidayCalendar.setActive(true);
		return toCalendarDetailResponse(holidayCalendarRepository.saveAndFlush(holidayCalendar));
	}

	@Transactional
	public HolidayCalendarAdministrationCalendarDetailResponse updateHolidayCalendar(
			UUID calendarId,
			HolidayCalendarAdministrationCalendarUpdateRequest request) {
		HolidayCalendar holidayCalendar = findHolidayCalendar(calendarId);
		Country country = findCountry(request.countryId());
		validateYear(request.year());
		assertCountryYearUnique(country.getId(), request.year(), calendarId);

		holidayCalendar.setCountry(country);
		holidayCalendar.setYear(request.year());
		holidayCalendar.setName(cleanRequired(request.name(), "Holiday calendar name is required"));
		return toCalendarDetailResponse(holidayCalendarRepository.saveAndFlush(holidayCalendar));
	}

	@Transactional
	public HolidayCalendarAdministrationCalendarDetailResponse activateHolidayCalendar(UUID calendarId) {
		HolidayCalendar holidayCalendar = findHolidayCalendar(calendarId);
		holidayCalendar.setActive(true);
		return toCalendarDetailResponse(holidayCalendarRepository.saveAndFlush(holidayCalendar));
	}

	@Transactional
	public HolidayCalendarAdministrationCalendarDetailResponse deactivateHolidayCalendar(UUID calendarId) {
		HolidayCalendar holidayCalendar = findHolidayCalendar(calendarId);
		holidayCalendar.setActive(false);
		return toCalendarDetailResponse(holidayCalendarRepository.saveAndFlush(holidayCalendar));
	}

	@Transactional
	public void deleteHolidayCalendar(UUID calendarId) {
		HolidayCalendar holidayCalendar = findHolidayCalendar(calendarId);
		try {
			holidayCalendarRepository.delete(holidayCalendar);
			holidayCalendarRepository.flush();
		}
		catch (DataIntegrityViolationException exception) {
			throw new ResourceConflictException("Holiday calendar cannot be deleted because it is referenced by one or more records");
		}
	}

	@Transactional
	public HolidayCalendarAdministrationHolidayDetailResponse createHoliday(
			UUID calendarId,
			HolidayCalendarAdministrationHolidayCreateRequest request) {
		HolidayCalendar holidayCalendar = findHolidayCalendar(calendarId);
		validateHolidayRequest(holidayCalendar, request.startDate(), request.endDate(), null);

		Holiday holiday = new Holiday();
		holiday.setHolidayCalendar(holidayCalendar);
		applyHoliday(holiday, request.name(), request.startDate(), request.endDate(), request.type(), request.generationRule(), request.description());
		return toHolidayDetailResponse(holidayRepository.saveAndFlush(holiday));
	}

	@Transactional
	public HolidayCalendarAdministrationHolidayDetailResponse updateHoliday(
			UUID calendarId,
			UUID holidayId,
			HolidayCalendarAdministrationHolidayUpdateRequest request) {
		HolidayCalendar holidayCalendar = findHolidayCalendar(calendarId);
		Holiday holiday = findHoliday(calendarId, holidayId);
		validateHolidayRequest(holidayCalendar, request.startDate(), request.endDate(), holidayId);
		applyHoliday(holiday, request.name(), request.startDate(), request.endDate(), request.type(), request.generationRule(), request.description());
		return toHolidayDetailResponse(holidayRepository.saveAndFlush(holiday));
	}

	@Transactional
	public void deleteHoliday(UUID calendarId, UUID holidayId) {
		findHolidayCalendar(calendarId);
		Holiday holiday = findHoliday(calendarId, holidayId);
		holidayRepository.delete(holiday);
		holidayRepository.flush();
	}

	private Specification<HolidayCalendar> holidayCalendarSpecification(
			UUID countryId,
			Integer year,
			Boolean active,
			String search) {
		Specification<HolidayCalendar> searchSpecification = MasterDataQuerySupport.searchSpecification(
				search,
				"name",
				"country.isoCode",
				"country.name");
		return (root, query, criteriaBuilder) -> {
			query.distinct(true);
			Predicate predicate = criteriaBuilder.conjunction();
			if (countryId != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("country").get("id"), countryId));
			}
			if (year != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("year"), year));
			}
			if (active != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("active"), active));
			}
			if (searchSpecification == null) {
				return predicate;
			}
			Predicate searchPredicate = searchSpecification.toPredicate(root, query, criteriaBuilder);
			return searchPredicate == null ? predicate : criteriaBuilder.and(predicate, searchPredicate);
		};
	}

	private HolidayCalendar findHolidayCalendar(UUID calendarId) {
		return holidayCalendarRepository.findById(calendarId)
				.orElseThrow(() -> new ResourceNotFoundException("Holiday calendar not found: " + calendarId));
	}

	private Holiday findHoliday(UUID calendarId, UUID holidayId) {
		return holidayRepository.findByIdAndHolidayCalendar_Id(holidayId, calendarId)
				.orElseThrow(() -> new ResourceNotFoundException("Holiday not found: " + holidayId));
	}

	private Country findCountry(UUID countryId) {
		if (countryId == null) {
			throw new InvalidRequestException("Country is required");
		}
		return countryRepository.findById(countryId)
				.orElseThrow(() -> new ResourceNotFoundException("Country not found: " + countryId));
	}

	private void validateYear(Integer year) {
		if (year == null) {
			throw new InvalidRequestException("Year is required");
		}
		if (year < 1900 || year > 9999) {
			throw new InvalidRequestException("Year must be between 1900 and 9999");
		}
	}

	private void assertCountryYearUnique(UUID countryId, Integer year, UUID calendarId) {
		boolean exists = calendarId == null
				? holidayCalendarRepository.existsByCountry_IdAndYear(countryId, year)
				: holidayCalendarRepository.existsByCountry_IdAndYearAndIdNot(countryId, year, calendarId);
		if (exists) {
			throw new ResourceConflictException("Holiday calendar already exists for country and year");
		}
	}

	private void validateHolidayRequest(HolidayCalendar holidayCalendar, LocalDate startDate, LocalDate endDate, UUID holidayId) {
		if (startDate == null) {
			throw new InvalidRequestException("Holiday startDate is required");
		}
		if (endDate == null) {
			throw new InvalidRequestException("Holiday endDate is required");
		}
		if (endDate.isBefore(startDate)) {
			throw new InvalidRequestException("Holiday endDate must be on or after startDate");
		}
		if (startDate.getYear() != holidayCalendar.getYear() || endDate.getYear() != holidayCalendar.getYear()) {
			throw new InvalidRequestException("Holiday dates must stay within the holiday calendar year");
		}
		boolean overlapping = holidayId == null
				? holidayRepository.existsOverlappingHoliday(holidayCalendar.getId(), startDate, endDate)
				: holidayRepository.existsOverlappingHolidayExcludingId(holidayCalendar.getId(), holidayId, startDate, endDate);
		if (overlapping) {
			throw new ResourceConflictException("Holiday dates overlap with an existing holiday in the same calendar");
		}
	}

	private void applyHoliday(
			Holiday holiday,
			String name,
			LocalDate startDate,
			LocalDate endDate,
			com.odsoftware.hrm.entity.calendar.HolidayType type,
			com.odsoftware.hrm.entity.calendar.HolidayGenerationRule generationRule,
			String description) {
		holiday.setName(cleanRequired(name, "Holiday name is required"));
		holiday.setStartDate(startDate);
		holiday.setEndDate(endDate);
		if (type == null) {
			throw new InvalidRequestException("Holiday type is required");
		}
		if (generationRule == null) {
			throw new InvalidRequestException("Holiday generationRule is required");
		}
		holiday.setType(type);
		holiday.setGenerationRule(generationRule);
		holiday.setDescription(clean(description));
	}

	private HolidayCalendarAdministrationCalendarListItemResponse toCalendarListItemResponse(HolidayCalendar holidayCalendar) {
		return new HolidayCalendarAdministrationCalendarListItemResponse(
				holidayCalendar.getId(),
				toCountryReference(holidayCalendar.getCountry()),
				holidayCalendar.getYear(),
				holidayCalendar.getName(),
				holidayCalendar.getActive(),
				holidayCalendar.getCreatedAt(),
				holidayCalendar.getUpdatedAt());
	}

	private HolidayCalendarAdministrationCalendarDetailResponse toCalendarDetailResponse(HolidayCalendar holidayCalendar) {
		return new HolidayCalendarAdministrationCalendarDetailResponse(
				holidayCalendar.getId(),
				toCountryReference(holidayCalendar.getCountry()),
				holidayCalendar.getYear(),
				holidayCalendar.getName(),
				holidayCalendar.getActive(),
				holidayCalendar.getCreatedAt(),
				holidayCalendar.getUpdatedAt());
	}

	private HolidayCalendarAdministrationHolidayListItemResponse toHolidayListItemResponse(Holiday holiday) {
		return new HolidayCalendarAdministrationHolidayListItemResponse(
				holiday.getId(),
				holiday.getName(),
				holiday.getStartDate(),
				holiday.getEndDate(),
				holiday.getType(),
				holiday.getGenerationRule(),
				holiday.getDescription(),
				holiday.getCreatedAt(),
				holiday.getUpdatedAt());
	}

	private HolidayCalendarAdministrationHolidayDetailResponse toHolidayDetailResponse(Holiday holiday) {
		return new HolidayCalendarAdministrationHolidayDetailResponse(
				holiday.getId(),
				holiday.getHolidayCalendar().getId(),
				holiday.getName(),
				holiday.getStartDate(),
				holiday.getEndDate(),
				holiday.getType(),
				holiday.getGenerationRule(),
				holiday.getDescription(),
				holiday.getCreatedAt(),
				holiday.getUpdatedAt());
	}

	private HolidayCalendarAdministrationReferenceResponse toCountryReference(Country country) {
		return new HolidayCalendarAdministrationReferenceResponse(country.getId(), country.getIsoCode(), country.getName());
	}

	private String cleanRequired(String value, String message) {
		String cleaned = clean(value);
		if (cleaned == null) {
			throw new InvalidRequestException(message);
		}
		return cleaned;
	}

	private String clean(String value) {
		if (value == null) {
			return null;
		}
		String cleaned = value.trim();
		return cleaned.isEmpty() ? null : cleaned;
	}
}
