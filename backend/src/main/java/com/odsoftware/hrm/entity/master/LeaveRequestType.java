package com.odsoftware.hrm.entity.master;

import com.odsoftware.hrm.entity.common.BaseTenantMasterEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "leave_request_types", uniqueConstraints = @UniqueConstraint(name = "uk_leave_request_types_tenant_code", columnNames = {"tenant_id", "code"}))
public class LeaveRequestType extends BaseTenantMasterEntity {

	@NotNull
	@Column(name = "requires_approval", nullable = false)
	private Boolean requiresApproval = true;

	public Boolean getRequiresApproval() {
		return requiresApproval;
	}

	public void setRequiresApproval(Boolean requiresApproval) {
		this.requiresApproval = requiresApproval;
	}
}
