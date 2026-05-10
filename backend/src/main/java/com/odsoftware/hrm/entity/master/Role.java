package com.odsoftware.hrm.entity.master;

import com.odsoftware.hrm.entity.common.BaseTenantMasterEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "roles", uniqueConstraints = @UniqueConstraint(name = "uk_roles_tenant_code", columnNames = {"tenant_id", "code"}))
public class Role extends BaseTenantMasterEntity {

	@Size(max = 500)
	@Column(name = "description", length = 500)
	private String description;

	@NotNull
	@Column(name = "system_role", nullable = false)
	private Boolean systemRole = false;

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Boolean getSystemRole() {
		return systemRole;
	}

	public void setSystemRole(Boolean systemRole) {
		this.systemRole = systemRole;
	}
}
