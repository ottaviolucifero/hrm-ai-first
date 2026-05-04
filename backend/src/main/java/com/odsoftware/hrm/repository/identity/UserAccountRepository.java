package com.odsoftware.hrm.repository.identity;

import com.odsoftware.hrm.entity.identity.UserAccount;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, UUID> {

	Optional<UserAccount> findByTenant_IdAndEmail(UUID tenantId, String email);

	Optional<UserAccount> findByEmailIgnoreCase(String email);
}
