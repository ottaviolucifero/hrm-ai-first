package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.Area;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AreaRepository extends JpaRepository<Area, UUID> {

	boolean existsByRegion_IdAndCode(UUID regionId, String code);

	boolean existsByRegion_IdAndCodeAndIdNot(UUID regionId, String code, UUID id);
}
