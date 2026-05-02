package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.GlobalZipCode;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GlobalZipCodeRepository extends JpaRepository<GlobalZipCode, UUID> {
}
