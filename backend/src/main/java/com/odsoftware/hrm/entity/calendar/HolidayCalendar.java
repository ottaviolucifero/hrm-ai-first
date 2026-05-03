package com.odsoftware.hrm.entity.calendar;

import com.odsoftware.hrm.entity.master.Area;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.entity.master.Region;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "holiday_calendars")
public class HolidayCalendar {

	@Id
	@GeneratedValue
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "country_id", nullable = false)
	private Country country;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "region_id")
	private Region region;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "area_id")
	private Area area;

	@NotNull
	@Column(name = "start_date", nullable = false)
	private LocalDate startDate;

	@NotNull
	@Column(name = "end_date", nullable = false)
	private LocalDate endDate;

	@NotBlank
	@Size(max = 255)
	@Column(name = "name", nullable = false, length = 255)
	private String name;

	@NotNull
	@Column(name = "active", nullable = false)
	private Boolean active = true;

	public UUID getId() {
		return id;
	}

	public Country getCountry() {
		return country;
	}

	public void setCountry(Country country) {
		this.country = country;
	}

	public Region getRegion() {
		return region;
	}

	public void setRegion(Region region) {
		this.region = region;
	}

	public Area getArea() {
		return area;
	}

	public void setArea(Area area) {
		this.area = area;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}
}
