package com.odsoftware.hrm.entity.core;

import com.odsoftware.hrm.entity.common.BaseMasterEntity;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.entity.master.Currency;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "tenants", uniqueConstraints = @UniqueConstraint(name = "uk_tenants_code", columnNames = "code"))
public class Tenant extends BaseMasterEntity {

	@NotBlank
	@Size(max = 50)
	@Column(name = "code", nullable = false, length = 50)
	private String code;

	@NotBlank
	@Size(max = 100)
	@Column(name = "name", nullable = false, length = 100)
	private String name;

	@NotBlank
	@Size(max = 150)
	@Column(name = "legal_name", nullable = false, length = 150)
	private String legalName;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "default_country_id", nullable = false)
	private Country defaultCountry;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "default_currency_id", nullable = false)
	private Currency defaultCurrency;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLegalName() {
		return legalName;
	}

	public void setLegalName(String legalName) {
		this.legalName = legalName;
	}

	public Country getDefaultCountry() {
		return defaultCountry;
	}

	public void setDefaultCountry(Country defaultCountry) {
		this.defaultCountry = defaultCountry;
	}

	public Currency getDefaultCurrency() {
		return defaultCurrency;
	}

	public void setDefaultCurrency(Currency defaultCurrency) {
		this.defaultCurrency = defaultCurrency;
	}
}
