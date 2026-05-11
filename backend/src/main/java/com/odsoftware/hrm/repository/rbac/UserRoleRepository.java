package com.odsoftware.hrm.repository.rbac;

import com.odsoftware.hrm.entity.rbac.UserRole;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRoleRepository extends JpaRepository<UserRole, UUID> {

	List<UserRole> findByTenant_IdAndUserAccount_Id(UUID tenantId, UUID userAccountId);

	boolean existsByTenant_IdAndRole_Id(UUID tenantId, UUID roleId);

	boolean existsByTenant_IdAndUserAccount_IdAndRole_Id(UUID tenantId, UUID userAccountId, UUID roleId);

	Optional<UserRole> findByTenant_IdAndUserAccount_IdAndRole_Id(UUID tenantId, UUID userAccountId, UUID roleId);

	@Query("""
			select userRole
			from UserRole userRole
			join fetch userRole.tenant tenant
			join userRole.userAccount userAccount
			join fetch userRole.role role
			where userAccount.id = :userAccountId
			and tenant.id = :tenantId
			order by role.code asc
			""")
	List<UserRole> findWithRoleAndTenantByUserAccountIdAndTenantId(
			@Param("userAccountId") UUID userAccountId,
			@Param("tenantId") UUID tenantId);

	@Query("""
			select userRole
			from UserRole userRole
			join fetch userRole.tenant tenant
			join userRole.userAccount userAccount
			join fetch userRole.role role
			where userAccount.id in :userAccountIds
			order by role.code asc
			""")
	List<UserRole> findWithRoleAndTenantByUserAccountIds(@Param("userAccountIds") Collection<UUID> userAccountIds);

	@Query("""
			select userRole
			from UserRole userRole
			join fetch userRole.tenant tenant
			join userRole.userAccount userAccount
			join fetch userRole.role role
			where userAccount.id = :userAccountId
			order by role.code asc
			""")
	List<UserRole> findWithRoleAndTenantByUserAccountId(@Param("userAccountId") UUID userAccountId);
}
