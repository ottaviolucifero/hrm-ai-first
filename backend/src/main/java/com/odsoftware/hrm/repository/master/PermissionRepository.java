package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.Permission;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, UUID> {
}
