package com.odsoftware.hrm.entity.master;

import com.odsoftware.hrm.entity.common.BaseMasterEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "global_zip_codes")
public class GlobalZipCode extends BaseMasterEntity {

	@Column(name = "tenant_id")
	private UUID tenantId;

	@Column(name = "tenant_scope_key", nullable = false)
	private UUID tenantScopeKey;

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

	@NotBlank
	@Size(max = 120)
	@Column(name = "city", nullable = false, length = 120)
	private String city;

	@NotBlank
	@Size(max = 20)
	@Column(name = "postal_code", nullable = false, length = 20)
	private String postalCode;

	@Size(max = 20)
	@Column(name = "province_code", length = 20)
	private String provinceCode;

	@Size(max = 120)
	@Column(name = "province_name", length = 120)
	private String provinceName;

	@DecimalMin("-90.0")
	@DecimalMax("90.0")
	@Column(name = "latitude", precision = 10, scale = 7)
	private BigDecimal latitude;

	@DecimalMin("-180.0")
	@DecimalMax("180.0")
	@Column(name = "longitude", precision = 10, scale = 7)
	private BigDecimal longitude;

	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(name = "source_type", nullable = false, length = 30)
	private GlobalZipCodeSourceType sourceType;

	public UUID getTenantId() {
		return tenantId;
	}

	public void setTenantId(UUID tenantId) {
		this.tenantId = tenantId;
	}

	public UUID getTenantScopeKey() {
		return tenantScopeKey;
	}

	public void setTenantScopeKey(UUID tenantScopeKey) {
		this.tenantScopeKey = tenantScopeKey;
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

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getPostalCode() {
		return postalCode;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	public String getProvinceCode() {
		return provinceCode;
	}

	public void setProvinceCode(String provinceCode) {
		this.provinceCode = provinceCode;
	}

	public String getProvinceName() {
		return provinceName;
	}

	public void setProvinceName(String provinceName) {
		this.provinceName = provinceName;
	}

	public BigDecimal getLatitude() {
		return latitude;
	}

	public void setLatitude(BigDecimal latitude) {
		this.latitude = latitude;
	}

	public BigDecimal getLongitude() {
		return longitude;
	}

	public void setLongitude(BigDecimal longitude) {
		this.longitude = longitude;
	}

	public GlobalZipCodeSourceType getSourceType() {
		return sourceType;
	}

	public void setSourceType(GlobalZipCodeSourceType sourceType) {
		this.sourceType = sourceType;
	}
}
