package com.odsoftware.hrm.entity.master;

import com.odsoftware.hrm.entity.common.BaseTenantMasterEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "document_types", uniqueConstraints = @UniqueConstraint(name = "uk_document_types_tenant_code", columnNames = {"tenant_id", "code"}))
public class DocumentType extends BaseTenantMasterEntity {
}
