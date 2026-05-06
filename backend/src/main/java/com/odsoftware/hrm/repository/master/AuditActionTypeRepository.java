package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.AuditActionType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditActionTypeRepository extends MasterDataRepository<AuditActionType> {

	boolean existsByCode(String code);

	boolean existsByCodeAndIdNot(String code, UUID id);
}
