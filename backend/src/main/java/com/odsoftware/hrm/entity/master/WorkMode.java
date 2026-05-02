package com.odsoftware.hrm.entity.master;

import com.odsoftware.hrm.entity.common.BaseTenantMasterEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "work_modes", uniqueConstraints = @UniqueConstraint(name = "uk_work_modes_tenant_code", columnNames = {"tenant_id", "code"}))
public class WorkMode extends BaseTenantMasterEntity {
}
