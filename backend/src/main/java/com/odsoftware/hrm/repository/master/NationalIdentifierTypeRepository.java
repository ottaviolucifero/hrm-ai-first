package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.NationalIdentifierType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NationalIdentifierTypeRepository extends JpaRepository<NationalIdentifierType, UUID> {
}
