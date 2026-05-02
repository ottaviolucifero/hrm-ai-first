package com.odsoftware.hrm.entity.master;

import com.odsoftware.hrm.entity.common.BaseTenantMasterEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "roles", uniqueConstraints = @UniqueConstraint(name = "uk_roles_tenant_code", columnNames = {"tenant_id", "code"}))
public class Role extends BaseTenantMasterEntity {

	@NotNull
	@Column(name = "system_role", nullable = false)
	private Boolean systemRole = false;

	public Boolean getSystemRole() {
		return systemRole;
	}

	public void setSystemRole(Boolean systemRole) {
		this.systemRole = systemRole;
	}
}
