package com.odsoftware.hrm.entity.master;

import com.odsoftware.hrm.entity.common.BaseTenantMasterEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "areas", uniqueConstraints = @UniqueConstraint(name = "uk_areas_tenant_region_code", columnNames = {"tenant_id", "region_id", "code"}))
public class Area extends BaseTenantMasterEntity {

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "country_id", nullable = false)
	private Country country;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "region_id", nullable = false)
	private Region region;

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
}
