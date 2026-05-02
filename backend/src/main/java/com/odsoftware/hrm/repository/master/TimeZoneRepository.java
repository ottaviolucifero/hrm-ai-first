package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.TimeZone;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeZoneRepository extends JpaRepository<TimeZone, UUID> {
}
