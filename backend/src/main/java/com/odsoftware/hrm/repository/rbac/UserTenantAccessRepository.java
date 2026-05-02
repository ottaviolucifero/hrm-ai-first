package com.odsoftware.hrm.repository.rbac;

import com.odsoftware.hrm.entity.rbac.UserTenantAccess;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserTenantAccessRepository extends JpaRepository<UserTenantAccess, UUID> {

	Optional<UserTenantAccess> findByUserAccount_IdAndTenant_Id(UUID userAccountId, UUID tenantId);
}
