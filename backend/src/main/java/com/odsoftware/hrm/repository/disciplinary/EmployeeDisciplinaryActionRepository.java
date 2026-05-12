package com.odsoftware.hrm.repository.disciplinary;

import com.odsoftware.hrm.entity.disciplinary.EmployeeDisciplinaryAction;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeDisciplinaryActionRepository extends JpaRepository<EmployeeDisciplinaryAction, UUID> {

	List<EmployeeDisciplinaryAction> findByTenant_IdAndEmployee_Id(UUID tenantId, UUID employeeId);

	boolean existsByIssuedBy_Id(UUID issuedById);

	boolean existsByDisciplinaryActionType_Id(UUID disciplinaryActionTypeId);

	List<EmployeeDisciplinaryAction> findByTenant_IdAndCompanyProfile_Id(UUID tenantId, UUID companyProfileId);

	List<EmployeeDisciplinaryAction> findByTenant_IdAndEmployee_IdAndActiveTrue(UUID tenantId, UUID employeeId);

	List<EmployeeDisciplinaryAction> findByTenant_IdAndDisciplinaryActionType_Id(UUID tenantId, UUID disciplinaryActionTypeId);
}
