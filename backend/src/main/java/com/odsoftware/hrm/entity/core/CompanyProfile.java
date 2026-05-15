package com.odsoftware.hrm.entity.core;

import com.odsoftware.hrm.entity.common.BaseMasterEntity;
import com.odsoftware.hrm.entity.master.Area;
import com.odsoftware.hrm.entity.master.CompanyProfileType;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.entity.master.GlobalZipCode;
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
@Table(name = "company_profiles", uniqueConstraints = @UniqueConstraint(name = "uk_company_profiles_tenant_code", columnNames = {"tenant_id", "code"}))
public class CompanyProfile extends BaseMasterEntity {

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "tenant_id", nullable = false)
	private Tenant tenant;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_profile_type_id", nullable = false)
	private CompanyProfileType companyProfileType;

	@NotBlank
	@Size(max = 50)
	@Column(name = "code", nullable = false, length = 50)
	private String code;

	@NotBlank
	@Size(max = 150)
	@Column(name = "legal_name", nullable = false, length = 150)
	private String legalName;

	@NotBlank
	@Size(max = 150)
	@Column(name = "trade_name", nullable = false, length = 150)
	private String tradeName;

	@Size(max = 50)
	@Column(name = "vat_number", length = 50)
	private String vatNumber;

	@Size(max = 50)
	@Column(name = "tax_identifier", length = 50)
	private String taxIdentifier;

	@Size(max = 50)
	@Column(name = "tax_number", length = 50)
	private String taxNumber;

	@Email
	@Size(max = 150)
	@Column(name = "email", length = 150)
	private String email;

	@Email
	@Size(max = 150)
	@Column(name = "pec_email", length = 150)
	private String pecEmail;

	@Size(max = 50)
	@Column(name = "phone_dial_code", length = 10)
	private String phoneDialCode;

	@Size(max = 50)
	@Column(name = "phone_national_number", length = 50)
	private String phoneNationalNumber;

	@Size(max = 70)
	@Column(name = "phone", length = 70)
	private String phone;

	@Size(max = 50)
	@Column(name = "sdi_code", length = 50)
	private String sdiCode;

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

	public CompanyProfileType getCompanyProfileType() {
		return companyProfileType;
	}

	public void setCompanyProfileType(CompanyProfileType companyProfileType) {
		this.companyProfileType = companyProfileType;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getLegalName() {
		return legalName;
	}

	public void setLegalName(String legalName) {
		this.legalName = legalName;
	}

	public String getTradeName() {
		return tradeName;
	}

	public void setTradeName(String tradeName) {
		this.tradeName = tradeName;
	}

	public String getVatNumber() {
		return vatNumber;
	}

	public void setVatNumber(String vatNumber) {
		this.vatNumber = vatNumber;
	}

	public String getTaxIdentifier() {
		return taxIdentifier;
	}

	public void setTaxIdentifier(String taxIdentifier) {
		this.taxIdentifier = taxIdentifier;
	}

	public String getTaxNumber() {
		return taxNumber;
	}

	public void setTaxNumber(String taxNumber) {
		this.taxNumber = taxNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPecEmail() {
		return pecEmail;
	}

	public void setPecEmail(String pecEmail) {
		this.pecEmail = pecEmail;
	}

	public String getPhoneDialCode() {
		return phoneDialCode;
	}

	public void setPhoneDialCode(String phoneDialCode) {
		this.phoneDialCode = phoneDialCode;
	}

	public String getPhoneNationalNumber() {
		return phoneNationalNumber;
	}

	public void setPhoneNationalNumber(String phoneNationalNumber) {
		this.phoneNationalNumber = phoneNationalNumber;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getSdiCode() {
		return sdiCode;
	}

	public void setSdiCode(String sdiCode) {
		this.sdiCode = sdiCode;
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
