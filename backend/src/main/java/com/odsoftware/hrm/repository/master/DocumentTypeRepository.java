package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.DocumentType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentTypeRepository extends JpaRepository<DocumentType, UUID> {
}
