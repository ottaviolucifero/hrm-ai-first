package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.ContractType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractTypeRepository extends MasterDataRepository<ContractType> {

	boolean existsByTenantIdAndCode(UUID tenantId, String code);

	boolean existsByTenantIdAndCodeAndIdNot(UUID tenantId, String code, UUID id);
}
