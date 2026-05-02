package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.DeviceType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceTypeRepository extends JpaRepository<DeviceType, UUID> {
}
