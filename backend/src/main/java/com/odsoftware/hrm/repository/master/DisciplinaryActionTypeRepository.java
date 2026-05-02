package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.DisciplinaryActionType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisciplinaryActionTypeRepository extends JpaRepository<DisciplinaryActionType, UUID> {
}
