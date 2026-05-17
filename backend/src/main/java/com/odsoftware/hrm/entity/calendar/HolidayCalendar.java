package com.odsoftware.hrm.entity.calendar;

import com.odsoftware.hrm.entity.master.Area;
import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.entity.master.Region;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
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
	@Column(name = "calendar_year", nullable = false)
	private Integer year;

	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(name = "scope", nullable = false, length = 50)
	private HolidayCalendarScope scope = HolidayCalendarScope.GLOBAL;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tenant_id")
	private Tenant tenant;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company_profile_id")
	private CompanyProfile companyProfile;

	@Column(name = "global_scope_key", length = 50)
	private String globalScopeKey;

	@Column(name = "tenant_scope_id")
	private UUID tenantScopeId;

	@Column(name = "company_profile_scope_id")
	private UUID companyProfileScopeId;

	@NotBlank
	@Size(max = 255)
	@Column(name = "name", nullable = false, length = 255)
	private String name;

	@NotNull
	@Column(name = "active", nullable = false)
	private Boolean active = true;

	@OneToMany(mappedBy = "holidayCalendar", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Holiday> holidays = new ArrayList<>();

	@Column(name = "created_at", nullable = false, updatable = false)
	private OffsetDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private OffsetDateTime updatedAt;

	@PrePersist
	void prePersist() {
		OffsetDateTime now = OffsetDateTime.now();
		this.createdAt = now;
		this.updatedAt = now;
		if (this.active == null) {
			this.active = true;
		}
		if (this.scope == null) {
			this.scope = HolidayCalendarScope.GLOBAL;
		}
		synchronizeScopeKeys();
	}

	@PreUpdate
	void preUpdate() {
		this.updatedAt = OffsetDateTime.now();
		synchronizeScopeKeys();
	}

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

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public HolidayCalendarScope getScope() {
		return scope;
	}

	public void setScope(HolidayCalendarScope scope) {
		this.scope = scope;
	}

	public Tenant getTenant() {
		return tenant;
	}

	public void setTenant(Tenant tenant) {
		this.tenant = tenant;
	}

	public CompanyProfile getCompanyProfile() {
		return companyProfile;
	}

	public void setCompanyProfile(CompanyProfile companyProfile) {
		this.companyProfile = companyProfile;
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

	public List<Holiday> getHolidays() {
		return holidays;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}

	private void synchronizeScopeKeys() {
		if (this.scope == null) {
			this.scope = HolidayCalendarScope.GLOBAL;
		}
		switch (this.scope) {
			case GLOBAL -> {
				this.globalScopeKey = HolidayCalendarScope.GLOBAL.name();
				this.tenantScopeId = null;
				this.companyProfileScopeId = null;
			}
			case TENANT -> {
				this.globalScopeKey = null;
				this.tenantScopeId = this.tenant != null ? this.tenant.getId() : null;
				this.companyProfileScopeId = null;
			}
			case COMPANY_PROFILE -> {
				this.globalScopeKey = null;
				this.tenantScopeId = null;
				this.companyProfileScopeId = this.companyProfile != null ? this.companyProfile.getId() : null;
			}
		}
	}
}
