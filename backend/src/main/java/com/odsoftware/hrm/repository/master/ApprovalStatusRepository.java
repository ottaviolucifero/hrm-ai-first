package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.ApprovalStatus;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApprovalStatusRepository extends JpaRepository<ApprovalStatus, UUID> {
}
