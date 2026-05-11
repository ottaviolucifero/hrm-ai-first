package com.odsoftware.hrm.repository.rbac;

import com.odsoftware.hrm.entity.rbac.UserTenantAccess;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserTenantAccessRepository extends JpaRepository<UserTenantAccess, UUID> {

	Optional<UserTenantAccess> findByUserAccount_IdAndTenant_Id(UUID userAccountId, UUID tenantId);

	@Query("""
			select access
			from UserTenantAccess access
			join access.userAccount userAccount
			join fetch access.tenant tenant
			where userAccount.id in :userAccountIds
			order by tenant.code asc
			""")
	List<UserTenantAccess> findWithTenantByUserAccountIds(@Param("userAccountIds") Collection<UUID> userAccountIds);

	@Query("""
			select access
			from UserTenantAccess access
			join access.userAccount userAccount
			join fetch access.tenant tenant
			where userAccount.id = :userAccountId
			order by tenant.code asc
			""")
	List<UserTenantAccess> findWithTenantByUserAccountId(@Param("userAccountId") UUID userAccountId);
}
