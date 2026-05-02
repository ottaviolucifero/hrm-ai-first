package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.AuditActionType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditActionTypeRepository extends JpaRepository<AuditActionType, UUID> {
}
