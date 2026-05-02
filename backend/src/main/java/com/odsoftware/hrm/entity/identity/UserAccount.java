package com.odsoftware.hrm.entity.identity;

import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.master.AuthenticationMethod;
import com.odsoftware.hrm.entity.master.TimeZone;
import com.odsoftware.hrm.entity.master.UserType;
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
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_accounts", uniqueConstraints = @UniqueConstraint(name = "uk_user_accounts_tenant_email", columnNames = {"tenant_id", "email"}))
public class UserAccount {

	@Id
	@GeneratedValue
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "tenant_id", nullable = false)
	private Tenant tenant;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company_profile_id")
	private CompanyProfile companyProfile;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_type_id", nullable = false)
	private UserType userType;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "authentication_method_id", nullable = false)
	private AuthenticationMethod authenticationMethod;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "primary_tenant_id")
	private Tenant primaryTenant;

	@NotBlank
	@Email
	@Size(max = 150)
	@Column(name = "email", nullable = false, length = 150)
	private String email;

	@Size(max = 255)
	@Column(name = "password_hash", length = 255)
	private String passwordHash;

	@Size(max = 255)
	@Column(name = "otp_secret", length = 255)
	private String otpSecret;

	@NotNull
	@Column(name = "email_otp_enabled", nullable = false)
	private Boolean emailOtpEnabled = false;

	@NotNull
	@Column(name = "app_otp_enabled", nullable = false)
	private Boolean appOtpEnabled = false;

	@NotNull
	@Column(name = "strong_authentication_required", nullable = false)
	private Boolean strongAuthenticationRequired = false;

	@Column(name = "email_verified_at")
	private OffsetDateTime emailVerifiedAt;

	@Column(name = "password_changed_at")
	private OffsetDateTime passwordChangedAt;

	@Column(name = "last_login_at")
	private OffsetDateTime lastLoginAt;

	@NotNull
	@Min(0)
	@Column(name = "failed_login_attempts", nullable = false)
	private Integer failedLoginAttempts = 0;

	@NotNull
	@Column(name = "locked", nullable = false)
	private Boolean locked = false;

	@NotNull
	@Column(name = "active", nullable = false)
	private Boolean active = true;

	@Size(max = 10)
	@Column(name = "preferred_language", length = 10)
	private String preferredLanguage;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "time_zone_id")
	private TimeZone timeZone;

	@Column(name = "created_at", nullable = false, updatable = false)
	private OffsetDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private OffsetDateTime updatedAt;

	@Column(name = "deleted_at")
	private OffsetDateTime deletedAt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "created_by")
	private UserAccount createdBy;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "updated_by")
	private UserAccount updatedBy;

	@PrePersist
	void prePersist() {
		OffsetDateTime now = OffsetDateTime.now();
		this.createdAt = now;
		this.updatedAt = now;
		if (this.emailOtpEnabled == null) {
			this.emailOtpEnabled = false;
		}
		if (this.appOtpEnabled == null) {
			this.appOtpEnabled = false;
		}
		if (this.strongAuthenticationRequired == null) {
			this.strongAuthenticationRequired = false;
		}
		if (this.failedLoginAttempts == null) {
			this.failedLoginAttempts = 0;
		}
		if (this.locked == null) {
			this.locked = false;
		}
		if (this.active == null) {
			this.active = true;
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

	public CompanyProfile getCompanyProfile() {
		return companyProfile;
	}

	public void setCompanyProfile(CompanyProfile companyProfile) {
		this.companyProfile = companyProfile;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public UserType getUserType() {
		return userType;
	}

	public void setUserType(UserType userType) {
		this.userType = userType;
	}

	public AuthenticationMethod getAuthenticationMethod() {
		return authenticationMethod;
	}

	public void setAuthenticationMethod(AuthenticationMethod authenticationMethod) {
		this.authenticationMethod = authenticationMethod;
	}

	public Tenant getPrimaryTenant() {
		return primaryTenant;
	}

	public void setPrimaryTenant(Tenant primaryTenant) {
		this.primaryTenant = primaryTenant;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	public String getOtpSecret() {
		return otpSecret;
	}

	public void setOtpSecret(String otpSecret) {
		this.otpSecret = otpSecret;
	}

	public Boolean getEmailOtpEnabled() {
		return emailOtpEnabled;
	}

	public void setEmailOtpEnabled(Boolean emailOtpEnabled) {
		this.emailOtpEnabled = emailOtpEnabled;
	}

	public Boolean getAppOtpEnabled() {
		return appOtpEnabled;
	}

	public void setAppOtpEnabled(Boolean appOtpEnabled) {
		this.appOtpEnabled = appOtpEnabled;
	}

	public Boolean getStrongAuthenticationRequired() {
		return strongAuthenticationRequired;
	}

	public void setStrongAuthenticationRequired(Boolean strongAuthenticationRequired) {
		this.strongAuthenticationRequired = strongAuthenticationRequired;
	}

	public OffsetDateTime getEmailVerifiedAt() {
		return emailVerifiedAt;
	}

	public void setEmailVerifiedAt(OffsetDateTime emailVerifiedAt) {
		this.emailVerifiedAt = emailVerifiedAt;
	}

	public OffsetDateTime getPasswordChangedAt() {
		return passwordChangedAt;
	}

	public void setPasswordChangedAt(OffsetDateTime passwordChangedAt) {
		this.passwordChangedAt = passwordChangedAt;
	}

	public OffsetDateTime getLastLoginAt() {
		return lastLoginAt;
	}

	public void setLastLoginAt(OffsetDateTime lastLoginAt) {
		this.lastLoginAt = lastLoginAt;
	}

	public Integer getFailedLoginAttempts() {
		return failedLoginAttempts;
	}

	public void setFailedLoginAttempts(Integer failedLoginAttempts) {
		this.failedLoginAttempts = failedLoginAttempts;
	}

	public Boolean getLocked() {
		return locked;
	}

	public void setLocked(Boolean locked) {
		this.locked = locked;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public String getPreferredLanguage() {
		return preferredLanguage;
	}

	public void setPreferredLanguage(String preferredLanguage) {
		this.preferredLanguage = preferredLanguage;
	}

	public TimeZone getTimeZone() {
		return timeZone;
	}

	public void setTimeZone(TimeZone timeZone) {
		this.timeZone = timeZone;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}

	public OffsetDateTime getDeletedAt() {
		return deletedAt;
	}

	public void setDeletedAt(OffsetDateTime deletedAt) {
		this.deletedAt = deletedAt;
	}

	public UserAccount getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(UserAccount createdBy) {
		this.createdBy = createdBy;
	}

	public UserAccount getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(UserAccount updatedBy) {
		this.updatedBy = updatedBy;
	}
}
