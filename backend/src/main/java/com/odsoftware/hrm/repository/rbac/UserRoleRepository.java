package com.odsoftware.hrm.repository.rbac;

import com.odsoftware.hrm.entity.rbac.UserRole;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRole, UUID> {

	List<UserRole> findByTenant_IdAndUserAccount_Id(UUID tenantId, UUID userAccountId);
}
