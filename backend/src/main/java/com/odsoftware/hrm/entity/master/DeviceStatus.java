package com.odsoftware.hrm.entity.master;

import com.odsoftware.hrm.entity.common.BaseTenantMasterEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "device_statuses", uniqueConstraints = @UniqueConstraint(name = "uk_device_statuses_tenant_code", columnNames = {"tenant_id", "code"}))
public class DeviceStatus extends BaseTenantMasterEntity {
}
