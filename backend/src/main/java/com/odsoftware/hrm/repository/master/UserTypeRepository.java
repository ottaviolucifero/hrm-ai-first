package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.UserType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserTypeRepository extends JpaRepository<UserType, UUID> {
}
