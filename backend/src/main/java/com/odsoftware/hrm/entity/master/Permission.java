package com.odsoftware.hrm.entity.master;

import com.odsoftware.hrm.entity.common.BaseTenantMasterEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "permissions", uniqueConstraints = @UniqueConstraint(name = "uk_permissions_tenant_code", columnNames = {"tenant_id", "code"}))
public class Permission extends BaseTenantMasterEntity {

	@NotNull
	@Column(name = "system_permission", nullable = false)
	private Boolean systemPermission = false;

	public Boolean getSystemPermission() {
		return systemPermission;
	}

	public void setSystemPermission(Boolean systemPermission) {
		this.systemPermission = systemPermission;
	}
}
