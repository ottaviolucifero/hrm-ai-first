package com.odsoftware.hrm.entity.audit;

import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.entity.master.AuditActionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

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
	@JoinColumn(name = "user_account_id")
	private UserAccount userAccount;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "audit_action_type_id", nullable = false)
	private AuditActionType auditActionType;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "acting_tenant_id")
	private Tenant actingTenant;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "target_tenant_id")
	private Tenant targetTenant;

	@Size(max = 50)
	@Column(name = "impersonation_mode", length = 50)
	private String impersonationMode = "NONE";

	@NotBlank
	@Size(max = 100)
	@Column(name = "entity_type", nullable = false, length = 100)
	private String entityType;

	@Column(name = "entity_id")
	private UUID entityId;

	@Size(max = 255)
	@Column(name = "entity_display_name", length = 255)
	private String entityDisplayName;

	@NotBlank
	@Size(max = 1000)
	@Column(name = "description", nullable = false, length = 1000)
	private String description;

	@Column(name = "old_value_json", columnDefinition = "TEXT")
	private String oldValueJson;

	@Column(name = "new_value_json", columnDefinition = "TEXT")
	private String newValueJson;

	@Size(max = 100)
	@Column(name = "ip_address", length = 100)
	private String ipAddress;

	@Size(max = 500)
	@Column(name = "user_agent", length = 500)
	private String userAgent;

	@Column(name = "created_at", nullable = false, updatable = false)
	private OffsetDateTime createdAt;

	@NotNull
	@Column(name = "success", nullable = false)
	private Boolean success = true;

	@NotBlank
	@Size(max = 30)
	@Column(name = "severity_level", nullable = false, length = 30)
	private String severityLevel;

	@PrePersist
	void prePersist() {
		if (this.createdAt == null) {
			this.createdAt = OffsetDateTime.now();
		}
		if (this.success == null) {
			this.success = true;
		}
		if (this.impersonationMode == null) {
			this.impersonationMode = "NONE";
		}
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

	public UserAccount getUserAccount() {
		return userAccount;
	}

	public void setUserAccount(UserAccount userAccount) {
		this.userAccount = userAccount;
	}

	public AuditActionType getAuditActionType() {
		return auditActionType;
	}

	public void setAuditActionType(AuditActionType auditActionType) {
		this.auditActionType = auditActionType;
	}

	public Tenant getActingTenant() {
		return actingTenant;
	}

	public void setActingTenant(Tenant actingTenant) {
		this.actingTenant = actingTenant;
	}

	public Tenant getTargetTenant() {
		return targetTenant;
	}

	public void setTargetTenant(Tenant targetTenant) {
		this.targetTenant = targetTenant;
	}

	public String getImpersonationMode() {
		return impersonationMode;
	}

	public void setImpersonationMode(String impersonationMode) {
		this.impersonationMode = impersonationMode;
	}

	public String getEntityType() {
		return entityType;
	}

	public void setEntityType(String entityType) {
		this.entityType = entityType;
	}

	public UUID getEntityId() {
		return entityId;
	}

	public void setEntityId(UUID entityId) {
		this.entityId = entityId;
	}

	public String getEntityDisplayName() {
		return entityDisplayName;
	}

	public void setEntityDisplayName(String entityDisplayName) {
		this.entityDisplayName = entityDisplayName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getOldValueJson() {
		return oldValueJson;
	}

	public void setOldValueJson(String oldValueJson) {
		this.oldValueJson = oldValueJson;
	}

	public String getNewValueJson() {
		return newValueJson;
	}

	public void setNewValueJson(String newValueJson) {
		this.newValueJson = newValueJson;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getUserAgent() {
		return userAgent;
	}

	public void setUserAgent(String userAgent) {
		this.userAgent = userAgent;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(OffsetDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public Boolean getSuccess() {
		return success;
	}

	public void setSuccess(Boolean success) {
		this.success = success;
	}

	public String getSeverityLevel() {
		return severityLevel;
	}

	public void setSeverityLevel(String severityLevel) {
		this.severityLevel = severityLevel;
	}
}
