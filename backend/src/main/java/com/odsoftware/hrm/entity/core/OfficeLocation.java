package com.odsoftware.hrm.entity.core;

import com.odsoftware.hrm.entity.common.BaseMasterEntity;
import com.odsoftware.hrm.entity.master.Area;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.entity.master.GlobalZipCode;
import com.odsoftware.hrm.entity.master.OfficeLocationType;
import com.odsoftware.hrm.entity.master.Region;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "office_locations", uniqueConstraints = @UniqueConstraint(name = "uk_office_locations_tenant_code", columnNames = {"tenant_id", "code"}))
public class OfficeLocation extends BaseMasterEntity {

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "tenant_id", nullable = false)
	private Tenant tenant;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_profile_id", nullable = false)
	private CompanyProfile companyProfile;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "office_location_type_id", nullable = false)
	private OfficeLocationType officeLocationType;

	@NotBlank
	@Size(max = 50)
	@Column(name = "code", nullable = false, length = 50)
	private String code;

	@NotBlank
	@Size(max = 150)
	@Column(name = "name", nullable = false, length = 150)
	private String name;

	@Email
	@Size(max = 150)
	@Column(name = "email", length = 150)
	private String email;

	@Size(max = 50)
	@Column(name = "phone", length = 50)
	private String phone;

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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "global_zip_code_id")
	private GlobalZipCode globalZipCode;

	@NotBlank
	@Size(max = 150)
	@Column(name = "street", nullable = false, length = 150)
	private String street;

	@NotBlank
	@Size(max = 30)
	@Column(name = "street_number", nullable = false, length = 30)
	private String streetNumber;

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

	public OfficeLocationType getOfficeLocationType() {
		return officeLocationType;
	}

	public void setOfficeLocationType(OfficeLocationType officeLocationType) {
		this.officeLocationType = officeLocationType;
	}

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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
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

	public GlobalZipCode getGlobalZipCode() {
		return globalZipCode;
	}

	public void setGlobalZipCode(GlobalZipCode globalZipCode) {
		this.globalZipCode = globalZipCode;
	}

	public String getStreet() {
		return street;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	public String getStreetNumber() {
		return streetNumber;
	}

	public void setStreetNumber(String streetNumber) {
		this.streetNumber = streetNumber;
	}
}
