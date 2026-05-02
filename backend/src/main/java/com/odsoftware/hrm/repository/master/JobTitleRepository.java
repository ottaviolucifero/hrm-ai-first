package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.JobTitle;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobTitleRepository extends JpaRepository<JobTitle, UUID> {
}
