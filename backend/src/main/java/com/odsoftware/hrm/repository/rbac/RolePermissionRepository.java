package com.odsoftware.hrm.repository.rbac;

import com.odsoftware.hrm.entity.rbac.RolePermission;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolePermissionRepository extends JpaRepository<RolePermission, UUID> {

	List<RolePermission> findByTenant_IdAndRole_Id(UUID tenantId, UUID roleId);
}
