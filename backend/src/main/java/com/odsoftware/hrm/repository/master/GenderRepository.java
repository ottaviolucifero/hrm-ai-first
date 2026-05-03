package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.Gender;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenderRepository extends JpaRepository<Gender, UUID> {

	boolean existsByCode(String code);

	boolean existsByCodeAndIdNot(String code, UUID id);
}
