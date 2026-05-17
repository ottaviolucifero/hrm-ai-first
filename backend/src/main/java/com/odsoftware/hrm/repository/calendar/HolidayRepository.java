package com.odsoftware.hrm.repository.calendar;

import com.odsoftware.hrm.entity.calendar.Holiday;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface HolidayRepository extends JpaRepository<Holiday, UUID> {

	@EntityGraph(attributePaths = {"holidayCalendar", "holidayCalendar.country"})
	List<Holiday> findByHolidayCalendar_IdOrderByStartDateAscNameAsc(UUID holidayCalendarId);

	@EntityGraph(attributePaths = {"holidayCalendar", "holidayCalendar.country"})
	Optional<Holiday> findByIdAndHolidayCalendar_Id(UUID id, UUID holidayCalendarId);

	@Query("""
			select case when count(holiday) > 0 then true else false end
			from Holiday holiday
			where holiday.holidayCalendar.id = :holidayCalendarId
			  and holiday.startDate <= :endDate
			  and holiday.endDate >= :startDate
			""")
	boolean existsOverlappingHoliday(UUID holidayCalendarId, LocalDate startDate, LocalDate endDate);

	@Query("""
			select case when count(holiday) > 0 then true else false end
			from Holiday holiday
			where holiday.holidayCalendar.id = :holidayCalendarId
			  and holiday.id <> :holidayId
			  and holiday.startDate <= :endDate
			  and holiday.endDate >= :startDate
			""")
	boolean existsOverlappingHolidayExcludingId(UUID holidayCalendarId, UUID holidayId, LocalDate startDate, LocalDate endDate);

	@Query("""
			select case when count(holiday) > 0 then true else false end
			from Holiday holiday
			where holiday.holidayCalendar.id = :holidayCalendarId
			  and holiday.startDate <= :date
			  and holiday.endDate >= :date
			""")
	boolean existsByHolidayCalendarIdAndDate(UUID holidayCalendarId, LocalDate date);
}
