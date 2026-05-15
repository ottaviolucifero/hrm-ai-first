package com.odsoftware.hrm.repository.core;

import com.odsoftware.hrm.entity.core.Tenant;
import java.util.UUID;
import java.util.Optional;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import static jakarta.persistence.LockModeType.PESSIMISTIC_WRITE;

public interface TenantRepository extends JpaRepository<Tenant, UUID>, JpaSpecificationExecutor<Tenant> {

	boolean existsByCode(String code);

	boolean existsByCodeAndIdNot(String code, UUID id);

	@Lock(PESSIMISTIC_WRITE)
	@Query("select tenant from Tenant tenant where tenant.id = :id")
	Optional<Tenant> findByIdForUpdate(UUID id);
}
