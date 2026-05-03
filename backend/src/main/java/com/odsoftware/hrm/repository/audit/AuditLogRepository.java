package com.odsoftware.hrm.repository.audit;

import com.odsoftware.hrm.entity.audit.AuditLog;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

	List<AuditLog> findByTenant_Id(UUID tenantId);

	List<AuditLog> findByTenant_IdAndUserAccount_Id(UUID tenantId, UUID userAccountId);

	List<AuditLog> findByTenant_IdAndAuditActionType_Id(UUID tenantId, UUID auditActionTypeId);

	List<AuditLog> findByTenant_IdAndEntityTypeAndEntityId(UUID tenantId, String entityType, UUID entityId);

	List<AuditLog> findByActingTenant_IdAndTargetTenant_Id(UUID actingTenantId, UUID targetTenantId);
}
