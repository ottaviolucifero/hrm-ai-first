package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.OfficeLocationType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfficeLocationTypeRepository extends JpaRepository<OfficeLocationType, UUID> {
}
