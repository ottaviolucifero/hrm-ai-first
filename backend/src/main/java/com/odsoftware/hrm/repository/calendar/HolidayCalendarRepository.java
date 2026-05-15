package com.odsoftware.hrm.repository.calendar;

import com.odsoftware.hrm.entity.calendar.HolidayCalendar;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HolidayCalendarRepository extends JpaRepository<HolidayCalendar, UUID> {

	List<HolidayCalendar> findByCountry_Id(UUID countryId);

	List<HolidayCalendar> findByCountry_IdAndRegion_Id(UUID countryId, UUID regionId);

	List<HolidayCalendar> findByCountry_IdAndRegion_IdAndArea_Id(UUID countryId, UUID regionId, UUID areaId);

	List<HolidayCalendar> findByCountry_IdAndActiveTrue(UUID countryId);

	boolean existsByRegion_Id(UUID regionId);

	boolean existsByArea_Id(UUID areaId);
}
