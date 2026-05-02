package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.EmploymentStatus;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmploymentStatusRepository extends JpaRepository<EmploymentStatus, UUID> {
}
