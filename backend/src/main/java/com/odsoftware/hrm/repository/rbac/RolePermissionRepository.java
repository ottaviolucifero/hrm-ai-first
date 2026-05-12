package com.odsoftware.hrm.repository.rbac;

import com.odsoftware.hrm.entity.rbac.RolePermission;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RolePermissionRepository extends JpaRepository<RolePermission, UUID> {

	List<RolePermission> findByTenant_IdAndRole_Id(UUID tenantId, UUID roleId);

	List<RolePermission> findByTenant_IdAndRole_IdOrderByPermission_CodeAsc(UUID tenantId, UUID roleId);

	@Query("""
			select permission.code
			from RolePermission rolePermission
			join rolePermission.permission permission
			where rolePermission.tenant.id = :tenantId
			and rolePermission.role.id = :roleId
			order by permission.code asc
			""")
	List<String> findPermissionCodesByTenantIdAndRoleId(
			@Param("tenantId") UUID tenantId,
			@Param("roleId") UUID roleId);
}
