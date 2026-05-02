package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.Department;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, UUID> {
}
