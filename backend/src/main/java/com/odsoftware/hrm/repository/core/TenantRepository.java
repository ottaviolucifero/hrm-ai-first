package com.odsoftware.hrm.repository.core;

import com.odsoftware.hrm.entity.core.Tenant;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {
}
