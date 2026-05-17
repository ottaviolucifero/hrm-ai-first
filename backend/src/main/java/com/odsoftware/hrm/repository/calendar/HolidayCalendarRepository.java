package com.odsoftware.hrm.repository.calendar;

import com.odsoftware.hrm.entity.calendar.HolidayCalendar;
import com.odsoftware.hrm.entity.calendar.HolidayCalendarScope;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface HolidayCalendarRepository extends JpaRepository<HolidayCalendar, UUID>, JpaSpecificationExecutor<HolidayCalendar> {

	List<HolidayCalendar> findByCountry_Id(UUID countryId);

	List<HolidayCalendar> findByCountry_IdAndRegion_Id(UUID countryId, UUID regionId);

	List<HolidayCalendar> findByCountry_IdAndRegion_IdAndArea_Id(UUID countryId, UUID regionId, UUID areaId);

	List<HolidayCalendar> findByCountry_IdAndActiveTrue(UUID countryId);

	Optional<HolidayCalendar> findByCountry_IdAndYear(UUID countryId, Integer year);

	Optional<HolidayCalendar> findByCountry_IdAndYearAndScope(UUID countryId, Integer year, HolidayCalendarScope scope);

	Optional<HolidayCalendar> findByCompanyProfile_IdAndCountry_IdAndYearAndActiveTrue(
			UUID companyProfileId,
			UUID countryId,
			Integer year);

	Optional<HolidayCalendar> findByTenant_IdAndCompanyProfileIsNullAndCountry_IdAndYearAndActiveTrue(
			UUID tenantId,
			UUID countryId,
			Integer year);

	Optional<HolidayCalendar> findByScopeAndCountry_IdAndYearAndActiveTrue(
			HolidayCalendarScope scope,
			UUID countryId,
			Integer year);

	boolean existsByScopeAndCountry_IdAndYear(HolidayCalendarScope scope, UUID countryId, Integer year);

	boolean existsByScopeAndCountry_IdAndYearAndIdNot(HolidayCalendarScope scope, UUID countryId, Integer year, UUID id);

	boolean existsByTenant_IdAndCompanyProfileIsNullAndCountry_IdAndYear(
			UUID tenantId,
			UUID countryId,
			Integer year);

	boolean existsByTenant_IdAndCompanyProfileIsNullAndCountry_IdAndYearAndIdNot(
			UUID tenantId,
			UUID countryId,
			Integer year,
			UUID id);

	boolean existsByCompanyProfile_IdAndCountry_IdAndYear(
			UUID companyProfileId,
			UUID countryId,
			Integer year);

	boolean existsByCompanyProfile_IdAndCountry_IdAndYearAndIdNot(
			UUID companyProfileId,
			UUID countryId,
			Integer year,
			UUID id);

	boolean existsByRegion_Id(UUID regionId);

	boolean existsByArea_Id(UUID areaId);

	@Override
	@EntityGraph(attributePaths = {"country", "tenant", "companyProfile"})
	Page<HolidayCalendar> findAll(Specification<HolidayCalendar> specification, Pageable pageable);

	@Override
	@EntityGraph(attributePaths = {"country", "tenant", "companyProfile"})
	Optional<HolidayCalendar> findById(UUID id);
}
