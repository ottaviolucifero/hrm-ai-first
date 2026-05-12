package com.odsoftware.hrm.repository.identity;

import com.odsoftware.hrm.entity.identity.UserAccount;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface UserAccountRepository extends JpaRepository<UserAccount, UUID>, JpaSpecificationExecutor<UserAccount> {

	Optional<UserAccount> findByTenant_IdAndEmail(UUID tenantId, String email);

	Optional<UserAccount> findByEmailIgnoreCase(String email);

	boolean existsByCreatedBy_IdOrUpdatedBy_Id(UUID createdById, UUID updatedById);

	@Override
	@EntityGraph(attributePaths = {
			"tenant",
			"primaryTenant",
			"companyProfile",
			"employee",
			"userType",
			"authenticationMethod",
			"timeZone"
	})
	Page<UserAccount> findAll(Specification<UserAccount> specification, Pageable pageable);

	@EntityGraph(attributePaths = {
			"tenant",
			"primaryTenant",
			"companyProfile",
			"employee",
			"userType",
			"authenticationMethod",
			"timeZone"
	})
	Optional<UserAccount> findWithAdministrationGraphById(UUID id);
}
