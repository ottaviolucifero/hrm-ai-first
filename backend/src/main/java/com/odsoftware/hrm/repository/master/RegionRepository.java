package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.Region;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegionRepository extends JpaRepository<Region, UUID> {
}
