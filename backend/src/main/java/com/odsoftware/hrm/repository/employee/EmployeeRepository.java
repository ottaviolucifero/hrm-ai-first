package com.odsoftware.hrm.repository.employee;

import com.odsoftware.hrm.entity.employee.Employee;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, UUID> {

	Optional<Employee> findByTenant_IdAndEmployeeCode(UUID tenantId, String employeeCode);

	boolean existsByTenant_IdAndDepartment(UUID tenantId, String department);

	boolean existsByTenant_IdAndJobTitle(UUID tenantId, String jobTitle);

	boolean existsByTenant_IdAndContractType(UUID tenantId, String contractType);

	boolean existsByTenant_IdAndWorkMode(UUID tenantId, String workMode);
}
