package com.odsoftware.hrm.repository.contract;

import com.odsoftware.hrm.entity.contract.Contract;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractRepository extends JpaRepository<Contract, UUID> {

	List<Contract> findByTenant_IdAndEmployee_Id(UUID tenantId, UUID employeeId);
}
