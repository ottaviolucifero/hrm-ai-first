package com.odsoftware.hrm.entity.employee;

import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.OfficeLocation;
import com.odsoftware.hrm.entity.core.Tenant;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "employees", uniqueConstraints = @UniqueConstraint(name = "uk_employees_tenant_employee_code", columnNames = {"tenant_id", "employee_code"}))
public class Employee {

	@Id
	@GeneratedValue
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "tenant_id", nullable = false)
	private Tenant tenant;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_id", nullable = false)
	private CompanyProfile company;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "office_id")
	private OfficeLocation office;

	@NotBlank
	@Size(max = 50)
	@Column(name = "employee_code", nullable = false, length = 50)
	private String employeeCode;

	@NotBlank
	@Size(max = 100)
	@Column(name = "first_name", nullable = false, length = 100)
	private String firstName;

	@NotBlank
	@Size(max = 100)
	@Column(name = "last_name", nullable = false, length = 100)
	private String lastName;

	@Size(max = 50)
	@Column(name = "fiscal_code", length = 50)
	private String fiscalCode;

	@Email
	@Size(max = 150)
	@Column(name = "email", length = 150)
	private String email;

	@Size(max = 100)
	@Column(name = "residence_country", length = 100)
	private String residenceCountry;

	@Size(max = 100)
	@Column(name = "residence_region", length = 100)
	private String residenceRegion;

	@Size(max = 100)
	@Column(name = "residence_area", length = 100)
	private String residenceArea;

	@Size(max = 20)
	@Column(name = "residence_global_zip_code", length = 20)
	private String residenceGlobalZipCode;

	@Size(max = 120)
	@Column(name = "residence_city", length = 120)
	private String residenceCity;

	@Size(max = 150)
	@Column(name = "residence_address_line1", length = 150)
	private String residenceAddressLine1;

	@Size(max = 30)
	@Column(name = "residence_street_number", length = 30)
	private String residenceStreetNumber;

	@Size(max = 150)
	@Column(name = "residence_address_line2", length = 150)
	private String residenceAddressLine2;

	@Size(max = 20)
	@Column(name = "residence_postal_code", length = 20)
	private String residencePostalCode;

	@Size(max = 100)
	@Column(name = "national_identifier", length = 100)
	private String nationalIdentifier;

	@Size(max = 50)
	@Column(name = "national_identifier_type", length = 50)
	private String nationalIdentifierType;

	@Column(name = "birth_date")
	private LocalDate birthDate;

	@Size(max = 100)
	@Column(name = "birth_country", length = 100)
	private String birthCountry;

	@Size(max = 100)
	@Column(name = "birth_region", length = 100)
	private String birthRegion;

	@Size(max = 100)
	@Column(name = "birth_area", length = 100)
	private String birthArea;

	@Size(max = 120)
	@Column(name = "birth_city", length = 120)
	private String birthCity;

	@Size(max = 50)
	@Column(name = "gender", length = 50)
	private String gender;

	@Size(max = 50)
	@Column(name = "marital_status", length = 50)
	private String maritalStatus;

	@Size(max = 10)
	@Column(name = "international_phone_prefix", length = 10)
	private String internationalPhonePrefix;

	@Size(max = 50)
	@Column(name = "phone_number", length = 50)
	private String phoneNumber;

	@Size(max = 150)
	@Column(name = "emergency_contact_name", length = 150)
	private String emergencyContactName;

	@Size(max = 10)
	@Column(name = "emergency_contact_phone_prefix", length = 10)
	private String emergencyContactPhonePrefix;

	@Size(max = 50)
	@Column(name = "emergency_contact_phone_number", length = 50)
	private String emergencyContactPhoneNumber;

	@NotNull
	@Column(name = "has_children", nullable = false)
	private Boolean hasChildren = false;

	@NotNull
	@Min(0)
	@Column(name = "children_count", nullable = false)
	private Integer childrenCount = 0;

	@Size(max = 50)
	@Column(name = "department", length = 50)
	private String department;

	@Size(max = 50)
	@Column(name = "job_title", length = 50)
	private String jobTitle;

	@Size(max = 50)
	@Column(name = "contract_type", length = 50)
	private String contractType;

	@NotBlank
	@Size(max = 50)
	@Column(name = "employment_status", nullable = false, length = 50)
	private String employmentStatus;

	@Size(max = 50)
	@Column(name = "work_mode", length = 50)
	private String workMode;

	@Column(name = "hire_date")
	private LocalDate hireDate;

	@Column(name = "termination_date")
	private LocalDate terminationDate;

	@NotNull
	@Column(name = "active", nullable = false)
	private Boolean active = true;

	@Column(name = "gdpr_consent_at")
	private OffsetDateTime gdprConsentAt;

	@Column(name = "privacy_policy_accepted_at")
	private OffsetDateTime privacyPolicyAcceptedAt;

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
		if (this.hasChildren == null) {
			this.hasChildren = false;
		}
		if (this.childrenCount == null) {
			this.childrenCount = 0;
		}
	}

	@PreUpdate
	void preUpdate() {
		this.updatedAt = OffsetDateTime.now();
	}

	public UUID getId() {
		return id;
	}

	public Tenant getTenant() {
		return tenant;
	}

	public void setTenant(Tenant tenant) {
		this.tenant = tenant;
	}

	public CompanyProfile getCompany() {
		return company;
	}

	public void setCompany(CompanyProfile company) {
		this.company = company;
	}

	public OfficeLocation getOffice() {
		return office;
	}

	public void setOffice(OfficeLocation office) {
		this.office = office;
	}

	public String getEmployeeCode() {
		return employeeCode;
	}

	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getFiscalCode() {
		return fiscalCode;
	}

	public void setFiscalCode(String fiscalCode) {
		this.fiscalCode = fiscalCode;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getResidenceCountry() {
		return residenceCountry;
	}

	public void setResidenceCountry(String residenceCountry) {
		this.residenceCountry = residenceCountry;
	}

	public String getResidenceRegion() {
		return residenceRegion;
	}

	public void setResidenceRegion(String residenceRegion) {
		this.residenceRegion = residenceRegion;
	}

	public String getResidenceArea() {
		return residenceArea;
	}

	public void setResidenceArea(String residenceArea) {
		this.residenceArea = residenceArea;
	}

	public String getResidenceGlobalZipCode() {
		return residenceGlobalZipCode;
	}

	public void setResidenceGlobalZipCode(String residenceGlobalZipCode) {
		this.residenceGlobalZipCode = residenceGlobalZipCode;
	}

	public String getResidenceCity() {
		return residenceCity;
	}

	public void setResidenceCity(String residenceCity) {
		this.residenceCity = residenceCity;
	}

	public String getResidenceAddressLine1() {
		return residenceAddressLine1;
	}

	public void setResidenceAddressLine1(String residenceAddressLine1) {
		this.residenceAddressLine1 = residenceAddressLine1;
	}

	public String getResidenceStreetNumber() {
		return residenceStreetNumber;
	}

	public void setResidenceStreetNumber(String residenceStreetNumber) {
		this.residenceStreetNumber = residenceStreetNumber;
	}

	public String getResidenceAddressLine2() {
		return residenceAddressLine2;
	}

	public void setResidenceAddressLine2(String residenceAddressLine2) {
		this.residenceAddressLine2 = residenceAddressLine2;
	}

	public String getResidencePostalCode() {
		return residencePostalCode;
	}

	public void setResidencePostalCode(String residencePostalCode) {
		this.residencePostalCode = residencePostalCode;
	}

	public String getNationalIdentifier() {
		return nationalIdentifier;
	}

	public void setNationalIdentifier(String nationalIdentifier) {
		this.nationalIdentifier = nationalIdentifier;
	}

	public String getNationalIdentifierType() {
		return nationalIdentifierType;
	}

	public void setNationalIdentifierType(String nationalIdentifierType) {
		this.nationalIdentifierType = nationalIdentifierType;
	}

	public LocalDate getBirthDate() {
		return birthDate;
	}

	public void setBirthDate(LocalDate birthDate) {
		this.birthDate = birthDate;
	}

	public String getBirthCountry() {
		return birthCountry;
	}

	public void setBirthCountry(String birthCountry) {
		this.birthCountry = birthCountry;
	}

	public String getBirthRegion() {
		return birthRegion;
	}

	public void setBirthRegion(String birthRegion) {
		this.birthRegion = birthRegion;
	}

	public String getBirthArea() {
		return birthArea;
	}

	public void setBirthArea(String birthArea) {
		this.birthArea = birthArea;
	}

	public String getBirthCity() {
		return birthCity;
	}

	public void setBirthCity(String birthCity) {
		this.birthCity = birthCity;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getMaritalStatus() {
		return maritalStatus;
	}

	public void setMaritalStatus(String maritalStatus) {
		this.maritalStatus = maritalStatus;
	}

	public String getInternationalPhonePrefix() {
		return internationalPhonePrefix;
	}

	public void setInternationalPhonePrefix(String internationalPhonePrefix) {
		this.internationalPhonePrefix = internationalPhonePrefix;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmergencyContactName() {
		return emergencyContactName;
	}

	public void setEmergencyContactName(String emergencyContactName) {
		this.emergencyContactName = emergencyContactName;
	}

	public String getEmergencyContactPhonePrefix() {
		return emergencyContactPhonePrefix;
	}

	public void setEmergencyContactPhonePrefix(String emergencyContactPhonePrefix) {
		this.emergencyContactPhonePrefix = emergencyContactPhonePrefix;
	}

	public String getEmergencyContactPhoneNumber() {
		return emergencyContactPhoneNumber;
	}

	public void setEmergencyContactPhoneNumber(String emergencyContactPhoneNumber) {
		this.emergencyContactPhoneNumber = emergencyContactPhoneNumber;
	}

	public Boolean getHasChildren() {
		return hasChildren;
	}

	public void setHasChildren(Boolean hasChildren) {
		this.hasChildren = hasChildren;
	}

	public Integer getChildrenCount() {
		return childrenCount;
	}

	public void setChildrenCount(Integer childrenCount) {
		this.childrenCount = childrenCount;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public String getContractType() {
		return contractType;
	}

	public void setContractType(String contractType) {
		this.contractType = contractType;
	}

	public String getEmploymentStatus() {
		return employmentStatus;
	}

	public void setEmploymentStatus(String employmentStatus) {
		this.employmentStatus = employmentStatus;
	}

	public String getWorkMode() {
		return workMode;
	}

	public void setWorkMode(String workMode) {
		this.workMode = workMode;
	}

	public LocalDate getHireDate() {
		return hireDate;
	}

	public void setHireDate(LocalDate hireDate) {
		this.hireDate = hireDate;
	}

	public LocalDate getTerminationDate() {
		return terminationDate;
	}

	public void setTerminationDate(LocalDate terminationDate) {
		this.terminationDate = terminationDate;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public OffsetDateTime getGdprConsentAt() {
		return gdprConsentAt;
	}

	public void setGdprConsentAt(OffsetDateTime gdprConsentAt) {
		this.gdprConsentAt = gdprConsentAt;
	}

	public OffsetDateTime getPrivacyPolicyAcceptedAt() {
		return privacyPolicyAcceptedAt;
	}

	public void setPrivacyPolicyAcceptedAt(OffsetDateTime privacyPolicyAcceptedAt) {
		this.privacyPolicyAcceptedAt = privacyPolicyAcceptedAt;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}
}
