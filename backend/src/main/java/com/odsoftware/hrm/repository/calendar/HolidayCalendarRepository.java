package com.odsoftware.hrm.repository.calendar;

import com.odsoftware.hrm.entity.calendar.HolidayCalendar;
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

	boolean existsByCountry_IdAndYear(UUID countryId, Integer year);

	boolean existsByCountry_IdAndYearAndIdNot(UUID countryId, Integer year, UUID id);

	boolean existsByRegion_Id(UUID regionId);

	boolean existsByArea_Id(UUID areaId);

	@Override
	@EntityGraph(attributePaths = {"country"})
	Page<HolidayCalendar> findAll(Specification<HolidayCalendar> specification, Pageable pageable);

	@Override
	@EntityGraph(attributePaths = {"country"})
	Optional<HolidayCalendar> findById(UUID id);
}
