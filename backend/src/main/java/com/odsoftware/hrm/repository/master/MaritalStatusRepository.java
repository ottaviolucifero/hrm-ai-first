package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.MaritalStatus;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaritalStatusRepository extends JpaRepository<MaritalStatus, UUID> {

	boolean existsByCode(String code);

	boolean existsByCodeAndIdNot(String code, UUID id);
}
