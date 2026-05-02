package com.odsoftware.hrm.entity.master;

import com.odsoftware.hrm.entity.common.BaseTenantMasterEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "job_titles", uniqueConstraints = @UniqueConstraint(name = "uk_job_titles_tenant_code", columnNames = {"tenant_id", "code"}))
public class JobTitle extends BaseTenantMasterEntity {
}
