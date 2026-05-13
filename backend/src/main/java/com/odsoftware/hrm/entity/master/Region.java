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
@Table(name = "regions", uniqueConstraints = @UniqueConstraint(name = "uk_regions_tenant_country_code", columnNames = {"tenant_id", "country_id", "code"}))
public class Region extends BaseTenantMasterEntity {

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "country_id", nullable = false)
	private Country country;

	public Country getCountry() {
		return country;
	}

	public void setCountry(Country country) {
		this.country = country;
	}
}
