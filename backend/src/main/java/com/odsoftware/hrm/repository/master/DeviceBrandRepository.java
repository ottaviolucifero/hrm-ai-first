package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.DeviceBrand;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceBrandRepository extends JpaRepository<DeviceBrand, UUID> {
}
