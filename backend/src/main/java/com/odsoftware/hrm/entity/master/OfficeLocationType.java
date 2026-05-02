package com.odsoftware.hrm.entity.master;

import com.odsoftware.hrm.entity.common.BaseTenantMasterEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "office_location_types", uniqueConstraints = @UniqueConstraint(name = "uk_office_location_types_tenant_code", columnNames = {"tenant_id", "code"}))
public class OfficeLocationType extends BaseTenantMasterEntity {
}
